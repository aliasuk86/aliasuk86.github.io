/**
 * In another file, you have:
 *
 * // API Key for Notion
 * const NOTION_API_KEY = "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";
 *
 * // Database references
 * const DATABASE_REFERENCES = {
 *   TASKS: "151cbfa0aae680d09bf2ceeee39959b1", // Tasks database ID
 *   WOW: "14fcbfa0aae680b3b32bf7fc0347da42"   // WoW database ID
 * };
 *
 * Ensure those variables are globally accessible before running this script.
 */

/***********************************************
 *             MAIN FUNCTION
 ***********************************************/

/**
 * Main entry point function to add tasks to Notion.
 * Assumes that NOTION_API_KEY and DATABASE_REFERENCES
 * are defined in another file or globally.
 */
function addTasksToNotion() {
  // We retrieve our database IDs and API key from global variables
  const databaseId = DATABASE_REFERENCES.TASKS;
  const apiKey = NOTION_API_KEY;

  // -----------------------------------------------
  // 1) DEFINE YOUR TASKS
  // -----------------------------------------------
  const tasks = [
    {
      name: "Laundry", // Renamed from "Wash"
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

  // The next bin event on Tuesday is "Recycling".
  let nextBinType = "Recycling";

  // We'll keep track of tasks created, to summarize at the end.
  let tasksCreated = [];

  // -----------------------------------------------
  // 2) LOOP OVER THE NEXT 5 WEEKS
  // -----------------------------------------------
  const today = new Date();
  for (let i = 0; i < 5; i++) {
    const weekStartDate = new Date();
    weekStartDate.setDate(today.getDate() + i * 7);

    // -----------------------------------------------
    // 3) ITERATE OVER TASKS
    // -----------------------------------------------
    tasks.forEach((task) => {
      if (task.days) {
        // For tasks with an array of days
        task.days.forEach((day) => {
          const taskDate = getTaskDate(day, weekStartDate);

          // Decide on the final task name (remove day in parentheses for Laundry/Run)
          let finalTaskName;
          if (task.name === "Laundry" || task.name === "Run") {
            finalTaskName = task.name;
          } else {
            finalTaskName = `${task.name} (${day})`;
          }

          // 3a) Check if the task already exists:
          const exists = doesTaskExist(
            finalTaskName,
            taskDate,
            databaseId,
            apiKey
          );

          if (!exists) {
            // 3b) Create new task
            createTask(
              finalTaskName,
              `${task.notes} (Scheduled for ${day})`,
              taskDate,
              databaseId,
              apiKey
            );
            tasksCreated.push(`${finalTaskName} on ${taskDate.toDateString()}`);
          }
        });
      } else if (task.details) {
        // Bins: Only create one event per week, alternating types
        const detailForNextBin = task.details.find(
          (d) => d.type === nextBinType
        );

        if (detailForNextBin) {
          const binDate = getTaskDate(detailForNextBin.day, weekStartDate);
          const binTaskName = `${task.name} (${nextBinType})`;

          // Check if bin task exists already
          const exists = doesTaskExist(binTaskName, binDate, databaseId, apiKey);

          if (!exists) {
            createTask(
              binTaskName,
              `${task.notes} (Scheduled for ${detailForNextBin.day})`,
              binDate,
              databaseId,
              apiKey
            );
            tasksCreated.push(`${binTaskName} on ${binDate.toDateString()}`);
          }

          // Flip bin type for next cycle
          nextBinType =
            nextBinType === "Recycling" ? "General Waste" : "Recycling";
        }
      }
    });
  }

  // -----------------------------------------------
  // 4) CREATE A NOTIFICATION WITH SUMMARY
  // -----------------------------------------------
  createNotification(tasksCreated, databaseId, apiKey);
}

/***********************************************
 *             HELPER FUNCTIONS
 ***********************************************/

/**
 * createTask:
 * Creates a new page in the Tasks database with the given name, notes, and date,
 * and sets the "Tag" property to "Maintenance".
 *
 * @param {string} taskName - The title of the task.
 * @param {string} notes - The notes content.
 * @param {Date} taskDate - The date of the task.
 * @param {string} databaseId - Notion DB ID.
 * @param {string} apiKey - Notion API key.
 */
function createTask(taskName, notes, taskDate, databaseId, apiKey) {
  const dateStr = taskDate.toISOString().split("T")[0]; // YYYY-MM-DD only

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
          start: dateStr
        }
      },
      Tag: {
        multi_select: [
          {
            name: "Maintenance"
          }
        ]
      }
    }
  };

  const options = {
    method: "POST",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Notion-Version": "2022-06-28"
    },
    payload: JSON.stringify(payload)
  };

  UrlFetchApp.fetch("https://api.notion.com/v1/pages", options);
  Logger.log(`Task Created: ${taskName}`);
}

/**
 * createNotification:
 * Creates a summary page in your Tasks database.
 *
 * @param {string[]} tasksCreated - Array of created task descriptions.
 * @param {string} databaseId - Notion DB ID.
 * @param {string} apiKey - Notion API key.
 */
function createNotification(tasksCreated, databaseId, apiKey) {
  const notificationContent = tasksCreated.length
    ? `Tasks Created:\n- ${tasksCreated.join("\n- ")}`
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
          start: new Date().toISOString().split("T")[0]
        }
      },
      Tag: {
        multi_select: [
          {
            name: "Maintenance"
          }
        ]
      }
    }
  };

  const options = {
    method: "POST",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Notion-Version": "2022-06-28"
    },
    payload: JSON.stringify(payload)
  };

  UrlFetchApp.fetch("https://api.notion.com/v1/pages", options);
  Logger.log("Notification created in Notion.");
}

/**
 * getTaskDate:
 * Returns a Date object for the given day (e.g. "Tuesday")
 * in the same week as `weekStartDate`.
 *
 * @param {string} day - Day of the week ("Sunday" ... "Saturday").
 * @param {Date} weekStartDate - A reference date for that week.
 * @returns {Date}
 */
function getTaskDate(day, weekStartDate) {
  const dayIndexMap = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  const targetIndex = dayIndexMap.indexOf(day);
  const newDate = new Date(weekStartDate);

  // Adjust newDate to the correct weekday
  const currentWeekday = newDate.getDay();
  const diff = (targetIndex - currentWeekday + 7) % 7;
  newDate.setDate(newDate.getDate() + diff);

  return newDate;
}

/**
 * doesTaskExist:
 * Queries the Notion database to see if a task with the same
 * Name and Date already exists.
 *
 * @param {string} taskName
 * @param {Date} taskDate
 * @param {string} databaseId
 * @param {string} apiKey
 * @returns {boolean} true if the task is found, otherwise false
 */
function doesTaskExist(taskName, taskDate, databaseId, apiKey) {
  const dateStr = taskDate.toISOString().split("T")[0]; // Compare only YYYY-MM-DD

  // Build a query filter with "and" conditions:
  //   1) property "Name" equals `taskName`
  //   2) property "Date" equals `dateStr`
  const queryPayload = {
    filter: {
      and: [
        {
          property: "Name",
          title: {
            equals: taskName
          }
        },
        {
          property: "Date",
          date: {
            equals: dateStr
          }
        }
      ]
    }
  };

  const queryOptions = {
    method: "POST",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Notion-Version": "2022-06-28"
    },
    payload: JSON.stringify(queryPayload)
  };

  // Query the database
  const queryUrl = `https://api.notion.com/v1/databases/${databaseId}/query`;
  const response = UrlFetchApp.fetch(queryUrl, queryOptions);
  const data = JSON.parse(response.getContentText());

  // If "results" array has any pages, that means a match was found
  if (data && data.results && data.results.length > 0) {
    Logger.log(`Task "${taskName}" on ${dateStr} already exists in the database.`);
    return true;
  }
  return false;
}
