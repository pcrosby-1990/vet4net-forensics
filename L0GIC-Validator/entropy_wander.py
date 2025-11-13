from datetime import datetime

def log_event(message, timestamp):
    with open("entropy_wander_log.txt", "a") as f:
        f.write(f"{timestamp} - {message}\n")

def entropy_wander_probe(series, window=100, low=0.59, high=0.61):
    if len(series) >= window and all(low <= e <= high for e in series[-window:]):
        log_event("entropy_wander detected", datetime.now())

# Example usage
if __name__ == "__main__":
    import random
    import time

    entropy_series = [0.6 + random.uniform(-0.005, 0.005) for _ in range(100)]

    start_time = time.time()
    duration = 300  # 5 minutes

    while time.time() - start_time < duration:
        entropy = 0.6 + random.uniform(-0.005, 0.005)
        entropy_series.append(entropy)
        entropy_series = entropy_series[-100:]

        entropy_wander_probe(entropy_series)

        time.sleep(1)
