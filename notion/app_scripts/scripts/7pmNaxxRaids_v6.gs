function createNaxxEventsWithIcon() {
  // Import your Notion API Key and Database ID
  const DATABASE_ID = DATABASE_REFERENCES.WOW;

  // Define the headers for the Notion API request
  const headers = {
    "Authorization": `Bearer ${NOTION_API_KEY}`,
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28" // Update to the latest version as needed
  };

  // Define the event name, time, and icon URL
  const eventName = "🔵 Naxx";
  const eventTime = "19:00"; // 7 PM in 24-hour format
  const iconUrl =
    "https://img.notionusercontent.com/ext/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2F29f28de6-5c67-4393-9fdd-c2fdf743cb38%2Fgorilla-svgrepo-com5.svg/size/?exp=1736543840&sig=h1uOfoVC0b6gb9NB6hicRKBzu53YQvkDy4e_4Bcs_9M";

  // Get today's date
  const now = new Date();

  // Adjust `today` to 7 PM
  const today = new Date(now);
  today.setHours(19, 0, 0, 0);

  // Loop through today + next 7 days (8 days total to ensure the correct range)
  for (let i = 0; i < 8; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + i);

    // Skip Sundays (day 0 in JavaScript Date)
    if (futureDate.getDay() === 0) {
      continue;
    }

    // Format the date for Notion
    const eventDate = futureDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD

    // Payload for Notion API to create a new entry
    const payload = {
      parent: { database_id: DATABASE_ID },
      icon: { type: "external", external: { url: iconUrl } },
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
