import os

MEMORY_FILE = "symbol_map.txt"

def load_symbol_map() -> dict:
    """Load symbolic equivalences from persistent memory."""
    symbol_map = {}
    if os.path.exists(MEMORY_FILE):
        with open(MEMORY_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if "≡" in line:
                    parts = line.split("≡")
                    if len(parts) == 2:
                        symbol, meaning = parts[0].strip(), parts[1].strip()
                        symbol_map[symbol] = meaning
    return symbol_map

def save_symbol_mapping(symbol: str, meaning: str):
    """Append a new symbolic equivalence to memory."""
    with open(MEMORY_FILE, "a", encoding="utf-8") as f:
        f.write(f"{symbol} ≡ {meaning}\n")
