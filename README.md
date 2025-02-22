# HabitiCalender
## Habitica & Google Calendar Sync

This script syncs Google Calendar events with Habitica tasks and vice versa. It automates the process so that your calendar events appear in Habitica as to-dos, and your Habitica tasks show up in your Google Calendar.

---

## Features
- **Google Calendar ➝ Habitica**: Converts upcoming calendar events into Habitica tasks.
- **Habitica ➝ Google Calendar**: Adds Habitica to-dos to Google Calendar.
- **Automatic Syncing**: Runs every few minutes using Google Apps Script triggers.

---

## Requirements
- A **Google Calendar**.
- A **Habitica account**.
- Your **Habitica API User ID and API Token**.
- Your **Google Calendar ID**.
- A Habitica **Tag ID** (optional, used to filter specific tasks).

---

## Setup Instructions

### 1️⃣ Get Your Habitica API Credentials
1. Log into [Habitica](https://habitica.com/).
2. Go to **User > Settings**.
3. Scroll to **API Settings**.
4. Copy your **User ID** and **API Token**.

### 2️⃣ Find Your Google Calendar ID
1. Open [Google Calendar](https://calendar.google.com/).
2. Find the calendar you want to sync.
3. Click **Settings (⚙) > Settings**.
4. Under **Integrate Calendar**, copy the **Calendar ID** (e.g., `your-email@gmail.com` or `xyz@group.calendar.google.com`).

### 3️⃣ Get a Habitica Tag ID (Optional)
1. Open [Habitica](https://habitica.com/).
2. Go to **Tasks > Tags**.
3. Create a new tag or select an existing one.
4. Right-click the tag and copy its ID from the URL (it looks like `abcdef12-3456-7890-abcd-1234567890ef`).

### 4️⃣ Set Up the Script in Google Apps Script
1. Go to [Google Apps Script](https://script.google.com/).
2. Create a new project.
3. Copy and paste the script from this repository.
4. Replace the placeholders with your **Google Calendar ID**, **Habitica User ID**, **API Token**, and **Tag ID**.

### 5️⃣ Store Your Credentials
Run the `setup()` function once to save your API credentials securely.

### 6️⃣ Enable Automatic Syncing
Run `createSafeTrigger()` to set up a time-based trigger that syncs Habitica and Google Calendar every few minutes.

---

## Usage
- Run `syncHabiticaCalendar()` manually or wait for the automatic trigger.
- View your Habitica tasks in Google Calendar and your calendar events in Habitica.

---

## Notes
- **API Rate Limits**: Habitica allows a limited number of API requests per hour.
- **Duplicate Prevention**: The script avoids duplicate tasks and events.
- **Customization**: Modify sync intervals, filtering, and formatting in the script.

---

## Troubleshooting
- **Nothing syncs?** Ensure API keys, Calendar ID, and Tag ID are correct.
- **Too many events?** Adjust the sync time range in the script.
- **Not updating automatically?** Check if the trigger is active under Google Apps Script > Triggers.

---

## Contributions
Feel free to submit issues or pull requests to improve the script!

