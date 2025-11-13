import json

with open("ValidatorTask.txt", "r") as f:
    tasks = json.load(f)

for task in tasks:
    assert isinstance(task["title"], str)
    assert isinstance(task["dueDate"], str)
    assert task["priority"] in ["High", "Medium", "Low"]
    assert isinstance(task["isComplete"], bool)
