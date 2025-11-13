from datetime import datetime

def log_event(message, timestamp):
    with open("phase_null_log.txt", "a") as f:
        f.write(f"{timestamp} - {message}\n")

def suppression_detector(series):
    decay = [series[i] - series[i+1] for i in range(len(series)-1)]
    avg = sum(decay) / len(decay)
    return avg < 0.01

def tone_delay_detector(current_time, last_entropy_time, suppression_active):
    delta = (current_time - last_entropy_time).total_seconds()
    if delta > 2:
        log_event("Tone delay detected", current_time)
        if not suppression_active:
            log_event("phase_null anomaly", current_time)

# Example usage
if __name__ == "__main__":
    import random
    import time

    entropy_series = [0.6 + random.uniform(-0.02, 0.02) for _ in range(10)]
    last_entropy_timestamp = datetime.now()

    start_time = time.time()
    duration = 300  # 5 minutes

    while time.time() - start_time < duration:
        entropy = 0.6 + random.uniform(-0.02, 0.02)
        entropy_series.append(entropy)
        entropy_series = entropy_series[-10:]

        current_time = datetime.now()
        suppression_active = suppression_detector(entropy_series)

        tone_delay_detector(current_time, last_entropy_timestamp, suppression_active)
        last_entropy_timestamp = current_time

        time.sleep(1)
