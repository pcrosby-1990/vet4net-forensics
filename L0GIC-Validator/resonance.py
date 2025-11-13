#!/usr/bin/env python3
"""
send_gluon.py — improved, robust helper to send a "gluon" burst to passive_listener.py

Improvements:
- Uses sys.executable to call passive_listener.py in the same env.
- CLI with options for encoding (ascii/hex/bits), timeout, retries, dry-run, capture.
- Captures and parses listener stdout/stderr; treats JSON output specially (prints pretty JSON).
- Detects unresolved result (⍰) and can optionally promote the gluon using promote_gluon.py (in same dir).
- Safe subprocess handling, logging, and clear exit codes for automation.
- Writes optional capture files for debugging.
- Returns exit codes and logs meaningful messages.

Usage examples:
  python send_gluon.py "Resonance"
  python send_gluon.py "Resonance" --mode bits --sep " "
  python send_gluon.py "Resonance" --promote --symbol "🔊" --timeout 20
  python send_gluon.py "Resonance" --dry-run
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import shlex
import subprocess
import sys
import tempfile
import time
from typing import Optional, Tuple

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PASSIVE_LISTENER = os.path.join(SCRIPT_DIR, "passive_listener.py")
PROMOTE_SCRIPT = os.path.join(SCRIPT_DIR, "promote_gluon.py")

# Exit codes
EX_OK = 0
EX_NO_LISTENER = 3
EX_PROMOTE_NOT_FOUND = 4
EX_SUBPROCESS_FAIL = 5
EX_INVALID_ARGS = 6
EX_PROMOTE_FAILED = 7
EX_TIMEOUT = 124

logger = logging.getLogger("send_gluon")


def to_hex(s: str) -> str:
    return s.encode("utf-8").hex()


def to_bits(s: str, sep: str = " ") -> str:
    return sep.join(f"{b:08b}" for b in s.encode("utf-8"))


def check_listener_exists() -> None:
    if not os.path.exists(PASSIVE_LISTENER):
        logger.error("passive_listener.py not found at %s", PASSIVE_LISTENER)
        sys.exit(EX_NO_LISTENER)


def call_listener(payload: str, timeout: int) -> Tuple[int, str, str]:
    """
    Call passive_listener.py --burst "<payload>" and capture stdout/stderr.
    Returns (returncode, stdout, stderr).
    """
    cmd = [sys.executable, PASSIVE_LISTENER, "--burst", payload]
    logger.debug("Executing: %s", shlex.join(cmd))
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
        return proc.returncode, proc.stdout or "", proc.stderr or ""
    except subprocess.TimeoutExpired as e:
        logger.error("Listener timed out after %ds", timeout)
        # e.stdout/e.stderr may exist
        return EX_TIMEOUT, getattr(e, "stdout", "") or "", getattr(e, "stderr", "") or ""
    except Exception as exc:
        logger.exception("Failed to run listener")
        return 1, "", str(exc)


def parse_listener_symbol(stdout: str, stderr: str) -> Optional[str]:
    """
    Try to determine the resolved symbol from listener output.
    - If JSON is present, parse and return obj['symbol'].
    - Otherwise, look for lines like 'Resolved: <symbol> via key: ...' or return '⍰' if unresolved.
    """
    combined = (stdout or "") + "\n" + (stderr or "")
    # Try JSON extraction: first JSON object
    try:
        start = combined.find("{")
        end = combined.rfind("}")
        if start != -1 and end != -1 and end > start:
            obj = json.loads(combined[start:end + 1])
            if isinstance(obj, dict) and "symbol" in obj:
                return obj.get("symbol")
    except Exception:
        # ignore parsing errors
        pass

    # Plain text heuristics
    for line in (stdout + "\n" + stderr).splitlines():
        line = line.strip()
        if not line:
            continue
        # "Resolved: X via key: Y" pattern
        if line.startswith("Resolved:"):
            try:
                after = line.split("Resolved:", 1)[1].strip()
                sym = after.split("via key:")[0].strip()
                return sym
            except Exception:
                continue
        if "Unresolved ascii" in line:
            return "⍰"
        # Fallback: if line equals a single emoji/char, return it
        if len(line) <= 4 and any(ord(ch) > 127 for ch in line):
            return line
    return None


def attempt_promote(gluon_key: str, target_symbol: str, force: bool = False) -> int:
    """
    Run promote_gluon.py CLI to add mapping. Returns exit code (0 success).
    """
    if not os.path.exists(PROMOTE_SCRIPT):
        logger.error("promote_gluon.py not found at %s", PROMOTE_SCRIPT)
        return EX_PROMOTE_NOT_FOUND
    cmd = [sys.executable, PROMOTE_SCRIPT, "--gluon", gluon_key, "--symbol", target_symbol]
    if force:
        cmd.append("--force")
    logger.info("Promoting via: %s", shlex.join(cmd))
    try:
        cp = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        if cp.stdout:
            logger.info("promote stdout: %s", cp.stdout.strip())
        if cp.stderr:
            logger.warning("promote stderr: %s", cp.stderr.strip())
        return cp.returncode
    except subprocess.TimeoutExpired:
        logger.error("promote_gluon.py timed out")
        return EX_PROMOTE_FAILED
    except Exception:
        logger.exception("Failed to run promote_gluon.py")
        return EX_PROMOTE_FAILED


def write_capture(stdout: str, stderr: str) -> Tuple[Optional[str], Optional[str]]:
    sfile = efile = None
    try:
        if stdout:
            fd, sfile = tempfile.mkstemp(prefix="listener_stdout_", suffix=".log")
            with os.fdopen(fd, "w", encoding="utf-8") as fh:
                fh.write(stdout)
            logger.info("Wrote listener stdout to %s", sfile)
        if stderr:
            fd, efile = tempfile.mkstemp(prefix="listener_stderr_", suffix=".log")
            with os.fdopen(fd, "w", encoding="utf-8") as fh:
                fh.write(stderr)
            logger.info("Wrote listener stderr to %s", efile)
    except Exception:
        logger.exception("Failed to write capture files")
    return sfile, efile


def main(argv: Optional[list[str]] = None) -> int:
    p = argparse.ArgumentParser(description="Send a gluon burst to passive_listener.py (upgraded)")
    p.add_argument("gluon", help="Text to send (emotion/gluon payload)")
    p.add_argument("--mode", choices=("ascii", "hex", "bits"), default="ascii")
    p.add_argument("--sep", default=" ", help="Separator for bits mode")
    p.add_argument("--timeout", type=int, default=10, help="Listener subprocess timeout (s)")
    p.add_argument("--retries", type=int, default=1, help="Retry attempts on failure")
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--capture", action="store_true", help="Save listener stdout/stderr to temp files")
    p.add_argument("--json-output", action="store_true", help="If listener prints JSON, pretty-print it")
    p.add_argument("--promote", action="store_true", help="If unresolved, promote the gluon (requires promote_gluon.py)")
    p.add_argument("--symbol", help="Symbol to use when promoting (required for non-interactive promote)")
    p.add_argument("--force-promote", action="store_true")
    p.add_argument("--verbose", "-v", action="store_true")
    args = p.parse_args(argv)

    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    logger.debug("Arguments: %s", args)

    if args.promote and (not args.symbol and not sys.stdin.isatty()):
        logger.error("--promote requires --symbol in non-interactive mode")
        return EX_INVALID_ARGS

    check_listener_exists()

    # prepare payload
    if args.mode == "ascii":
        payload = args.gluon
    elif args.mode == "hex":
        payload = to_hex(args.gluon)
    else:
        payload = to_bits(args.gluon, sep=args.sep)

    cmd_preview = [sys.executable, PASSIVE_LISTENER, "--burst", payload]
    logger.info("Prepared payload (preview): %s", payload if len(payload) < 200 else payload[:200] + "...")
    if args.dry_run:
        print("Dry-run. Command to execute:\n", shlex.join(cmd_preview))
        return EX_OK

    last_rc = 1
    last_out = ""
    last_err = ""
    for attempt in range(1, max(1, args.retries) + 1):
        logger.info("Calling listener (attempt %d/%d)", attempt, args.retries)
        rc, out, err = call_listener(payload, timeout=args.timeout)
        last_rc, last_out, last_err = rc, out, err
        logger.debug("Listener rc=%d stdout_len=%d stderr_len=%d", rc, len(out), len(err))
        if rc == 0:
            break
        if attempt < args.retries:
            logger.info("Retrying in 0.5s...")
            time.sleep(0.5)

    if args.capture:
        sfile, efile = write_capture(last_out, last_err)
        if sfile:
            print("Captured stdout:", sfile)
        if efile:
            print("Captured stderr:", efile)

    if last_rc != 0:
        logger.error("Listener exited with code %d", last_rc)
        if last_err:
            logger.error("Listener stderr:\n%s", last_err.strip())
        return EX_SUBPROCESS_FAIL if last_rc not in (EX_TIMEOUT, ) else EX_TIMEOUT

    # If JSON output requested, pretty-print if possible
    if args.json_output:
        try:
            start = last_out.find("{")
            end = last_out.rfind("}")
            if start != -1 and end != -1 and end > start:
                obj = json.loads(last_out[start:end + 1])
                print(json.dumps(obj, ensure_ascii=False, indent=2))
            else:
                logger.info("No JSON found in listener output")
        except Exception:
            logger.exception("Failed to parse JSON from listener output")

    resolved = parse_listener_symbol(last_out, last_err)
    logger.info("Listener resolved symbol: %r", resolved)

    # Promotion flow
    if args.promote:
        unresolved = (resolved is None) or (resolved == "⍰")
        if not unresolved:
            logger.info("Already resolved to %r; skipping promotion.", resolved)
            return EX_OK
        target = args.symbol
        if not target:
            if not sys.stdin.isatty():
                logger.error("No --symbol provided and not interactive; aborting promotion.")
                return EX_INVALID_ARGS
            # interactive prompt
            try:
                target = input(f"Enter a symbol to promote for '{args.gluon}': ").strip()
            except Exception:
                logger.exception("Failed to read symbol from input")
                return EX_PROMOTE_FAILED
            if not target:
                logger.error("No symbol entered; aborting")
                return EX_PROMOTE_FAILED
        prom_rc = attempt_promote(args.gluon, target, force=args.force_promote)
        if prom_rc == 0:
            logger.info("Promotion succeeded")
            return EX_OK
        else:
            logger.error("Promotion failed (code %d)", prom_rc)
            return EX_PROMOTE_FAILED

    return EX_OK


if __name__ == "__main__":
    raise SystemExit(main())