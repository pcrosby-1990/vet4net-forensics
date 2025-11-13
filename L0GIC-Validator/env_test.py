import os
from dotenv import load_dotenv

# Load the .env file
load_dotenv(dotenv_path="D:/Forensics-l0gic-validation/L0GIC-Validator/.env")

# Get the private key from the environment
private_key = os.getenv("PRIVATE_KEY")

# Print the result
print("🔍 PRIVATE_KEY =", private_key)
