using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

public class ValidatorTaskPanel : MonoBehaviour
{
    public GameObject taskPrefab;
    public Transform taskContainer;

    void Start()
    {
        List<string> tasks = new List<string>
        {
            "🧾 Stamp trace ID #A1B2",
            "🔍 Review registry entry for validator X",
            "📤 Export audit log for October",
            "🧠 Check hormonal phase for cycle sync"
        };

        foreach (string task in tasks)
        {
            GameObject taskItem = Instantiate(taskPrefab, taskContainer);
            taskItem.GetComponentInChildren<Text>().text = task;
        }
    }
}
