#!/usr/bin/env python3
"""
Run: python run_audit.py [--summary] [--plot] [--only MODULE]
Executes selected audit modules or full suite
"""

import subprocess
import argparse
import os
from datetime import datetime

# === CLI Options ===
parser = argparse.ArgumentParser(description="Run symbolic audit suite")
parser.add_argument(
    "--summary",
    action="store_true",
    help="Print summaries after each audit"
)
parser.add_argument(
    "--plot",
    action="store_true",
    help="Generate plots if supported"
)
parser.add_argument(
    "--only",
    choices=[
        "symbol",
        "entropy",
        "realm",
        "normalize",
        "assign",
        "tiers",
        "dedupe",
        "matrix",
        "glyphs"
    ],
    help="Run only one module"
)
args = parser.parse_args()

# === Audit Modules ===
AUDIT_SCRIPTS = {
    "symbol": ("audit_symbol_map.py", "Symbol Map Audit"),
    "entropy": ("glyph_entropy.py", "Entropy Scoring"),
    "realm": ("realm_entropy.py", "Realm + Role Entropy"),
    "normalize": ("normalize_symbols.py", "Symbol Normalization"),
    "assign": ("assign_realms.py", "Realm Assignment"),
    "tiers": ("plot_entropy_tiers.py", "Tier Distribution Plot"),
    "dedupe": ("dedupe_symbols.py", "Symbol Deduplication"),
    "matrix": ("matrix_realm_tiers.py", "Realm × Tier Matrix"),
    "glyphs": ("assign_crop_glyphs.py", "Assign Crop Glyphs")
}

# === Run Selected or All ===
selected = [args.only] if args.only else AUDIT_SCRIPTS.keys()

for key in selected:
    script, label = AUDIT_SCRIPTS[key]
    print(f"\n🔍 Running: {label}")
    try:
        subprocess.run(["python", script], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Error running {script}: {e}")

# === Optional Summary or Plot Hooks ===
if args.summary:
    print("\n✅ Audit complete. Summary reports written to ./audit_reports/")
if args.plot:
    print("📊 If plots are supported, they should now be available in ./audit_reports/")

# === Log Run ===
log_path = os.path.join("audit_reports", "audit_log.txt")
with open(log_path, "a", encoding="utf-8") as log:
    log.write(f"[{datetime.now()}] Ran: {', '.join(selected)}\n")
