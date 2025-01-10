function createMultipleRaidEvents() {
  // Import your Notion API Key and Database ID
  const DATABASE_ID = DATABASE_REFERENCES.WOW;

  // Define the headers for the Notion API request
  const headers = {
    "Authorization": `Bearer ${NOTION_API_KEY}`,
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28" // Update to the latest version as needed
  };

  // Array of raid configurations
  const raids = [
    { title: "🔵 Naxx", time: "19:00", days: [1, 2, 3, 4, 5, 6] }, // Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
    { title: "🔵 Naxx", time: "22:00", days: [1, 4, 5, 6] }, // Monday, Thursday, Friday, Saturday
    { title: "🔵 Naxx", time: "14:30", days: [0] }, // Sunday
    { title: "🟡 World Tour", time: "22:00", days: [3] }, // Wednesday
    { title: "🟡 World Tour", time: "14:30", days: [6] }, // Saturday
    { title: "🟡 World Tour", time: "19:30", days: [0] }, // Sunday
    { title: "🟢 AQ40", time: "22:00", days: [2] }, // Tuesday
    { title: "🟢 AQ40", time: "16:00", days: [4] }, // Thursday
    { title: "🟢 AQ40", time: "23:30", days: [6] }, // Saturday
    { title: "🔴 BWLMC", time: "15:30", days: [5] } // Friday
  ];

  // Get today's date
  const now = new Date();
  const today = new Date(now);
  // today.setHours(19, 0, 0, 0);

  // Loop through each raid configuration
  for (const raid of raids) {
    // Loop through today + next 7 days (8 days total to ensure the correct range)
    for (let i = 0; i < 8; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);

      // Skip days not in the raid's schedule
      if (!raid.days.includes(futureDate.getDay())) {
        continue;
      }

      // Format the date for Notion
      const eventDate = futureDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD

      // Payload for Notion API to create a new entry
      const payload = {
        parent: { database_id: DATABASE_ID },
        icon: { type: "external", external: { url: "https://img.notionusercontent.com/ext/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2F29f28de6-5c67-4393-9fdd-c2fdf743cb38%2Fgorilla-svgrepo-com5.svg/size/?exp=1736543840&sig=h1uOfoVC0b6gb9NB6hicRKBzu53YQvkDy4e_4Bcs_9M" } },
        properties: {
          Raid: { title: [{ text: { content: raid.title } }] },
          Date: { date: { start: `${eventDate}T${raid.time}:00.000Z` } }
        }
      };

      // Query payload to check if the event already exists
      const queryPayload = {
        filter: {
          and: [
            { property: "Raid", title: { equals: raid.title } },
            { property: "Date", date: { equals: `${eventDate}T${raid.time}:00.000Z` } }
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
          Logger.log(`Event for ${raid.title} on ${eventDate} already exists. Skipping.`);
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

        Logger.log(`Created event "${raid.title}" for ${eventDate}: ${response.getContentText()}`);
      } catch (error) {
        Logger.log(`Error creating event "${raid.title}" for ${eventDate}: ${error}`);
      }
    }
  }
}
