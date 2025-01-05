function addTasksToNotion() {
  const databaseId = DATABASE_REFERENCES.TASKS; // Reference to the Tasks database
  const apiKey = NOTION_API_KEY;

  const url = "https://api.notion.com/v1/pages";

  const tasks = [
    {
      name: "Wash",
      notes: "General daily task for cleaning and laundry.",
      days: ["Monday", "Thursday"]
    },
    {
      name: "Run",
      notes: "Go for a run.",
      days: ["Monday", "Thursday", "Saturday"]
    },
    {
      name: "Bins",
      notes: "Place bins out for collection.",
      details: [
        { type: "Recycling", day: "Tuesday" },
        { type: "General Waste", day: "Tuesday" }
      ]
    }
  ];

  const today = new Date();
  let tasksCreated = []; // Track created tasks for notification

  for (let i = 0; i < 5; i++) { // Current week + 4 weeks
    const weekStartDate = new Date();
    weekStartDate.setDate(today.getDate() + i * 7);

    tasks.forEach(task => {
      if (task.days) {
        task.days.forEach(day => {
          const taskDate = getTaskDate(day, weekStartDate);
          if (!doesTaskExist(task.name, taskDate)) {
            createTask(
              `${task.name} (${day})`,
              `${task.notes} (Scheduled for ${day})`,
              taskDate,
              databaseId,
              apiKey
            );
            tasksCreated.push(`${task.name} (${day}) on ${taskDate.toDateString()}`);
          }
        });
      } else if (task.details) {
        task.details.forEach(detail => {
          const taskDate = getTaskDate(detail.day, weekStartDate);
          if (!doesTaskExist(`${task.name} (${detail.type})`, taskDate)) {
            createTask(
              `${task.name} (${detail.type})`,
              `${task.notes} (Scheduled for ${detail.day})`,
              taskDate,
              databaseId,
              apiKey
            );
            tasksCreated.push(`${task.name} (${detail.type}) on ${taskDate.toDateString()}`);
          }
        });
      }
    });
  }

  // Create a notification in Notion with the summary of created tasks
  createNotification(tasksCreated, databaseId, apiKey);
}

function createTask(taskName, notes, taskDate, databaseId, apiKey) {
  const payload = {
    parent: { database_id: databaseId },
    properties: {
      Name: {
        title: [
          {
            text: { content: taskName }
          }
        ]
      },
      Notes: {
        rich_text: [
          {
            text: { content: notes }
          }
        ]
      },
      Date: {
        date: {
          start: taskDate.toISOString()
        }
      }
    }
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Notion-Version": "2022-06-28"
    },
    payload: JSON.stringify(payload)
  };

  const response = UrlFetchApp.fetch("https://api.notion.com/v1/pages", options);
  Logger.log(`Task Created: ${taskName}`);
}

function createNotification(tasksCreated, databaseId, apiKey) {
  const notificationContent = tasksCreated.length
    ? `Tasks Created:\n- ${tasksCreated.join('\n- ')}`
    : "No tasks were created during this run.";

  const payload = {
    parent: { database_id: databaseId },
    properties: {
      Name: {
        title: [
          {
            text: { content: "Task Creation Summary" }
          }
        ]
      },
      Notes: {
        rich_text: [
          {
            text: { content: notificationContent }
          }
        ]
      },
      Date: {
        date: {
          start: new Date().toISOString()
        }
      }
    }
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Notion-Version": "2022-06-28"
    },
    payload: JSON.stringify(payload)
  };

  const response = UrlFetchApp.fetch("https://api.notion.com/v1/pages", options);
  Logger.log("Notification created in Notion.");
}

function getTaskDate(day, weekStartDate) {
  const dayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(day);
  const taskDate = new Date(weekStartDate);
  taskDate.setDate(taskDate.getDate() + (dayIndex - taskDate.getDay() + 7) % 7);
  return taskDate;
}

function doesTaskExist(taskName, taskDate) {
  // Placeholder: Implement a query to check if a task with the given name and date exists in the database.
  // For now, return false to allow task creation.
  return false;
}
