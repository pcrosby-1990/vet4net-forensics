import os
import csv
import json

INPUT_FOLDER = "assets/to_stamp/input"
CSV_OUTPUT = "badge_levels.csv"
JSON_OUTPUT = "badge_levels.json"
VALID_BADGES = ["diamond", "emerald", "gold", "silver", "iron"]

def infer_badge_level(filename):
    name = filename.lower()
    for level in VALID_BADGES:
        if level in name:
            return level
    return "iron"

def generate_badge_metadata():
    badge_dict = {}
    for filename in os.listdir(INPUT_FOLDER):
        if filename.lower().endswith((".png", ".jpg", ".jpeg")):
            badge_level = infer_badge_level(filename)
            badge_dict[filename] = badge_level
            print(f"🛡️ {filename} → {badge_level}")

    # Write CSV
    with open(CSV_OUTPUT, "w", newline="") as csvfile:
        writer = csv.writer(csvfile)
        for fname, level in badge_dict.items():
            writer.writerow([fname, level])
    print(f"✅ CSV saved to {CSV_OUTPUT}")

    # Write JSON
    with open(JSON_OUTPUT, "w") as jsonfile:
        json.dump(badge_dict, jsonfile, indent=2)
    print(f"✅ JSON saved to {JSON_OUTPUT}")

if __name__ == "__main__":
    generate_badge_metadata()
