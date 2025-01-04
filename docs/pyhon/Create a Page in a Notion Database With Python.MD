# To start test with Python

## Install Python
Install Required libraries
```bash
   pip install requests
```


Steps to Get Your Notion API Token:
1. Go to Notion Developers Portal:
Visit the Notion Developers Portal.
Log in if you haven’t already.
2. Create a New Integration:
Click on "Create new integration" (if you haven't created one yet).
Provide a name for the integration (e.g., "API Integration").
Choose the workspace you want to connect with the integration.
You can leave the "Capabilities" as default unless you need specific permissions.
Click Submit to create the integration.
3. Get the Integration Token:
After creating the integration, you’ll be taken to a page with your integration's details.
Find the "Internal Integration Token". This is the token you’ll use for authentication in your API requests.
Copy this token and save it securely. It will look like a long string of characters.
4. Share the Database with Your Integration:
Go to the database you want to access.
Click Share in the top right corner.
Invite your integration by searching for its name and selecting it.
Ensure the integration has the necessary permissions (e.g., "Can view" or "Can edit").
Note
For accessing Notion via the API in a way that allows you to interact with databases and retrieve data, you'll need to use an internal integration token.

> **Difference Between Internal and Public Tokens:**
>
> **Internal Integration Token:**
> This is the token you'll need for accessing your own Notion workspace.
> It allows you to interact with Notion databases, pages, and content from your personal workspace.
> It is the correct token for use when you're testing or automating tasks within your own Notion account.
>
> **Public Integration Token:**
> This is used for integrations that need to be publicly available to others, such as external apps or services that you want to give access to your Notion workspace.
> It's not used for personal testing or accessing your private databases.


5. Ensure Databases are Shared with Your Integration
You must explicitly share databases with the integration for them to show up in search results.

Open the database in Notion.
In the top-right corner, click Share.
Search for your integration and invite it with View or Edit permissions.

---
# How to Share a Notion Database with Your Integration

To share a Notion database with your integration, you'll need to ensure that your Notion integration is invited to the specific database you're working with. If you're seeing options that only ask for an email (typically for inviting users), here's how you can correctly share a database with your integration:

## Steps to Share a Notion Database with Your Integration

### 1. Go to the Database You Want to Share:
- Open Notion and navigate to the database that you want your integration to access.

### 2. Click on the "Share" Button:
- In the top-right corner of the database, you should see a Share button. Click on it to open the sharing options.

### 3. Find Your Integration:
- In the Share dialog, you will see an option to invite people or integrations.
- Look for your integration in the list. This will show up as the name of the integration you've connected with your Notion workspace.
- For example, if you set up an integration for API access, the integration name might be something like "My Notion Integration."

### 4. Invite the Integration:
- When you type in the integration's name, it will appear in the search box.
- Select the integration from the list to invite it to the database.
- After selecting the integration, you'll need to decide whether to give it view or edit access.
  - **View access** is typically enough for querying data.
  - **Edit access** is needed if you want the integration to modify data in the database.

### 5. Confirm the Invite:
- After selecting the correct permissions (view or edit), click **Invite** to share the database with your integration.

### 6. Integration Should Now Have Access:
- Once you’ve invited the integration to the database, it will be able to access the database via the API (assuming you've set up API access correctly).
