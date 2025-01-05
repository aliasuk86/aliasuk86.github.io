// Secrets (replace with actual values)
const NOTION_API_KEY = "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";
const DATABASE_REFERENCES = {
  TASKS: "151cbfa0aae680d09bf2ceeee39959b1", // Tasks database ID
  WOW: "14fcbfa0aae680b3b32bf7fc0347da42"   // WoW database ID
};

// Raid schedule (times are in server time, adjust to your time zone if needed)
const raidSchedule = {
  "Naxx 7pm": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  "Naxx 10pm": ["Mon", "Thu", "Fri", "Sat"],
  "Naxx 14:30": ["Sun"],
  "World Tour": { "Wed": "22:00", "Sat": "14:30", "Sun": "19:30" },
  "AQ40": { "Tue": "22:00", "Thu": "16:00", "Sat": "23:30" },
  "BWL/MC": { "Fri": "15:30" }
};

// Function to create events
function createEvents() {
  const calendar = CalendarApp.getDefaultCalendar();
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
          
          if (!eventExists(calendar, raid, startTime)) {
            calendar.createEvent(raid, startTime, new Date(startTime.getTime() + 60 * 60 * 1000)); // Event for 1 hour
          }
        }
      });
    } else {
      times.forEach(day => {
        const eventDate = getNextDateForDay(day, today);
        if (eventDate > today && eventDate <= nextWeek) {
          const startTime = new Date(eventDate);
          startTime.setHours(19, 0); // Default start time for Naxx 7pm
          
          if (!eventExists(calendar, raid, startTime)) {
            calendar.createEvent(raid, startTime, new Date(startTime.getTime() + 60 * 60 * 1000)); // Event for 1 hour
          }
        }
      });
    }
  });
}

// Check if an event already exists
function eventExists(calendar, title, startTime) {
  const events = calendar.getEventsForDay(startTime);
  return events.some(event => event.getTitle() === title);
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

// Setup daily trigger at 7pm
function createTimeTrigger() {
  ScriptApp.newTrigger('createEvents')
    .timeBased()
    .atHour(19)
    .everyDays(1)
    .create();
}
