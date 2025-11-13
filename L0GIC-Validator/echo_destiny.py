from datetime import datetime

# Load Flip_cube timestamps
flipcube_times = []
with open("flipcube_trace.txt", "r") as file:
    for line in file:
        try:
            ts = datetime.strptime(line.split(" - ")[0].strip(), "%Y-%m-%d %H:%M:%S.%f")
            flipcube_times.append(ts)
        except Exception:
            continue

# Load flip_echo timestamps
echo_times = []
with open("echo_only.txt", "r") as file:
    for line in file:
        try:
            ts = datetime.strptime(line.split(" - ")[0].strip(), "%Y-%m-%d %H:%M:%S.%f")
            echo_times.append(ts)
        except Exception:
            continue

# Count echoes per Flip_cube interval
echo_counts = []
for i in range(len(flipcube_times) - 1):
    start = flipcube_times[i]
    end = flipcube_times[i + 1]
    count = sum(1 for t in echo_times if start <= t < end)
    echo_counts.append((start, count))

# Print high-density echo bursts
threshold = 5  # Adjust this value as needed
print(f"\nEcho Density Report (Threshold: {threshold} echoes/sec)\n")
for ts, count in echo_counts:
    if count >= threshold:
        print(f"High echo density at {ts}: {count} echoes")
