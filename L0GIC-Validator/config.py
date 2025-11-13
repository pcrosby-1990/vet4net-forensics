import os
from config import REMINDERS_JSON

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_DIR = os.path.join(BASE_DIR, "Data")

REMINDERS_JSON = os.path.join(DATA_DIR, "reminders.json")
TASKS_JSON = os.path.join(DATA_DIR, "tasks.json")
