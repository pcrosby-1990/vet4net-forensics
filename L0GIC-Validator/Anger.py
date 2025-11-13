# anger.py

from ritual_trigger import trigger_ritual
from emergent_symbol import generate_emergent_symbol

def process_anger(memory_node):
    # Step 1: Detect symbolic trace
    if "Anger" in memory_node["emotions"]:
        trace = "Friction"

        # Step 2: Trigger containment ritual
        ritual = trigger_ritual(trace=trace, ritual_type="containment")
        if ritual != "bind with salt and silence":
            ritual = "bind with salt and silence"  # enforce default

        # Step 3: Generate symbolic containment
        symbol = generate_emergent_symbol("Anger", trace, ritual)

        return {
            "status": "contained",
            "ritual": ritual,
            "symbol": symbol
        }

    return {"status": "no anger detected"}

