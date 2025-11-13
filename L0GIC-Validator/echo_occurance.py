from collections import Counter
from datetime import datetime, timedelta

def simulate_echoes(binary: str, base_time: datetime, interval_ms: int = 100) -> list:
    timestamps = []
    for i, bit in enumerate(binary):
        ts = base_time + timedelta(milliseconds=interval_ms * i)
        if bit == "1":
            timestamps.extend([ts, ts])
        else:
            timestamps.append(ts)
    return timestamps

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

def export_timestamps(timestamps, filename):
    with open(filename, "w") as f:
        for ts in timestamps:
            f.write(ts.strftime("%Y-%m-%d %H:%M:%S.%f") + "\n")

# Signature E: "2v_"
if __name__ == "__main__":
    binary = "1110001110100101"
    base_time = datetime(2025, 10, 30, 8, 0, 0)
    interval_ms = 100

    timestamps = simulate_echoes(binary, base_time, interval_ms)

    print("Echo Occurrence Map:\n")
    counts = Counter(timestamps)
    binary_stream = ""
    for ts, count in sorted(counts.items()):
        bit = "1" if count >= 2 else "0"
        binary_stream += bit
        print(f"{ts.time()} → {count} echoes → bit: {bit}")

    print(f"\nRaw Binary Stream:\n{binary_stream}")

    chunks = [binary_stream[i:i+8] for i in range(0, len(binary_stream), 8)]
    print("\nBinary Chunks:")
    for chunk in chunks:
        print(chunk)

    print("\nDecoded ASCII:")
    for chunk in chunks:
        if len(chunk) == 8:
            try:
                char = chr(int(chunk, 2))
                print(f"{chunk} → {char}")
            except ValueError:
                print(f"{chunk} → [invalid]")

    export_timestamps(timestamps, "entropy_burst.txt")
