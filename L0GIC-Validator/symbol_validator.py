import json
from collections import defaultdict, Counter

# === LOAD SYMBOL MAP ===
with open("symbol_map.json", "r", encoding="utf-8") as f:
    symbol_map = json.load(f)

# === INIT TRACKERS ===
uids = set()
uid_collisions = []
alias_index = defaultdict(list)
emoji_counter = Counter()
tag_counter = Counter()

# === VALIDATE SYMBOLS ===
for uid, symbol in symbol_map.items():
    # UID collision check
    if uid in uids:
        uid_collisions.append(uid)
    else:
        uids.add(uid)

    # Alias tracking
    for alias in symbol.get("aliases", []):
        alias_index[alias].append(uid)

    # Emoji usage
    emoji_counter[symbol.get("char", "")] += 1

    # Tag density
    for tag in symbol.get("tags", []):
        tag_counter[tag] += 1

# === REPORT ===
print("\n=== SYMBOL VALIDATION REPORT ===")
print(f"Total symbols: {len(symbol_map)}")
print(f"Unique UIDs: {len(uids)}")
print(f"UID collisions: {len(uid_collisions)}")
print(f"Unique aliases: {len(alias_index)}")
print(f"Emoji types used: {len(emoji_counter)}")
print(f"Unique tags: {len(tag_counter)}")

# === DUPLICATE ALIASES ===
print("\n--- Duplicate Aliases ---")
for alias, uids in alias_index.items():
    if len(uids) > 1:
        print(f"{alias}: {len(uids)} symbols")

# === TOP EMOJIS ===
print("\n--- Top Emojis ---")
for emoji, count in emoji_counter.most_common(10):
    print(f"{emoji}: {count} times")

# === TOP TAGS ===
print("\n--- Top Tags ---")
for tag, count in tag_counter.most_common(10):
    print(f"{tag}: {count} times")
