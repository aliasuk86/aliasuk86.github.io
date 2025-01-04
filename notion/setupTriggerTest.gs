function createTrigger() {
    // Check if the trigger already exists to avoid duplicates
    const triggers = ScriptApp.getProjectTriggers();
    const triggerName = "addPageToNotion";
  
    const triggerExists = triggers.some(trigger => trigger.getHandlerFunction() === triggerName);
  
    if (!triggerExists) {
      // Create a trigger that runs the function every 10 minutes
      ScriptApp.newTrigger(triggerName)
        .timeBased()
        .everyMinutes(10)
        .create();
  
      Logger.log("Trigger created to run every 10 minutes.");
    } else {
      Logger.log("Trigger already exists.");
    }
  }