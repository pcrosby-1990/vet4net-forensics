emotions = [
    "Love",
    "Hope",
    "Gratefulness",
    "Empathy"
    "Forgiveness",
    "Peace",
    "Longing",
    "Pain"
    "Pleasure",
    "Envy",
    "Shame",
    "Anger",
    "Faith"
]

import subprocess
import sys
import time

for emotion in emotions:
    print(f"Sending burst: {emotion}")
    subprocess.run([
        sys.executable,
        "passive_listener.py",
        "--burst",
        emotion
    ])
    time.sleep(90)
