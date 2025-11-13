#!/usr/bin/env python3
"""
validate_semantic_map.py

Tiny schema validator for rich semantic symbol maps.

Checks per-entry:
- required fields present: "char", "role", "effect"
- "codepoints" if present is a non-empty list of strings formatted as U+XXXX or U+XXXXX (hex)
- "confidence_hint" if present is a number between 0.0 and 1.0 (inclusive)
- "char" is a non-empty string (single grapheme/emoji recommended)
- reports overall stats and returns non-zero on problems

Accepts JSON or YAML input. Handles both top-level "map" wrapper ({"format":"rich","map":{...}})
and a plain map object.

Usage:
  python validate_semantic_map.py semantic_map.json
  python validate_semantic_map.py semantic_map.yaml --require-codepoints --strict --json

Exit codes:
 0 - OK (no problems)
 1 - Problems found (non-strict)
 2 - Fatal error (file not found / parse error / strict mode with problems)

Output:
 - Human-readable summary by default.
 - With --json emits a JSON report for automation.

"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from typing import Any, Dict, List, Optional

# optional YAML support
try:
    import yaml  # type: ignore
    YAML_AVAILABLE = True
except Exception:
    YAML_AVAILABLE = False

CP_RE = re.compile(r"^U\+[0-9A-Fa-f]{4,6}$")


def load_any(path: str) -> Optional[Dict[str, Any]]:
    if not os.path.exists(path):
        print(f"ERROR: file not found: {path}", file=sys.stderr)
        return None
    with open(path, "r", encoding="utf-8") as fh:
        txt = fh.read()
    # try JSON
    try:
        return json.loads(txt)
    except Exception:
        if YAML_AVAILABLE:
            try:
                return yaml.safe_load(txt)
            except Exception as e:
                print(f"ERROR: failed to parse YAML: {e}", file=sys.stderr)
                return None
        else:
            print("ERROR: not valid JSON and PyYAML not installed to parse YAML.", file=sys.stderr)
            return None


def extract_map(obj: Dict[str, Any]) -> Dict[str, Any]:
    if not isinstance(obj, dict):
        return {}
    # common wrapper: { "format": "rich", "map": { ... } }
    if "map" in obj and isinstance(obj["map"], dict):
        return obj["map"]
    # otherwise assume top-level is the map
    return obj


def is_valid_codepoint(s: Any) -> bool:
    if not isinstance(s, str):
        return False
    return bool(CP_RE.match(s.strip()))


def validate_entry(key: str, entry: Any, require_codepoints: bool) -> Dict[str, Any]:
    """
    Validate a single map entry.
    Returns a dict with lists of problems found.
    """
    problems: List[str] = []
    info: Dict[str, Any] = {"key": key, "problems": problems}
    if not isinstance(entry, dict):
        problems.append("entry is not an object/dict (expected rich entry with metadata)")
        return info

    # char
    char = entry.get("char")
    if not char or not isinstance(char, str) or char.strip() == "":
        problems.append("missing or empty 'char'")

    # role
    role = entry.get("role")
    if not role or not isinstance(role, str) or role.strip() == "":
        problems.append("missing or empty 'role'")

    # effect
    effect = entry.get("effect")
    if not effect or not isinstance(effect, str) or effect.strip() == "":
        problems.append("missing or empty 'effect'")

    # codepoints
    cps = entry.get("codepoints")
    if cps is None:
        if require_codepoints:
            problems.append("missing 'codepoints' (required)")
    else:
        if not isinstance(cps, list) or len(cps) == 0:
            problems.append("'codepoints' must be a non-empty list")
        else:
            for i, cp in enumerate(cps):
                if not is_valid_codepoint(cp):
                    problems.append(f"codepoints[{i}] invalid format: {cp!r} (expected U+XXXX..U+XXXXX)")

    # confidence_hint
    ch = entry.get("confidence_hint")
    if ch is not None:
        try:
            val = float(ch)
            if not (0.0 <= val <= 1.0):
                problems.append(f"'confidence_hint' out of range 0.0..1.0: {val}")
        except Exception:
            problems.append(f"'confidence_hint' not a number: {ch!r}")

    # optional: warn if char longer than a few codepoints (not an error)
    if isinstance(char, str) and len(char) > 4:
        info["warning"] = info.get("warning", []) + [f"'char' appears long ({len(char)} characters)"]

    return info


def run_validation(path: str, require_codepoints: bool = False, max_entries: Optional[int] = None) -> Dict[str, Any]:
    report: Dict[str, Any] = {
        "path": path,
        "parse_error": None,
        "total_entries": 0,
        "entry_reports": [],
        "duplicate_chars": [],
    }

    obj = load_any(path)
    if obj is None:
        report["parse_error"] = "failed to parse file"
        return report

    mp = extract_map(obj)
    if not isinstance(mp, dict):
        report["parse_error"] = "no mapping object found"
        return report

    report["total_entries"] = len(mp)
    char_index: Dict[str, List[str]] = {}
    for i, (k, v) in enumerate(mp.items()):
        if max_entries and i >= max_entries:
            break
        ent_report = validate_entry(str(k), v, require_codepoints=require_codepoints)
        report["entry_reports"].append(ent_report)
        # index char if present
        if isinstance(v, dict):
            ch = v.get("char")
        else:
            ch = None
        if ch:
            char_index.setdefault(str(ch), []).append(str(k))

    # duplicates
    for ch, keys in char_index.items():
        if len(keys) > 1:
            report["duplicate_chars"].append({"char": ch, "keys": keys})

    return report


def print_human(report: Dict[str, Any]) -> None:
    if report.get("parse_error"):
        print("PARSE ERROR:", report["parse_error"])
        return
    print("Semantic symbol map validation")
    print("==============================")
    print("Path:", report.get("path"))
    print("Total entries:", report.get("total_entries", 0))
    if report.get("duplicate_chars"):
        print("\nDuplicate characters found:")
        for d in report["duplicate_chars"]:
            print(f"  {d['char']!r} used by keys: {', '.join(d['keys'])}")
    else:
        print("\nNo duplicate characters detected.")

    print("\nEntry problems:")
    count_problems = 0
    for e in report.get("entry_reports", []):
        if e.get("problems"):
            count_problems += 1
            print(f"- {e['key']}:")
            for p in e["problems"]:
                print(f"    - {p}")
        elif e.get("warning"):
            print(f"- {e['key']}: warnings:")
            for w in e["warning"]:
                print(f"    - {w}")
    if count_problems == 0:
        print("\nNo entry-level validation problems found.")
    else:
        print(f"\nEntries with problems: {count_problems}")


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description="Validate semantic symbol map (requires: char, role, effect).")
    parser.add_argument("path", help="Path to JSON or YAML semantic symbol map")
    parser.add_argument("--require-codepoints", action="store_true", help="Require entries to have codepoints")
    parser.add_argument("--max-entries", type=int, default=0, help="Limit number of entries validated (0 = all)")
    parser.add_argument("--json", action="store_true", help="Emit JSON report")
    parser.add_argument("--strict", action="store_true", help="Exit with code 2 if any problems found")
    args = parser.parse_args(argv)

    max_entries = args.max_entries if args.max_entries and args.max_entries > 0 else None
    report = run_validation(args.path, require_codepoints=args.require_codepoints, max_entries=max_entries)

    problems_exist = bool(report.get("parse_error")) or bool(report.get("duplicate_chars")) or any(e.get("problems") for e in report.get("entry_reports", []))

    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        print_human(report)

    if problems_exist:
        return 2 if args.strict else 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())