import time

def timed_hash(path):
    start = time.perf_counter()
    with open(path, "rb") as f:
        data = f.read()
    hash_val = hashlib.sha512(data).hexdigest()
    end = time.perf_counter()
    delta = end - start
    return hash_val, delta

pnginfo.add_text("HashTimeDelta", f"{delta:.6f} seconds")

from collections import Counter
import math

def estimate_entropy(data):
    counter = Counter(data)
    total = len(data)
    entropy = -sum((count/total) * math.log2(count/total) for count in counter.values())
    return entropy

entropy = estimate_entropy(data)
pnginfo.add_text("InputEntropy", f"{entropy:.4f} bits/byte")