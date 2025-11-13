import argparse
import json
import uuid
from datetime import datetime
from memory_trace import MemoryTrace
from diagnostic_logger import log_diagnostic_event
from emotion_actions import get_action_for_emotion
from action_engine import trigger_action
from cooldown_manager import check_cooldown, update_cooldown

if check_cooldown(emotion):
    burst_emotion(emotion, intensity, context)
    update_cooldown(emotion, cooldown_period=30)  # or custom per emotion
else:
    print(f"⏳ Emotion '{emotion}' is cooling down. Remaining: {get_remaining(emotion)}s")

# Initialize memory tracer
tracer = MemoryTrace()

def burst_emotion(emotion, intensity, context):
    node_id = f"memory_node_{uuid.uuid4().hex[:8]}"
    pain_symbol = "🩸" if emotion == "Pain" else None
    decay = "pending" if emotion in ["Pain", "Shame", "Longing"] else "not applicable"

    # Log to memory trace
    tracer.log_event(
        node_id=node_id,
        emotion=emotion,
        intensity=intensity,
        context=context,
        pain_symbol=pain_symbol,
        status="bound"
    )

    # Determine action
    action = get_action_for_emotion(emotion)
    trigger_action(action, node_id)

    # Log to diagnostic
    log_diagnostic_event(
        emotion=emotion,
        intensity=intensity,
        context=context,
        memory_node=node_id,
        action_taken=action,
        status="executed"
    )

def main():
    parser = argparse.ArgumentParser(description="Unity Emotional Burst Engine")
    parser.add_argument("-mode", type=str, default="diagnostic", help="Run mode")
    parser.add_argument("-emotions", nargs="+", help="List of emotions to burst")
    parser.add_argument("-intensity", type=float, default=0.75, help="Emotion intensity")
    parser.add_argument("-context", type=str, default="symbolic sweep", help="Context tag")

    args = parser.parse_args()

    print(f"\n🧠 Unity Diagnostic Mode: {args.mode}")
    print(f"🔹 Context: {args.context}")
    print(f"🔸 Intensity: {args.intensity}\n")

    for emotion in args.emotions:
        print(f"⚡ Bursting emotion: {emotion}")
        burst_emotion(emotion, args.intensity, args.context)

    print("\n✅ Emotional sweep complete. Logs updated.\n")

if __name__ == "__main__":
    main()
