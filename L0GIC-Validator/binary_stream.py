# Count echoes per timestamp
counts = Counter(timestamps)

# Build binary stream
binary_stream = ""
print("Echo Occurrence Map:\n")
for ts, count in sorted(counts.items()):
    bit = "1" if count >= 2 else "0"
    binary_stream += bit
    print(f"{ts.time()} → {count} echoes → bit: {bit}")

# Debug: show raw binary stream
print(f"\nRaw Binary Stream:\n{binary_stream}")
