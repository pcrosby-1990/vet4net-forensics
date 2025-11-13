# burst_utils.py

from typing import List
from collections import Counter

def binary_to_hex(binary_stream: str) -> str:
    pad_len = (-len(binary_stream)) % 8
    padded = binary_stream + ("0" * pad_len)
    hex_string = ""
    for i in range(0, len(padded), 8):
        byte = padded[i:i + 8]
        hex_string += f"{int(byte, 2):02x}"
    return hex_string

def binary_to_ascii(binary_stream: str) -> str:
    chars: List[str] = []
    for i in range(0, len(binary_stream), 8):
        byte = binary_stream[i:i + 8]
        if len(byte) < 8:
            break
        chars.append(chr(int(byte, 2)))
    return "".join(chars)

def decode_burst(timestamps: List[float], repeats_threshold: int = 2) -> str:
    quantized = [round(ts, 6) for ts in timestamps]
    counts = Counter(quantized)
    return "".join("1" if counts[k] >= repeats_threshold else "0" for k in sorted(counts))
