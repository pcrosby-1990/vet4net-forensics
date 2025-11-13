from datetime import datetime

def log_event(message, timestamp):
    print(f"[{timestamp}] {message}")
    
def load_entropy_series(filename):
    with open(filename, "r") as f:
        return [float(line.strip()) for line in f if line.strip()]

def detect_flip_echo(series, threshold=0.05):
    if len(series) < 10:
        return False
    drop = series[-10:-5]
    rise = series[-5:]
    drop_delta = drop[0] - drop[-1]
    rise_delta = rise[-1] - rise[0]
    
    if drop_delta > threshold and rise_delta > threshold:
        if abs(drop_delta - rise_delta) < 0.01:
            log_event("Flip Echo Detected", datetime.now())
            return True
    return False
