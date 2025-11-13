MAX_ENTRIES = 13337  # Change this to whatever chaos level you want
import json
import random
import uuid
import argparse

# === CONFIG ===
REALMS = {
    "SOCIAL": ["wave", "smile", "hug", "nod", "greet", "farewell"],
    "META": ["think", "reflect", "aware", "observe", "contemplate"],
    "ACTION": ["move", "act", "transform", "create", "destroy"],
    "SENSE": ["see", "hear", "touch", "taste", "feel"],
    "TIME": ["past", "present", "future", "cycle", "moment"],
    "EXTRA": ["wildcard", "glitch", "undefined", "chaos", "echo"]
}

EMOJI_POOL = ["👋", "🧠", "⚡", "👁️", "⏳", "🌀", "🌟", "💬", "🔮", "🎭", "🧩", "📡", "🫂", "🫧", "🫀", "🫴"]

# === ARGUMENT PARSING ===
parser = argparse.ArgumentParser()
parser.add_argument("--max", type=int, default=50, help="Max total symbols to inject")
args = parser.parse_args()
MAX_ENTRIES = args.max

# === LOAD EXISTING MAP ===
with open("symbol_map.json", "r", encoding="utf-8") as f:
    symbol_map = json.load(f)

# === INJECT SYMBOLS ===
def inject_symbols(symbol_map, max_total):
    injected = 0
    realm_keys = list(REALMS.keys())

    while injected < max_total:
        realm = random.choice(realm_keys)
        alias_pool = REALMS[realm]

        uid = f"sym_{realm}{str(uuid.uuid4())[:8]}"
        char = random.choice(EMOJI_POOL)
        ascii_fallback = f"[{random.choice(alias_pool)}]"
        aliases = random.sample(alias_pool, min(3, len(alias_pool)))
        description = f"{aliases[0].capitalize()} — symbolic representation of {realm.lower()} domain."
        tags = [realm.lower()] + aliases

        symbol_map[uid] = {
            "uid": uid,
            "char": char,
            "ascii_fallback": ascii_fallback,
            "role": realm.lower(),
            "aliases": aliases,
            "description": description,
            "tags": tags
        }

        injected += 1

    return symbol_map

# === RUN INJECTION ===
updated_map = inject_symbols(symbol_map, MAX_ENTRIES)

# === SAVE UPDATED MAP ===
with open("symbol_map.json", "w", encoding="utf-8") as f:
    json.dump(updated_map, f, indent=2, ensure_ascii=False)

print(f"[OK] Injected {MAX_ENTRIES} new symbols into symbol_map.json")
