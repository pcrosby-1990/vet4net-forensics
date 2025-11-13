import subprocess
import json
import sys

with open("love.json", "r", encoding="utf-8") as f:
    burst = json.load(f)

json_burst = json.dumps(burst, ensure_ascii=False)

subprocess.run([
    sys.executable,
    "passive_listener.py",
    "--test-burst",
    json_burst
])
