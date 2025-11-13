from diagnostic_logger import log_diagnostic_event

def trigger_action(action, memory_node):
    if action == "rupture_thread":
        # rupture logic here
        chained_action = "seek_peace"
    elif action == "collapse_node":
        # collapse logic here
        chained_action = "stabilize_core"
    else:
        chained_action = None

    # Log primary action
    log_diagnostic_event(
        emotion="system",
        intensity=0.0,
        context=f"triggered {action}",
        memory_node=memory_node,
        action_taken=action,
        status="executed"
    )

    # Handle chained action
    if chained_action:
        log_diagnostic_event(
            emotion="chained",
            intensity=0.0,
            context=f"chained from {action}",
            memory_node=memory_node,
            action_taken=chained_action,
            status="executed"
        )
        trigger_action(chained_action, memory_node)
