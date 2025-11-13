import pandas as pd
import numpy as np

start = pd.Timestamp("2025-10-30T00:00:00Z")
end = pd.Timestamp("2025-10-30T00:03:00Z")
timestamps = pd.date_range(start, end, freq="100ms")

# Simulate a base signal with noise
np.random.seed(42)
base_signal = np.random.normal(loc=0.2, scale=0.05, size=len(timestamps))

# Add spikes at key moments
def add_spike(signal, center_idx, width, height):
    for i in range(-width, width + 1):
        idx = center_idx + i
        if 0 <= idx < len(signal):
            signal[idx] += height * np.exp(-0.5 * (i / width)**2)

# Define spikes
event_times = {
    "Quark detected": "2025-10-30T00:00:30Z",
    "Tau override": "2025-10-30T00:02:00Z"
}
for label, t in event_times.items():
    idx = timestamps.get_loc(pd.Timestamp(t))
    add_spike(base_signal, idx, width=10, height=0.7)

df = pd.DataFrame({
    "timestamp": timestamps,
    "value": np.clip(base_signal, 0, 1)
})
df.to_csv("detector_stream.csv", index=False)
