#!/usr/bin/env python3
"""
validate_correlation.py

Enhanced validator (tuned). Key fixes in this version:
 - Robust handling of timezone-aware timestamps when converting to integer ns values.
 - Fixes TypeError: "Cannot use .astype to convert from timezone-aware dtype..."
 - All timestamps normalized to UTC; integer ns values derived via `.value` (safe for tz-aware Timestamps).
 - All prior features retained: synthesis from logs, dedupe modes, match-window, diagnostics, sweep, JSON/CSV output.
"""
from __future__ import annotations
import argparse
import csv
import json
import logging
import os
import re
import statistics
import sys
from typing import Dict, List, Optional, Tuple

import numpy as np
import pandas as pd
from scipy.signal import find_peaks
from scipy.stats import pearsonr

# ---------- Config / builtins ----------
COMMON_TIME_NAMES = ["time", "timestamp", "ts", "date", "datetime", "created_at", "time_stamp", "timeutc"]
DEFAULT_DEDUPE_WINDOW = 60  # seconds
DEFAULT_MATCH_WINDOW = 30   # seconds
BUILTIN_LABEL_KEYWORDS = {
    "quark": "Quark detected",
    "quark packet": "Quark detected",
    "extraction triggered": "Quark detected",
    "tau override": "Tau override",
    "splash": "Splash",
    "photon pulse": "Splash",
    "gluon ignition": "Gluon ignition",
    "gluon": "Gluon ignition",
    "passive entropy scan": "Passive scan",
    "passive scan": "Passive scan",
    "entropy packet": "Quark detected",
    "entropy check initiated": "Entropy check",
}

# ---------- Logging ----------
def setup_logging(log_file: Optional[str], quiet: bool):
    root = logging.getLogger()
    root.setLevel(logging.DEBUG)
    fmt_file = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s", "%Y-%m-%d %H:%M:%S")
    if log_file:
        fh = logging.FileHandler(log_file, encoding="utf-8")
        fh.setLevel(logging.DEBUG)
        fh.setFormatter(fmt_file)
        root.addHandler(fh)
    ch = logging.StreamHandler(sys.stdout)
    ch.setLevel(logging.WARNING if quiet else logging.INFO)
    ch.setFormatter(logging.Formatter("%(message)s"))
    root.addHandler(ch)

log = logging.getLogger(__name__)

# ---------- CSV loading ----------
def sample_lines(path: str, max_lines: int = 300) -> List[str]:
    with open(path, "r", encoding="utf-8", errors="replace") as f:
        lines = []
        for i, raw in enumerate(f):
            if i >= max_lines:
                break
            lines.append(raw.rstrip("\n\r"))
    return lines

def choose_delimiter(path: str, candidates: Optional[List[str]] = None) -> Tuple[str, bool, int]:
    if candidates is None:
        candidates = [",", "\t", ";", "|"]
    lines = sample_lines(path, max_lines=300)
    if not lines:
        raise ValueError("File appears empty or unreadable.")
    def score(d: str):
        counts = []
        reader = csv.reader(lines, delimiter=d)
        for row in reader:
            counts.append(len(row))
        if not counts:
            return 0, 0
        try:
            mode_count = statistics.mode(counts)
        except statistics.StatisticsError:
            mode_count = int(statistics.median(counts))
        score_val = sum(1 for c in counts if c == mode_count)
        return score_val, mode_count

    best, best_score, best_mode = None, -1, 0
    for d in candidates:
        sc, mc = score(d)
        if sc > best_score:
            best_score = sc
            best = d
            best_mode = mc

    sample_text = "\n".join(lines)
    try:
        has_header = csv.Sniffer().has_header(sample_text)
    except Exception:
        has_header = True
    return best or ",", has_header, best_mode

def looks_like_code(path: str, sample_lines_count: int = 8) -> bool:
    try:
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            count = 0
            for raw in f:
                line = raw.strip()
                if not line:
                    continue
                count += 1
                low = line.lower()
                if low.startswith(("import ", "from ", "def ", "class ", "#", "print(", "if ", "while ", "for ")):
                    return True
                if count >= sample_lines_count:
                    break
    except Exception:
        return False
    return False

def safe_load_csv(path: str, forced_delim: Optional[str] = None, on_bad_lines: str = "warn") -> pd.DataFrame:
    if looks_like_code(path):
        raise ValueError(f"File {path!r} appears to contain source code/text rather than CSV data. Restore the CSV or point to the real file.")

    if forced_delim:
        delim = forced_delim
        _, has_header, _ = choose_delimiter(path)
    else:
        delim, has_header, _ = choose_delimiter(path)

    read_kwargs = dict(sep=delim, engine="python", dtype=str, encoding="utf-8", on_bad_lines=on_bad_lines)
    try:
        if not has_header:
            df = pd.read_csv(path, header=None, **read_kwargs)
            df.columns = [f"col_{i}" for i in range(len(df.columns))]
        else:
            df = pd.read_csv(path, **read_kwargs)
    except Exception:
        df = pd.read_csv(path, sep=None, engine="python", dtype=str, encoding="utf-8", on_bad_lines=on_bad_lines)
    return df

def find_time_column(df: pd.DataFrame, forced: Optional[str] = None) -> Optional[str]:
    if forced:
        if forced in df.columns:
            return forced
        try:
            idx = int(forced)
            if 0 <= idx < len(df.columns):
                return df.columns[idx]
        except Exception:
            return None
    for n in COMMON_TIME_NAMES:
        for col in df.columns:
            if col.lower() == n.lower():
                return col
    for col in df.columns:
        lc = col.lower()
        if "time" in lc or "date" in lc or "timestamp" in lc or lc == "ts":
            return col
    return None

# ---------- Log parsing / event synthesis ----------
TIMESTAMP_BRACKET_RE = re.compile(r"\[([0-9]{4}-[0-9]{2}-[0-9]{2}[ T][0-9]{2}:[0-9]{2}:[0-9]{2}(?:[+-][0-9]{2}:?[0-9]{2}|Z)?)\]")
GENERIC_TS_RE = re.compile(r"([0-9]{4}-[0-9]{2}-[0-9]{2}[ T][0-9]{2}:[0-9]{2}:[0-9]{2}(?:[+-][0-9]{2}:?[0-9]{2}|Z)?)")

def parse_line_timestamp(line: str) -> Optional[pd.Timestamp]:
    m = TIMESTAMP_BRACKET_RE.search(line)
    if m:
        try:
            return pd.to_datetime(m.group(1), errors="coerce", utc=True)
        except Exception:
            pass
    m2 = GENERIC_TS_RE.search(line)
    if m2:
        try:
            return pd.to_datetime(m2.group(1), errors="coerce", utc=True)
        except Exception:
            pass
    return None

def load_label_map(path: Optional[str]) -> Dict[str, str]:
    if not path:
        return {}
    if not os.path.exists(path):
        log.warning("Label map file not found: %s", path)
        return {}
    try:
        obj = json.load(open(path, "r", encoding="utf-8"))
        mapping = {}
        if isinstance(obj, dict):
            for k, v in obj.items():
                mapping[k] = v
            return mapping
        elif isinstance(obj, list):
            for entry in obj:
                pat = entry.get("pattern") or entry.get("phrase")
                lab = entry.get("label")
                if pat and lab:
                    mapping[pat] = lab
            return mapping
    except Exception as e:
        log.warning("Failed to load label map %s: %s", path, e)
    return {}

def apply_label_map_to_text(text: str, label_map: Dict[str, str]) -> Optional[str]:
    ltext = text.lower()
    for k, lab in label_map.items():
        if k.startswith("re:"):
            try:
                if re.search(k[3:], text, flags=re.IGNORECASE):
                    return lab
            except re.error:
                continue
        else:
            if k.lower() in ltext:
                return lab
    return None

def synthesize_events_from_logs(entropy_log_path: str, neutrino_path: Optional[str] = None, splash_path: Optional[str] = None, dedupe_window: int = DEFAULT_DEDUPE_WINDOW, dedupe_mode: str = "earliest", label_map_path: Optional[str] = None) -> pd.DataFrame:
    """
    Parse entropy.log and neutrino memory to synthesize a collapse_events DataFrame:
      columns: time (UTC datetime), label (string)

    dedupe_mode: one of 'earliest' (default), 'latest', 'midpoint'
    """
    events = []
    label_map = load_label_map(label_map_path)

    def extract_from_file(path: str) -> List[Tuple[Optional[pd.Timestamp], str]]:
        if not path or not os.path.exists(path):
            return []
        found = []
        try:
            with open(path, "r", encoding="utf-8", errors="replace") as f:
                for raw in f:
                    line = raw.strip()
                    if not line:
                        continue
                    ts = parse_line_timestamp(line)
                    found.append((ts, line))
        except Exception as e:
            log.debug("Failed to read %s: %s", path, e)
        return found

    entropy_lines = extract_from_file(entropy_log_path)
    neutrino_lines = extract_from_file(neutrino_path) if neutrino_path else []

    combined = entropy_lines + neutrino_lines
    for ts, text in combined:
        label = apply_label_map_to_text(text, label_map) if label_map else None
        if not label:
            l = text.lower()
            for key, lab in BUILTIN_LABEL_KEYWORDS.items():
                if key in l:
                    label = lab
                    break
        if not label:
            if "extraction triggered" in text.lower():
                label = "Quark detected"
            elif "photon pulse" in text.lower():
                label = "Splash"
            else:
                continue

        if ts is None:
            try:
                src = entropy_log_path if entropy_log_path and os.path.exists(entropy_log_path) else neutrino_path
                mtime = os.path.getmtime(src)
                ts = pd.to_datetime(mtime, unit="s", utc=True)
            except Exception:
                ts = pd.NaT

        if pd.isna(ts):
            continue

        ts = pd.to_datetime(ts, utc=True)
        events.append({"time": ts, "label": label})

    if not events:
        return pd.DataFrame(columns=["time", "label"])

    df = pd.DataFrame(events)
    df["time"] = pd.to_datetime(df["time"], errors="coerce", utc=True)
    df = df.dropna(subset=["time"]).drop_duplicates(subset=["time", "label"]).sort_values(by="time").reset_index(drop=True)

    # dedupe/collapse events within dedupe_window seconds using dedupe_mode
    if dedupe_window and dedupe_window > 0 and len(df) > 1:
        out_rows = []
        group_start_idx = 0
        for i in range(1, len(df)):
            delta = (df.loc[i, "time"] - df.loc[group_start_idx, "time"]).total_seconds()
            if delta <= dedupe_window:
                continue
            group = df.loc[group_start_idx:i]
            if dedupe_mode == "latest":
                chosen_time = group["time"].max()
            elif dedupe_mode == "midpoint":
                t0 = group["time"].min().value
                t1 = group["time"].max().value
                mid_ns = (t0 + t1) // 2
                chosen_time = pd.to_datetime(mid_ns, unit="ns", utc=True)
            else:  # earliest
                chosen_time = group["time"].min()
            labels = []
            for lab in list(group["label"]):
                if lab not in labels:
                    labels.append(lab)
            out_rows.append({"time": chosen_time, "label": " + ".join(labels)})
            group_start_idx = i
        group = df.loc[group_start_idx:len(df)]
        if not group.empty:
            if dedupe_mode == "latest":
                chosen_time = group["time"].max()
            elif dedupe_mode == "midpoint":
                t0 = group["time"].min().value
                t1 = group["time"].max().value
                mid_ns = (t0 + t1) // 2
                chosen_time = pd.to_datetime(mid_ns, unit="ns", utc=True)
            else:
                chosen_time = group["time"].min()
            labels = []
            for lab in list(group["label"]):
                if lab not in labels:
                    labels.append(lab)
            out_rows.append({"time": chosen_time, "label": " + ".join(labels)})
        df = pd.DataFrame(out_rows)
        df["time"] = pd.to_datetime(df["time"], utc=True)

    df = df.sort_values(by="time").reset_index(drop=True)
    return df

# ---------- Matching and metrics ----------
def _timestamps_to_ns_array(ts_series: pd.Series) -> np.ndarray:
    """Convert a pandas Series of datetimes (possibly tz-aware) to an int64 numpy array of ns since epoch.
    We use .apply(lambda x: x.value) on pandas.Timestamp which returns nanoseconds as int and works for tz-aware timestamps.
    NaT values become np.nan then are converted to a large negative sentinel and filtered by callers if needed.
    """
    # Ensure series is datetime and tz-aware UTC for consistency
    s = pd.to_datetime(ts_series, errors="coerce", utc=True)
    # Use .apply on Timestamps to get integer ns; map NaT -> np.nan then convert to int64 array with Nan->min int
    vals = s.apply(lambda x: x.value if not pd.isna(x) else np.nan).to_numpy()
    # Replace nan with a sentinel that won't match any real timestamp (use min int64 + 1)
    nan_mask = np.isnan(vals)
    if nan_mask.any():
        vals[nan_mask] = np.iinfo(np.int64).min + 1
    return vals.astype("int64")

def make_event_flag(detector_times: pd.Series, events_times: pd.Series, match_window: int) -> pd.Series:
    """
    Returns a boolean Series (same index as detector_times) where True indicates
    there exists an event within +/- match_window seconds of the detector time.
    match_window in seconds. If match_window <= 0 uses exact equality.
    """
    if events_times is None or len(events_times) == 0:
        return pd.Series([0] * len(detector_times), index=detector_times.index).astype(int)

    # Convert both series to UTC and integer ns arrays using safe helper
    det_ns = _timestamps_to_ns_array(detector_times)
    ev_ns = _timestamps_to_ns_array(events_times)

    # Filter out sentinel (min int) values from ev_ns
    valid_ev_mask = ev_ns != (np.iinfo(np.int64).min + 1)
    ev_ns_valid = np.sort(ev_ns[valid_ev_mask]) if valid_ev_mask.any() else np.array([], dtype=np.int64)

    if match_window <= 0:
        # exact equality: compare integer ns after filtering NaT sentinel
        if ev_ns_valid.size == 0:
            return pd.Series([0] * len(detector_times), index=detector_times.index).astype(int)
        # for exact equality: build a set of ev_ns_valid for quick membership test
        ev_set = set(int(x) for x in ev_ns_valid)
        flags = np.array([1 if int(t) in ev_set else 0 for t in det_ns], dtype=int)
        return pd.Series(flags, index=detector_times.index).astype(int)

    # approximate matching: find nearest neighbor and compare distance
    mw_ns = int(match_window * 1_000_000_000)
    flags = np.zeros(len(det_ns), dtype=int)
    if ev_ns_valid.size == 0:
        return pd.Series(flags, index=detector_times.index).astype(int)

    # Use searchsorted on sorted ev_ns_valid
    for i, t in enumerate(det_ns):
        # skip invalid detector times (sentinel)
        if t == np.iinfo(np.int64).min + 1:
            continue
        idx = np.searchsorted(ev_ns_valid, t)
        candidates = []
        if idx < ev_ns_valid.size:
            candidates.append(ev_ns_valid[idx])
        if idx - 1 >= 0:
            candidates.append(ev_ns_valid[idx - 1])
        if not candidates:
            continue
        nearest = min(candidates, key=lambda x: abs(x - t))
        if abs(nearest - t) <= mw_ns:
            flags[i] = 1
    return pd.Series(flags, index=detector_times.index).astype(int)

def compute_metrics(detector_df: pd.DataFrame, events_df: pd.DataFrame, time_col: str, threshold: float = 0.7, mc_iters: int = 1000, seed: Optional[int] = None, match_window: int = DEFAULT_MATCH_WINDOW) -> dict:
    detector_df[time_col] = pd.to_datetime(detector_df[time_col], errors="coerce", utc=True)
    events_df[time_col] = pd.to_datetime(events_df[time_col], errors="coerce", utc=True)

    detector_df = detector_df.dropna(subset=[time_col]).sort_values(by=time_col).reset_index(drop=True)
    events_df = events_df.dropna(subset=[time_col]).sort_values(by=time_col).reset_index(drop=True)

    if "value" not in detector_df.columns:
        raise ValueError("'value' column missing from detector data.")
    detector_df["value"] = pd.to_numeric(detector_df["value"], errors="coerce")

    detector_df["event_flag"] = make_event_flag(detector_df[time_col], events_df[time_col], match_window)

    summary = {}
    summary["n_detector_rows"] = int(len(detector_df))
    summary["n_events"] = int(len(events_df))

    # 1. correlation
    try:
        valid_mask = detector_df["value"].notna() & detector_df["event_flag"].notna()
        if valid_mask.sum() < 2:
            summary["correlation"] = None
        else:
            vals = detector_df.loc[valid_mask, "value"].astype(float)
            flags = detector_df.loc[valid_mask, "event_flag"].astype(int)
            if np.std(vals) == 0 or np.std(flags) == 0:
                summary["correlation"] = None
            else:
                corr, _ = pearsonr(vals, flags)
                summary["correlation"] = float(corr)
    except Exception:
        summary["correlation"] = None

    # 2. false positive rate
    detector_df["predicted_event"] = (detector_df["value"].astype(float) > threshold).astype(int)
    predicted_total = int(detector_df["predicted_event"].sum())
    if predicted_total == 0:
        summary["false_positive_rate"] = None
    else:
        false_positives = detector_df[(detector_df["predicted_event"] == 1) & (detector_df["event_flag"] == 0)]
        summary["false_positive_rate"] = float(len(false_positives) / predicted_total)

    # 3. average lead time
    lead_times: List[float] = []
    for _, event in events_df.iterrows():
        spikes = detector_df[(detector_df["value"].astype(float) > threshold) & (detector_df[time_col] <= event[time_col])]
        if not spikes.empty:
            lead = (event[time_col] - spikes.iloc[-1][time_col]).total_seconds()
            lead_times.append(lead)
    summary["avg_lead_seconds"] = float(statistics.mean(lead_times)) if lead_times else None
    summary["n_lead_times"] = int(len(lead_times))

    # 4. peak detection accuracy
    try:
        vals = detector_df["value"].astype(float).to_numpy()
        peaks_idx, _ = find_peaks(vals, height=threshold)
        peak_times = detector_df.iloc[peaks_idx][time_col]
        peak_count = len(peak_times)
        summary["n_peaks"] = int(peak_count)
        if peak_count == 0:
            summary["peak_accuracy"] = None
        else:
            matched = int(make_event_flag(peak_times.reset_index(drop=True), events_df[time_col].reset_index(drop=True), match_window).sum())
            summary["peak_accuracy"] = float(matched / peak_count)
            summary["peak_matched"] = int(matched)
    except Exception:
        summary["peak_accuracy"] = None
        summary["n_peaks"] = 0
        summary["peak_matched"] = 0

    # 5. noisy false positive rate
    rng = np.random.default_rng(seed)
    noise = rng.normal(0, 0.05, size=len(detector_df))
    noisy_value = np.clip(detector_df["value"].astype(float) + noise, 0, 1)
    noisy_predicted = (noisy_value > threshold).astype(int)
    noisy_total = int(noisy_predicted.sum())
    if noisy_total == 0:
        summary["noisy_false_positive_rate"] = None
    else:
        noisy_fp = int(((noisy_predicted == 1) & (detector_df["event_flag"] == 0)).sum())
        summary["noisy_false_positive_rate"] = float(noisy_fp / noisy_total)

    # 6. Monte Carlo
    def monte_carlo_mean(n: int) -> float:
        scores = []
        for _ in range(n):
            sample_noise = rng.normal(0, 0.05, size=len(detector_df))
            signal = np.clip(detector_df["value"].astype(float) + sample_noise, 0, 1)
            predicted = (signal > threshold).astype(int)
            fp = int(((predicted == 1) & (detector_df["event_flag"] == 0)).sum())
            tp = int(((predicted == 1) & (detector_df["event_flag"] == 1)).sum())
            score = (tp - fp) / max(tp + fp, 1)
            scores.append(score)
        return float(np.mean(scores)) if scores else 0.0

    try:
        summary["monte_carlo_mean_score"] = float(monte_carlo_mean(100 if mc_iters > 100 else mc_iters))
    except Exception:
        summary["monte_carlo_mean_score"] = None

    summary["threshold"] = float(threshold)
    summary["mc_iters"] = int(mc_iters)
    summary["seed"] = int(seed) if seed is not None else None
    summary["match_window_seconds"] = int(match_window)
    return summary

# ---------- Diagnostics (peaks CSV) ----------
def write_peaks_diagnostics(detector_df: pd.DataFrame, events_df: pd.DataFrame, time_col: str, threshold: float, match_window: int, out_path: str = "peaks.csv"):
    detector_df[time_col] = pd.to_datetime(detector_df[time_col], errors="coerce", utc=True)
    events_df[time_col] = pd.to_datetime(events_df[time_col], errors="coerce", utc=True)
    detector_df = detector_df.dropna(subset=[time_col]).sort_values(by=time_col).reset_index(drop=True)
    events_df = events_df.dropna(subset=[time_col]).sort_values(by=time_col).reset_index(drop=True)

    vals = detector_df["value"].astype(float).to_numpy()
    peaks_idx, _ = find_peaks(vals, height=threshold)
    rows = []
    ev_ns = _timestamps_to_ns_array(events_df[time_col]) if len(events_df) > 0 else np.array([], dtype=np.int64)
    ev_ns_valid = ev_ns[ev_ns != (np.iinfo(np.int64).min + 1)] if ev_ns.size > 0 else np.array([], dtype=np.int64)
    ev_ns_valid.sort()
    for p in peaks_idx:
        peak_time = pd.to_datetime(detector_df.loc[p, time_col], utc=True)
        peak_value = float(detector_df.loc[p, "value"])
        if ev_ns_valid.size == 0:
            rows.append({"peak_time": peak_time.isoformat(), "peak_value": peak_value, "nearest_event_time": "", "seconds_to_event": "", "matched": False})
            continue
        pt_ns = int(peak_time.value)
        idx = np.searchsorted(ev_ns_valid, pt_ns)
        candidates = []
        if idx < len(ev_ns_valid):
            candidates.append(ev_ns_valid[idx])
        if idx - 1 >= 0:
            candidates.append(ev_ns_valid[idx - 1])
        nearest = int(min(candidates, key=lambda x: abs(x - pt_ns)))
        sec_diff = (nearest - pt_ns) / 1_000_000_000
        matched = abs(sec_diff) <= match_window
        nearest_time = pd.to_datetime(nearest, unit="ns", utc=True).isoformat()
        rows.append({"peak_time": peak_time.isoformat(), "peak_value": peak_value, "nearest_event_time": nearest_time, "seconds_to_event": sec_diff, "matched": bool(matched)})
    with open(out_path, "w", newline="", encoding="utf-8") as f:
        fieldnames = ["peak_time", "peak_value", "nearest_event_time", "seconds_to_event", "matched"]
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        for r in rows:
            w.writerow(r)
    log.info("Wrote peaks diagnostics to %s (%d peaks)", out_path, len(rows))

# ---------- Sample generator ----------
def generate_sample(detector_path: str, events_path: str, entropy_path: Optional[str] = None, neutrino_path: Optional[str] = None):
    import datetime as _dt
    times = [_dt.datetime(2025, 10, 30, 0, 0, 0) + _dt.timedelta(seconds=30 * i) for i in range(21)]
    values = [0.12, 0.23, 0.18, 0.21, 0.78, 0.32, 0.14, 0.81, 0.20, 0.17, 0.09, 0.95, 0.11, 0.16, 0.40, 0.72, 0.15, 0.19, 0.22, 0.85, 0.13]
    with open(detector_path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["time", "value"])
        for t, v in zip(times, values):
            w.writerow([t.strftime("%Y-%m-%d %H:%M:%S"), f"{v:.3f}"])
    with open(events_path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["time", "label"])
        w.writerow([times[4].strftime("%Y-%m-%d %H:%M:%S"), "Quark detected"])
        w.writerow([times[7].strftime("%Y-%m-%d %H:%M:%S"), "Splash"])
        w.writerow([times[11].strftime("%Y-%m-%d %H:%M:%S"), "Tau override"])
        w.writerow([times[15].strftime("%Y-%m-%d %H:%M:%S"), "Partial collapse"])
        w.writerow([times[19].strftime("%Y-%m-%d %H:%M:%S"), "Final collapse"])
    if entropy_path:
        with open(entropy_path, "w", encoding="utf-8") as f:
            f.write(f"[{times[4].strftime('%Y-%m-%d %H:%M:%S')}] Quark packet detected — extraction triggered\n")
            f.write(f"[{times[7].strftime('%Y-%m-%d %H:%M:%S')}] Quark packet detected — extraction triggered\n")
            f.write(f"[{times[11].strftime('%Y-%m-%d %H:%M:%S')}] Tau override triggered\n")
    if neutrino_path:
        with open(neutrino_path, "w", encoding="utf-8") as f:
            f.write(f"[{times[11].strftime('%Y-%m-%d %H:%M:%S')}] Tau override triggered\n")
            f.write(f"[{times[7].strftime('%Y-%m-%d %H:%M:%S')}] Passive entropy scan complete — no trigger\n")
    log.info("Sample files written: %s, %s", detector_path, events_path)
    if entropy_path:
        log.info("Sample entropy log written: %s", entropy_path)
    if neutrino_path:
        log.info("Sample neutrino memory written: %s", neutrino_path)

# ---------- Runner / CLI ----------
def run_one(cfg):
    (detector_path, events_df, synth_cfg, write_events_path, output_json, output_csv, threshold, mc_iters, seed, match_window, generate_diagnostics) = (
        cfg["detector_path"],
        cfg.get("events_df"),
        cfg.get("synth_cfg"),
        cfg.get("write_events_path"),
        cfg.get("output_json"),
        cfg.get("output_csv"),
        cfg["threshold"],
        cfg["mc_iters"],
        cfg.get("seed"),
        cfg["match_window"],
        cfg.get("generate_diagnostics", False),
    )

    events_df_local = events_df
    if synth_cfg:
        events_df_local = synthesize_events_from_logs(
            synth_cfg["entropy_log"],
            synth_cfg.get("neutrino_log"),
            synth_cfg.get("splash_file"),
            dedupe_window=synth_cfg.get("dedupe_window", DEFAULT_DEDUPE_WINDOW),
            dedupe_mode=synth_cfg.get("dedupe_mode", "earliest"),
            label_map_path=synth_cfg.get("label_map"),
        )
        if write_events_path and not events_df_local.empty:
            try:
                tmp = events_df_local.copy()
                tmp["time"] = pd.to_datetime(tmp["time"], utc=True).dt.strftime("%Y-%m-%dT%H:%M:%SZ")
                tmp.to_csv(write_events_path, index=False)
                log.info("Wrote synthesized events to %s", write_events_path)
            except Exception as e:
                log.warning("Failed to persist synthesized events: %s", e)
    else:
        if events_df_local is None:
            if os.path.exists(cfg.get("events_path", "collapse_events.csv")):
                events_df_local = safe_load_csv(cfg.get("events_path", "collapse_events.csv"), forced_delim=cfg.get("delimiter"))
            else:
                events_df_local = pd.DataFrame(columns=["time", "label"])

    detector_df_local = safe_load_csv(detector_path, forced_delim=cfg.get("delimiter"), on_bad_lines=cfg.get("on_bad_lines", "warn"))
    dt_col = find_time_column(detector_df_local, forced=cfg.get("time_col"))
    ev_col = find_time_column(events_df_local, forced=cfg.get("time_col")) if events_df_local is not None and len(events_df_local) > 0 else None
    if dt_col is None:
        raise RuntimeError(f"Could not detect time column in detector CSV: {detector_path}")
    if ev_col is None and events_df_local is not None and len(events_df_local) > 0:
        raise RuntimeError("Could not detect time column in events data.")
    if ev_col and ev_col != dt_col:
        events_df_local = events_df_local.rename(columns={ev_col: dt_col})

    summary = compute_metrics(detector_df_local, events_df_local, time_col=dt_col, threshold=threshold, mc_iters=mc_iters, seed=seed, match_window=match_window)
    diag_path = None
    if generate_diagnostics:
        diag_path = cfg.get("diagnostics_path", "peaks.csv")
        write_peaks_diagnostics(detector_df_local, events_df_local, time_col=dt_col, threshold=threshold, match_window=match_window, out_path=diag_path)
    if output_json:
        try:
            with open(output_json, "w", encoding="utf-8") as f:
                json.dump(summary, f, indent=2)
            log.info("Wrote JSON summary to %s", output_json)
        except Exception as e:
            log.warning("Failed to write JSON summary: %s", e)
    if output_csv:
        try:
            row = {k: ("" if v is None else v) for k, v in summary.items()}
            with open(output_csv, "w", newline="", encoding="utf-8") as f:
                w = csv.DictWriter(f, fieldnames=list(row.keys()))
                w.writeheader()
                w.writerow(row)
            log.info("Wrote CSV summary to %s", output_csv)
        except Exception as e:
            log.warning("Failed to write CSV summary: %s", e)
    return summary, diag_path

def main(argv: Optional[List[str]] = None):
    parser = argparse.ArgumentParser(description="Validate correlation between detector stream and synthesized or supplied collapse events.")
    parser.add_argument("--detector", "-d", default="detector_stream.csv", help="Path to detector CSV")
    parser.add_argument("--events", "-e", default="collapse_events.csv", help="Path to events CSV (if not synthesizing)")
    parser.add_argument("--generate-sample", action="store_true", help="Generate sample detector/events/log files and exit")
    parser.add_argument("--synthesize-events", action="store_true", help="Synthesize collapse_events from entropy/neutrino logs")
    parser.add_argument("--entropy-log", default=os.path.join("Subparticle Log", "entropy.log"), help="Path to entropy.log")
    parser.add_argument("--neutrino-log", default=None, help="Path to neutrino memory file (optional)")
    parser.add_argument("--splash-file", default=None, help="Optional splash.txt path to scan for splash timestamps")
    parser.add_argument("--write-events", default=None, help="If synthesizing, write synthesized events to this CSV path (default overrides --events)")
    parser.add_argument("--output-json", help="Write metrics summary to JSON file")
    parser.add_argument("--output-csv", help="Write metrics summary to single-row CSV file")
    parser.add_argument("--time-col", help="Force timestamp column name or index (detector/events)")
    parser.add_argument("--delimiter", help="Force delimiter for reading CSVs")
    parser.add_argument("--threshold", type=float, default=0.7, help="Threshold for predicted events")
    parser.add_argument("--mc", type=int, default=1000, help="Monte Carlo iterations")
    parser.add_argument("--seed", type=int, default=None, help="Random seed for Monte Carlo and noisy sim")
    parser.add_argument("--label-map", help="Path to JSON label-map for custom phrase/regex -> label mappings")
    parser.add_argument("--dedupe-window", type=int, default=DEFAULT_DEDUPE_WINDOW, help=f"Collapse synthesized events within this many seconds (default {DEFAULT_DEDUPE_WINDOW})")
    parser.add_argument("--dedupe-mode", choices=["earliest", "latest", "midpoint"], default="earliest", help="How to collapse events within dedupe-window (default earliest)")
    parser.add_argument("--match-window", type=int, default=DEFAULT_MATCH_WINDOW, help=f"Match detector samples to events within +/- this many seconds (default {DEFAULT_MATCH_WINDOW})")
    parser.add_argument("--generate-diagnostics", action="store_true", help="Write peaks.csv diagnostic file showing peak->nearest-event distances and matched boolean")
    parser.add_argument("--sweep", action="store_true", help="Run a small sweep of parameter combinations and output sweep_results.csv")
    parser.add_argument("--on-bad-lines", choices=["warn", "skip", "error"], default="warn", help="How to handle malformed CSV lines when reading")
    parser.add_argument("--quiet", action="store_true", help="Reduce console verbosity (still write to log file if provided)")
    parser.add_argument("--log-file", help="Path to write detailed run log")
    args = parser.parse_args(argv)

    setup_logging(args.log_file, args.quiet)
    log.info("Starting validate_correlation.py (UTC normalization active)")

    if args.generate_sample:
        entropy_path = args.entropy_log or os.path.join("Subparticle Log", "entropy.log")
        neutrino_path = args.neutrino_log
        generate_sample(args.detector, args.events, entropy_path, neutrino_path)
        return

    synth_cfg = None
    if args.synthesize_events:
        synth_cfg = {
            "entropy_log": args.entropy_log,
            "neutrino_log": args.neutrino_log,
            "splash_file": args.splash_file,
            "dedupe_window": args.dedupe_window,
            "dedupe_mode": args.dedupe_mode,
            "label_map": args.label_map,
        }
        log.info("Synthesizing events from logs: entropy=%s neutrino=%s dedupe=%ds mode=%s", args.entropy_log, args.neutrino_log, args.dedupe_window, args.dedupe_mode)

    if args.sweep:
        dedupe_values = [args.dedupe_window, max(0, args.dedupe_window // 2), 0]
        thresholds = [args.threshold, max(0.1, args.threshold - 0.1)]
        match_windows = [args.match_window, max(0, args.match_window // 2), 0]
        dedupe_modes = [args.dedupe_mode]
        sweep_rows = []
        for dv in sorted(set(dedupe_values)):
            for th in sorted(set(thresholds)):
                for mw in sorted(set(match_windows)):
                    for dm in dedupe_modes:
                        cfg = {
                            "detector_path": args.detector,
                            "events_df": None,
                            "synth_cfg": dict(synth_cfg) if synth_cfg else None,
                            "write_events_path": args.write_events,
                            "output_json": None,
                            "output_csv": None,
                            "threshold": float(th),
                            "mc_iters": int(args.mc),
                            "seed": args.seed,
                            "match_window": int(mw),
                            "generate_diagnostics": False,
                            "delimiter": args.delimiter,
                            "on_bad_lines": args.on_bad_lines,
                            "time_col": args.time_col,
                            "events_path": args.events,
                        }
                        if cfg["synth_cfg"]:
                            cfg["synth_cfg"]["dedupe_window"] = dv
                            cfg["synth_cfg"]["dedupe_mode"] = dm
                        try:
                            summary, _ = run_one(cfg)
                            sweep_row = {"dedupe_window": dv, "dedupe_mode": dm, "threshold": th, "match_window": mw}
                            sweep_row.update(summary)
                            sweep_rows.append(sweep_row)
                            log.info("Sweep run dedupe=%d mode=%s thr=%.2f match=%d -> n_events=%s correlation=%s", dv, dm, th, mw, sweep_row.get("n_events"), sweep_row.get("correlation"))
                        except Exception as e:
                            log.warning("Sweep run failed for dedupe=%d thr=%.2f match=%d: %s", dv, th, mw, e)
        if sweep_rows:
            out_fields = list(sweep_rows[0].keys())
            with open("sweep_results.csv", "w", newline="", encoding="utf-8") as f:
                w = csv.DictWriter(f, fieldnames=out_fields)
                w.writeheader()
                for r in sweep_rows:
                    w.writerow(r)
            log.info("Wrote sweep results to sweep_results.csv (%d rows)", len(sweep_rows))
        else:
            log.warning("No successful sweep runs produced results.")
        log.info("Sweep completed.")
        return

    cfg = {
        "detector_path": args.detector,
        "events_df": None,
        "synth_cfg": synth_cfg,
        "write_events_path": args.write_events,
        "output_json": args.output_json,
        "output_csv": args.output_csv,
        "threshold": float(args.threshold),
        "mc_iters": int(args.mc),
        "seed": args.seed,
        "match_window": int(args.match_window),
        "generate_diagnostics": args.generate_diagnostics,
        "diagnostics_path": "peaks.csv",
        "delimiter": args.delimiter,
        "on_bad_lines": args.on_bad_lines,
        "time_col": args.time_col,
        "events_path": args.events,
    }

    try:
        summary, diag_path = run_one(cfg)
    except Exception as e:
        log.exception("Validation failed: %s", e)
        sys.exit(1)

    if not args.quiet:
        print("\nValidation summary (timestamps normalized to UTC):")
        def fmt(k, v):
            if v is None:
                return f"{k}: N/A"
            if isinstance(v, float):
                return f"{k}: {v:.3f}"
            return f"{k}: {v}"
        print(fmt("n_detector_rows", summary.get("n_detector_rows")))
        print(fmt("n_events", summary.get("n_events")))
        print(fmt("correlation", summary.get("correlation")))
        print(fmt("false_positive_rate", summary.get("false_positive_rate")))
        print(fmt("avg_lead_seconds", summary.get("avg_lead_seconds")))
        print(fmt("peak_accuracy", summary.get("peak_accuracy")))
        print(fmt("noisy_false_positive_rate", summary.get("noisy_false_positive_rate")))
        print(fmt("monte_carlo_mean_score", summary.get("monte_carlo_mean_score")))
        if diag_path:
            print(f"(Diagnostics written to {diag_path})")
        print()

    log.debug("Full metrics summary: %s", json.dumps(summary, indent=2))
    log.info("Validation completed successfully.")

if __name__ == "__main__":
    main()