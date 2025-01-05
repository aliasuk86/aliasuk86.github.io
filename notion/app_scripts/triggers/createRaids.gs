// Setup trigger to run at 7pm in your local time zone
function createTimeTrigger() {
  // Set your local time zone here (adjust to your actual time zone, e.g., "Europe/London")
  const timeZone = "Europe/London"; 

  // Get the current date and time in your local time zone
  const now = new Date();
  const localTime = Utilities.formatDate(now, timeZone, "yyyy-MM-dd'T'HH:mm:ss");

  // Parse the date and set the trigger to run at 7pm every day
  const triggerTime = new Date(localTime);
  triggerTime.setHours(19, 0, 0); // Set time to 7pm

  // Set up a daily trigger at exactly 7pm in the specified time zone
  ScriptApp.newTrigger('createEvents')
    .timeBased()
    .at(triggerTime)
    .inTimezone(timeZone)
    .everyDays(1)
    .create();
}
