function createNaxxEventsForNextWeek() {
  // Import your Notion API Key and Database ID
  const DATABASE_ID = DATABASE_REFERENCES.WOW;

  // Define the headers for the Notion API request
  const headers = {
    "Authorization": `Bearer ${NOTION_API_KEY}`,
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28" // Update to the latest version as needed
  };

  // Define the event name and time
  const eventName = "Naxx";
  const eventTime = "19:00"; // 7 PM in 24-hour format

  // Get today's date
  const today = new Date();

  // Loop through the next 7 days
  for (let i = 0; i < 7; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + i + 8); // 8 days ahead

    // Skip Sundays (day 0 in JavaScript Date)
    if (futureDate.getDay() === 0) {
      continue;
    }

    // Format the date for Notion
    const eventDate = futureDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD

    // Payload for Notion API to create a new entry
    const payload = {
      parent: { database_id: DATABASE_ID },
      properties: {
        Raid: { title: [{ text: { content: eventName } }] },
        Date: { date: { start: `${eventDate}T${eventTime}:00.000Z` } }
      }
    };

    // Query payload to check if the event already exists
    const queryPayload = {
      filter: {
        and: [
          { property: "Raid", title: { equals: eventName } },
          { property: "Date", date: { equals: `${eventDate}T${eventTime}:00.000Z` } }
        ]
      }
    };

    try {
      // Query the database to see if the event exists
      const queryResponse = UrlFetchApp.fetch(
        `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
        {
          method: "POST",
          headers: headers,
          payload: JSON.stringify(queryPayload)
        }
      );

      const queryResult = JSON.parse(queryResponse.getContentText());
      if (queryResult.results.length > 0) {
        Logger.log(`Event for ${eventDate} already exists. Skipping.`);
        continue;
      }

      // Create the event if it doesn't exist
      const response = UrlFetchApp.fetch(
        "https://api.notion.com/v1/pages",
        {
          method: "POST",
          headers: headers,
          payload: JSON.stringify(payload)
        }
      );

      Logger.log(`Created event for ${eventDate}: ${response.getContentText()}`);
    } catch (error) {
      Logger.log(`Error creating event for ${eventDate}: ${error}`);
    }
  }
}
