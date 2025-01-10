// Setup daily trigger at 7pm in your local time zone
function createTimeTrigger() {
  ScriptApp.newTrigger('createEvents')
    .timeBased()
    .atHour(19) // This sets the trigger to run at 7pm.
    .everyDays(1) // This ensures the trigger runs every day.
    .create();
}