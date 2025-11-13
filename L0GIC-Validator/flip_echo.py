from datetime import datetime

def log_event(message, timestamp):
    with open("flip_echo_log.txt", "a") as f:
        f.write(f"{timestamp} - {message}\n")

def flip_echo_probe(series):
    for i in range(len(series) - 2):
        a, b, c = series[i], series[i + 1], series[i + 2]
        if (a > 0.6) != (b > 0.6) and (b > 0.6) != (c > 0.6) and (a > 0.6) == (c > 0.6):
            log_event("flip_echo detected", datetime.now())

# Example usage
if __name__ == "__main__":
    import random
    import time

    entropy_series = [0.6 + random.uniform(-0.02, 0.02) for _ in range(10)]

    start_time = time.time()
    duration = 300  # 5 minutes

    while time.time() - start_time < duration:
        entropy = 0.6 + random.uniform(-0.02, 0.02)
        entropy_series.append(entropy)
        entropy_series = entropy_series[-10:]

        flip_echo_probe(entropy_series)

        time.sleep(1)
