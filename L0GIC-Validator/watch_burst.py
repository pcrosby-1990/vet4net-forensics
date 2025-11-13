import time
import os
from datetime import datetime
from echo_occurance import decode_burst

WATCH_FILE = "burst_timestamps.txt"
LOG_FILE = "decoded_log.txt"
KNOWN_PHRASES = {"HI", "NO THIS IS PATRICK"}

def get_mtime(path):
    try:
        return os.path.getmtime(path)
    except FileNotFoundError:
        return 0

def log_message(message):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(f"[{timestamp}] {message}\n")

def main():
    print(f"👁️ Watching {WATCH_FILE} for changes...\n")
    last_mtime = get_mtime(WATCH_FILE)

    while True:
        time.sleep(2)
        current_mtime = get_mtime(WATCH_FILE)

        if current_mtime != last_mtime:
            print(f"\n📡 Detected update at {time.ctime(current_mtime)}")
            decoded = decode_burst(WATCH_FILE)
            if decoded:
                print(f"🧠 Decoded Message: {decoded}")
                log_message(decoded)
                if decoded not in KNOWN_PHRASES:
                    print("⚠️ Unknown message detected — possible anomaly.")
            else:
                print("⚠️ Could not decode burst.")
            last_mtime = current_mtime

if __name__ == "__main__":
    main()
