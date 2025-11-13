import time
import random
from datetime import datetime, timedelta

# Core detectors
def entropy_probe(value, threshold=0.72):
    return value >= threshold

def suppression_detector(series):
    decay = [series[i] - series[i+1] for i in range(len(series)-1)]
    avg = sum(decay) / len(decay)
    return avg < 0.01

def cascade_tracker(series):
    for i in range(len(series)-1):
        if abs(series[i] - series[i+1]) > 0.5:
            return True
    return False

def entropy_decay_sim(series):
    return sum(series[-5:]) / 5 < 0.5

def dark_phase_generator(series):
    return round(sum(series[-5:]) * 0.42, 3)

# Subparticle probes
def tau_ghost_probe(series, threshold_low=0.45, threshold_high=0.5):
    for i in range(len(series) - 1):
        delta = abs(series[i] - series[i + 1])
        if threshold_low < delta < threshold_high:
            log_event("tau_ghost detected", datetime.now())

def tone_delay_detector(current_time, last_entropy_time, suppression_active):
    delta = (current_time - last_entropy_time).total_seconds()
    if delta > 2:
        log_event("Tone delay detected", current_time)
        if not suppression_active:
            log_event("phase_null anomaly", current_time)

def flip_echo_probe(series):
    for i in range(len(series) - 2):
        a, b, c = series[i], series[i + 1], series[i + 2]
        if (a > 0.6) != (b > 0.6) and (b > 0.6) != (c > 0.6) and (a > 0.6) == (c > 0.6):
            log_event("flip_echo detected", datetime.now())

def entropy_wander_probe(series, window=100, low=0.59, high=0.61):
    if len(series) >= window and all(low <= e <= high for e in series[-window:]):
        log_event("entropy_wander detected", datetime.now())

def parity_flip_sim(series):
    flips = sum(1 for i in range(1, len(series)) if (series[i] > 0.6) != (series[i-1] > 0.6))
    if flips > len(series) * 0.7:
        log_event("Parity flip anomaly", datetime.now())

# Logging
def log_event(message, timestamp):
    with open("collapse_log.txt", "a") as f:
        f.write(f"{timestamp} - {message}\n")

# Initialization
entropy_series = [0.6] * 10
last_entropy_timestamp = datetime.now()
start_time = time.time()
duration = 21600  # 6 hours

# Main loop
while time.time() - start_time < duration:
    # Inject entropy noise
    entropy = 0.6 + random.uniform(-0.015, 0.015)
    timestamp = datetime.now()
    entropy_series.append(entropy)
    entropy_series = entropy_series[-100:]  # Keep last 100 samples

    # Core detections
    if entropy_probe(entropy):
        log_event("Entropy spike", timestamp)

    suppression_active = suppression_detector(entropy_series[-10:])
    if suppression_active:
        log_event("Suppression zone", timestamp)

    if cascade_tracker(entropy_series[-10:]):
        log_event("Tau decay candidate", timestamp)

    if entropy_decay_sim(entropy_series[-10:]):
        dark_phase = dark_phase_generator(entropy_series[-10:])
        log_event(f"Dark phase density: {dark_phase}", timestamp)

    # Advanced detections
    tone_delay_detector(timestamp, last_entropy_timestamp, suppression_active)
    parity_flip_sim(entropy_series[-60:])

    # Subparticle probes
    tau_ghost_probe(entropy_series[-10:])
    flip_echo_probe(entropy_series[-10:])
    entropy_wander_probe(entropy_series)

    # Checkpoint every 30 minutes
    if timestamp.minute % 30 == 0 and timestamp.second == 0:
        log_event("Validator checkpoint: system stable", timestamp)

    last_entropy_timestamp = timestamp

    # ─────────────────────────────────────────────
    # 🧠 CollapseNet Timing: 1.337ms Interval
    # ─────────────────────────────────────────────
    next_tick = datetime.now() + timedelta(seconds=0.001337)
    while datetime.now() < next_tick:
        time.sleep(0.0005)
