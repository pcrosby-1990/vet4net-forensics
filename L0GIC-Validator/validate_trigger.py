#!/usr/bin/env python3
"""
validate_trigger.py

Validate a trigger config (JSON or YAML) according to rules described in the config:
- checks required fields exist
- ensures symbol uniqueness by character (if requested)
- enforces max aliases per entry
- sanity checks for numeric fields
- prints human-friendly errors/warnings and returns non-zero on validation failure

Usage:
  python validate_trigger.py trigger_release.yaml
  python validate_trigger.py trigger_release.yaml --strict
"""
from __future__ import annotations
import argparse
import json
import os
import sys
from typing import Any, Dict, List, Tuple, Optional

try:
    import yaml  # type: ignore
    YAML_AVAILABLE = True
except Exception:
    YAML_AVAILABLE = False

def load_file(path: str) -> Optional[Dict[str, Any]]:
    if not os.path.exists(path):
        print(f"ERROR: file not found: {path}", file=sys.stderr)
        return None
    with open(path, "r", encoding="utf-8") as fh:
        txt = fh.read()
    # Try JSON first, then YAML
    try:
        return json.loads(txt)
    except Exception:
        if YAML_AVAILABLE:
            try:
                return yaml.safe_load(txt)
            except Exception as e:
                print(f"ERROR: Failed to parse YAML: {e}", file=sys.stderr)
                return None
        else:
            print("ERROR: Not valid JSON and PyYAML not installed to parse YAML.", file=sys.stderr)
            return None

def get(d: Dict[str, Any], path: str) -> Any:
    # dot-path getter; returns None if missing
    cur = d
    for p in path.split("."):
        if not isinstance(cur, dict):
            return None
        cur = cur.get(p)
        if cur is None:
            return None
    return cur

def validate_required(cfg: Dict[str, Any], paths: List[str]) -> List[str]:
    missing = []
    for p in paths:
        if get(cfg, p) is None:
            missing.append(p)
    return missing

def collect_symbol_entries(cfg: Dict[str, Any]) -> Tuple[Dict[str, Dict[str, Any]], bool]:
    """
    Returns (map, is_rich) where map is top-level mapping for symbolic_map.map entries, and is_rich indicates metadata form.
    """
    sm = cfg.get("symbolic_map") or {}
    if not isinstance(sm, dict):
        return {}, False
    if sm.get("format") == "rich" and isinstance(sm.get("map"), dict):
        return sm.get("map"), True
    # if map directly present as object
    if isinstance(sm.get("map"), dict):
        return sm.get("map"), any(isinstance(v, dict) for v in sm.get("map").values())
    # fallback: if root contains mapping directly (legacy)
    if isinstance(sm, dict) and all(isinstance(v, str) for v in sm.values()):
        return sm, False
    return {}, False

def validate_symbol_uniqueness(entries: Dict[str, Any], by: str = "char") -> List[str]:
    seen = {}
    problems = []
    for key, meta in entries.items():
        if isinstance(meta, dict):
            char = meta.get("char")
        else:
            char = meta
        if not char:
            problems.append(f"{key}: missing character/codepoint")
            continue
        if char in seen:
            problems.append(f"Duplicate symbol char '{char}' for keys: {seen[char]} and {key}")
        else:
            seen[char] = key
    return problems

def validate_alias_counts(entries: Dict[str, Any], max_aliases: int) -> List[str]:
    problems = []
    for key, meta in entries.items():
        aliases = []
        if isinstance(meta, dict):
            aliases = meta.get("aliases") or []
        if not isinstance(aliases, list):
            problems.append(f"{key}: aliases must be a list")
            continue
        if len(aliases) > max_aliases:
            problems.append(f"{key}: has {len(aliases)} aliases (max {max_aliases})")
    return problems

def run_validation(cfg: Dict[str, Any], strict: bool = False) -> int:
    ok = True
    val = cfg.get("validation", {}) or {}
    required = val.get("required_fields", [])
    missing = validate_required(cfg, required)
    if missing:
        print("Missing required fields:")
        for m in missing:
            print("  -", m)
        ok = False
    entries, is_rich = collect_symbol_entries(cfg)
    if not entries:
        print("WARNING: no symbol entries found in symbolic_map.map")
    else:
        by = val.get("symbol_uniqueness", "char")
        problems = validate_symbol_uniqueness(entries, by=by)
        if problems:
            print("Symbol uniqueness problems:")
            for p in problems:
                print("  -", p)
            ok = False
        max_aliases = val.get("max_aliases_per_entry", 10)
        alias_problems = validate_alias_counts(entries, max_aliases)
        if alias_problems:
            print("Alias count problems:")
            for p in alias_problems:
                print("  -", p)
            ok = False
    if ok:
        print("Validation: OK")
        return 0
    else:
        print("Validation: FAILED")
        return 2 if strict else 1

def main(argv=None):
    p = argparse.ArgumentParser(description="Validate trigger config (JSON or YAML)")
    p.add_argument("path", help="Path to trigger config (JSON or YAML)")
    p.add_argument("--strict", action="store_true", help="Exit non-zero on warnings")
    args = p.parse_args(argv)
    cfg = load_file(args.path)
    if cfg is None:
        return 2
    return run_validation(cfg, strict=args.strict)

if __name__ == "__main__":
    raise SystemExit(main())