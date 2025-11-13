import os
print("Current working directory:", os.getcwd())

from datetime import datetime

def log_event(filename, action, user_id, hash_value):
    timestamp = datetime.utcnow().isoformat() + "Z"
    log_entry = f"[{timestamp}] {action} {filename} by {user_id} | hash={hash_value}\n"
    with open("forensic.log", "a+", encoding="utf-8") as f:
        f.write(log_entry)

log_event("normalize-catchall-routes.js", "MODIFY", "patrick", "b3:abc123...")
