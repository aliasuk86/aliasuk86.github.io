function createDailyTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  const triggerName = "addTasksToNotion";

  const triggerExists = triggers.some(trigger => trigger.getHandlerFunction() === triggerName);

  if (!triggerExists) {
    ScriptApp.newTrigger(triggerName)
      .timeBased()
      .everyDays(1)
      .atHour(4) // Runs at 4 AM daily
      .create();
    Logger.log("Daily trigger created for addTasksToNotion.");
  } else {
    Logger.log("Trigger already exists.");
  }
}

function deleteAllTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  Logger.log("All triggers deleted.");
}
