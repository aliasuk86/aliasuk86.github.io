function createNaxxEvent() {
  // Import your Notion API Key and Database ID
  // const NOTION_API_KEY = Secrets.NOTION_API_KEY;
  const DATABASE_ID = DATABASE_REFERENCES.WOW; // Adjust based on your setup

  // Define the headers for the Notion API request
  const headers = {
    "Authorization": `Bearer ${NOTION_API_KEY}`,
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28" // Update to the latest version as needed
  };

  // Calculate the next Monday
  const now = new Date();
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + ((1 + 7 - now.getDay()) % 7 || 7));
  const eventDate = nextMonday.toISOString().split("T")[0]; // Format: YYYY-MM-DD

  // Define the event name and time
  const eventName = "Naxx";
  const eventTime = "19:00"; // 7 PM in 24-hour format

  // Payload for Notion API to create a new entry
  const payload = {
    parent: { database_id: DATABASE_ID },
    properties: {
      Raid: { title: [{ text: { content: eventName } }] },
      Date: { date: { start: `${eventDate}T${eventTime}:00.000Z` } }
    }
  };

  // Check if the event already exists
  const queryPayload = {
    filter: {
      and: [
        { property: "Raid", title: { equals: eventName } },
        { property: "Date", date: { equals: `${eventDate}T${eventTime}:00.000Z` } }
      ]
    }
  };

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
    Logger.log("Event already exists. No action taken.");
    return;
  }

  // Make a POST request to Notion API to create the event
  const response = UrlFetchApp.fetch(
    "https://api.notion.com/v1/pages",
    {
      method: "POST",
      headers: headers,
      payload: JSON.stringify(payload)
    }
  );

  Logger.log(`Response: ${response.getContentText()}`);
}
