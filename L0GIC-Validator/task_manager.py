import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "..", "Data")
TASKS_PATH = os.path.join(DATA_DIR, "tasks.json")

def load_tasks():
    with open(TASKS_PATH, "r") as f:
        return json.load(f)

def save_tasks(tasks):
    with open(TASKS_PATH, "w") as f:
        json.dump(tasks, f, indent=2)

def filter_tasks(priority=None, is_complete=None):
    tasks = load_tasks()
    filtered = []
    for task in tasks:
        if priority and task["priority"] != priority:
            continue
        if is_complete is not None and task["isComplete"] != is_complete:
            continue
        filtered.append(task)
    return filtered
