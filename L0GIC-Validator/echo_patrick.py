from collections import Counter
from datetime import datetime, timedelta

# Binary for "NO THIS IS PATRICK"
binary = (
    "01001110"  # N
    "01001111"  # O
    "00100000"  # space
    "01010100"  # T
    "01001000"  # H
    "01001001"  # I
    "01010011"  # S
    "00100000"  # space
    "01001001"  # I
    "01010011"  # S
    "00100000"  # space
    "01010000"  # P
    "01000001"  # A
    "01010100"  # T
    "01010010"  # R
    "01001001"  # I
    "01000011"  # C
    "01001011"  # K
)

# Step 1: Create timestamps spaced 1 second apart
base_time = datetime(2025, 10, 30, 8, 0, 0)
timestamps = []

# Step 2: Simulate echoes based on binary
for i, bit in enumerate(binary):
    ts = base_time + timedelta(seconds=i)
    if bit == "1":
        timestamps.extend([ts, ts])  # 2 echoes = bit 1
    else:
        timestamps.append(ts)        # 1 echo = bit 0

# Step 3: Count echoes per timestamp
counts = Counter(timestamps)

# Step 4: Build binary stream
binary_stream = ""
print("Echo Occurrence Map:\n")
for ts, count in sorted(counts.items()):
    bit = "1" if count >= 2 else "0"
    binary_stream += bit
    print(f"{ts.time()} → {count} echoes → bit: {bit}")

# Step 5: Show raw binary stream
print(f"\nRaw Binary Stream:\n{binary_stream}")

# Step 6: Chunk binary into 8-bit segments
chunks = [binary_stream[i:i+8] for i in range(0, len(binary_stream), 8)]

# Step 7: Display binary chunks
print("\nBinary Chunks:")
for chunk in chunks:
    print(chunk)

# Step 8: Decode binary chunks to ASCII
print("\nDecoded ASCII:")
for chunk in chunks:
    if len(chunk) == 8:
        try:
            char = chr(int(chunk, 2))
            print(f"{chunk} → {char}")
        except ValueError:
            print(f"{chunk} → [invalid]")
