import time
from datetime import datetime
from collections import Counter
import os

PERSIST_FILE = "last_decoded.txt"

def decode_burst_from_timestamps(timestamps: list) -> str:
    counts = Counter(timestamps)
    binary_stream = ""
    for ts, count in sorted(counts.items()):
        bit = "1" if count >= 2 else "0"
        binary_stream += bit

    chunks = [binary_stream[i:i+8] for i in range(0, len(binary_stream), 8)]
    decoded = ""
    for chunk in chunks:
        if len(chunk) == 8:
            try:
                decoded += chr(int(chunk, 2))
            except ValueError:
                decoded += "�"
    return decoded.strip()

def read_timestamps(filename: str) -> list:
    timestamps = []
    try:
        with open(filename, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    ts = datetime.strptime(line.strip(), "%Y-%m-%d %H:%M:%S.%f")
                    timestamps.append(ts)
                except ValueError:
                    continue
    except FileNotFoundError:
        return []
    return timestamps

def load_last_decoded() -> str:
    if os.path.exists(PERSIST_FILE):
        with open(PERSIST_FILE, "r", encoding="utf-8") as f:
            return f.read().strip()
    return ""

def save_last_decoded(decoded: str):
    with open(PERSIST_FILE, "w", encoding="utf-8") as f:
        f.write(decoded)

def monitor(filename: str, interval: int = 2):
    print("🟢 Passive listener activated. Monitoring corridor...")
    last_seen = set()
    last_decoded = load_last_decoded()

    while True:
        timestamps = read_timestamps(filename)
        new_ts = [ts for ts in timestamps if ts not in last_seen]
        if new_ts:
            decoded = decode_burst_from_timestamps(new_ts)
            if decoded:
                now = datetime.now().strftime('%H:%M:%S.%f')[:-3]
                if decoded != last_decoded:
                    print(f"[{now}] 🔄 Mutation detected → {decoded}")
                    last_decoded = decoded
                    save_last_decoded(decoded)
                else:
                    print(f"[{now}] Echo confirmed → {decoded}")
            last_seen.update(new_ts)
        time.sleep(interval)

if __name__ == "__main__":
    monitor("entropy_burst.txt", interval=2)
