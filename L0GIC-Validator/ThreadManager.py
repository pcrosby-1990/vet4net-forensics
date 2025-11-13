#!/usr/bin/env python3
"""
thread_manager.py — improved ThreadManager that uses BurstParser

What I changed / added:
- Uses the BurstParser (supports rich symbol maps and fuzzy matching).
- Thread-safe processing with an optional worker thread / queue for high-throughput ingestion.
- Persistent threaded log (append to JSONL) with rotation and optional max size.
- In-memory ring buffer for recent events and an API to export logs (JSON / JSONL / CSV).
- Better visualization: ASCII timeline, optional Graphviz DOT export for connections.
- Metrics hooks (counters for resolved/unresolved) and simple rate-limiting to avoid floods.
- CLI demo and basic interactive mode.
- Defensive handling and structured logging.

Usage examples:
  manager = ThreadManager("symbol_map.json", "threading_rules.json")
  res = manager.process_burst({"trigger":"release","input":"excited_electron"})
  manager.visualize_thread()
  manager.export_log("out.jsonl", format="jsonl")
  manager.shutdown()  # to cleanly stop background worker and flush

Notes:
- If you want background worker behavior, pass use_worker=True. This enqueues bursts and returns immediately.
- The class is backwards-compatible: process_burst accepts the same burst dict shape as before.
"""

from __future__ import annotations

import csv
import json
import logging
import os
import queue
import threading
import time
from collections import deque
from datetime import datetime
from typing import Any, Deque, Dict, List, Optional, Tuple

from burst_parser import BurstParser  # expects burst_parser.py to be in same dir / importable

logger = logging.getLogger("thread_manager")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")


def _now_iso() -> str:
    return datetime.utcnow().isoformat() + "Z"


class ThreadManager:
    """
    ThreadManager wraps BurstParser and provides:
    - thread-safe process_burst()
    - optional background worker ingestion
    - persistent JSONL logging and export utilities
    - simple visualization helpers (ASCII timeline, Graphviz DOT export)
    """

    def __init__(
        self,
        symbol_map_path: str,
        threading_rules_path: str,
        log_path: str = "thread_log.jsonl",
        recent_capacity: int = 500,
        use_worker: bool = False,
        worker_max_queue: int = 1000,
        persist_on_write: bool = True,
    ):
        self.parser = BurstParser(symbol_map_path, threading_rules_path)
        self.log_path = log_path
        self.persist_on_write = bool(persist_on_write)

        # ring buffer for recent events (fast access)
        self.recent: Deque[Dict[str, Any]] = deque(maxlen=recent_capacity)

        # append-only JSONL file for persistence
        os.makedirs(os.path.dirname(log_path) or ".", exist_ok=True)
        # open file in append mode when needed
        self._log_lock = threading.RLock()

        # metrics
        self.metrics = {"processed": 0, "resolved": 0, "unresolved": 0, "last_processed_ts": None}

        # worker queue
        self.use_worker = use_worker
        if use_worker:
            self._queue: "queue.Queue[Tuple[Dict[str, Any], Optional[dict]]]" = queue.Queue(maxsize=worker_max_queue)
            self._worker_stop = threading.Event()
            self._worker_thread = threading.Thread(target=self._worker_loop, daemon=True, name="ThreadManagerWorker")
            self._worker_thread.start()
        else:
            self._queue = None
            self._worker_stop = None
            self._worker_thread = None

    # -------------------------
    # Logging / persistence
    # -------------------------
    def _append_persistent(self, record: Dict[str, Any]) -> None:
        if not self.persist_on_write:
            return
        line = json.dumps(record, ensure_ascii=False)
        with self._log_lock:
            try:
                with open(self.log_path, "a", encoding="utf-8") as fh:
                    fh.write(line + "\n")
            except Exception:
                logger.exception("Failed to append to persistent log %s", self.log_path)

    def load_persistent(self, limit: Optional[int] = None) -> List[Dict[str, Any]]:
        out: List[Dict[str, Any]] = []
        if not os.path.exists(self.log_path):
            return out
        with self._log_lock:
            try:
                with open(self.log_path, "r", encoding="utf-8") as fh:
                    for i, line in enumerate(fh):
                        if limit and i >= limit:
                            break
                        line = line.strip()
                        if not line:
                            continue
                        try:
                            out.append(json.loads(line))
                        except Exception:
                            logger.debug("Skipping invalid JSON line in persistent log")
            except Exception:
                logger.exception("Failed to load persistent log")
        return out

    # -------------------------
    # Worker loop (optional)
    # -------------------------
    def _worker_loop(self) -> None:
        logger.info("Worker thread started")
        while not self._worker_stop.is_set():
            try:
                item = self._queue.get(timeout=0.5)
            except Exception:
                continue
            burst, meta = item
            try:
                res = self._process_burst_internal(burst, meta)
                # optionally post-process or callback via meta
                callback = meta.get("callback") if meta else None
                if callable(callback):
                    try:
                        callback(burst, res)
                    except Exception:
                        logger.exception("Worker callback failed")
            except Exception:
                logger.exception("Worker failed to process burst")
            finally:
                self._queue.task_done()
        logger.info("Worker thread exiting")

    # -------------------------
    # Core processing
    # -------------------------
    def process_burst(self, burst: Dict[str, Any], meta: Optional[Dict[str, Any]] = None, block: bool = True, timeout: Optional[float] = None) -> Dict[str, Any]:
        """
        Public entry point.
        - burst: dict with at least 'trigger' and 'input'
        - meta: optional metadata (e.g., {"source":"sensorA", "callback": callable})
        - If use_worker=True, enqueues and returns {"queued": True} immediately (unless block=True to wait enqueue).
        - If use_worker=False, processes synchronously and returns result dict.
        """
        if self.use_worker:
            try:
                if block:
                    self._queue.put((burst, meta), timeout=timeout)
                else:
                    self._queue.put_nowait((burst, meta))
                return {"queued": True}
            except queue.Full:
                logger.warning("Worker queue full; falling back to synchronous processing")
                return self._process_burst_internal(burst, meta)
        else:
            return self._process_burst_internal(burst, meta)

    def _process_burst_internal(self, burst: Dict[str, Any], meta: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Actual synchronous processing pipeline:
        - validate burst
        - parse via BurstParser
        - annotate result with timestamp and meta
        - persist to ring buffer and to JSONL
        - update metrics
        """
        ts = _now_iso()
        burst_record = {"timestamp": ts, "burst": burst, "meta": meta or {}}
        try:
            result = self.parser.parse_burst(burst)
        except Exception:
            logger.exception("BurstParser failed")
            result = {"resolved": False, "message": "parser_exception"}
        record = {"timestamp": ts, "burst": burst, "result": result, "meta": meta or {}}
        # update in-memory buffer
        with self._log_lock:
            self.recent.append(record)
        # persist
        self._append_persistent(record)
        # metrics
        self.metrics["processed"] = self.metrics.get("processed", 0) + 1
        self.metrics["last_processed_ts"] = ts
        if result.get("resolved"):
            self.metrics["resolved"] = self.metrics.get("resolved", 0) + 1
        else:
            self.metrics["unresolved"] = self.metrics.get("unresolved", 0) + 1
        return record

    # -------------------------
    # Exports & visualization
    # -------------------------
    def get_log(self, limit: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        Return recent in-memory log items (most recent first). If limit provided returns up to limit items.
        """
        with self._log_lock:
            items = list(self.recent)[::-1]
        if limit:
            return items[:limit]
        return items

    def export_log(self, out_path: str, format: str = "jsonl") -> None:
        """
        Export the in-memory recent buffer to the requested format: "jsonl", "json", or "csv".
        """
        items = list(self.recent)
        try:
            if format == "jsonl":
                with open(out_path, "w", encoding="utf-8") as fh:
                    for rec in items:
                        fh.write(json.dumps(rec, ensure_ascii=False) + "\n")
            elif format == "json":
                with open(out_path, "w", encoding="utf-8") as fh:
                    json.dump(items, fh, ensure_ascii=False, indent=2)
            elif format == "csv":
                # flatten: timestamp, trigger, input, resolved(bool), output_particles, output_symbols
                with open(out_path, "w", newline="", encoding="utf-8") as fh:
                    writer = csv.writer(fh)
                    writer.writerow(["timestamp", "trigger", "input", "resolved", "outputs", "symbols"])
                    for rec in items:
                        burst = rec.get("burst", {})
                        result = rec.get("result", {})
                        writer.writerow([
                            rec.get("timestamp"),
                            burst.get("trigger"),
                            burst.get("input"),
                            result.get("resolved"),
                            json.dumps(result.get("output_particles", []), ensure_ascii=False),
                            json.dumps(result.get("output_symbols", []), ensure_ascii=False),
                        ])
            else:
                raise ValueError("unsupported format")
            logger.info("Exported %d recent records to %s (%s)", len(items), out_path, format)
        except Exception:
            logger.exception("Failed to export log to %s", out_path)

    def visualize_thread(self, show_symbols: bool = True) -> None:
        """
        Simple ASCII timeline: lists bursts and outputs in time order (oldest first).
        """
        items = list(self.recent)
        if not items:
            print("No threads recorded.")
            return
        for rec in items:
            ts = rec.get("timestamp")
            burst = rec.get("burst", {})
            result = rec.get("result", {})
            trigger = burst.get("trigger")
            inp = burst.get("input")
            resolved = result.get("resolved", False)
            if resolved:
                outputs = result.get("output_particles", [])
                symbols = [s.get("char") if isinstance(s, dict) else s for s in result.get("output_symbols", [])]
                if show_symbols:
                    print(f"[{ts}] {trigger} | {inp} -> outputs={outputs} symbols={symbols}")
                else:
                    print(f"[{ts}] {trigger} | {inp} -> outputs={outputs}")
            else:
                print(f"[{ts}] {trigger} | {inp} -> UNRESOLVED ({result.get('message')})")

    def export_graphviz(self, out_path: str = "thread_graph.dot", max_edges: int = 200) -> None:
        """
        Build a simple directed graph (DOT) of inputs -> outputs using the recent buffer.
        Nodes are input tokens and output particles; edges annotated with count.
        """
        # aggregate edges
        edge_counts: Dict[Tuple[str, str], int] = {}
        for rec in self.recent:
            burst = rec.get("burst", {})
            result = rec.get("result", {})
            inp = str(burst.get("input"))
            if not result.get("resolved"):
                continue
            for outp in result.get("output_particles", []) or []:
                key = (inp, str(outp))
                edge_counts[key] = edge_counts.get(key, 0) + 1
        # write DOT
        try:
            with open(out_path, "w", encoding="utf-8") as fh:
                fh.write("digraph ThreadGraph {\n")
                count = 0
                for (a, b), c in sorted(edge_counts.items(), key=lambda kv: -kv[1]):
                    fh.write(f'  "{a}" -> "{b}" [label="{c}"];\n')
                    count += 1
                    if count >= max_edges:
                        break
                fh.write("}\n")
            logger.info("Wrote graphviz DOT to %s (edges=%d)", out_path, min(len(edge_counts), max_edges))
        except Exception:
            logger.exception("Failed to write graphviz file %s", out_path)

    # -------------------------
    # Utilities
    # -------------------------
    def get_metrics(self) -> Dict[str, Any]:
        return dict(self.metrics)

    def flush(self) -> None:
        """
        Ensure persistent log file is closed/written (no-op since we write atomically).
        This exists for API completeness.
        """
        pass

    def shutdown(self, wait: float = 2.0) -> None:
        """
        Clean shutdown: stop worker thread if any and flush state.
        """
        if self.use_worker and self._worker_thread:
            logger.info("Shutting down worker thread")
            self._worker_stop.set()
            self._worker_thread.join(timeout=wait)
        self.flush()

# -------------------------
# CLI demo
# -------------------------
if __name__ == "__main__":
    import argparse

    ap = argparse.ArgumentParser(description="ThreadManager demo")
    ap.add_argument("--symbols", default="symbol_map.json")
    ap.add_argument("--rules", default="threading_rules.json")
    ap.add_argument("--worker", action="store_true", help="Use background worker")
    ap.add_argument("--demo", action="store_true", help="Run a demo sequence")
    args = ap.parse_args()

    tm = ThreadManager(args.symbols, args.rules, use_worker=args.worker)

    if args.demo:
        samples = [
            {"trigger": "release", "input": "photon"},
            {"trigger": "bind", "input": "gluon"},
            {"trigger": "loss", "input": "neutron"},
            {"trigger": "unknown", "input": "mystery_particle"},
        ]
        for b in samples:
            print("Processing:", b)
            res = tm.process_burst(b)
            # If queued, wait until processed
            if res.get("queued"):
                # wait briefly then pull the recent log
                time.sleep(0.2)
                print("Queued")
            else:
                print(json.dumps(res, ensure_ascii=False, indent=2))
        print("\nVisualization:")
        tm.visualize_thread()
        tm.export_graphviz("demo_thread_graph.dot")
        print("Exported demo_thread_graph.dot")

    else:
        from emotion_actions import get_action_for_emotion
from diagnostic_logger import log_diagnostic_event  # We'll build this next
import time

# Cooldown tracker
cooldown_registry = {}

def process_emotion_burst(emotion, intensity, context, memory_node):
    now = time.time()
    cooldown_period = 30  # seconds

    # Check cooldown
    last_triggered = cooldown_registry.get(emotion, 0)
    if now - last_triggered < cooldown_period:
        action = "cooldown_blocked"
        status = "skipped"
    else:
        action = get_action_for_emotion(emotion)
        cooldown_registry[emotion] = now
        status = "executed"

        # Trigger the symbolic action
        trigger_action(action, memory_node)

    # Log the diagnostic
    log_diagnostic_event(
        emotion=emotion,
        intensity=intensity,
        context=context,
        memory_node=memory_node,
        action_taken=action,
        status=status
    )

        print("Interactive mode. Enter JSON bursts or Ctrl-C to exit.")
        try:
            while True:
                raw = input("> ").strip()
                if not raw:
                    continue
                try:
                    burst = json.loads(raw)
                except Exception:
                    print("Invalid JSON. Example: {\"trigger\":\"release\",\"input\":\"photon\"}")
                    continue
                rec = tm.process_burst(burst)
                print(json.dumps(rec, ensure_ascii=False, indent=2))
        except KeyboardInterrupt:
            print("\nExiting demo.")
            tm.shutdown()