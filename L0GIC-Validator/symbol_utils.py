#!/usr/bin/env python3
"""
symbol_utils.py — normalization and extended symbol lookup helpers

Enhancements added:
- Unicode codepoint keys support (e.g. "U+2234" -> "∴")
- Alias/semantic keys (e.g. "therefore" -> "∴", "forall" -> "∀")
- Hex and escaped-byte lookup (existing)
- Inverse lookup support: symbol -> list of keys that map to it
- Helper to augment a symbol_map with generated hex/escaped/codepoint/alias keys
- Clean, well-documented functions for use by passive_listener.py

Usage:
- normalize_and_map_ascii(ascii_str, symbol_map, reverse_map=None, aliases=None)
  returns (resolved_symbol, used_key)
- build_inverse_map(symbol_map, aliases=None) -> Dict[str, List[str]]
- augment_symbol_map_with_variants(symbol_map, aliases=None, include_codepoints=True)
  returns a new dict including generated keys (hex, escaped, U+XXXX, aliases)

Note: symbol_map should be a dict mapping keys (strings) -> symbol chars (single unicode char).
Aliases is an optional dict mapping alias-text -> symbol char (or alias -> canonical key).
"""

from __future__ import annotations
import string
import json
from typing import Dict, List, Optional, Tuple, Iterable
import unicodedata

# Utilities --------------------------------------------------------------------

def to_hex_repr(s: str) -> str:
    """Return lowercase hex bytes without prefix, e.g. 'ã¥' -> 'c3a3c2a5'"""
    return "".join(f"{ord(ch):02x}" for ch in s)


def to_escaped_bytes(s: str) -> str:
    """Return python-escaped bytes sequence, e.g. 'ã' -> '\\xc3\\xa3' for UTF-8 bytes."""
    return "".join(f"\\x{b:02x}" for b in s.encode("utf-8"))


def unicode_codepoint_key(s: str) -> str:
    """Return a codepoint key for s. If s has length 1 -> 'U+XXXX', else concatenated 'U+XXXX_U+YYYY'."""
    cps = [f"U+{ord(ch):04X}" for ch in s]
    return "_".join(cps)


def normalize_ascii(ascii_str: Optional[str]) -> str:
    """
    Normalize ascii_str by trimming and removing non-printable control characters.
    Does not attempt to transliterate Unicode.
    """
    if ascii_str is None:
        return ""
    s = ascii_str.strip()
    if not s:
        return ""
    cleaned = "".join(ch for ch in s if ch in string.printable and ch != "\x00")
    return cleaned if cleaned else s


# Symbol mapping helpers -------------------------------------------------------

def build_inverse_map(symbol_map: Dict[str, str], aliases: Optional[Dict[str, str]] = None) -> Dict[str, List[str]]:
    """
    Return a mapping from symbol -> list of keys that map to it.
    Includes alias keys (if provided).
    """
    inv: Dict[str, List[str]] = {}
    for k, v in symbol_map.items():
        inv.setdefault(v, []).append(k)
    if aliases:
        for alias_k, alias_v in aliases.items():
            # alias_v might be a symbol char or a canonical key; prefer symbol char mapping if possible
            if alias_v in symbol_map.values():
                symbol_char = alias_v
            else:
                # alias_v might be a key in symbol_map
                symbol_char = symbol_map.get(alias_v, alias_v)
            inv.setdefault(symbol_char, []).append(alias_k)
    # canonicalize lists
    for k in inv:
        inv[k] = sorted(dict.fromkeys(inv[k]))
    return inv


def augment_symbol_map_with_variants(
    symbol_map: Dict[str, str],
    aliases: Optional[Dict[str, str]] = None,
    include_codepoints: bool = True,
    include_hex_and_escaped: bool = True
) -> Dict[str, str]:
    """
    Produce a new symbol map containing original entries plus variant keys:
      - escaped byte sequences (e.g. "\\xc3\\xa3\\xc2\\xa5")
      - contiguous hex bytes (e.g. "c3a3c2a5")
      - Unicode codepoint keys (e.g. "U+2234" or "U+2234_U+XXXX")
      - alias semantic keys if provided (alias -> symbol)
    Behavior:
      - If an alias maps to a canonical key, it will be resolved to the symbol.
      - Does not overwrite existing keys unless same mapping.
    """
    out = dict(symbol_map)  # shallow copy
    # include aliases mapping (alias text -> symbol or canonical key)
    if aliases:
        for alias_k, alias_v in aliases.items():
            if alias_v in symbol_map.values():
                out.setdefault(alias_k, alias_v)
            else:
                # alias_v might be a canonical key in symbol_map
                resolved = symbol_map.get(alias_v)
                if resolved:
                    out.setdefault(alias_k, resolved)
                else:
                    # store alias as-is (if value looks like a single char use directly)
                    if isinstance(alias_v, str) and len(alias_v) <= 2:
                        out.setdefault(alias_k, alias_v)

    # for each existing key that maps to a symbol, add variants
    for k, sym in list(symbol_map.items()):
        # add hex and escaped variants for the key itself (if it contains multi-byte characters)
        if include_hex_and_escaped:
            try:
                hex_k = to_hex_repr(k)
                esc_k = to_escaped_bytes(k)
                # prefer not to overwrite different mappings
                out.setdefault(hex_k, sym)
                out.setdefault(esc_k, sym)
            except Exception:
                pass
        # add codepoint key for the displayed symbol (sym) and for the key string as well
        if include_codepoints:
            try:
                cp_sym = unicode_codepoint_key(sym)
                cp_key = unicode_codepoint_key(k)
                out.setdefault(cp_sym, sym)
                out.setdefault(cp_key, sym)
            except Exception:
                pass

    return out


# Main resolution helper ------------------------------------------------------

def normalize_and_map_ascii(
    ascii_str: Optional[str],
    symbol_map: Dict[str, str],
    reverse_map: Optional[Dict[str, str]] = None,
    aliases: Optional[Dict[str, str]] = None
) -> Tuple[str, str]:
    """
    Try multiple strategies to resolve ascii_str to a symbol in symbol_map:
      1. direct normalized lookup (normalize_ascii)
      2. direct raw ascii lookup
      3. alias lookup (if aliases provided)
      4. hex representation lookup
      5. escaped-bytes lookup
      6. codepoint key lookup (U+XXXX[_U+YYYY...])
      7. reverse_map lookup (if provided) where ascii_str equals symbol and we want a key
      8. case-insensitive single-byte letter lookup
    Returns (resolved_symbol, used_key).
    - resolved_symbol is the mapped Unicode symbol (or '⍰' if unknown)
    - used_key is the key string in the map that produced the mapping (or original ascii_str if none)
    """
    orig = ascii_str or ""
    # 1. normalized printable
    norm = normalize_ascii(orig)
    if norm and norm in symbol_map:
        return symbol_map[norm], norm

    # 2. direct raw ascii
    if orig in symbol_map:
        return symbol_map[orig], orig

    # 3. alias lookup
    if aliases:
        # aliases may map alias->symbol or alias->canonical-key
        v = aliases.get(orig)
        if v:
            if v in symbol_map.values():
                return v, orig
            if v in symbol_map:
                return symbol_map[v], orig

    # 4. hex representation
    try:
        hexrep = to_hex_repr(orig)
        if hexrep and hexrep in symbol_map:
            return symbol_map[hexrep], hexrep
    except Exception:
        pass

    # 5. escaped bytes
    try:
        esc = to_escaped_bytes(orig)
        if esc and esc in symbol_map:
            return symbol_map[esc], esc
    except Exception:
        pass

    # 6. Unicode codepoint key lookup (for symbol or for orig)
    try:
        cp_sym = unicode_codepoint_key(orig)
        if cp_sym and cp_sym in symbol_map:
            return symbol_map[cp_sym], cp_sym
        # try codepoint of mapped symbol (if ascii decodes to actual symbol)
        for k, v in symbol_map.items():
            # if ascii_str equals a symbol char, try mapping symbol -> key
            if orig == v:
                cp = unicode_codepoint_key(v)
                if cp in symbol_map:
                    return symbol_map[cp], cp
    except Exception:
        pass

    # 7. reverse_map: if caller provided reverse_map where symbol->key, support that
    if reverse_map:
        # if ascii_str itself is a symbol (single char), try reverse_map to find canonical key
        if len(orig) == 1 and orig in reverse_map:
            return orig, reverse_map[orig]

    # 8. case-insensitive checks for single-byte letters
    try:
        if len(orig) == 1:
            up = orig.upper()
            lo = orig.lower()
            if up in symbol_map:
                return symbol_map[up], up
            if lo in symbol_map:
                return symbol_map[lo], lo
    except Exception:
        pass

    # not found
    return "⍰", orig


# Optional helper: suggest keys for unknown ascii_str --------------------------------
def suggest_keys_for_ascii(ascii_str: str) -> Dict[str, str]:
    """
    Return a small dictionary of candidate representations to help generate map entries:
      { "raw": orig, "hex": "...", "escaped": "...", "codepoint": "U+...." }
    """
    return {
        "raw": ascii_str,
        "hex": to_hex_repr(ascii_str),
        "escaped": to_escaped_bytes(ascii_str),
        "codepoint": unicode_codepoint_key(ascii_str),
        "name": ";".join(unicodedata.name(ch, "?") for ch in ascii_str)
    }