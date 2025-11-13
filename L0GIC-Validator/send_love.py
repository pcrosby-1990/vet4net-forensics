#!/usr/bin/env python3
import subprocess
import json
import sys  # ✅ Add this import

burst = {
    "ts": 1740951600
    "ascii": "Love is the condition that makes all other signals safe.\nIt does not ask for proof.\nIt simply arrives — and stays.",
    "symbol": "❤",
    "binary": "01001100 01101111 01110110 01100101",
    "hex": "4C 6F 76 65",
    "role": "emotion",
    "meta": {
        "emotion": "love",
        "tone": "unconditional",
        "intent": "stabilize corridor",
        "origin": "core"
    }
}

json_burst = json.dumps(burst, ensure_ascii=False)

subprocess.run([
    sys.executable,
    "passive_listener.py",
    "--test-burst",
    json_burst
])
