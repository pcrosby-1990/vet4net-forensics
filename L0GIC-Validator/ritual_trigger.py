def trigger_ritual(prev_index, current_index):
    if current_index > prev_index:
        return "invoke descent ritual: bind with salt and silence"
    elif current_index < prev_index:
        return "invoke ascent ritual: thread with light and breath"
    else:
        return "invoke stasis ritual: hold with stillness"
