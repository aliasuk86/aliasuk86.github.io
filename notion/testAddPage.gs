function addPageToNotion() {
    const token = "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"; // Replace with your Notion API token
    const databaseId = "151cbfa0aae680d09bf2ceeee39959b1";
  
    const url = "https://api.notion.com/v1/pages";
  
    const payload = {
      parent: { database_id: databaseId },
      properties: {
        Task: {
          title: [
            {
              text: {
                content: "Test Page" // Replace with your hardcoded test value
              }
            }
          ]
        },
        Notes: {
          rich_text: [
            {
              text: {
                content: "This is a test description" // Replace with your test value
              }
            }
          ]
        }
      }
    };
  
    const options = {
      method: "post",
      contentType: "application/json",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": "2022-06-28" // Use the appropriate version for your API
      },
      payload: JSON.stringify(payload)
    };
  
    const response = UrlFetchApp.fetch(url, options);
    Logger.log(response.getContentText());
  }  