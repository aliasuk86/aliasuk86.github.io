# Install and Connect CLASP to VS Code

This guide will help you set up and connect Google Apps Script (GAS) with your local development environment using CLASP and VS Code.


- [Install and Connect CLASP to VS Code](#install-and-connect-clasp-to-vs-code)
  - [Prerequisites](#prerequisites)
    - [Step 1: Install CLASP](#step-1-install-clasp)
    - [Step 2: Authenticate CLASP](#step-2-authenticate-clasp)
    - [Step 3: Create a New Apps Script Project](#step-3-create-a-new-apps-script-project)
    - [Step 4: Clone an Existing Apps Script Project (Optional)](#step-4-clone-an-existing-apps-script-project-optional)
    - [Step 5: Configure VS Code for Apps Script](#step-5-configure-vs-code-for-apps-script)
    - [Step 6: Push Changes to Google Apps Script](#step-6-push-changes-to-google-apps-script)
    - [Step 7: Pull Changes from Google Apps Script](#step-7-pull-changes-from-google-apps-script)
    - [Step 8: Test and Deploy](#step-8-test-and-deploy)


## Prerequisites
1. **Google Account**: Ensure you have a Google account to access Google Apps Script.
2. **Node.js**: Install Node.js (v10 or later) from [Node.js website](https://nodejs.org/).
3. **VS Code**: Install [Visual Studio Code](https://code.visualstudio.com/).
4. **Google Apps Script API**: Enable it for your account.

   - Go to the [Google Cloud Console / User Settings](https://console.cloud.google.com/).
   - Search for "Google Apps Script API" and enable it or click [here](https://script.google.com/home/usersettings)

---
### Step 1: Install CLASP
Open a terminal/command prompt.
Run the following command to install CLASP globally:
```bash
npm install -g @google/clasp
```
Verify the installation: - [Install and Connect CLASP to VS Code](#install-and-connect-clasp-to-vs-code)
```bash
clasp --version
```
---
### Step 2: Authenticate CLASP
Log in to your Google account with CLASP:
A browser window will open. Follow the prompts to allow access.
After successful login, CLASP is authenticated.
```bash
clasp login
```
---
### Step 3: Create a New Apps Script Project
In your terminal, navigate to a directory where you'd like to store your project:
```bash
mkdir app_script
cd app_script
```
Create a new Apps Script project:
```bash
clasp create --type standalone --title "My Apps Script Project"
--type standalone: Creates a standalone script.
--title: Sets the title of the project in Google Drive.
```
Verify the setup:
```bash
clasp status
```
---
### Step 4: Clone an Existing Apps Script Project (Optional)
If you have an existing project:
Obtain the script project ID from the Apps Script editor URL: Example:

```bash
https://script.google.com/d/<PROJECT_ID>/edit
```

One the project locally:
```bash
clasp clone <PROJECT_ID>
```
---
### Step 5: Configure VS Code for Apps Script
Open the project in VS Code:
```bash
code .
```
Ensure .clasp.json is present in the root directory. This file contains project metadata.
Create and edit your Apps Script files locally:
CLASP uses .js or .ts files for script files.
Example:
```javascript
function myFunction() {
  Logger.log("Hello, Apps Script!");
}
```
---
### Step 6: Push Changes to Google Apps Script
After editing, push changes to the cloud:

```bash
clasp push
```
Verify your changes in the Apps Script editor:
Open the project from Google Drive or Apps Script Dashboard.
### Step 7: Pull Changes from Google Apps Script
To sync changes made in the Apps Script editor to your local files:
```bash
clasp pull
```
---
### Step 8: Test and Deploy
Test your script in the Apps Script editor or by creating a trigger.
Deploy the script:
```bash
Copy code
clasp deploy
```
Additional Tips
Check CLASP Documentation: For advanced features, refer to the official CLASP documentation.
Use TypeScript: CLASP supports TypeScript for better type-checking and modern syntax.
Troubleshooting
Permission Issues: Ensure that the Google account used has the correct permissions for the Apps Script project.
Missing .clasp.json: If missing, re-run clasp create or clasp clone.
Enjoy developing with Google Apps Script and CLASP in VS Code!
