#!/usr/bin/env python3
"""
send_gluon.py — upgraded helper to send a "gluon" burst to passive_listener.py

Improvements over prior version:
- Captures passive_listener stdout/stderr and can parse JSON output when listener prints JSON.
- Detects unresolved symbol (⍰) automatically from listener output and offers to promote (interactive or auto with --promote).
- Adds --timeout, --json-output (print listener JSON output), --capture (save listener stdout/stderr to files).
- Supports automatic retry (with --retries) and configurable subprocess timeout.
- Uses logging instead of prints and returns meaningful exit codes.
- Safer subprocess usage: passes payload as single argv element; uses check=False and captures output when needed.
- Better error handling and user feedback for non-interactive runs.
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
from typing import Optional, Tuple

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PASSIVE_LISTENER = os.path.join(SCRIPT_DIR, "passive_listener.py")
PROMOTE_SCRIPT = os.path.join(SCRIPT_DIR, "promote_gluon.py")

# Exit codes:
EX_OK = 0
EX_NO_LISTENER = 3
EX_PROMOTE_NOT_FOUND = 4
EX_SUBPROCESS_FAIL = 5
EX_INVALID_ARGS = 6
EX_PROMOTE_FAILED = 7

logger = logging.getLogger("send_gluon")


def to_hex(s: str) -> str:
    return s.encode("utf-8").hex()


def to_bit_string(s: str, sep: str = " ") -> str:
    b = s.encode("utf-8")
    return sep.join(f"{byte:08b}" for byte in b)


def check_listener_exists() -> None:
    if not os.path.exists(PASSIVE_LISTENER):
        logger.error("passive_listener.py not found at %s", PASSIVE_LISTENER)
        sys.exit(EX_NO_LISTENER)


def call_passive_listener(payload: str, timeout: int, capture: bool) -> Tuple[int, str, str]:
    """
    Calls passive_listener.py --burst "<payload>".
    Returns (returncode, stdout, stderr).
    If capture is False, streams to console but still captures for parsing.
    """
    cmd = [sys.executable, PASSIVE_LISTENER, "--burst", payload]
    logger.debug("Command: %s", shlex.join(cmd))
    try:
        if capture:
            cp = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
            out = cp.stdout or ""
            err = cp.stderr or ""
        else:
            # capture output but also print realtime to console
            cp = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
            out = cp.stdout or ""
            err = cp.stderr or ""
            if out:
                print(out, end="")
            if err:
                print(err, end="", file=sys.stderr)
        return cp.returncode, out, err
    except subprocess.TimeoutExpired as e:
        logger.error("Listener timed out after %ds", timeout)
        return 124, getattr(e, "stdout", "") or "", getattr(e, "stderr", "") or ""
    except Exception as exc:
        logger.exception("Failed to invoke passive_listener.py: %s", exc)
        return 1, "", str(exc)


def attempt_promote_cli(gluon_key: str, symbol: str, force: bool = False) -> int:
    """
    Calls promote_gluon.py CLI to add mapping.
    Returns promote script exit code (0 on success).
    """
    if not os.path.exists(PROMOTE_SCRIPT):
        logger.error("promote_gluon.py not found at %s", PROMOTE_SCRIPT)
        return EX_PROMOTE_NOT_FOUND
    cmd = [sys.executable, PROMOTE_SCRIPT, "--gluon", gluon_key, "--symbol", symbol]
    if force:
        cmd.append("--force")
    logger.info("Running promote CLI: %s", shlex.join(cmd))
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


def parse_listener_output_for_symbol(stdout: str, stderr: str) -> Optional[str]:
    """
    Try to detect resolved symbol in listener output.
    Strategy:
    - If listener prints JSON, parse it and look for "symbol".
    - Else, search for lines like "Resolved: <symbol> via key: <key>" or unresolved indicator "⍰".
    Returns symbol string if found, otherwise None.
    """
    # Attempt JSON parse
    combined = (stdout or "") + "\n" + (stderr or "")
    try:
        # extract first JSON object from output if possible
        start = combined.find("{")
        end = combined.rfind("}")
        if start != -1 and end != -1 and end > start:
            candidate = combined[start:end + 1]
            obj = json.loads(candidate)
            if isinstance(obj, dict) and "symbol" in obj:
                return obj.get("symbol")
    except Exception:
        pass

    # Search plaintext patterns
    for line in (stdout + "\n" + stderr).splitlines():
        line = line.strip()
        if not line:
            continue
        # patterns
        if line.startswith("Resolved:"):
            # "Resolved: ⍰ via key: Love"
            parts = line.split("Resolved:", 1)[1].strip()
            sym = parts.split("via key:", 1)[0].strip()
            return sym
        if "Resolved:" in line:
            parts = line.split("Resolved:", 1)[1].strip()
            sym = parts.split("via key:", 1)[0].strip()
            return sym
        if "Unresolved ascii" in line and "suggestions" in line:
            # unresolved -> symbol likely ⍰
            return "⍰"
        # fallback: if a line is exactly a single emoji/char, return it
        if len(line) <= 4 and not line.isascii():
            return line
    return None


def ensure_symbol_interactive(original_gluon: str) -> Optional[str]:
    """
    Interactively ask user for a symbol to promote. Returns symbol or None.
    """
    if not sys.stdin.isatty():
        logger.error("Interactive prompt not available in non-TTY mode. Provide --symbol.")
        return None
    try:
        sym = input(f"Enter symbol to promote for '{original_gluon}': ").strip()
        return sym or None
    except Exception:
        logger.exception("Failed to read input")
        return None


def write_capture_files(stdout: str, stderr: str) -> Tuple[Optional[str], Optional[str]]:
    """
    If requested, write stdout/stderr to temporary files and return paths.
    """
    try:
        sfile = None
        efile = None
        if stdout:
            fd, sfile = tempfile.mkstemp(prefix="listener_stdout_", suffix=".log")
            os.write(fd, stdout.encode("utf-8"))
            os.close(fd)
            logger.info("Wrote listener stdout to %s", sfile)
        if stderr:
            fd, efile = tempfile.mkstemp(prefix="listener_stderr_", suffix=".log")
            os.write(fd, stderr.encode("utf-8"))
            os.close(fd)
            logger.info("Wrote listener stderr to %s", efile)
        return sfile, efile
    except Exception:
        logger.exception("Failed to write capture files")
        return None, None


def main(argv: Optional[list[str]] = None) -> int:
    p = argparse.ArgumentParser(description="Send a gluon burst to passive_listener.py (upgraded)")
    p.add_argument("gluon", help="Text to send (emotion/gluon payload)")
    p.add_argument("--mode", choices=("ascii", "hex", "bits"), default="ascii", help="How to encode the payload for --burst")
    p.add_argument("--sep", default=" ", help="Separator for bits mode (default: single space). Ignored for ascii/hex.")
    p.add_argument("--dry-run", action="store_true", help="Print the command but don't run it")
    p.add_argument("--promote", action="store_true", help="If unresolved, promote this gluon into symbol_map.json (requires promote_gluon.py)")
    p.add_argument("--symbol", help="Symbol to use when promoting (e.g. '🔊'), required with --promote unless interactive")
    p.add_argument("--force-promote", action="store_true", help="Pass --force to promote_gluon.py")
    p.add_argument("--timeout", type=int, default=10, help="Subprocess timeout in seconds")
    p.add_argument("--retries", type=int, default=1, help="Number of times to retry calling the listener on failure")
    p.add_argument("--capture", action="store_true", help="Save listener stdout/stderr to temporary files")
    p.add_argument("--json-output", action="store_true", help="If listener prints JSON, pretty-print it to stdout")
    p.add_argument("--verbose", "-v", action="store_true", help="Verbose logging")
    args = p.parse_args(argv)

    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    logger.debug("Arguments: %s", args)

    # Basic validation
    if args.promote and (not args.symbol and not sys.stdin.isatty()):
        logger.error("--promote requires --symbol when running non-interactively")
        return EX_INVALID_ARGS

    check_listener_exists()

    # build payload
    if args.mode == "ascii":
        payload = args.gluon
    elif args.mode == "hex":
        payload = to_hex(args.gluon)
    else:  # bits
        payload = to_bit_string(args.gluon, sep=args.sep)

    # dry run: show the invocation and exit
    if args.dry_run:
        cmd = [sys.executable, PASSIVE_LISTENER, "--burst", payload]
        print("Dry run. Command to be executed:\n", shlex.join(cmd))
        return EX_OK

    # call listener with retries
    last_rc = 1
    last_out = ""
    last_err = ""
    for attempt in range(1, max(1, args.retries) + 1):
        logger.info("Invoking listener (attempt %d/%d)", attempt, args.retries)
        rc, out, err = call_passive_listener(payload, timeout=args.timeout, capture=True)
        last_rc, last_out, last_err = rc, out, err
        logger.debug("Listener rc=%s stdout=%d_bytes stderr=%d_bytes", rc, len(out.encode("utf-8")), len(err.encode("utf-8")))
        # if success return code, break
        if rc == 0:
            break
        # else retry if attempts remain
        if attempt < args.retries:
            logger.info("Retrying after failure...")
            time.sleep(0.5)
    # optionally persist capture files
    sfile, efile = (None, None)
    if args.capture:
        sfile, efile = write_capture_files(last_out, last_err)

    # show JSON output if requested and possible
    if args.json_output:
        # try to extract first JSON object from stdout
        try:
            start = last_out.find("{")
            end = last_out.rfind("}")
            if start != -1 and end != -1 and end > start:
                obj = json.loads(last_out[start:end + 1])
                print(json.dumps(obj, ensure_ascii=False, indent=2))
            else:
                logger.info("No JSON object found in listener stdout")
        except Exception:
            logger.exception("Failed to parse JSON from listener stdout")

    # If listener failed return code
    if last_rc != 0:
        logger.error("Listener process exited with code %d", last_rc)
        # show captured stderr
        if last_err:
            logger.error("Listener stderr:\n%s", last_err.strip())
        return EX_SUBPROCESS_FAIL

    # On success, try to detect resolved symbol
    resolved_symbol = parse_listener_output_for_symbol(last_out, last_err)
    logger.info("Resolved symbol detected: %s", resolved_symbol)

    # If unresolved and promote requested, perform promotion flow
    if args.promote:
        # Determine whether symbol indicates unresolved
        unresolved = (resolved_symbol is None) or (resolved_symbol == "⍰")
        if not unresolved:
            logger.info("Listener resolved to %r; promotion not necessary.", resolved_symbol)
            return EX_OK
        # determine target symbol to promote
        target_symbol = args.symbol
        if not target_symbol:
            target_symbol = ensure_symbol_interactive(args.gluon)
            if not target_symbol:
                logger.error("No symbol provided; aborting promotion")
                return EX_INVALID_ARGS
        prom_rc = attempt_promote_cli(args.gluon, target_symbol, force=args.force_promote)
        if prom_rc == 0:
            logger.info("Promotion succeeded")
            return EX_OK
        else:
            logger.error("Promotion failed with code %d", prom_rc)
            return EX_PROMOTE_FAILED

    return EX_OK


if __name__ == "__main__":
    raise SystemExit(main())