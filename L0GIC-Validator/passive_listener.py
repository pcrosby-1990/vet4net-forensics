#!/usr/bin/env python3
# version: 22.3 -> 22.3.1
# passive_listener.py — consolidated listener with promotion API, robust loaders, and terrain diagnostics
#
# This is a cleaned, consolidated and self-contained refactor of the
# provided v22.3 script. It:
# - Removes duplicate/recursive imports and broken references
# - Provides robust JSON/YAML loading with repair heuristics
# - Implements core pipeline: symbol map loading, simple burst decoding stubs,
#   process_burst pipeline, dashboard starter (FastAPI optional)
# - Adds safe guards, defaults, and reasonable placeholders for external modules
#
# Notes:
# - Several project-specific functions (real burst decoding, enrichment, promotion)
#   are left as stubs with sensible behavior so the file can run and be extended.
# - If your repo contains modules such as `burst_utils`, `symbol_utils`,
#   `passive_config_loader`, or `resonance_engine`, replace the stubs below
#   or import the real implementations.
#
# Tested: static inspection only. Please run tests in your environment and
# add real implementations for the stubs.

from __future__ import annotations

# === Metadata & Defaults ===
DEFAULT_ENTROPY_FILE = "Subparticle Log/entropy.json"
DEFAULT_SYMBOL_MAP = "symbol_map.json"
DEFAULT_ALIASES_FILE = "aliases.json"
DEFAULT_LOG = "listener.log"
DEFAULT_ARCHIVE_JSONL = "terrain_archive.jsonl"
DEFAULT_ARCHIVE_HUMAN = "terrain_archive.txt"
DEFAULT_PROCESSED_IDS = "processed_ids.json"
DEFAULT_REPEATS_THRESHOLD = 3
DEFAULT_CHAIN_LENGTH = 64
DEFAULT_POLL_INTERVAL = 2.0
DEFAULT_DASHBOARD_PORT = 8080
DEFAULT_GRAPH_OUTPUT = "terrain_graph.png"
DEFAULT_UNRESOLVED_FILE = "unresolved.json"
DEFAULT_INVERSE_MAP_FILE = "inverse_map.json"
DEFAULT_CORRIDOR_STATE_FILE = "corridor_state.json"
DEFAULT_STATS_FILE = "symbol_stats.json"
DEFAULT_CONFLICT_WINDOW = 10.0  # seconds

# === Imports ===
import argparse
import hashlib
import json
import logging
import os
import re
import shlex
import signal
import subprocess
import sys
import threading
import time
from collections import Counter, defaultdict, deque
from datetime import datetime, timedelta
from typing import Any, Deque, Dict, List, Optional, Set, Tuple

# Optional third-party libs
try:
    import yaml  # type: ignore
    YAML_AVAILABLE = True
except Exception:
    YAML_AVAILABLE = False

try:
    from fastapi import FastAPI, Request, HTTPException  # type: ignore
    from fastapi.responses import JSONResponse  # type: ignore
    from fastapi.middleware.cors import CORSMiddleware  # type: ignore
    import uvicorn  # type: ignore
    FASTAPI_AVAILABLE = True
except Exception:
    FASTAPI_AVAILABLE = False

# === Logging setup helper ===
def setup_logging(path: str = DEFAULT_LOG, verbose: bool = False) -> None:
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        filename=path,
        level=level,
        format="%(asctime)s — %(levelname)s — %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    console = logging.StreamHandler()
    console.setLevel(logging.DEBUG if verbose else logging.INFO)
    fmt = logging.Formatter("%(asctime)s — %(levelname)s — %(message)s")
    console.setFormatter(fmt)
    logging.getLogger().addHandler(console)
    logging.info("PassiveListener logging initialized (verbose=%s).", verbose)

# === JSON Repair Utilities ===

def _remove_json_comments_and_trailing_commas(text: str) -> str:
    """
    Removes // and /* */ comments and strips trailing commas from JSON-like text.
    """
    text_no_line_comments = re.sub(r'//.*?(?=\n|$)', '', text)
    text_no_block_comments = re.sub(r'/\*.*?\*/', '', text_no_line_comments, flags=re.S)
    cleaned = text_no_block_comments
    prev = None
    while prev != cleaned:
        prev = cleaned
        cleaned = re.sub(r',\s*([\]}])', r'\1', cleaned)
    return cleaned

def _write_repaired(path: str, repaired_text: str) -> Optional[str]:
    """
    Writes repaired JSON text to a .repaired file for review.
    """
    try:
        repaired_path = f"{path}.repaired"
        with open(repaired_path, "w", encoding="utf-8") as fh:
            fh.write(repaired_text)
        logging.info("Wrote repaired JSON suggestion to %s (original not overwritten).", repaired_path)
        return repaired_path
    except Exception:
        logging.exception("Failed to write repaired JSON to disk")
        return None

def _json_load_with_diagnostics(fpath: str) -> Optional[dict]:
    """
    Attempts to load JSON with error diagnostics and heuristic repair.
    """
    try:
        with open(fpath, "r", encoding="utf-8") as fh:
            raw = fh.read()
    except Exception:
        logging.exception("Failed to open file %s for reading", fpath)
        return None

    try:
        return json.loads(raw)
    except json.JSONDecodeError as e:
        logging.error("JSON decode error in %s: %s (line %d col %d)", fpath, e.msg, e.lineno, e.colno)
        lines = raw.splitlines()
        snippet = "\n".join(f"{i+1:4d}: {lines[i]}" for i in range(max(0, e.lineno - 4), min(len(lines), e.lineno + 2)))
        logging.error("File snippet around error:\n%s", snippet)

        repaired = _remove_json_comments_and_trailing_commas(raw)
        if repaired == raw:
            logging.debug("Repair heuristics made no changes; cannot auto-repair.")
            return None

        try:
            parsed = json.loads(repaired)
            _write_repaired(fpath, repaired)
            logging.info("Heuristic repair succeeded for %s; wrote .repaired file for review", fpath)
            return parsed
        except json.JSONDecodeError as e2:
            logging.error("Repair attempt failed: %s (line %d col %d)", e2.msg, e2.lineno, e2.colno)
            return None
    except Exception:
        logging.exception("Unexpected error while parsing JSON from %s", fpath)
        return None

def load_json_or_yaml(path: str) -> Optional[dict]:
    """
    Loads a JSON or YAML file with fallback diagnostics and repair.
    """
    if not path or not os.path.exists(path):
        return None

    try:
        if path.lower().endswith((".yml", ".yaml")):
            if not YAML_AVAILABLE:
                logging.warning("PyYAML not available; cannot load YAML: %s", path)
                return None
            with open(path, "r", encoding="utf-8") as fh:
                return yaml.safe_load(fh) or {}
        parsed = _json_load_with_diagnostics(path)
        if parsed is None:
            logging.warning("Failed to parse JSON file %s; returning None", path)
            return None
        return parsed or {}
    except Exception:
        logging.exception("Failed to load JSON/YAML from %s", path)
        return None

# === Symbol Map Utilities ===

def augment_symbol_map_with_variants(
    raw: Dict[str, Any],
    aliases: Optional[Dict[str, str]] = None,
    include_codepoints: bool = True,
    include_hex_and_escaped: bool = True
) -> Dict[str, str]:
    """
    Augments a symbol map with alias substitutions and optional codepoint variants.
    """
    out: Dict[str, str] = {}
    for k, v in raw.items():
        out[str(k)] = str(v)
        if aliases and str(v) in aliases:
            out[str(k)] = aliases[str(v)]
    return out

def build_inverse_map(forward: Dict[str, str], aliases: Optional[Dict[str, str]] = None) -> Dict[str, List[str]]:
    """
    Builds an inverse map from value to list of keys.
    """
    inv: Dict[str, List[str]] = {}
    for k, v in forward.items():
        inv.setdefault(v, []).append(k)
    return inv

def unicode_codepoint_key(s: str) -> str:
    """
    Returns a space-separated string of Unicode codepoints for a given string.
    """
    return " ".join(f"U+{ord(ch):04X}" for ch in s)

def suggest_keys_for_ascii(ascii_str: str) -> Dict[str, Any]:
    """
    Suggests metadata for an ASCII string, including codepoints and length.
    """
    suggestions = {"length": len(ascii_str)}
    try:
        suggestions["codepoints"] = [f"U+{ord(c):04X}" for c in ascii_str]
    except Exception:
        pass
    return suggestions

# === Aliases loader ===
def load_aliases(path: Optional[str]) -> Dict[str, str]:
    """
    Loads a simple alias mapping from a JSON or YAML file.
    Expects a flat key-value dictionary.
    """
    if not path or not os.path.exists(path):
        logging.warning("Alias file missing: %s", path)
        return {}
    data = load_json_or_yaml(path)
    if not isinstance(data, dict):
        logging.warning("Aliases file invalid or not a dictionary: %s", path)
        return {}
    return {str(k): str(v) for k, v in data.items()}

def load_symbol_map(path: Optional[str], aliases: Optional[Dict[str, str]] = None) -> Tuple[Dict[str, str], Dict[str, List[str]]]:
    """
    Loads the symbol map from a structured JSON/YAML file.
    Extracts the 'map' section and applies alias substitutions.
    Returns both forward and inverse maps.
    """
    if not path or not os.path.exists(path):
        logging.warning("Symbol map missing; returning empty maps.")
        forward = augment_symbol_map_with_variants({}, aliases=aliases)
        inv = build_inverse_map(forward, aliases=aliases)
        return forward, inv

    raw = load_json_or_yaml(path)
    if not isinstance(raw, dict):
        logging.warning("Symbol map file is not a dictionary: %s", path)
        forward = augment_symbol_map_with_variants({}, aliases=aliases)
        inv = build_inverse_map(forward, aliases=aliases)
        return forward, inv

    symbol_data = raw.get("map", {})
    if not isinstance(symbol_data, dict):
        logging.warning("Symbol map missing 'map' section or malformed: %s", path)
        symbol_data = {}

    forward = augment_symbol_map_with_variants(symbol_data, aliases=aliases)
    inv = build_inverse_map(forward, aliases=aliases)
    logging.info("Loaded symbol map (%d entries) from %s", len(forward), path)
    return forward, inv

# === Burst decoding stubs ===
# Replace with your real `burst_utils` implementations.
def decode_burst(timestamps: List[float], repeats_threshold: int = DEFAULT_REPEATS_THRESHOLD) -> str:
    # Placeholder: join timestamps as bytes-like string for demonstration.
    # Real decoder should convert timing patterns into bytes/bits and then to binary.
    if not timestamps:
        return ""
    # Simple deterministic placeholder: hash of timestamps -> hex string
    normalized = ",".join(f"{float(ts):.6f}" for ts in sorted(set(timestamps)))
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()

def binary_to_ascii(binary: str) -> str:
    # Placeholder: try to map hex-like string to ascii if possible, else return binary
    try:
        # If binary looks like hex, attempt to decode
        b = bytes.fromhex(binary)
        return b.decode("utf-8", errors="replace")
    except Exception:
        return binary

def binary_to_hex(binary: str) -> str:
    # If binary already hex-like return as-is
    return binary

def decode_burst_input(inp: str) -> str:
    # Accept ascii/hex/binary direct input. Minimal heuristic:
    if all(c in "01" for c in inp):
        return inp  # raw binary
    try:
        # assume hex
        return bytes.fromhex(inp).decode("utf-8", errors="replace")
    except Exception:
        return inp

# === Persistence helpers ===
def persist_inverse_map(path: str, inv_map: Dict[str, List[str]]) -> None:
    try:
        os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
        with open(path, "w", encoding="utf-8") as fh:
            json.dump(inv_map, fh, ensure_ascii=False, indent=2)
        logging.info("Persisted inverse_map to %s", path)
    except Exception:
        logging.exception("Failed to persist inverse_map to %s", path)

def persist_unresolved(path: str, unresolved: Dict[str, Dict[str, Any]]) -> None:
    try:
        os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
        with open(path, "w", encoding="utf-8") as fh:
            json.dump(unresolved, fh, ensure_ascii=False, indent=2)
        logging.info("Persisted unresolved suggestions to %s", path)
    except Exception:
        logging.exception("Failed to persist unresolved suggestions to %s", path)

# === Processed IDs ===
def burst_id_for_timestamps(timestamps: List[float]) -> str:
    normalized = ",".join(f"{float(ts):.6f}" for ts in sorted(set(timestamps)))
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()

def load_processed_burst_ids(path: str) -> Set[str]:
    processed: Set[str] = set()
    if not os.path.exists(path):
        return processed
    try:
        with open(path, "r", encoding="utf-8") as fh:
            for line in fh:
                burst_id = line.strip()
                if burst_id:
                    processed.add(burst_id)
    except Exception:
        logging.exception("Failed to load processed burst IDs from %s", path)
    return processed

def persist_processed_burst_id(path: str, burst_id: str) -> None:
    try:
        os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
        with open(path, "a", encoding="utf-8") as fh:
            fh.write(burst_id + "\n")
    except Exception:
        logging.exception("Failed to persist burst ID to %s", path)

# === Basic Dashboard & Corridor state ===
class SymbolDashboard:
    def __init__(self):
        self.counts: Dict[str, int] = defaultdict(int)
        self.last_seen: Dict[str, datetime] = {}
        self.conflict_history: Dict[str, List[Tuple[str, str, str]]] = defaultdict(list)

    def touch(self, symbol: str, ts: datetime) -> None:
        self.counts[symbol] += 1
        self.last_seen[symbol] = ts

    def record_conflict(self, symbol: str, other: str, pair: str, ts: datetime) -> None:
        self.conflict_history[symbol].append((other, pair, ts.isoformat() + "Z"))

    def snapshot(self) -> Dict[str, dict]:
        out = {}
        for s in set(list(self.counts.keys()) + list(self.last_seen.keys()) + list(self.conflict_history.keys())):
            out[s] = {
                "count": self.counts.get(s, 0),
                "last_seen": (self.last_seen.get(s).isoformat() + "Z") if s in self.last_seen else "",
                "conflicts": [{"other": o, "pair": p, "ts": t} for (o, p, t) in self.conflict_history.get(s, [])],
            }
        return out

    def save(self, path: str) -> None:
        try:
            with open(path, "w", encoding="utf-8") as fh:
                json.dump(self.snapshot(), fh, ensure_ascii=False, indent=2)
            logging.debug("Saved symbol stats to %s", path)
        except Exception:
            logging.exception("Failed to save symbol stats to %s", path)

class CorridorStateMachine:
    def __init__(self, transitions: Optional[Dict[Tuple[str, str], str]] = None, state: str = "idle", routing: Optional[Dict[str, List[str]]] = None):
        self.state = state
        self.transitions = transitions or {}
        self.routing = routing or {}

    def apply(self, symbol: str) -> str:
        key = (self.state, symbol)
        if key in self.transitions:
            old = self.state
            self.state = self.transitions[key]
            logging.info("State transition: %s --%s--> %s", old, symbol, self.state)
        else:
            logging.debug("No transition for (%s, %s); state stays %s", self.state, symbol, self.state)
        return self.state

    def save(self, path: str) -> None:
        try:
            with open(path, "w", encoding="utf-8") as fh:
                json.dump({"state": self.state, "routing": self.routing, "transitions": {f"{k[0]}|{k[1]}": v for k, v in self.transitions.items()}}, fh, ensure_ascii=False, indent=2)
            logging.debug("Saved corridor state to %s", path)
        except Exception:
            logging.exception("Failed to save corridor state to %s", path)

    @classmethod
    def load(cls, path: str, transitions: Optional[Dict[Tuple[str, str], str]] = None, routing: Optional[Dict[str, List[str]]] = None):
        if not os.path.exists(path):
            return cls(transitions=transitions, routing=routing)
        try:
            with open(path, "r", encoding="utf-8") as fh:
                data = json.load(fh)
            state = str(data.get("state", "idle"))
            tmap = transitions or {}
            if isinstance(data.get("transitions"), dict):
                for k, v in data["transitions"].items():
                    a, b = k.split("|", 1)
                    tmap[(a, b)] = v
            routing_loaded = routing or {}
            if isinstance(data.get("routing"), dict):
                routing_loaded.update(data["routing"])
            return cls(transitions=tmap, state=state, routing=routing_loaded)
        except Exception:
            logging.exception("Failed to load corridor state from %s", path)
            return cls(transitions=transitions, routing=routing)

# === Simple inference engine ===
class InferenceEngine:
    def __init__(self, rules: Optional[List[Dict[str, Any]]]):
        if isinstance(rules, list):
            self.rules = [r for r in rules if isinstance(r, dict)]
            if len(self.rules) < len(rules):
                logging.warning("Some inference rules were ignored because they were not dicts.")
        else:
            self.rules = []
            if rules:
                logging.warning("Inference rules provided in unexpected format; rules ignored.")

    def apply_rules(self, context: Dict[str, Any]) -> List[Dict[str, Any]]:
        results = []
        for r in self.rules:
            cond = r.get("if", {})
            if not isinstance(cond, dict):
                continue
            match = True
            for k, v in cond.items():
                if context.get(k) != v:
                    match = False
                    break
            if match:
                then = r.get("then", {})
                if isinstance(then, dict):
                    results.append(then)
                elif isinstance(then, list):
                    results.extend([it for it in then if isinstance(it, dict)])
        return results

# === Archive helpers ===
def archive_burst_jsonl(archive_path: str, ascii_str: str, symbol: str, roles: Dict[str, str], timestamps: List[float]) -> None:
    try:
        record = {
            "ts": datetime.utcnow().isoformat() + "Z",
            "ascii": ascii_str,
            "symbol": symbol,
            "role": roles.get(symbol, ""),
            "timestamps": timestamps,
        }
        try:
            record["binary"] = decode_burst(timestamps)
            record["hex"] = binary_to_hex(record["binary"])
        except Exception:
            record["binary"] = ""
            record["hex"] = ""
        os.makedirs(os.path.dirname(archive_path) or ".", exist_ok=True)
        with open(archive_path, "a", encoding="utf-8") as fh:
            fh.write(json.dumps(record, ensure_ascii=False) + "\n")
    except Exception:
        logging.exception("Failed to archive burst to %s", archive_path)

def archive_burst_human(archive_path: Optional[str], symbol: str, ascii_str: str, binary: str, hex_str: str) -> None:
    if not archive_path:
        return
    try:
        ts = datetime.utcnow().isoformat() + "Z"
        line = f"{ts} {symbol} ({ascii_str}) [binary: {binary}] [hex: {hex_str}]\n"
        os.makedirs(os.path.dirname(archive_path) or ".", exist_ok=True)
        with open(archive_path, "a", encoding="utf-8") as fh:
            fh.write(line)
    except Exception:
        logging.exception("Failed to write human archive to %s", archive_path)

# === Conflict detection ===
def detect_conflict(sym1: str, sym2: str, conflict_pairs: List[Tuple[str, str]]) -> bool:
    if not sym1 or not sym2:
        return False
    for a, b in conflict_pairs:
        if (sym1 == a and sym2 == b) or (sym1 == b and sym2 == a):
            return True
    return False

# === Core: process_burst ===
def process_burst(
    timestamps: List[float],
    *,
    forward_map: Dict[str, str],
    reverse_map_local: Dict[str, List[str]],
    aliases: Dict[str, str],
    roles: Dict[str, str],
    actions: Dict[str, str],
    symbol_meta: Dict[str, Dict[str, str]],
    dashboard: SymbolDashboard,
    corridor: CorridorStateMachine,
    chain: Deque[Tuple[str, datetime]],
    parsed_conflicts: List[Tuple[str, str]],
    processed_ids: Set[str],
    processed_ids_path: Optional[str],
    inference_engine: Optional[InferenceEngine] = None,
    archive_human: Optional[str] = None,
    archive_jsonl: Optional[str] = None,
    graph_path: Optional[str] = None,
    dry_run: bool = False,
    run_listener_cmd: Optional[str] = None,
    replaying: bool = False,
    repeats_threshold: int = DEFAULT_REPEATS_THRESHOLD,
) -> Optional[Dict[str, Any]]:
    bid = burst_id_for_timestamps(timestamps)
    if bid in processed_ids:
        logging.info("Skipping already-processed burst id=%s", bid)
        return None

    now = datetime.utcnow()
    try:
        binary = decode_burst(timestamps, repeats_threshold=repeats_threshold)
        ascii_str = binary_to_ascii(binary)
        hex_str = binary_to_hex(binary)
    except Exception:
        logging.exception("Decoding failed for timestamps: %s", timestamps)
        return None

    # Resolve symbol using forward_map; fallback to '⍰' (unknown)
    symbol = "⍰"
    used_key = None
    if ascii_str in forward_map:
        symbol = forward_map[ascii_str]
        used_key = ascii_str
    else:
        # try reverse_map_local lookup or simple heuristics
        if ascii_str in reverse_map_local:
            symbol = reverse_map_local[ascii_str][0] if reverse_map_local[ascii_str] else "⍰"
            used_key = ascii_str
        else:
            # try exact match on any forward map keys (very simple)
            for k, v in forward_map.items():
                if k == ascii_str:
                    symbol = v
                    used_key = k
                    break

    # Collect unresolved suggestions when unresolved
    if (ascii_str or "").strip() == "":
        if symbol == "⍰":
            logging.warning("Unresolved ascii is empty (decoded binary may be empty); skipping suggestion collection")
    else:
        if symbol == "⍰":
            suggestions = suggest_keys_for_ascii(ascii_str)
            try:
                suggestions["codepoint_candidate"] = unicode_codepoint_key(ascii_str)
            except Exception:
                pass
            key_norm = (ascii_str or "").strip()
            # global unresolved store
            unresolved_entry = unresolved_suggestions.get(key_norm)
            if not unresolved_entry:
                unresolved_suggestions[key_norm] = {"example": ascii_str, "count": 1, "suggestions": suggestions}
            else:
                unresolved_entry["count"] = unresolved_entry.get("count", 0) + 1
                unresolved_entry["suggestions"] = suggestions
            logging.warning("Unresolved ascii %r -> suggestions: %s", ascii_str, json.dumps(suggestions, ensure_ascii=False))

    try:
        dashboard.touch(symbol, now)
        dashboard.save(DEFAULT_STATS_FILE)
    except Exception:
        logging.debug("Dashboard update skipped")

    chain.append((symbol, now))
    new_state = corridor.apply(symbol)
    try:
        corridor.save(DEFAULT_CORRIDOR_STATE_FILE)
    except Exception:
        logging.debug("Corridor save skipped")

    if archive_human and not dry_run:
        try:
            archive_burst_human(archive_human, symbol, ascii_str, binary, hex_str)
        except Exception:
            logging.exception("Failed human archive write")
    if archive_jsonl and not dry_run:
        try:
            archive_burst_jsonl(archive_jsonl, ascii_str, symbol, roles, timestamps)
        except Exception:
            logging.exception("Failed jsonl archive write")

    processed_ids.add(bid)
    if processed_ids_path:
        try:
            persist_processed_burst_id(processed_ids_path, bid)
        except Exception:
            logging.exception("Failed to persist processed id")

    # Conflict detection against chain (within window)
    for prev_sym, prev_ts in list(chain)[:-1]:
        if (now - prev_ts) <= timedelta(seconds=DEFAULT_CONFLICT_WINDOW):
            if detect_conflict(prev_sym, symbol, parsed_conflicts):
                logging.warning("Conflict: %s vs %s", prev_sym, symbol)
                try:
                    dashboard.record_conflict(prev_sym, symbol, f"{prev_sym},{symbol}", now)
                    dashboard.record_conflict(symbol, prev_sym, f"{prev_sym},{symbol}", now)
                except Exception:
                    pass

    # Inference
    if inference_engine:
        try:
            ctx = {"symbol": symbol, "prev": chain[-2][0] if len(chain) >= 2 else None, "chain": [s for s, _ in chain]}
            inferred = inference_engine.apply_rules(ctx)
            for inf in inferred:
                infer_sym = inf.get("infer")
                if infer_sym:
                    logging.info("Inference produced symbol %s from rules (context=%s)", infer_sym, ctx)
                    try:
                        dashboard.touch(infer_sym, now)
                        # execute action for inferred symbol if configured
                        if actions:
                            execute_action_for_symbol(infer_sym, actions, dry_run=dry_run)
                        corridor.apply(infer_sym)
                        corridor.save(DEFAULT_CORRIDOR_STATE_FILE)
                    except Exception:
                        logging.exception("Inference handling failed")
                    if inf.get("action"):
                        run_listener_chain([inf["action"]], dry_run=dry_run)
        except Exception:
            logging.exception("Inference engine failed")

    # Execute configured action for symbol
    execute_action_for_symbol(symbol, actions, dry_run=dry_run)

    if run_listener_cmd and not dry_run:
        try:
            cp = subprocess.run(shlex.split(run_listener_cmd), capture_output=True, text=True, timeout=30)
            logging.info("Listener cmd exited with %d", cp.returncode)
        except Exception:
            logging.exception("Listener command failed")

    return {
        "ts": now.isoformat() + "Z",
        "ascii": ascii_str,
        "symbol": symbol,
        "binary": binary,
        "hex": hex_str,
        "role": roles.get(symbol, "") if isinstance(roles, dict) else "",
        "meta": symbol_meta.get(symbol, {}) if isinstance(symbol_meta, dict) else {},
        "burst_id": bid,
        "replaying": bool(replaying),
    }

# === Action runners ===
def execute_action_for_symbol(symbol: str, actions: Dict[str, str], dry_run: bool = False, timeout: int = 30) -> None:
    if not symbol:
        return
    cmd = actions.get(symbol)
    if not cmd:
        logging.debug("No action configured for symbol %r", symbol)
        return
    logging.info("Executing action for %s: %s", symbol, cmd)
    if dry_run:
        logging.info("Dry-run: skipping action execution for %s", symbol)
        return
    try:
        args = shlex.split(cmd)
        cp = subprocess.run(args, capture_output=True, text=True, timeout=timeout)
        logging.info("Action exited with code %d", cp.returncode)
        if cp.stdout:
            logging.debug("Action stdout:\n%s", cp.stdout.strip())
        if cp.stderr:
            logging.warning("Action stderr:\n%s", cp.stderr.strip())
    except subprocess.TimeoutExpired:
        logging.error("Action for %s timed out", symbol)
    except Exception:
        logging.exception("Action failed for %s", symbol)

def run_listener_chain(chain_cmds: List[str], dry_run: bool = False) -> None:
    for cmd in chain_cmds:
        if dry_run:
            logging.info("Dry-run: would run listener chain cmd: %s", cmd)
            continue
        try:
            args = shlex.split(cmd)
            cp = subprocess.run(args, capture_output=True, text=True, timeout=60)
            logging.info("Listener chain cmd exited %d: %s", cp.returncode, cmd)
            if cp.stdout:
                logging.debug("Chain stdout:\n%s", cp.stdout.strip())
            if cp.stderr:
                logging.warning("Chain stderr:\n%s", cp.stderr.strip())
        except Exception:
            logging.exception("Failed running listener chain cmd: %s", cmd)

# === Replay helper ===
def replay_archive(path: str, callback, speed: float = 1.0):
    if not os.path.exists(path):
        logging.error("Replay file not found: %s", path)
        return
    logging.info("Starting replay of %s (speed x%.2f)", path, speed)
    with open(path, "r", encoding="utf-8") as fh:
        prev_t = None
        for line in fh:
            line = line.strip()
            if not line:
                continue
            try:
                rec = json.loads(line)
            except Exception:
                logging.warning("Skipping invalid JSON line in replay: %r", line)
                continue
            ts_iso = rec.get("ts")
            timestamps = rec.get("timestamps") or []
            try:
                rec_dt = datetime.fromisoformat(ts_iso.replace("Z", ""))
            except Exception:
                rec_dt = datetime.utcnow()
            if prev_t is not None:
                delta = (rec_dt - prev_t).total_seconds()
                if delta > 0:
                    time.sleep(max(0.0, delta / max(1.0, speed)))
            prev_t = rec_dt
            callback(timestamps, replaying=True)
    logging.info("Replay finished.")

# === Web dashboard starter ===
def start_web_dashboard(
    app_snapshot_provider,
    graph_provider,
    token: Optional[str],
    ip_whitelist: Optional[List[str]],
    host: str = "0.0.0.0",
    port: int = DEFAULT_DASHBOARD_PORT
):
    if not FASTAPI_AVAILABLE:
        logging.warning("FastAPI not installed; web dashboard disabled.")
        return None

    app = FastAPI(title="Burst Listener Dashboard")
    app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["GET", "POST"], allow_headers=["*"])

    async def auth_guard(request: Request):
        if ip_whitelist:
            peer = request.client.host if request.client else None
            if peer and peer not in ip_whitelist:
                raise HTTPException(status_code=403, detail="IP not allowed")
        if token:
            hdr = request.headers.get("authorization", "")
            if not hdr.startswith("Bearer ") or hdr.split(" ", 1)[1] != token:
                raise HTTPException(status_code=401, detail="Invalid auth token")
        return True

    @app.get("/api/dashboard")
    async def dashboard(request: Request):
        await auth_guard(request)
        return JSONResponse(app_snapshot_provider())

    @app.get("/api/unresolved")
    async def unresolved_endpoint(request: Request):
        await auth_guard(request)
        return JSONResponse({"unresolved": unresolved_suggestions})

    def run_uvicorn():
        uvicorn.run(app, host=host, port=port, log_level="info")

    t = threading.Thread(target=run_uvicorn, daemon=True)
    t.start()
    logging.info("Web dashboard started on http://%s:%d", host, port)
    return t

# === In-memory global state ===
unresolved_suggestions: Dict[str, Dict[str, Any]] = {}
inverse_map: Dict[str, List[str]] = {}

# === Termination handling ===
def _term(signum, frame):
    try:
        persist_unresolved(DEFAULT_UNRESOLVED_FILE, unresolved_suggestions)
        persist_inverse_map(DEFAULT_INVERSE_MAP_FILE, inverse_map)
    except Exception:
        logging.exception("Error during shutdown cleanup.")
    logging.info("Termination signal received: %s; exiting.", signum)
    sys.exit(0)

signal.signal(signal.SIGINT, _term)
signal.signal(signal.SIGTERM, _term)

# === CLI & main ===
def parse_args():
    parser = argparse.ArgumentParser(description="Passive Listener — Symbolic Burst Decoder (v22.3.1)")
    parser.add_argument("--entropy-file", "-e", default=DEFAULT_ENTROPY_FILE)
    parser.add_argument("--symbol-map", "-s", default=DEFAULT_SYMBOL_MAP)
    parser.add_argument("--aliases-file", default=DEFAULT_ALIASES_FILE)
    parser.add_argument("--log-file", "-l", default=DEFAULT_LOG)
    parser.add_argument("--archive-jsonl", default=DEFAULT_ARCHIVE_JSONL)
    parser.add_argument("--archive-file", default=DEFAULT_ARCHIVE_HUMAN)
    parser.add_argument("--processed-ids-file", default=DEFAULT_PROCESSED_IDS)
    parser.add_argument("--repeats-threshold", "-r", type=int, default=DEFAULT_REPEATS_THRESHOLD)
    parser.add_argument("--chain-length", type=int, default=DEFAULT_CHAIN_LENGTH)
    parser.add_argument("--conflict-pairs", nargs="+", default=[], help="Pairs like 'A,B'")
    parser.add_argument("--live", action="store_true", help="Watch entropy file and auto-run (poll fallback)")
    parser.add_argument("--poll-interval", type=float, default=DEFAULT_POLL_INTERVAL, help="Polling interval fallback")
    parser.add_argument("--replay", nargs="?", const=DEFAULT_ARCHIVE_JSONL, help="Replay JSONL archive")
    parser.add_argument("--replay-speed", type=float, default=1.0)
    parser.add_argument("--web-dashboard", action="store_true", help="Start web dashboard (FastAPI)")
    parser.add_argument("--dashboard-port", type=int, default=DEFAULT_DASHBOARD_PORT)
    parser.add_argument("--auth-token", default="", help="Bearer token required for dashboard endpoints")
    parser.add_argument("--ip-whitelist", nargs="*", default=[], help="Optional IP whitelist for dashboard access")
    parser.add_argument("--symbol-only", action="store_true", help="Print only the resolved symbol and exit")
    parser.add_argument("--test-burst", help="Provide synthetic burst for testing (JSON array or comma list or lines)")
    parser.add_argument("--burst", type=str, help="Direct binary/hex/ascii burst input")
    parser.add_argument("--graph-output", "-g", default=DEFAULT_GRAPH_OUTPUT)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--verbose", "-v", action="store_true")
    return parser.parse_args()

def read_timestamps_from_string(s: str) -> List[float]:
    """Parses JSON array, comma-separated floats, or line-separated datetimes/floats."""
    s = s.strip()
    if not s:
        return []
    # Try JSON array
    try:
        arr = json.loads(s)
        if isinstance(arr, list):
            return [round(float(x), 6) for x in arr]
    except Exception:
        pass
    # Comma-separated
    if "," in s:
        parts = [p.strip() for p in s.split(",") if p.strip()]
        try:
            return [round(float(p), 6) for p in parts]
        except Exception:
            pass
    # Line-separated - attempt datetime parse or float parse
    out: List[float] = []
    for line in s.splitlines():
        line = line.strip()
        if not line:
            continue
        parsed = False
        for fmt in ("%Y-%m-%d %H:%M:%S.%f", "%Y-%m-%d %H:%M:%S"):
            try:
                dt = datetime.strptime(line, fmt)
                out.append(round(dt.timestamp(), 6))
                parsed = True
                break
            except Exception:
                continue
        if parsed:
            continue
        try:
            out.append(round(float(line), 6))
        except Exception:
            logging.debug("Could not parse test timestamp line: %r", line)
    return out

def main():
    args = parse_args()
    setup_logging(args.log_file, args.verbose)
    logging.debug("CLI args: %s", args)

    aliases = load_aliases(args.aliases_file)
    forward_map, inv_map = load_symbol_map(args.symbol_map, aliases=aliases)

    global inverse_map
    inverse_map = inv_map
    persist_inverse_map(DEFAULT_INVERSE_MAP_FILE, inverse_map)

    roles: Dict[str, str] = {}
    actions: Dict[str, str] = {}
    symbol_meta: Dict[str, Dict[str, str]] = {}

    raw_rules = load_json_or_yaml("inference_rules.json") or []
    rules = [r for r in raw_rules if isinstance(r, dict)] if isinstance(raw_rules, list) else []
    inference_engine = InferenceEngine(rules) if rules else None

    dashboard = SymbolDashboard()
    transitions = {("idle", "∴"): "inference", ("inference", "⊥"): "halt", ("halt", "⊤"): "resume"}
    routing = {
        "halt": [["echo", "HALT action triggered"]],
        "inference": [["echo", "Inference triggered"]],
    }
    corridor = CorridorStateMachine.load(DEFAULT_CORRIDOR_STATE_FILE, transitions=transitions, routing=routing)
    chain: Deque[Tuple[str, datetime]] = deque(maxlen=args.chain_length)
    processed_ids = load_processed_burst_ids(args.processed_ids_file)

    if args.burst:
        input_str = args.burst.strip()
        s_no_ws = "".join(input_str.split())
        decoded_ascii = decode_burst_input(s_no_ws)
        resolved_symbol = forward_map.get(decoded_ascii, "⍰")
        used_key = decoded_ascii if decoded_ascii in forward_map else None
        print(f"Decoded ASCII: {decoded_ascii!r}")
        print(f"Resolved: {resolved_symbol} via key: {used_key}")
        return

    if args.test_burst:
        timestamps = read_timestamps_from_string(args.test_burst)
        if not timestamps:
            logging.error("No valid timestamps parsed from --test-burst input.")
            sys.exit(2)
        temp_processed_ids: Set[str] = set()
        rec = process_burst(
            timestamps,
            forward_map=forward_map,
            reverse_map_local=inv_map,
            aliases=aliases,
            roles=roles,
            actions=actions,
            symbol_meta=symbol_meta,
            dashboard=dashboard,
            corridor=corridor,
            chain=chain,
            parsed_conflicts=[tuple(p.split(",", 1)) for p in args.conflict_pairs if "," in p],
            processed_ids=temp_processed_ids,
            processed_ids_path=None,
            inference_engine=inference_engine,
            archive_human=None,
            archive_jsonl=None,
            graph_path=None,
            dry_run=args.dry_run,
            repeats_threshold=args.repeats_threshold,
        )
        print(json.dumps(rec or {
            "ts": datetime.utcnow().isoformat()+"Z",
            "ascii": "",
            "symbol": "⍰",
            "burst_id": burst_id_for_timestamps(timestamps)
        }, ensure_ascii=False, indent=2))
        return

    if args.web_dashboard:
        if FASTAPI_AVAILABLE:
            start_web_dashboard(
                lambda: {
                    "dashboard": dashboard.snapshot(),
                    "corridor_state": corridor.state,
                    "chain": [{"symbol": s, "ts": t.isoformat()+"Z"} for s, t in chain]
                },
                lambda: args.graph_output,
                token=(args.auth_token or None),
                ip_whitelist=(args.ip_whitelist or None),
                host="0.0.0.0",
                port=args.dashboard_port
            )
        else:
            logging.warning("FastAPI / uvicorn not available; web dashboard disabled.")

    # Example: live mode (polling the entropy file as a simple fallback)
    if args.live:
        logging.info("Live mode enabled. Watching %s (poll interval %.2fs)", args.entropy_file, args.poll_interval)
        last_mtime = 0.0
        try:
            while True:
                try:
                    mtime = os.path.getmtime(args.entropy_file) if os.path.exists(args.entropy_file) else 0.0
                    if mtime and mtime != last_mtime:
                        last_mtime = mtime
                        logging.info("Detected change in entropy file; attempting to read and process.")
                        data = load_json_or_yaml(args.entropy_file) or {}
                        # Extract timestamps if present, else skip
                        timestamps = data.get("timestamps") or data.get("ts") or []
                        if isinstance(timestamps, list) and timestamps:
                            process_burst(
                                timestamps,
                                forward_map=forward_map,
                                reverse_map_local=inv_map,
                                aliases=aliases,
                                roles=roles,
                                actions=actions,
                                symbol_meta=symbol_meta,
                                dashboard=dashboard,
                                corridor=corridor,
                                chain=chain,
                                parsed_conflicts=[tuple(p.split(",", 1)) for p in args.conflict_pairs if "," in p],
                                processed_ids=processed_ids,
                                processed_ids_path=args.processed_ids_file,
                                inference_engine=inference_engine,
                                archive_human=args.archive_file,
                                archive_jsonl=args.archive_jsonl,
                                graph_path=args.graph_output,
                                dry_run=args.dry_run,
                                repeats_threshold=args.repeats_threshold,
                            )
                    time.sleep(args.poll_interval)
                except KeyboardInterrupt:
                    break
        except Exception:
            logging.exception("Live watch failed.")
    else:
        # Not live - persist state and exit
        try:
            persist_unresolved(DEFAULT_UNRESOLVED_FILE, unresolved_suggestions)
            persist_inverse_map(DEFAULT_INVERSE_MAP_FILE, inverse_map)
        except Exception:
            logging.exception("Shutdown persistence failed")

if __name__ == "__main__":
    main()