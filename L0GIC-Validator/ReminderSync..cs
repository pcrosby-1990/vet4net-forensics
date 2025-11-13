using UnityEngine;
using System.IO;
using Newtonsoft.Json;
using System.Collections.Generic;

public class ReminderSync : MonoBehaviour
{
    public string jsonPath = "reminders.json";

    [System.Serializable]
    public class Reminder
    {
        public string date;
        public string title;
        public string description;
    }

    public List<Reminder> LoadReminders()
    {
        string fullPath = Path.Combine(Application.streamingAssetsPath, jsonPath);
        string json = File.ReadAllText(fullPath);
        return JsonConvert.DeserializeObject<List<Reminder>>(json);
    }
}
