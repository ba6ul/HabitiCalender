// HOW TO USE:
// 1. Replace 'GOOGLE_CALENDAR_ID' and 'HABITICA_TAG_ID' with your values.
// 2. Run `setup()` once to store your Habitica credentials.
// 3. Set up a time-based trigger to run `syncHabiticaCalendar()` automatically.
// ==============================================================================

// CONFIGURATION ===============================================================

const GOOGLE_CALENDAR_ID = "Change-to-your-GOOGLE_CALENDAR_ID"; 
const HABITICA_TAG_ID = "Change-to-your-HABITICA_TAG_ID"; 
const TIMEZONE = "Asia/Kolkata"; // Change it to your timezone
const SYNC_INTERVAL_MINUTES = 5; // Safe interval (max 12 calls/hour)

// HABITICA SETUP ==============================================================

/**
 * Store Habitica API credentials in Google Apps Script properties.
 * Run this function once to initialize credentials.
 */
function setup() {
  const props = PropertiesService.getUserProperties();
  props.setProperty('HABITICA_TOKEN', 'Change-to-your-HABITICA_TOKEN'); 
  props.setProperty('HABITICA_ID', 'Change-to-your-HABITICA_ID'); 
  console.log("Credentials saved! Run syncHabiticaCalendar() next.");
}

// MAIN SYNC FUNCTION ==========================================================

/**
 * Syncs events between Habitica and Google Calendar.
 * Ensures sync only happens after the defined interval.
 */
function syncHabiticaCalendar() {
  try {
    const lastSync = getLastSyncTime();
    if (new Date() - lastSync < SYNC_INTERVAL_MINUTES * 60000) {
      console.log("Skipping sync - too soon.");
      return;
    }

    syncCalendarToHabitica();
    syncHabiticaToCalendar();
    setLastSyncTime();
  } catch (e) {
    console.error("Sync Error:", e);
  }
}

// GOOGLE → HABITICA ==========================================================

/**
 * Fetches Google Calendar events and adds them as Habitica tasks.
 */
function syncCalendarToHabitica() {
  const props = PropertiesService.getUserProperties();
  const calendar = CalendarApp.getCalendarById(GOOGLE_CALENDAR_ID);
  const now = new Date();

  // Get events from last sync to now+1 hour
  const lastSync = getLastSyncTime();
  const events = calendar.getEvents(lastSync, new Date(now.getTime() + 3600000));

  events.forEach(event => {
    const timeRange = `${Utilities.formatDate(event.getStartTime(), TIMEZONE, "h:mm a")} - ${Utilities.formatDate(event.getEndTime(), TIMEZONE, "h:mm a")}`;
    
    UrlFetchApp.fetch('https://habitica.com/api/v3/tasks/user', {
      method: "post",
      headers: {
        "x-api-user": props.getProperty('HABITICA_ID'),
        "x-api-key": props.getProperty('HABITICA_TOKEN'),
        "Content-Type": "application/json"
      },
      payload: JSON.stringify({
        text: `📅 ${event.getTitle()}`, // Adds calendar emoji for clarity
        notes: timeRange,
        type: "todo",
        tags: [HABITICA_TAG_ID]
      })
    });
  });

  console.log("Google Calendar events synced to Habitica.");
}

// HABITICA → GOOGLE ==========================================================

/**
 * Fetches Habitica tasks and creates Google Calendar events.
 */
function syncHabiticaToCalendar() {
  const props = PropertiesService.getUserProperties();
  const calendar = CalendarApp.getCalendarById(GOOGLE_CALENDAR_ID);
  
  // Fetch tasks from Habitica
  const response = UrlFetchApp.fetch("https://habitica.com/api/v3/tasks/user?type=todos", {
    headers: {
      "x-api-user": props.getProperty('HABITICA_ID'),
      "x-api-key": props.getProperty('HABITICA_TOKEN')
    }
  });

  const tasks = JSON.parse(response.getContentText()).data
    .filter(task => task.tags.includes(HABITICA_TAG_ID))
    .filter(task => new Date(task.updatedAt) > getLastSyncTime());

  tasks.forEach(task => {
    const [start, end] = task.notes.split('-').map(timeStr => 
      new Date(`${Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd")} ${timeStr.trim()}`)
    );

    // Prevent duplicate events
    const existing = calendar.getEvents(start, end, { search: task.text.replace("📅", "") });
    if (existing.length === 0) {
      calendar.createEvent(task.text.replace("📅", ""), start, end);
    }
  });

  console.log("Habitica tasks synced to Google Calendar.");
}

// LAST SYNC TIME MANAGEMENT ===================================================

/**
 * Retrieves the last sync time from script properties.
 * If never synced, returns the epoch date.
 */
function getLastSyncTime() {
  const props = PropertiesService.getUserProperties();
  const lastSync = props.getProperty("LAST_SYNC");
  return lastSync ? new Date(Number(lastSync)) : new Date(0);
}

/**
 * Updates the last sync time in script properties.
 */
function setLastSyncTime() {
  PropertiesService.getUserProperties().setProperty("LAST_SYNC", Date.now());
}

// TRIGGER SETUP ===============================================================

/**
 * Creates a trigger to run the sync function automatically every X minutes.
 */
function createSafeTrigger() {
  ScriptApp.newTrigger("syncHabiticaCalendar")
    .timeBased()
    .everyMinutes(SYNC_INTERVAL_MINUTES)
    .create();
  
  console.log("Trigger created to sync every " + SYNC_INTERVAL_MINUTES + " minutes.");
}
