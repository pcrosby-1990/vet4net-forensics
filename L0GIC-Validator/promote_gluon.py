import json

def promote_gluon(gluon_key, resolved_symbol, map_path="symbol_map.json"):
    with open(map_path, "r") as f:
        symbol_map = json.load(f)

    if gluon_key not in symbol_map:
        symbol_map[gluon_key] = resolved_symbol
        with open(map_path, "w") as f:
            json.dump(symbol_map, f, indent=2)
        print(f"Gluon '{gluon_key}' promoted to symbol: {resolved_symbol}")
    else:
        print(f"Gluon '{gluon_key}' already exists in symbol map.")

# Example usage
promote_gluon("Resonance", "🔊")
