/**************************************
 *           1) CONSTANTS
 *************************************/

// No need to re-declare NOTION_API_KEY or DATABASE_REFERENCES
// They are directly available from Secrets.gs

// RAID SCHEDULE (times are in server time; adjust to your time zone if needed)
const raidSchedule = {
  "Naxx 7pm":   ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  "Naxx 10pm":  ["Mon", "Thu", "Fri", "Sat"],
  "Naxx 14:30": ["Sun"],
  "World Tour": { 
    "Wed": "22:00", 
    "Sat": "14:30", 
    "Sun": "19:30" 
  },
  "AQ40": { 
    "Tue": "22:00", 
    "Thu": "16:00", 
    "Sat": "23:30" 
  },
  "BWL/MC": { 
    "Fri": "15:30" 
  }
};

// Emoji mappings based on raid type
const emojiMapping = {
  "BWL/MC":      "🔴",
  "AQ40":        "🟢",
  "World Tour":  "🟡",
  "Naxx 14:30":  "🔵"
};
// Default emoji if not found in the mapping
const DEFAULT_EMOJI = "🟣";

/**************************************
 *     2) HELPER FUNCTIONS
 *************************************/

/**
 * Helper function to compute the next date for a specific day of the week.
 * 
 * @param {string} day           - The short day of week (e.g., "Sun", "Mon", etc.)
 * @param {Date}   currentDate   - The reference date (today)
 * @returns {Date}               - The next date that matches the given day of week
 */
function getNextDateForDay(day, currentDate) {
  console.log(`getNextDateForDay called with day: ${day}, currentDate: ${currentDate}`);

  if (!day || typeof day !== "string") {
    console.error(`Invalid day provided: ${day}`);
    throw new Error("Invalid day: Must be a valid string.");
  }

  if (!(currentDate instanceof Date) || isNaN(currentDate)) {
    console.error(`Invalid currentDate provided: ${currentDate}`);
    throw new Error("Invalid currentDate: Must be a valid Date object.");
  }

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayIndex = daysOfWeek.indexOf(day);

  if (dayIndex === -1) {
    console.error(`Invalid day abbreviation: ${day}`);
    throw new Error(`Invalid day: "${day}" is not a valid day abbreviation.`);
  }

  const currentDayIndex = currentDate.getDay();
  const daysToAdd = (dayIndex - currentDayIndex + 7) % 7;
  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() + daysToAdd);
  console.log(`Next date for ${day}: ${nextDate}`);
  return nextDate;
}




/**
 * Checks if an event already exists in Notion by matching the Name and (start) Date.
 * 
 * @param {string} raid        - The name of the raid (e.g., "Naxx 7pm")
 * @param {Date}   startTime   - The start time of the raid
 * @returns {boolean}          - True if an event already exists, false otherwise
 */
function isEventExists(raid, startTime) {
  const emoji = emojiMapping[raid] || DEFAULT_EMOJI;
  const nameToSearch = `${emoji} ${raid}`;
  let dateString = startTime.toISOString();

  const notionFilter = {
    filter: {
      and: [
        {
          property: "Name",
          rich_text: { equals: nameToSearch }
        },
        {
          property: "Date",
          date: { equals: dateString }
        }
      ]
    }
  };

  const url = `https://api.notion.com/v1/databases/${DATABASE_REFERENCES.WOW}/query`;
  const options = {
    method: 'post',
    headers: {
      "Authorization": `Bearer ${NOTION_API_KEY}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28"
    },
    payload: JSON.stringify(notionFilter)
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(response.getContentText());
    return data.results && data.results.length > 0;
  } catch (error) {
    console.error('Error querying Notion:', error);
    return false;
  }
}

/**
 * Creates an event in Notion using the Notion API.
 * 
 * @param {string} raid        - The name of the raid (e.g., "Naxx 7pm")
 * @param {Date}   startTime   - The start time of the raid
 * @param {Date}   endTime     - The end time of the raid
 */
function createNotionEvent(raid, startTime, endTime) {
  if (!(startTime instanceof Date) || !(endTime instanceof Date) || isNaN(startTime) || isNaN(endTime)) {
    console.error('Invalid Date value:', { startTime, endTime });
    return;
  }

  const emoji = emojiMapping[raid] || DEFAULT_EMOJI;
  const notionData = {
    parent: { database_id: DATABASE_REFERENCES.WOW },
    properties: {
      "Name": {
        title: [
          {
            text: {
              content: `${emoji} ${raid}`
            }
          }
        ]
      },
      "Date": {
        date: {
          start: startTime.toISOString(),
          end: endTime.toISOString()
        }
      },
      "Icon": {
        rich_text: [
          {
            text: {
              content: "gorilla_face"
            }
          }
        ]
      }
    }
  };

  try {
    const options = {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${NOTION_API_KEY}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
      },
      payload: JSON.stringify(notionData)
    };

    UrlFetchApp.fetch('https://api.notion.com/v1/pages', options);
    console.log(`Event "${raid}" created successfully.`);
  } catch (error) {
    console.error(`Error creating event: ${error.message}`);
  }
}

/**************************************
 *        3) MAIN FUNCTION
 *************************************/

/**
 * Creates upcoming raid events in Notion based on the `raidSchedule`.
 */
function createEvents() {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  // Log the raidSchedule to debug its structure
  console.log("Raid Schedule:", JSON.stringify(raidSchedule));

  Object.keys(raidSchedule).forEach(raid => {
    const times = raidSchedule[raid];
    console.log(`Processing raid: ${raid}, Times: ${JSON.stringify(times)}`);

    if (typeof times === 'object' && !Array.isArray(times)) {
      Object.keys(times).forEach(day => {
        if (day === undefined) {
          console.error(`Day is undefined for raid: ${raid}`);
          return;
        }
        console.log(`Day: ${day}, Event Time: ${times[day]}`);
        try {
          const eventTime = times[day];
          const eventDate = getNextDateForDay(day, today);
          console.log(`Event date for ${day}: ${eventDate}`);
        } catch (error) {
          console.error(`Error processing raid "${raid}" for day "${day}": ${error.message}`);
        }
      });
    } else if (Array.isArray(times)) {
      times.forEach(day => {
        if (day === undefined) {
          console.error(`Day is undefined in array for raid: ${raid}`);
          return;
        }
        console.log(`Day: ${day}`);
        try {
          const eventDate = getNextDateForDay(day, today);
          console.log(`Event date for ${day}: ${eventDate}`);
        } catch (error) {
          console.error(`Error processing raid "${raid}" for day "${day}": ${error.message}`);
        }
      });
    } else {
      console.error(`Invalid schedule format for raid "${raid}":`, times);
    }
  });
}
