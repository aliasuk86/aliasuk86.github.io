// Raid schedule (times are in server time, adjust to your time zone if needed)
const raidSchedule = {
  "Naxx 7pm": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  "Naxx 10pm": ["Mon", "Thu", "Fri", "Sat"],
  "Naxx 14:30": ["Sun"],
  "World Tour": { "Wed": "22:00", "Sat": "14:30", "Sun": "19:30" },
  "AQ40": { "Tue": "22:00", "Thu": "16:00", "Sat": "23:30" },
  "BWL/MC": { "Fri": "15:30" }
};

// Function to create events in Notion only
function createEvents() {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  // Loop through the raid schedule
  Object.keys(raidSchedule).forEach(raid => {
    let times = raidSchedule[raid];

    if (typeof times === 'object') {
      Object.keys(times).forEach(day => {
        const eventTime = times[day];
        const eventDate = getNextDateForDay(day, today);
        if (eventDate > today && eventDate <= nextWeek) {
          const startTime = new Date(eventDate);
          const [hours, minutes] = eventTime.split(":").map(Number);
          startTime.setHours(hours, minutes);

          const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration
          createNotionEvent(raid, startTime, endTime); // Create Notion event
        }
      });
    } else {
      times.forEach(day => {
        const eventDate = getNextDateForDay(day, today);
        if (eventDate > today && eventDate <= nextWeek) {
          const startTime = new Date(eventDate);
          startTime.setHours(19, 0); // Default start time for Naxx 7pm

          const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration
          createNotionEvent(raid, startTime, endTime); // Create Notion event
        }
      });
    }
  });
}

// Create an event in Notion using the Notion API
function createNotionEvent(raid, startTime, endTime) {
  // Check if startTime and endTime are valid Date objects
  if (!(startTime instanceof Date) || !(endTime instanceof Date) || isNaN(startTime) || isNaN(endTime)) {
    console.error('Invalid Date value:', { startTime, endTime });
    return; // Exit if invalid date
  }

  const emojiMapping = {
    "BWL/MC": "🔴",
    "AQ40": "🟢",
    "World Tour": "🟡",
    "Naxx 14:30": "🔵"
  };

  const emoji = emojiMapping[raid] || "🟣"; // Default to purple if no match

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
              content: "gorilla_face"  // Custom Notion emoji reference
            }
          }
        ]
      }
    }
  };

  try {
    // Create the page in Notion
    const options = {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${NOTION_API_KEY}`,
        "Content-Type": "application/json",
        "Notion-Version": "2021-05-13" // Make sure to use the latest version
      },
      payload: JSON.stringify(notionData)
    };
    UrlFetchApp.fetch('https://api.notion.com/v1/pages', options);
    console.log(`Event "${raid}" created successfully.`);
  } catch (error) {
    console.error(`Error creating event: ${error.message}`);
  }
}

// Get the next date for a specific day of the week
function getNextDateForDay(day, currentDate) {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayIndex = daysOfWeek.indexOf(day);
  const currentDayIndex = currentDate.getDay();
  const daysToAdd = (dayIndex - currentDayIndex + 7) % 7;

  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() + daysToAdd);
  return nextDate;
}
