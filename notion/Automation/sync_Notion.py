import requests
import os

# Your Notion API token and Database ID
NOTION_TOKEN = os.getenv('NOTION_TOKEN')
DATABASE_ID = 'your-database-id'

# Notion API URL
url = "https://api.notion.com/v1/pages"

# Headers for the Notion API request
headers = {
    "Authorization": f"Bearer {NOTION_TOKEN}",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
}

# Function to create a task in Notion
def create_notion_task(task_name, task_description):
    data = {
        "parent": { "database_id": 151cbfa0aae680d09bf2ceeee39959b1 },
        "properties": {
            "Title": {
                "title": [
                    {
                        "text": {
                            "content": test
                        }
                    }
                ]
            },
            "Description": {
                "rich_text": [
                    {
                        "text": {
                            "content": task_description
                        }
                    }
                ]
            }
        }
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        print("Task successfully created!")
    else:
        print(f"Failed to create task: {response.status_code} - {response.text}")

# Example: Create a task
create_notion_task("New Task from GitHub Action", "This task was created by a GitHub Action.")
