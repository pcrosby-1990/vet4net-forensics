#!/usr/bin/env python3
"""
promote_gluon.py — upgraded (v2) to support:
- programmatic import (exposes promote_gluon function)
- CLI behavior unchanged (backwards-compatible)
- richer metadata support (role, aliases, codepoints)
- better logging and return codes for automation
"""

from __future__ import annotations
import argparse
import json
import os
import shutil
import tempfile
from datetime import datetime
from typing import Dict, Any, List, Optional, Tuple

def load_symbol_map(path: str) -> Dict[str, Any]:
    if not os.path.exists(path):
        return {}
    with open(path, "r", encoding="utf-8") as fh:
        return json.load(fh)

def write_atomic(path: str, data: Dict[str, Any]) -> None:
    dirpath = os.path.dirname(path) or "."
    fd, tmp = tempfile.mkstemp(dir=dirpath, prefix=".tmp_symbol_map_")
    os.close(fd)
    with open(tmp, "w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False, indent=2)
    os.replace(tmp, path)

def backup_file(path: str) -> Optional[str]:
    if not os.path.exists(path):
        return None
    bak = f"{path}.bak-{datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')}"
    shutil.copy2(path, bak)
    return bak

def find_existing_symbol_entry(symbol_map: Dict[str, Any], symbol_char: str) -> Optional[str]:
    for k, v in symbol_map.items():
        if isinstance(v, dict):
            if str(v.get("char", "")) == symbol_char:
                return k
        else:
            if str(v) == symbol_char:
                return k
    return None

def promote_gluon(
    gluon_key: str,
    resolved_symbol: str,
    map_path: str = "symbol_map.json",
    role: Optional[str] = None,
    aliases: Optional[List[str]] = None,
    codepoints: Optional[List[str]] = None,
    force: bool = False,
) -> Tuple[bool, str]:
    aliases = aliases or []
    codepoints = codepoints or []

    symbol_map = load_symbol_map(map_path)
    is_rich = any(isinstance(v, dict) and "char" in v for v in symbol_map.values())

    # Prevent accidental overwrites
    if gluon_key in symbol_map and not force:
        return False, f"Gluon key '{gluon_key}' already exists; use --force to override."

    existing = find_existing_symbol_entry(symbol_map, resolved_symbol)
    if existing and existing != gluon_key and not force:
        return False, f"Symbol '{resolved_symbol}' already exists as key '{existing}'; use --force to override."

    bak = backup_file(map_path)

    if is_rich:
        canonical_key = resolved_symbol
        meta = symbol_map.get(canonical_key)
        if not isinstance(meta, dict):
            meta = {"char": resolved_symbol, "role": role or "", "aliases": [], "codepoints": []}
        meta["char"] = resolved_symbol
        if role:
            meta["role"] = role
        # merge aliases and ensure uniqueness
        merged_aliases = list(dict.fromkeys((meta.get("aliases") or []) + aliases + [gluon_key]))
        meta["aliases"] = merged_aliases
        merged_cps = list(dict.fromkeys((meta.get("codepoints") or []) + codepoints))
        meta["codepoints"] = merged_cps
        symbol_map[canonical_key] = meta
        # ensure no stale flat mapping for gluon_key remains
        if gluon_key in symbol_map and gluon_key != canonical_key:
            symbol_map.pop(gluon_key, None)
    else:
        # flat map: add or overwrite depending on force
        symbol_map[gluon_key] = resolved_symbol

    write_atomic(map_path, symbol_map)
    msg = f"Promoted gluon '{gluon_key}' -> '{resolved_symbol}'."
    if bak:
        msg += f" Backup: {bak}"
    return True, msg

def main():
    parser = argparse.ArgumentParser(description="Promote a gluon key into symbol_map.json (safe)")
    parser.add_argument("--gluon", required=True, help="Gluon key to promote (e.g. 'Resonance')")
    parser.add_argument("--symbol", required=True, help="Resolved symbol/char (e.g. '🔊')")
    parser.add_argument("--map", dest="map_path", default="symbol_map.json", help="Path to symbol_map.json")
    parser.add_argument("--role", help="Optional role for metadata (e.g. 'diagnostic')")
    parser.add_argument("--aliases", help="Comma-separated aliases (e.g. 'loud,announce')", default="")
    parser.add_argument("--codepoints", help="Comma-separated U+XXXX codepoints", default="")
    parser.add_argument("--force", action="store_true", help="Force overwrite if conflicts exist")
    args = parser.parse_args()

    aliases = [a.strip() for a in args.aliases.split(",") if a.strip()] if args.aliases else []
    codepoints = [c.strip() for c in args.codepoints.split(",") if c.strip()] if args.codepoints else []

    changed, msg = promote_gluon(args.gluon, args.symbol, map_path=args.map_path, role=args.role, aliases=aliases, codepoints=codepoints, force=args.force)
    if changed:
        print(msg)
        raise SystemExit(0)
    else:
        print(msg)
        raise SystemExit(2)

if __name__ == "__main__":
    main()