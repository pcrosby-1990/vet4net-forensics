import time
import os
import subprocess
from datetime import datetime
from collections import Counter

ENTROPY_FILE = "entropy_burst.txt"
LISTENER_SCRIPT = "passive_listener.py"
LOG_FILE = "burst_log.txt"

# Define symbol map
symbol_map = {
    "ã¥": "∴",
    "¥ã": "Δ",
    "µ#": "⊥",
    "ø%": "⊤"
}

def get_mtime(path):
    return os.path.getmtime(path)

def decode_burst(timestamps):
    counts = Counter(timestamps)
    binary_stream = ""
    for ts in sorted(counts):
        bit = "1" if counts[ts] >= 2 else "0"
        binary_stream += bit
    return binary_stream

def binary_to_ascii(binary_stream):
    chars = []
    for i in range(0, len(binary_stream), 8):
        byte = binary_stream[i:i+8]
        if len(byte) == 8:
            chars.append(chr(int(byte, 2)))
    return "".join(chars)

def log_burst():
    try:
        with open(ENTROPY_FILE, "r") as f:
            raw = f.read().strip()
        if raw:
            timestamps = [line.strip() for line in raw.splitlines()]
            binary = decode_burst(timestamps)
            ascii_string = binary_to_ascii(binary)
            symbol = symbol_map.get(ascii_string, "⍰")  # Unknown symbol fallback
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            with open(LOG_FILE, "a") as log:
                log.write(f"\n[{timestamp}] Burst Injected:\n")
                log.write(f"Raw Timestamps:\n{raw}\n")
                log.write(f"Binary Stream: {binary}\n")
                log.write(f"ASCII Decoded: {ascii_string}\n")
                log.write(f"Symbolic Meaning: {ascii_string} ≡ {symbol}\n")

            print(f"📝 Logged burst: {ascii_string} ≡ {symbol}")
    except Exception as e:
        print(f"⚠️ Logging error: {e}")

def clear_burst():
    try:
        open(ENTROPY_FILE, "w").close()
        print("🧹 Burst file cleared.\n")
    except Exception as e:
        print(f"⚠️ Clear error: {e}")

def run_listener():
    print("🔁 Change detected — activating passive listener...\n")
    subprocess.run(["python", LISTENER_SCRIPT])
    log_burst()
    clear_burst()

def watch_file():
    print(f"👁️ Watching {ENTROPY_FILE} for changes...\n")
    last_mtime = get_mtime(ENTROPY_FILE)

    while True:
        try:
            current_mtime = get_mtime(ENTROPY_FILE)
            if current_mtime != last_mtime:
                last_mtime = current_mtime
                run_listener()
            time.sleep(1)
        except KeyboardInterrupt:
            print("\n👋 Watcher stopped.")
            break
        except Exception as e:
            print(f"⚠️ Error: {e}")
            time.sleep(5)

if __name__ == "__main__":
    watch_file()
