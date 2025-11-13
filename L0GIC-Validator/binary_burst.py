import subprocess
import sys

def send_binary_burst(binary_string):
    print(f"Transmitting binary burst: {binary_string}")
    subprocess.run([
        sys.executable,
        "passive_listener.py",
        "--burst",
        binary_string
    ])

# Example: Pleasure in binary
burst = "01010000 01101100 01100101 01100001 01110011 01110101 01110010 01100101"
send_binary_burst(burst)
