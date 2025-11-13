#!/usr/bin/env python3
"""
audit_unresolved.py

Scan the archive JSONL (burst_archive.jsonl) and unresolved suggestions to produce a report of
unresolved keys and best-effort candidate mappings.

Features:
- Reads DEFAULT_ARCHIVE_JSONL (or --archive) and DEFAULT_SYMBOL_MAP to determine what is unresolved.
- Aggregates counts and examples per unresolved key.
- Attempts simple heuristics to recommend candidate symbols:
    * codepoint candidate if ascii is a single unicode char
    * if ascii matches a known alias in symbol_map, recommend that symbol
    * prefer suggestions returned by suggest_keys_for_ascii (if available)
- JSON output (--json) suitable for /api/promote_batch.
- Dry-run only: does not change symbol_map unless --apply and mappings are supplied externally.
- Accepts --min-count to filter low-frequency items and --limit to restrict results.

Usage:
  python audit_unresolved.py --archive burst_archive.jsonl --symbol-map symbol_map.json --json
"""
from __future__ import annotations

import argparse
import json
import logging
import os
from collections import Counter, defaultdict
from typing import Dict, Any, List, Tuple

# try to import symbol utilities for suggestions
try:
    import symbol_utils  # type: ignore
    SUGGEST_AVAILABLE = True
except Exception:
    SUGGEST_AVAILABLE = False

DEFAULT_ARCHIVE = "burst_archive.jsonl"
DEFAULT_SYMBOL_MAP = "symbol_map.json"
DEFAULT_ALIASES_FILE = "aliases.json"


def load_archive(path: str) -> List[Dict[str, Any]]:
    out = []
    if not os.path.exists(path):
        return out
    with open(path, "r", encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if not line:
                continue
            try:
                rec = json.loads(line)
                out.append(rec)
            except Exception:
                continue
    return out


def load_symbol_map(path: str) -> Dict[str, Any]:
    if not os.path.exists(path):
        return {}
    with open(path, "r", encoding="utf-8") as fh:
        try:
            raw = json.load(fh)
            # if wrapper with "map", return that
            if isinstance(raw, dict) and "map" in raw and isinstance(raw["map"], dict):
                return raw["map"]
            return raw
        except Exception:
            # try YAML fallback
            try:
                import yaml  # type: ignore
                fh.seek(0)
                return yaml.safe_load(fh)
            except Exception:
                return {}


def suggest_candidate(ascii_str: str, symbol_map: Dict[str, Any]) -> List[str]:
    """
    Heuristic suggestions:
    - If ascii_str is a single codepoint, return its U+XXXX form and match against symbol_map values.
    - If symbol_utils.suggest_keys_for_ascii is available, use it to get suggestions.
    - Check alias and key matches in symbol_map.
    Returns ordered list of candidate symbols (characters).
    """
    candidates: List[str] = []
    s = (ascii_str or "").strip()
    if not s:
        return candidates
    # single char -> codepoint candidate
    if len(s) == 1:
        cp = f"U+{ord(s):04X}"
        # find a map entry with char == s
        for k, v in symbol_map.items():
            if isinstance(v, dict):
                ch = v.get("char")
            else:
                ch = v
            if ch == s:
                candidates.append(ch)
                break
        # also include codepoint if not found
        candidates.append(s)
    # try symbol_utils suggestions
    if SUGGEST_AVAILABLE:
        try:
            sug = symbol_utils.suggest_keys_for_ascii(s)
            # The suggestion structure is implementation-specific; attempt to extract string candidates
            for k, v in (sug.items() if isinstance(sug, dict) else []):
                if isinstance(v, str) and v not in candidates:
                    candidates.append(v)
        except Exception:
            pass
    # fallback: check symbol_map keys/aliases for fuzzy matches (simple substring)
    for k, v in symbol_map.items():
        if isinstance(v, dict):
            aliases = v.get("aliases", []) or []
            char = v.get("char")
        else:
            aliases = []
            char = v
        if s.lower() == str(k).lower() and char not in candidates:
            candidates.append(char)
        for a in aliases:
            if s.lower() == str(a).lower() and char not in candidates:
                candidates.append(char)
    return candidates


def aggregate_unresolved(archive: List[Dict[str, Any]], min_count: int = 1, limit: int = 0, symbol_map: Dict[str, Any] = None) -> Dict[str, Any]:
    counter = Counter()
    examples: Dict[str, str] = {}
    suggestions: Dict[str, Any] = {}
    for rec in archive:
        ascii_val = (rec.get("ascii") or "").strip()
        symbol = rec.get("symbol")
        if not ascii_val:
            continue
        # unresolved marker handled by symbol value or external logic
        if symbol and symbol != "⍰":
            continue
        counter[ascii_val] += 1
        if ascii_val not in examples:
            examples[ascii_val] = ascii_val
    results = {}
    for key, cnt in counter.most_common():
        if cnt < min_count:
            continue
        cand = suggest_candidate(key, symbol_map or {})
        results[key] = {"example": examples.get(key, ""), "count": cnt, "suggestions": cand}
        if limit and len(results) >= limit:
            break
    return results


def main(argv=None) -> int:
    p = argparse.ArgumentParser(description="Audit unresolved bursts and suggest symbol mappings")
    p.add_argument("--archive", default=DEFAULT_ARCHIVE)
    p.add_argument("--symbol-map", default=DEFAULT_SYMBOL_MAP)
    p.add_argument("--aliases", default=DEFAULT_ALIASES_FILE)
    p.add_argument("--min-count", type=int, default=1)
    p.add_argument("--limit", type=int, default=0)
    p.add_argument("--json", action="store_true", help="Emit JSON to stdout")
    p.add_argument("--verbose", "-v", action="store_true")
    args = p.parse_args(argv)

    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

    archive = load_archive(args.archive)
    symmap = load_symbol_map(args.symbol_map)
    suggestions = aggregate_unresolved(archive, min_count=args.min_count, limit=args.limit, symbol_map=symmap)

    if args.json:
        print(json.dumps(suggestions, ensure_ascii=False, indent=2))
    else:
        for k, v in suggestions.items():
            print(f"{k!r}  count={v['count']}  example={v['example']!r}  suggestions={v['suggestions']}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())