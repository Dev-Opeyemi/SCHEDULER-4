/* ============================================================
         PES — Personal Execution System  |  script.js
         Full logic: schedule engine, real-time tracker, notifications,
         rescheduling, and UI rendering.

         OPEYEMI OLAITAN — AFIT 300L CS, 2025/2026 Semester 2
         ============================================================ */

"use strict";

/* ============================================================
         SECTION 1: TIMETABLE DATA
         This is your full weekly fixed schedule, extracted from your
         personal timetable. Each day has an array of fixed events.
         Type codes: SPIRITUAL | LECTURE | GROWTH | REST | MEAL | BUFFER
         ============================================================ */

const WEEKLY_TIMETABLE = {
  // 0 = Sunday, 1 = Monday ... 6 = Saturday
  1: [
    // MONDAY — CSC302 (8-10), CSC308 (12-1), CSC314 (2-3)
    {
      name: "Morning Devotion + Prayer",
      start: "05:00",
      end: "06:00",
      type: "SPIRITUAL",
      notes: "Fixed anchor. Start here every day.",
    },
    {
      name: "Freshen Up + Breakfast",
      start: "06:00",
      end: "07:35",
      type: "MEAL",
      notes: "Prepare mentally for lectures.",
    },
    {
      name: "Buffer / Travel to School",
      start: "07:35",
      end: "08:00",
      type: "BUFFER",
      notes: "Arrive early, review notes on the way.",
    },
    {
      name: "CSC302 — OOP Lecture",
      start: "08:00",
      end: "10:00",
      type: "LECTURE",
      notes: "Fixed. Pay attention, take clean notes.",
    },
    {
      name: "Transition Buffer",
      start: "10:00",
      end: "10:35",
      type: "BUFFER",
      notes: "Walk, water, mental reset.",
    },
    {
      name: "Cool Down / Personal Book Reading",
      start: "10:35",
      end: "11:40",
      type: "GROWTH",
      notes: "Non-academic reading. Swap to academics if assignment due.",
    },
    {
      name: "Transition Buffer",
      start: "11:40",
      end: "12:00",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "CSC308 — Formal Methods Lecture",
      start: "12:00",
      end: "13:00",
      type: "LECTURE",
      notes: "Fixed.",
    },
    {
      name: "Personal Book Reading / Lunch",
      start: "13:00",
      end: "14:00",
      type: "MEAL",
      notes: "Step away from study. Eat properly.",
    },
    {
      name: "CSC314 — Computer Architecture",
      start: "14:00",
      end: "15:00",
      type: "LECTURE",
      notes: "Fixed.",
    },
    {
      name: "Transition Buffer",
      start: "15:00",
      end: "15:35",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Lunch / Siesta",
      start: "15:35",
      end: "17:35",
      type: "REST",
      notes: "Full rest. No phone.",
    },
    {
      name: "Transition Buffer",
      start: "17:35",
      end: "18:00",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Academic Study",
      start: "18:00",
      end: "20:30",
      type: "GROWTH",
      notes: "Review CSC302, CSC308, CSC314. Past questions.",
    },
    {
      name: "Web Development",
      start: "20:30",
      end: "22:00",
      type: "GROWTH",
      notes: "HTML/CSS/JS. Build something — not just tutorials.",
    },
    {
      name: "Transition Buffer",
      start: "22:00",
      end: "22:30",
      type: "BUFFER",
      notes: "Wind down. No new learning.",
    },
    {
      name: "Night Devotion / Prayers",
      start: "22:30",
      end: "23:20",
      type: "SPIRITUAL",
      notes: "Fixed anchor.",
    },
    {
      name: "Transition Buffer",
      start: "23:20",
      end: "23:30",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Bible Study",
      start: "23:30",
      end: "00:00",
      type: "SPIRITUAL",
      notes: "Fixed. Structured study.",
    },
  ],

  2: [
    // TUESDAY — CSC314 (8-10), CSC332 (12-1)
    {
      name: "Morning Devotion + Prayer",
      start: "05:00",
      end: "06:00",
      type: "SPIRITUAL",
      notes: "Fixed anchor.",
    },
    {
      name: "Freshen Up + Breakfast",
      start: "06:00",
      end: "07:35",
      type: "MEAL",
      notes: "",
    },
    {
      name: "Buffer / Travel to School",
      start: "07:35",
      end: "08:00",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "CSC314 — Computer Architecture",
      start: "08:00",
      end: "10:00",
      type: "LECTURE",
      notes: "Fixed.",
    },
    {
      name: "Transition Buffer",
      start: "10:00",
      end: "10:35",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Cool Down / Personal Book Reading",
      start: "10:35",
      end: "11:35",
      type: "GROWTH",
      notes: "Non-academic reading. Not just tutorials.",
    },
    {
      name: "Transition Buffer",
      start: "11:35",
      end: "12:00",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "CSC332 — Survey of Prog. Languages",
      start: "12:00",
      end: "13:00",
      type: "LECTURE",
      notes: "Fixed.",
    },
    {
      name: "Transition Buffer",
      start: "13:00",
      end: "13:35",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Lunch",
      start: "13:35",
      end: "15:35",
      type: "MEAL",
      notes: "Eat properly. Rest after if needed.",
    },
    {
      name: "Siesta",
      start: "15:35",
      end: "17:30",
      type: "REST",
      notes: "Full rest. No phone.",
    },
    {
      name: "Transition Buffer",
      start: "17:30",
      end: "18:00",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Academic Study",
      start: "18:00",
      end: "20:30",
      type: "GROWTH",
      notes: "Focus: CSC314 or CSC332 — whichever is harder this week.",
    },
    {
      name: "Web Development",
      start: "20:30",
      end: "22:00",
      type: "GROWTH",
      notes: "Build, don't just watch. Use this lighter day well.",
    },
    {
      name: "Transition Buffer",
      start: "22:00",
      end: "22:30",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Night Devotion / Prayers",
      start: "22:30",
      end: "23:20",
      type: "SPIRITUAL",
      notes: "Fixed anchor.",
    },
    {
      name: "Transition Buffer",
      start: "23:20",
      end: "23:30",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Bible Study",
      start: "23:30",
      end: "00:00",
      type: "SPIRITUAL",
      notes: "Fixed.",
    },
  ],

  3: [
    // WEDNESDAY — CSC308 (10-12), CSC302 (12-1) — HEAVY DAY
    {
      name: "Morning Devotion + Prayer",
      start: "05:00",
      end: "06:00",
      type: "SPIRITUAL",
      notes: "Fixed anchor.",
    },
    {
      name: "Freshen Up + Breakfast",
      start: "06:00",
      end: "07:00",
      type: "MEAL",
      notes: "",
    },
    {
      name: "Personal Book Reading",
      start: "07:00",
      end: "09:00",
      type: "GROWTH",
      notes: "Best brain hours. Personal reading or lightest course preview.",
    },
    {
      name: "Buffer + Prep for Class",
      start: "09:00",
      end: "09:35",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Travel / Settle In",
      start: "09:35",
      end: "10:00",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "CSC308 — Formal Methods",
      start: "10:00",
      end: "12:00",
      type: "LECTURE",
      notes: "Fixed.",
    },
    {
      name: "CSC302 — OOP Lecture",
      start: "12:00",
      end: "13:00",
      type: "LECTURE",
      notes: "Fixed.",
    },
    {
      name: "Lunch",
      start: "13:00",
      end: "15:00",
      type: "MEAL",
      notes: "Heavy morning. Eat well and rest lightly.",
    },
    {
      name: "Siesta — Mandatory Today",
      start: "15:00",
      end: "17:30",
      type: "REST",
      notes: "Heavy day. Protect this block completely.",
    },
    {
      name: "Transition Buffer",
      start: "17:30",
      end: "18:00",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Academic Study",
      start: "18:00",
      end: "20:30",
      type: "GROWTH",
      notes: "Review CSC308 and CSC302. Pace yourself.",
    },
    {
      name: "Web Development",
      start: "20:30",
      end: "22:00",
      type: "GROWTH",
      notes: "Shorter session today. Don't overload.",
    },
    {
      name: "Transition Buffer",
      start: "22:00",
      end: "22:30",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Night Devotion + Journaling",
      start: "22:30",
      end: "23:20",
      type: "SPIRITUAL",
      notes: "Fixed anchor.",
    },
    {
      name: "Transition Buffer",
      start: "23:20",
      end: "23:30",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Bible Study",
      start: "23:30",
      end: "00:00",
      type: "SPIRITUAL",
      notes: "Fixed.",
    },
  ],

  4: [
    // THURSDAY — CSC304 (8-10), CSC316 (10-12)
    {
      name: "Morning Devotion + Prayer",
      start: "05:00",
      end: "06:00",
      type: "SPIRITUAL",
      notes: "Fixed anchor.",
    },
    {
      name: "Freshen Up + Breakfast",
      start: "06:00",
      end: "07:35",
      type: "MEAL",
      notes: "",
    },
    {
      name: "Buffer / Travel to School",
      start: "07:35",
      end: "08:00",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "CSC304 — Data Management",
      start: "08:00",
      end: "10:00",
      type: "LECTURE",
      notes: "Fixed.",
    },
    {
      name: "CSC316 — Compiler Construction",
      start: "10:00",
      end: "12:00",
      type: "LECTURE",
      notes: "Fixed.",
    },
    {
      name: "Transition Buffer",
      start: "12:00",
      end: "12:35",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Lunch",
      start: "12:35",
      end: "14:30",
      type: "MEAL",
      notes: "Eat well. Good afternoon ahead.",
    },
    {
      name: "Siesta",
      start: "14:30",
      end: "16:30",
      type: "REST",
      notes: "Full rest. Good afternoon slot ahead.",
    },
    {
      name: "Personal Book Reading",
      start: "16:30",
      end: "17:30",
      type: "GROWTH",
      notes: "Non-academic reading.",
    },
    {
      name: "Transition Buffer",
      start: "17:30",
      end: "18:00",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Academic Study",
      start: "18:00",
      end: "20:30",
      type: "GROWTH",
      notes: "CSC304 or CSC316. Review lecture + past questions.",
    },
    {
      name: "Web Development",
      start: "20:30",
      end: "22:00",
      type: "GROWTH",
      notes: "No late lectures — push a project forward.",
    },
    {
      name: "Transition Buffer",
      start: "22:00",
      end: "22:30",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Night Devotion + Journaling",
      start: "22:30",
      end: "23:20",
      type: "SPIRITUAL",
      notes: "Fixed anchor.",
    },
    {
      name: "Transition Buffer",
      start: "23:20",
      end: "23:30",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Bible Study",
      start: "23:30",
      end: "00:00",
      type: "SPIRITUAL",
      notes: "Fixed.",
    },
  ],

  5: [
    // FRIDAY — CSC332 (8-10) — LIGHTEST DAY
    {
      name: "Morning Devotion + Prayer",
      start: "05:00",
      end: "06:00",
      type: "SPIRITUAL",
      notes: "Fixed anchor.",
    },
    {
      name: "Freshen Up + Breakfast",
      start: "06:00",
      end: "07:35",
      type: "MEAL",
      notes: "",
    },
    {
      name: "Buffer / Travel to School",
      start: "07:35",
      end: "08:00",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "CSC332 — Survey of Prog. Languages",
      start: "08:00",
      end: "10:00",
      type: "LECTURE",
      notes: "Fixed.",
    },
    {
      name: "Transition Buffer",
      start: "10:00",
      end: "10:35",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Personal Book Reading",
      start: "10:35",
      end: "11:35",
      type: "GROWTH",
      notes: "Lightest lecture day. Read without pressure.",
    },
    {
      name: "Transition Buffer",
      start: "11:35",
      end: "12:00",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Padre Hour",
      start: "12:00",
      end: "13:00",
      type: "SPIRITUAL",
      notes: "Scheduled rest / personal time.",
    },
    {
      name: "Transition Buffer",
      start: "13:00",
      end: "13:35",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Lunch",
      start: "13:35",
      end: "15:35",
      type: "MEAL",
      notes: "Eat well. Lightest day — enjoy it.",
    },
    {
      name: "Siesta",
      start: "15:35",
      end: "17:30",
      type: "REST",
      notes: "Full rest.",
    },
    {
      name: "Transition Buffer",
      start: "17:30",
      end: "18:00",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Academic Study",
      start: "18:00",
      end: "20:30",
      type: "GROWTH",
      notes: "Weekly review. Identify gaps. Past questions for all 6 courses.",
    },
    {
      name: "Web Development",
      start: "20:30",
      end: "22:00",
      type: "GROWTH",
      notes: "Push a project forward. Reward for the week.",
    },
    {
      name: "Transition Buffer",
      start: "22:00",
      end: "22:30",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Night Devotion + Journaling",
      start: "22:30",
      end: "23:20",
      type: "SPIRITUAL",
      notes: "Fixed anchor.",
    },
    {
      name: "Bible Study",
      start: "23:30",
      end: "00:00",
      type: "SPIRITUAL",
      notes: "Fixed.",
    },
  ],

  6: [
    // SATURDAY — No Lectures — RECOVERY + DEEP WORK
    {
      name: "Devotion (Prayer / Bible Study)",
      start: "05:00",
      end: "06:30",
      type: "SPIRITUAL",
      notes: "Fixed. Longer today — no rush.",
    },
    {
      name: "Breakfast + Chores",
      start: "06:30",
      end: "08:30",
      type: "MEAL",
      notes: "Eat, tidy up, settle in for the day.",
    },
    {
      name: "Freshen Up / Break",
      start: "08:30",
      end: "09:30",
      type: "BUFFER",
      notes: "Transition into study mode.",
    },
    {
      name: "Transition Buffer",
      start: "09:30",
      end: "10:00",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Academic Study",
      start: "10:00",
      end: "13:00",
      type: "GROWTH",
      notes: "Your hardest course this semester. Focused, distraction-free.",
    },
    {
      name: "Transition Buffer",
      start: "13:00",
      end: "13:30",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Lunch",
      start: "13:30",
      end: "15:00",
      type: "MEAL",
      notes: "",
    },
    {
      name: "Siesta",
      start: "15:00",
      end: "17:00",
      type: "REST",
      notes: "Longer rest today. You've earned it.",
    },
    {
      name: "Personal Book Reading",
      start: "17:00",
      end: "18:30",
      type: "GROWTH",
      notes: "",
    },
    {
      name: "Transition Buffer",
      start: "18:30",
      end: "19:00",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Web Development",
      start: "19:00",
      end: "22:00",
      type: "GROWTH",
      notes: "Best web dev session of the week. Build a real project.",
    },
    {
      name: "Transition Buffer",
      start: "22:00",
      end: "22:30",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Night Devotion + Journaling",
      start: "22:30",
      end: "23:20",
      type: "SPIRITUAL",
      notes: "Fixed anchor.",
    },
    {
      name: "Transition Buffer",
      start: "23:20",
      end: "23:30",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Bible Study",
      start: "23:30",
      end: "00:00",
      type: "SPIRITUAL",
      notes: "Fixed.",
    },
  ],

  0: [
    // SUNDAY — REST + WORSHIP + WEEKLY PLANNING
    {
      name: "Morning Devotion + Prayer",
      start: "05:00",
      end: "06:00",
      type: "SPIRITUAL",
      notes: "Fixed. Unhurried. Longer.",
    },
    {
      name: "Breakfast + Prepare for Church",
      start: "06:00",
      end: "07:40",
      type: "MEAL",
      notes: "",
    },
    {
      name: "Transition Buffer",
      start: "07:40",
      end: "08:00",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Church / Worship",
      start: "08:00",
      end: "12:00",
      type: "SPIRITUAL",
      notes: "Fixed spiritual anchor.",
    },
    {
      name: "Transition Buffer",
      start: "12:00",
      end: "12:30",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Siesta",
      start: "12:30",
      end: "14:30",
      type: "REST",
      notes: "Sunday is recovery. Protect it completely.",
    },
    {
      name: "Lunch",
      start: "14:30",
      end: "16:00",
      type: "MEAL",
      notes: "",
    },
    {
      name: "Weekly Planning + Personal Reading",
      start: "16:00",
      end: "17:30",
      type: "GROWTH",
      notes: "Review past week. Set 3 priorities for Monday. NON-NEGOTIABLE.",
    },
    {
      name: "Transition Buffer",
      start: "17:30",
      end: "18:00",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Discipleship Class",
      start: "18:00",
      end: "20:00",
      type: "GROWTH",
      notes: "Light review only. Optional if fully caught up.",
    },
    {
      name: "Transition Buffer",
      start: "20:00",
      end: "20:30",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Academic Study",
      start: "20:30",
      end: "22:00",
      type: "GROWTH",
      notes: "Optional — only if genuinely needed.",
    },
    {
      name: "Transition Buffer",
      start: "22:00",
      end: "22:30",
      type: "BUFFER",
      notes: "",
    },
    {
      name: "Night Devotion + Journaling",
      start: "22:30",
      end: "23:20",
      type: "SPIRITUAL",
      notes: "Fixed anchor.",
    },
    {
      name: "Bible Study",
      start: "23:30",
      end: "00:00",
      type: "SPIRITUAL",
      notes: "Fixed.",
    },
  ],
};

/* ============================================================
         SECTION 2: APP STATE
         Central state object. Everything the app needs at runtime.
         ============================================================ */

const STATE = {
  tasks: [], // User's flexible tasks (from localStorage)
  schedule: [], // Today's full schedule (fixed + allocated flexible tasks)
  selectedDay: null, // Which day is shown in the Schedule view (null = today)
  selectedPriority: 5, // Default priority for new task form
  notifPermission: "default", // 'granted' | 'denied' | 'default'
  notifiedIds: new Set(), // Track which notifications we already sent
  rescheduleCount: 0, // How many times tasks were rescheduled today
  lastScheduleDate: null, // The date string for when schedule was last built
};

/* ============================================================
         SECTION 3: UTILITY FUNCTIONS
         Small helpers used throughout the app.
         ============================================================ */

/**
 * Convert "HH:MM" time string to total minutes since midnight.
 * e.g. "08:30" → 510
 */
function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Convert total minutes since midnight back to "HH:MM" string.
 * e.g. 510 → "08:30"
 */
function minutesToTime(mins) {
  // Handle values that cross midnight (e.g. 1440 = 00:00 next day)
  const normalized = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60)
    .toString()
    .padStart(2, "0");
  const m = (normalized % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * Get the current time as total minutes since midnight.
 */
function nowInMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

/**
 * Format minutes duration to human-readable string.
 * e.g. 90 → "1h 30m"
 */
function formatDuration(mins) {
  if (mins <= 0) return "0m";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/**
 * Get today's day of the week (0=Sunday … 6=Saturday).
 */
function todayDayIndex() {
  return new Date().getDay();
}

/**
 * Get the name of a day from its index.
 */
function dayName(idx) {
  return [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][idx];
}

/**
 * Generate a simple unique ID string.
 */
function uid() {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Get today's date as a "YYYY-MM-DD" string (used to detect day change).
 */
function todayDateString() {
  return new Date().toISOString().split("T")[0];
}

/* ============================================================
         SECTION 4: LOCALSTORAGE PERSISTENCE
         Save and load tasks + schedule from localStorage so data
         survives page refreshes.
         ============================================================ */

function saveTasks() {
  localStorage.setItem("pes_tasks", JSON.stringify(STATE.tasks));
}

function loadTasks() {
  try {
    const stored = localStorage.getItem("pes_tasks");
    STATE.tasks = stored ? JSON.parse(stored) : [];
  } catch (e) {
    STATE.tasks = [];
  }
}

function saveSchedule() {
  localStorage.setItem("pes_schedule", JSON.stringify(STATE.schedule));
  localStorage.setItem("pes_schedule_date", todayDateString());
}

function loadSchedule() {
  try {
    const storedDate = localStorage.getItem("pes_schedule_date");
    // Only load stored schedule if it was built today
    if (storedDate === todayDateString()) {
      const stored = localStorage.getItem("pes_schedule");
      STATE.schedule = stored ? JSON.parse(stored) : [];
      STATE.lastScheduleDate = storedDate;
      return true;
    }
  } catch (e) {
    /* fall through */
  }
  return false;
}

/* ============================================================
         SECTION 5: GENERATE TIME BLOCKS
         Looks at today's fixed schedule and finds the FREE GAPS
         where flexible tasks can be inserted.
         Returns array of { startMins, endMins } free slots.
         ============================================================ */

function generateTimeBlocks(dayIndex) {
  const fixedEvents = WEEKLY_TIMETABLE[dayIndex] || [];

  // Sort events by start time
  const sorted = [...fixedEvents].sort(
    (a, b) => timeToMinutes(a.start) - timeToMinutes(b.start),
  );

  const BUFFER_MINS = 15; // minimum gap before/after flex task
  const freeSlots = [];

  // Walk through sorted fixed events and find gaps
  let cursor = timeToMinutes("05:00"); // day starts at 5am

  for (const event of sorted) {
    const evStart = timeToMinutes(event.start);
    const gapSize = evStart - cursor;

    // A gap large enough for at least one buffered flex task?
    if (gapSize >= BUFFER_MINS * 2 + 5) {
      freeSlots.push({
        startMins: cursor + BUFFER_MINS,
        endMins: evStart - BUFFER_MINS,
      });
    }

    const evEnd = timeToMinutes(event.end);
    // Handle events that end past midnight (e.g. "00:00" = 1440)
    cursor = Math.max(cursor, evEnd === 0 ? 1440 : evEnd);
  }

  // Any remaining time after last event until midnight (23:59)
  const dayEnd = 1440;
  if (dayEnd - cursor >= BUFFER_MINS * 2 + 5) {
    freeSlots.push({
      startMins: cursor + BUFFER_MINS,
      endMins: dayEnd - BUFFER_MINS,
    });
  }

  return freeSlots;
}

/* ============================================================
         SECTION 6: ALLOCATE FLEXIBLE TASKS INTO FREE SLOTS
         Takes user's flexible tasks, sorts by priority, then fits
         them into the free gaps identified in generateTimeBlocks().
         Returns array of scheduled flex task objects.
         ============================================================ */

function allocateTasks(freeSlots, tasks) {
  // Sort tasks: highest priority first, then longer duration first
  const sorted = [...tasks].sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return b.duration - a.duration;
  });

  const allocated = [];

  // For each free slot, try to fit as many tasks as possible
  for (const slot of freeSlots) {
    let cursor = slot.startMins;

    for (const task of sorted) {
      // Skip if already scheduled
      if (allocated.find((a) => a.taskId === task.id)) continue;

      const taskEnd = cursor + task.duration;

      // Does this task fit in the remaining slot?
      if (taskEnd <= slot.endMins) {
        allocated.push({
          id: uid(),
          taskId: task.id,
          name: task.title,
          type: task.category || "GROWTH",
          start: minutesToTime(cursor),
          end: minutesToTime(taskEnd),
          startMins: cursor,
          endMins: taskEnd,
          duration: task.duration,
          priority: task.priority,
          notes: `Flexible task — Priority ${task.priority}`,
          isFlexible: true,
          missed: false,
        });
        cursor = taskEnd + 15; // 15 min buffer between flex tasks
      }
    }
  }

  return allocated;
}

/* ============================================================
         SECTION 7: BUILD TODAY'S FULL SCHEDULE
         Combines fixed timetable events with allocated flex tasks,
         sorts everything by start time, and stores in STATE.schedule.
         ============================================================ */

function buildFullSchedule(dayIndex) {
  const fixed = (WEEKLY_TIMETABLE[dayIndex] || []).map((ev) => ({
    id: uid(),
    taskId: null,
    name: ev.name,
    type: ev.type,
    start: ev.start,
    end: ev.end,
    startMins: timeToMinutes(ev.start),
    endMins: ev.end === "00:00" ? 1440 : timeToMinutes(ev.end),
    duration:
      (ev.end === "00:00" ? 1440 : timeToMinutes(ev.end)) -
      timeToMinutes(ev.start),
    notes: ev.notes || "",
    isFlexible: false,
    isFixed: true,
    missed: false,
    isBuffer: ev.type === "BUFFER",
  }));

  const freeSlots = generateTimeBlocks(dayIndex);
  const flexAllocated = allocateTasks(freeSlots, STATE.tasks);

  // Merge and sort
  const full = [...fixed, ...flexAllocated].sort(
    (a, b) => a.startMins - b.startMins,
  );

  STATE.schedule = full;
  STATE.lastScheduleDate = todayDateString();
  saveSchedule();
}

/* ============================================================
         SECTION 8: GET CURRENT TASK (REAL-TIME ENGINE)
         Checks the current time against STATE.schedule and returns
         the currently active event, plus the next upcoming event.
         ============================================================ */

function getCurrentTask() {
  const now = nowInMinutes();

  let current = null;
  let next = null;

  for (let i = 0; i < STATE.schedule.length; i++) {
    const ev = STATE.schedule[i];
    const s = ev.startMins;
    const e = ev.endMins;

    // Is this event currently active?
    if (now >= s && now < e) {
      current = ev;
      // Look ahead for next non-buffer event (or any event)
      for (let j = i + 1; j < STATE.schedule.length; j++) {
        next = STATE.schedule[j];
        break;
      }
      break;
    }

    // If we haven't found a current event yet, check if this is upcoming
    if (now < s && !current) {
      next = ev;
      break;
    }
  }

  return { current, next };
}

/* ============================================================
         SECTION 9: RESCHEDULING ENGINE
         If a flexible task's time has passed and it was never marked
         as done, move it to the next available free slot.
         ============================================================ */

function rescheduleTasks() {
  const now = nowInMinutes();
  let rescheduled = false;
  let rescheduleNames = [];

  // Find missed flexible tasks
  STATE.schedule = STATE.schedule.map((ev) => {
    if (ev.isFlexible && !ev.missed && ev.endMins < now) {
      // Mark as missed (will be rescheduled)
      ev.missed = true;
      rescheduled = true;
      rescheduleNames.push(ev.name);
    }
    return ev;
  });

  if (rescheduled) {
    // Get missed tasks to re-slot
    const missedTasks = STATE.tasks.filter((t) =>
      STATE.schedule.some((s) => s.taskId === t.id && s.missed),
    );

    // Remove old missed allocations
    STATE.schedule = STATE.schedule.filter((ev) => !ev.missed);

    // Re-find free slots from NOW onwards
    const freeSlots = generateTimeBlocks(todayDayIndex()).filter(
      (slot) => slot.endMins > now,
    );

    // Reallocate
    const newSlots = allocateTasks(freeSlots, missedTasks);
    STATE.schedule = [...STATE.schedule, ...newSlots].sort(
      (a, b) => a.startMins - b.startMins,
    );

    STATE.rescheduleCount++;
    saveSchedule();

    // Show alert in UI
    const alertEl = document.getElementById("reschedule-alert");
    const msgEl = document.getElementById("reschedule-msg");
    if (alertEl && msgEl) {
      msgEl.textContent = `⟳ Rescheduled: ${rescheduleNames.join(", ")}`;
      alertEl.classList.remove("hidden");
      setTimeout(() => alertEl.classList.add("hidden"), 6000);
    }
  }
}

/* ============================================================
         SECTION 10: NOTIFICATIONS
         Uses the browser Notification API to alert Opeyemi when
         a task is starting or is 5 minutes away.
         Falls back to alert() if notifications not supported.
         ============================================================ */

function requestNotificationPermission() {
  if (!("Notification" in window)) {
    STATE.notifPermission = "unsupported";
    updateNotifButton();
    return;
  }
  Notification.requestPermission().then((perm) => {
    STATE.notifPermission = perm;
    updateNotifButton();
  });
}

function updateNotifButton() {
  const btn = document.getElementById("notif-btn");
  const icon = document.getElementById("notif-icon");
  const label = document.getElementById("notif-label");
  if (!btn) return;

  if (STATE.notifPermission === "granted") {
    btn.classList.add("granted");
    icon.textContent = "🔔";
    label.textContent = "Alerts On";
  } else if (STATE.notifPermission === "denied") {
    icon.textContent = "🔕";
    label.textContent = "Blocked";
  } else {
    icon.textContent = "🔔";
    label.textContent = "Enable Alerts";
  }
}

/**
 * Main notification trigger — called every minute by the ticker.
 * Checks if any event is starting now or in exactly 5 minutes.
 */
function triggerNotifications() {
  const now = nowInMinutes();

  for (const ev of STATE.schedule) {
    // Skip buffer events — no need to notify for transitions
    if (ev.isBuffer || ev.type === "BUFFER") continue;

    // ── 10-minute warning ──
    const warn10Key = `warn10_${ev.id}`;
    if (ev.startMins - now === 10 && !STATE.notifiedIds.has(warn10Key)) {
      STATE.notifiedIds.add(warn10Key);
      notifyViaServiceWorker(
        `⏰ Up next in 10 min`,
        `${ev.name} — starts at ${ev.start} until ${ev.end}`,
        `pes-warn10-${ev.id}`,
        false,
      );
    }

    // ── 5-minute warning ──
    const warn5Key = `warn5_${ev.id}`;
    if (ev.startMins - now === 5 && !STATE.notifiedIds.has(warn5Key)) {
      STATE.notifiedIds.add(warn5Key);
      notifyViaServiceWorker(
        `⚡ Starting in 5 min`,
        `${ev.name} — get ready. ${ev.notes ? ev.notes : ""}`.trim(),
        `pes-warn5-${ev.id}`,
        false,
      );
    }

    // ── Task start ──
    const startKey = `start_${ev.id}`;
    if (ev.startMins === now && !STATE.notifiedIds.has(startKey)) {
      STATE.notifiedIds.add(startKey);
      const typeEmoji =
        {
          SPIRITUAL: "🙏",
          LECTURE: "📚",
          GROWTH: "💡",
          REST: "😴",
          MEAL: "🍽️",
          BUFFER: "⏸",
          OTHER: "▶",
        }[ev.type] || "▶";
      notifyViaServiceWorker(
        `${typeEmoji} START NOW: ${ev.name}`,
        `Now until ${ev.end} · ${formatDuration(ev.endMins - ev.startMins)}`,
        `pes-start-${ev.id}`,
        ev.type === "LECTURE" || ev.type === "SPIRITUAL",
      );
    }

    // ── Halfway reminder for long blocks (>90 mins) ──
    const halfKey = `half_${ev.id}`;
    const duration = ev.endMins - ev.startMins;
    const halfPoint = ev.startMins + Math.floor(duration / 2);
    if (
      duration >= 90 &&
      now === halfPoint &&
      !STATE.notifiedIds.has(halfKey)
    ) {
      STATE.notifiedIds.add(halfKey);
      notifyViaServiceWorker(
        `⏱ Halfway through`,
        `${ev.name} — ${formatDuration(ev.endMins - now)} remaining`,
        `pes-half-${ev.id}`,
        false,
      );
    }
  }
}

/**
 * Send a notification. Falls back to console if permissions not granted.
 */
function sendNotification(title, body) {
  notifyViaServiceWorker(title, body, "pes-general", false);
}

/* ============================================================
         SECTION 11: UI RENDERING
         Functions that update the DOM based on STATE.
         ============================================================ */

/**
 * Update the sidebar clock (runs every second).
 */
function updateClock() {
  const now = new Date();
  const hh = now.getHours().toString().padStart(2, "0");
  const mm = now.getMinutes().toString().padStart(2, "0");
  const ss = now.getSeconds().toString().padStart(2, "0");

  const timeEl = document.getElementById("sidebar-time");
  const dayEl = document.getElementById("sidebar-day");
  const dateEl = document.getElementById("sidebar-date");

  if (timeEl) timeEl.textContent = `${hh}:${mm}`;
  if (dayEl) dayEl.textContent = dayName(now.getDay()).toUpperCase();
  if (dateEl)
    dateEl.textContent = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
}

/**
 * Apply the correct color class to a type badge element.
 */
function applyBadgeClass(el, type) {
  // Remove all existing badge classes
  el.className = el.className.replace(/badge-\w+/g, "").trim();
  el.classList.add(`badge-${type}`);
  el.textContent = type;
}

/**
 * Update the dashboard hero panel with current task info.
 */
function renderDashboard() {
  const { current, next } = getCurrentTask();
  const now = nowInMinutes();

  // --- Current task ---
  const nameEl = document.getElementById("current-task-name");
  const timeEl = document.getElementById("current-task-time");
  const badgeEl = document.getElementById("current-type-badge");
  const progressEl = document.getElementById("task-progress");
  const elapsedEl = document.getElementById("time-elapsed");
  const remainEl = document.getElementById("time-remaining");

  if (current) {
    nameEl.textContent = current.name;
    timeEl.textContent = `${current.start} – ${current.end === "00:00" ? "00:00" : current.end}`;
    applyBadgeClass(badgeEl, current.type);

    const duration = current.endMins - current.startMins;
    const elapsed = Math.max(0, now - current.startMins);
    const remaining = Math.max(0, current.endMins - now);
    const pct = Math.min(100, (elapsed / duration) * 100);

    progressEl.style.width = `${pct}%`;
    elapsedEl.textContent = `${formatDuration(elapsed)} elapsed`;
    remainEl.textContent = `${formatDuration(remaining)} remaining`;
  } else {
    nameEl.textContent = "No active task";
    timeEl.textContent = "Check the schedule below";
    badgeEl.textContent = "—";
    badgeEl.className = "type-badge";
    progressEl.style.width = "0%";
    elapsedEl.textContent = "—";
    remainEl.textContent = "—";
  }

  // --- Next task ---
  const nextNameEl = document.getElementById("next-task-name");
  const nextTimeEl = document.getElementById("next-task-time");
  const nextBadgeEl = document.getElementById("next-type-badge");
  const nextCountdownEl = document.getElementById("next-countdown");

  if (next) {
    nextNameEl.textContent = next.name;
    nextTimeEl.textContent = `${next.start} – ${next.end}`;
    applyBadgeClass(nextBadgeEl, next.type);

    const minsUntil = next.startMins - now;
    if (minsUntil > 0) {
      nextCountdownEl.textContent = `in ${formatDuration(minsUntil)}`;
    } else {
      nextCountdownEl.textContent = "Starting now";
    }
  } else {
    nextNameEl.textContent = "No more tasks today";
    nextTimeEl.textContent = "";
    nextBadgeEl.textContent = "—";
    nextBadgeEl.className = "type-badge small";
    nextCountdownEl.textContent = "";
  }

  // --- Stats ---
  const now2 = nowInMinutes();
  const flexItems = STATE.schedule.filter((e) => e.isFlexible);
  const done = flexItems.filter((e) => e.endMins < now2).length;
  const pending = flexItems.filter((e) => e.startMins > now2).length;
  const freeSlots = generateTimeBlocks(todayDayIndex());

  document.getElementById("stat-done").textContent = done;
  document.getElementById("stat-pending").textContent = pending;
  document.getElementById("stat-missed").textContent = STATE.rescheduleCount;
  document.getElementById("stat-free").textContent = freeSlots.length;
}

/**
 * Build the color bar style for a schedule item.
 */
function typeColor(type) {
  const map = {
    SPIRITUAL: "var(--spiritual)",
    LECTURE: "var(--lecture)",
    GROWTH: "var(--growth)",
    REST: "var(--rest)",
    MEAL: "var(--meal)",
    BUFFER: "var(--buffer)",
    OTHER: "var(--other)",
  };
  return map[type] || "var(--other)";
}

/**
 * Render the schedule list for a given day index.
 */
function renderScheduleView(dayIndex) {
  const listEl = document.getElementById("schedule-list");
  if (!listEl) return;

  // Which schedule to show?
  let items;
  if (dayIndex === todayDayIndex()) {
    items = STATE.schedule;
  } else {
    // Build a preview for another day (no flex tasks, just fixed)
    items = (WEEKLY_TIMETABLE[dayIndex] || []).map((ev) => ({
      name: ev.name,
      type: ev.type,
      start: ev.start,
      end: ev.end,
      startMins: timeToMinutes(ev.start),
      endMins: ev.end === "00:00" ? 1440 : timeToMinutes(ev.end),
      notes: ev.notes || "",
      isBuffer: ev.type === "BUFFER",
      isFlexible: false,
    }));
  }

  const now = nowInMinutes();
  const isToday = dayIndex === todayDayIndex();

  listEl.innerHTML = items
    .map((ev) => {
      const isCurrent = isToday && now >= ev.startMins && now < ev.endMins;
      const isPast = isToday && ev.endMins < now;
      const isBuffer = ev.isBuffer;

      return `
            <div class="sched-item ${isCurrent ? "is-current" : ""} ${isPast ? "is-past" : ""} ${isBuffer ? "is-buffer" : ""}">
              <div class="sched-color-bar" style="background:${typeColor(ev.type)}"></div>
              <div class="sched-time-col">
                <div class="sched-time-start">${ev.start}</div>
                <div class="sched-time-end">${ev.end}</div>
              </div>
              <div class="sched-body">
                <div>
                  <div class="sched-task-name">${ev.name}</div>
                  ${ev.notes ? `<span class="sched-notes">${ev.notes}</span>` : ""}
                </div>
                <div class="sched-duration">${formatDuration(ev.endMins - ev.startMins)}</div>
                <div class="type-badge small badge-${ev.type}">${ev.type}</div>
              </div>
            </div>
          `;
    })
    .join("");

  // Scroll current item into view
  const currentEl = listEl.querySelector(".is-current");
  if (currentEl) {
    currentEl.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

/**
 * Render the day tabs in the schedule view.
 */
function renderDayTabs(activeDay) {
  const tabsEl = document.getElementById("day-tabs");
  if (!tabsEl) return;

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = todayDayIndex();

  tabsEl.innerHTML = days
    .map(
      (d, i) => `
          <button class="day-tab ${i === activeDay ? "active" : ""}" onclick="selectDay(${i})">
            ${d}${i === today ? " ◈" : ""}
          </button>
        `,
    )
    .join("");
}

/**
 * Render the flexible task list in the Tasks view.
 */
function renderTaskList() {
  const listEl = document.getElementById("task-list");
  if (!listEl) return;

  if (STATE.tasks.length === 0) {
    listEl.innerHTML = `<div class="empty-state">No flexible tasks yet. Add one above.</div>`;
    return;
  }

  listEl.innerHTML = STATE.tasks
    .sort((a, b) => b.priority - a.priority)
    .map(
      (task) => `
            <div class="task-item">
              <div class="task-pri" data-pri="${task.priority}">${task.priority}</div>
              <div class="task-body">
                <div class="task-name">${task.title}</div>
                <div class="task-meta">${formatDuration(task.duration)} · ${task.category}</div>
              </div>
              <button class="task-delete" onclick="deleteTask('${task.id}')" title="Delete task">✕</button>
            </div>
          `,
    )
    .join("");
}

/* ============================================================
         SECTION 12: USER INTERACTIONS
         Functions triggered by user actions in the UI.
         ============================================================ */

/**
 * Switch between dashboard, schedule, and tasks views.
 */
function switchView(viewId) {
  document
    .querySelectorAll(".view")
    .forEach((v) => v.classList.remove("active"));
  document
    .querySelectorAll(".nav-btn")
    .forEach((b) => b.classList.remove("active"));

  const viewEl = document.getElementById(`view-${viewId}`);
  const navEl = document.querySelector(`[data-view="${viewId}"]`);

  if (viewEl) viewEl.classList.add("active");
  if (navEl) navEl.classList.add("active");

  if (viewId === "schedule") {
    const activeDay = STATE.selectedDay ?? todayDayIndex();
    STATE.selectedDay = activeDay;
    renderDayTabs(activeDay);
    renderScheduleView(activeDay);
  }
  if (viewId === "tasks") renderTaskList();
  if (viewId === "study") renderStudyView();
  if (viewId === "today") renderTodayView();
}

/**
 * Select a day tab in the schedule view.
 */
function selectDay(dayIndex) {
  STATE.selectedDay = dayIndex;
  renderDayTabs(dayIndex);
  renderScheduleView(dayIndex);
}

/**
 * Set the priority for the new task form.
 */
function setPriority(pri) {
  STATE.selectedPriority = pri;
  document.querySelectorAll(".pri-btn").forEach((btn) => {
    btn.classList.toggle("active", parseInt(btn.dataset.pri) === pri);
  });
}

/**
 * Add a new flexible task from the form inputs.
 */
function addTask() {
  const titleInput = document.getElementById("task-title");
  const durationInput = document.getElementById("task-duration");
  const categoryInput = document.getElementById("task-category");
  const errorEl = document.getElementById("form-error");

  const title = titleInput.value.trim();
  const duration = parseInt(durationInput.value);
  const category = categoryInput.value;

  // Validate
  if (!title || !duration || duration < 5) {
    errorEl.classList.remove("hidden");
    return;
  }
  errorEl.classList.add("hidden");

  // Create task object
  const task = {
    id: uid(),
    title,
    duration,
    priority: STATE.selectedPriority,
    category,
    createdAt: Date.now(),
  };

  STATE.tasks.push(task);
  saveTasks();

  // Clear form
  titleInput.value = "";
  durationInput.value = "";

  // Re-render task list
  renderTaskList();

  // Show confirmation
  const btn = document.querySelector(".add-task-btn");
  const orig = btn.textContent;
  btn.textContent = "✓ Task Added!";
  setTimeout(() => {
    btn.textContent = orig;
  }, 1500);
}

/**
 * Delete a task by ID.
 */
function deleteTask(taskId) {
  STATE.tasks = STATE.tasks.filter((t) => t.id !== taskId);
  saveTasks();
  renderTaskList();
}

/**
 * Regenerate today's schedule after adding/removing tasks.
 */
function regenerateSchedule() {
  buildFullSchedule(todayDayIndex());

  const btn = document.querySelector(".regen-btn");
  const orig = btn.textContent;
  btn.textContent = "✓ Schedule Updated!";
  setTimeout(() => {
    btn.textContent = orig;
  }, 2000);

  // Refresh dashboard too
  renderDashboard();

  // If schedule view is open, refresh it
  const schedView = document.getElementById("view-schedule");
  if (schedView && schedView.classList.contains("active")) {
    renderScheduleView(STATE.selectedDay ?? todayDayIndex());
  }
}

/* ============================================================
         SECTION 13: MAIN TICK FUNCTION
         Called every minute. This is the heartbeat of the app.
         It: checks for rescheduling, triggers notifications,
         and updates the dashboard.
         ============================================================ */

function tick() {
  // Check if it's a new day — rebuild schedule if so
  if (STATE.lastScheduleDate !== todayDateString()) {
    buildFullSchedule(todayDayIndex());
  }

  // Run rescheduling check for missed flexible tasks
  rescheduleTasks();

  // Fire any due notifications
  triggerNotifications();

  // Update dashboard if it's visible
  const dashView = document.getElementById("view-dashboard");
  if (dashView && dashView.classList.contains("active")) {
    renderDashboard();
  }

  // Update schedule view if open and showing today
  const schedView = document.getElementById("view-schedule");
  if (schedView && schedView.classList.contains("active")) {
    if (STATE.selectedDay === null || STATE.selectedDay === todayDayIndex()) {
      renderScheduleView(todayDayIndex());
    }
  }
}

/* ============================================================
         SECTION 14: ADAPTIVE STUDY & PRIORITY TRACKING SYSTEM
         Data model, priority engine, CRUD, board drag-drop,
         Today view, and dashboard widget integration.
         ============================================================ */

/* ---- 14A: STUDY STATE ---- */

// Extend STATE with study-specific properties
STATE.studyItems = []; // All study items
STATE.studyDifficulty = 3; // Selected difficulty in add form
STATE.studyViewMode = "table"; // 'table' | 'board'
STATE.draggedStudyId = null; // For drag-and-drop

/* ---- 14B: STUDY LOCALSTORAGE ---- */

function saveStudyItems() {
  localStorage.setItem("pes_study_items", JSON.stringify(STATE.studyItems));
}

function loadStudyItems() {
  try {
    const stored = localStorage.getItem("pes_study_items");
    STATE.studyItems = stored ? JSON.parse(stored) : [];
  } catch (e) {
    STATE.studyItems = [];
  }
}

/* ---- 14C: PRIORITY ENGINE ---- */
/**
 * sortStudyItems(items)
 * Deterministic sort — no visible scores, no formulas.
 * Rule order:
 *   1. Status: Not Started > In Progress > Completed
 *   2. Deadline: has deadline > no deadline; earlier > later
 *   3. Difficulty: higher > lower
 */
function sortStudyItems(items) {
  const statusRank = { "Not Started": 0, "In Progress": 1, Completed: 2 };

  return [...items].sort((a, b) => {
    // 1. Status
    const sr = statusRank[a.status] - statusRank[b.status];
    if (sr !== 0) return sr;

    // 2. Deadline
    const aHas = !!a.deadline;
    const bHas = !!b.deadline;
    if (aHas && !bHas) return -1;
    if (!aHas && bHas) return 1;
    if (aHas && bHas) {
      const diff = new Date(a.deadline) - new Date(b.deadline);
      if (diff !== 0) return diff;
    }

    // 3. Difficulty
    return b.difficulty - a.difficulty;
  });
}

/* ---- 14D: DEADLINE HELPERS ---- */

/**
 * Returns days until deadline. Negative = overdue.
 */
function daysUntilDeadline(deadlineStr) {
  if (!deadlineStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dl = new Date(deadlineStr);
  dl.setHours(0, 0, 0, 0);
  return Math.round((dl - today) / (1000 * 60 * 60 * 24));
}

/**
 * Build a deadline badge HTML string.
 */
function deadlineBadgeHTML(deadlineStr) {
  if (!deadlineStr) return '<span class="deadline-badge">No deadline</span>';
  const days = daysUntilDeadline(deadlineStr);
  let cls = "due-ok";
  let label = "";
  if (days < 0) {
    cls = "overdue";
    label = `${Math.abs(days)}d overdue`;
  } else if (days === 0) {
    cls = "due-soon";
    label = "Due today";
  } else if (days <= 3) {
    cls = "due-soon";
    label = `${days}d left`;
  } else {
    cls = "due-ok";
    label = deadlineStr;
  }
  return `<span class="deadline-badge ${cls}">📅 ${label}</span>`;
}

/**
 * Build difficulty badge HTML.
 */
function diffBadgeHTML(d) {
  const labels = ["", "●○○○○", "●●○○○", "●●●○○", "●●●●○", "●●●●●"];
  return `<span class="diff-badge diff-${d}">${labels[d] || d}</span>`;
}

/**
 * Build status badge HTML. Clicking cycles to next status.
 */
function statusBadgeHTML(item) {
  const map = {
    "Not Started": { cls: "status-NS", label: "Not Started" },
    "In Progress": { cls: "status-IP", label: "In Progress" },
    Completed: { cls: "status-DONE", label: "Completed" },
  };
  const s = map[item.status] || map["Not Started"];
  return `<span class="status-badge ${s.cls}" onclick="cycleStudyStatus('${item.id}')" title="Click to advance status">${s.label}</span>`;
}

/* ---- 14E: CRUD ---- */

/**
 * Set difficulty in the add-form.
 */
function setStudyDifficulty(d) {
  STATE.studyDifficulty = d;
  document.querySelectorAll("#si-diff-selector .pri-btn").forEach((btn) => {
    btn.classList.toggle("active", parseInt(btn.dataset.diff) === d);
  });
}

/**
 * Add a new study item from the form.
 */
function addStudyItem() {
  const course = document.getElementById("si-course").value;
  const type = document.getElementById("si-type").value;
  const deadline = document.getElementById("si-deadline").value || null;

  if (!course) return;

  const item = {
    id: uid(),
    course,
    type,
    deadline,
    difficulty: STATE.studyDifficulty,
    status: "Not Started",
    createdAt: Date.now(),
  };

  STATE.studyItems.push(item);
  saveStudyItems();

  // Clear form fields (keep course/type selected for fast repeat entry)
  document.getElementById("si-deadline").value = "";

  // Re-render
  renderStudyView();
  renderStudyFocusWidget();

  // Flash confirm
  const btn = document.querySelector(".study-add-form .add-task-btn");
  const orig = btn.textContent;
  btn.textContent = "✓ Added!";
  setTimeout(() => {
    btn.textContent = orig;
  }, 1200);
}

/**
 * Delete a study item by ID.
 */
function deleteStudyItem(id) {
  STATE.studyItems = STATE.studyItems.filter((i) => i.id !== id);
  saveStudyItems();
  renderStudyView();
  renderStudyFocusWidget();
  renderTodayView();
}

/**
 * Cycle status: Not Started → In Progress → Completed → Not Started
 * Enforces clean transitions and warns about too many In Progress.
 */
function cycleStudyStatus(id) {
  const item = STATE.studyItems.find((i) => i.id === id);
  if (!item) return;

  const flow = ["Not Started", "In Progress", "Completed"];
  const idx = flow.indexOf(item.status);
  const next = flow[(idx + 1) % flow.length];

  // Warn if trying to move too many to In Progress (threshold: 3)
  if (next === "In Progress") {
    const inProgressCount = STATE.studyItems.filter(
      (i) => i.id !== id && i.status === "In Progress",
    ).length;
    if (inProgressCount >= 3) {
      // Show visual warning but still allow it
      const warn = document.getElementById("in-progress-warn");
      if (warn) {
        warn.classList.remove("hidden");
        setTimeout(() => warn.classList.add("hidden"), 3000);
      }
    }
  }

  item.status = next;
  saveStudyItems();
  renderStudyView();
  renderStudyFocusWidget();
  renderTodayView();
}

/**
 * Update a study item's deadline inline and re-sort.
 */
function updateStudyDeadline(id, newDeadline) {
  const item = STATE.studyItems.find((i) => i.id === id);
  if (!item) return;

  item.deadline = newDeadline || null;
  saveStudyItems();
  renderStudyView();
  renderStudyFocusWidget();
  renderTodayView();
}

/* ---- 14F: STUDY VIEW TOGGLE ---- */

function setStudyView(mode) {
  STATE.studyViewMode = mode;

  document
    .getElementById("svt-table")
    .classList.toggle("active", mode === "table");
  document
    .getElementById("svt-board")
    .classList.toggle("active", mode === "board");
  document.getElementById("study-table-view").style.display =
    mode === "table" ? "block" : "none";
  document.getElementById("study-board-view").style.display =
    mode === "board" ? "block" : "none";

  renderStudyView();
}

/* ---- 14G: RENDER STUDY TABLE ---- */

function renderStudyTable() {
  const container = document.getElementById("study-table-container");
  if (!container) return;

  const sorted = sortStudyItems(STATE.studyItems);

  if (sorted.length === 0) {
    container.innerHTML = `<div class="study-table-empty">No study items yet. Add your first item above.</div>`;
    return;
  }

  // On small screens render cards instead of a cramped table
  const isMobile = window.innerWidth <= 600;

  if (isMobile) {
    container.innerHTML = `
            <div class="study-card-list">
              ${sorted
                .map((item, idx) => {
                  const isCompleted = item.status === "Completed";
                  return `
                  <div class="study-card ${isCompleted ? "card-completed" : ""}">
                    <div class="study-card-top">
                      <span class="study-card-rank">#${idx + 1}</span>
                      <span class="study-card-course">${item.course}</span>
                      ${statusBadgeHTML(item)}
                      <button class="tbl-delete-btn" onclick="deleteStudyItem('${item.id}')" title="Delete">✕</button>
                    </div>
                    <div class="study-card-type">${item.type}</div>
                    <div class="study-card-meta">
                      ${diffBadgeHTML(item.difficulty)}
                      ${item.deadline ? deadlineBadgeHTML(item.deadline) : '<span class="deadline-badge">No deadline</span>'}
                    </div>
                    <div class="study-card-deadline">
                      <input
                        type="date"
                        class="deadline-input-inline"
                        value="${item.deadline || ""}"
                        onchange="updateStudyDeadline('${item.id}', this.value)"
                        title="Set or change deadline"
                        style="width:100%;max-width:100%;"
                      />
                    </div>
                    <div class="study-card-actions">
                      <button class="tbl-action-btn" onclick="cycleStudyStatus('${item.id}')">→ Advance Status</button>
                    </div>
                  </div>
                `;
                })
                .join("")}
            </div>
          `;
  } else {
    const rows = sorted
      .map((item, idx) => {
        const isCompleted = item.status === "Completed";
        return `
              <tr class="${isCompleted ? "row-completed" : ""}">
                <td class="study-table-rank">#${idx + 1}</td>
                <td class="study-table-course">${item.course}</td>
                <td><div class="study-table-name">${item.type}</div></td>
                <td>
                  <input
                    type="date"
                    class="deadline-input-inline"
                    value="${item.deadline || ""}"
                    onchange="updateStudyDeadline('${item.id}', this.value)"
                    title="Change deadline to reschedule"
                  />
                  ${item.deadline ? deadlineBadgeHTML(item.deadline) : ""}
                </td>
                <td>${diffBadgeHTML(item.difficulty)}</td>
                <td>${statusBadgeHTML(item)}</td>
                <td>
                  <div class="study-table-actions">
                    <button class="tbl-action-btn" onclick="cycleStudyStatus('${item.id}')">→ Advance</button>
                    <button class="tbl-delete-btn" onclick="deleteStudyItem('${item.id}')" title="Delete">✕</button>
                  </div>
                </td>
              </tr>
            `;
      })
      .join("");

    container.innerHTML = `
            <table class="study-table">
              <thead>
                <tr>
                  <th>#</th><th>Course</th><th>Type</th>
                  <th>Deadline</th><th>Difficulty</th>
                  <th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          `;
  }
}

/* ---- 14H: RENDER STUDY BOARD ---- */

/* ---- 14H: RENDER STUDY BOARD ---- */

function renderStudyBoard() {
  const groups = {
    "Not Started": [],
    "In Progress": [],
    Completed: [],
  };

  const sorted = sortStudyItems(STATE.studyItems);
  sorted.forEach((item) => {
    if (groups[item.status]) groups[item.status].push(item);
  });

  const colIds = {
    "Not Started": "bcol-ns",
    "In Progress": "bcol-ip",
    Completed: "bcol-done",
  };

  const countIds = {
    "Not Started": "bcount-ns",
    "In Progress": "bcount-ip",
    Completed: "bcount-done",
  };

  for (const [status, items] of Object.entries(groups)) {
    const colEl = document.getElementById(colIds[status]);
    const countEl = document.getElementById(countIds[status]);
    if (!colEl) continue;

    countEl.textContent = items.length;

    colEl.innerHTML =
      items.length === 0
        ? `<div style="color:var(--text-muted);font-size:0.75rem;text-align:center;padding:1rem;">Empty</div>`
        : items
            .map(
              (item) => `
                <div
                  class="board-card"
                  draggable="true"
                  data-id="${item.id}"
                  ondragstart="boardDragStart(event,'${item.id}')"
                  ondragend="boardDragEnd(event)"
                >
                  <div class="board-card-course">${item.course}</div>
                  <div class="board-card-name">${item.type}</div>
                  <div class="board-card-meta">
                    ${diffBadgeHTML(item.difficulty)}
                    ${item.deadline ? deadlineBadgeHTML(item.deadline) : ""}
                  </div>
                </div>
              `,
            )
            .join("");
  }

  // Warn if too many In Progress
  const warn = document.getElementById("in-progress-warn");
  if (warn) {
    const ipCount = groups["In Progress"].length;
    warn.classList.toggle("hidden", ipCount < 4);
  }
}

/* ---- 14I: DRAG AND DROP (Board) ---- */
// Drag-and-drop only changes STATUS — never priority.
// Priority is always computed by the engine.

function boardDragStart(event, id) {
  STATE.draggedStudyId = id;
  event.target.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
}

function boardDragEnd(event) {
  event.target.classList.remove("dragging");
  STATE.draggedStudyId = null;
}

function boardDrop(event, newStatus) {
  event.preventDefault();
  const id = STATE.draggedStudyId;
  if (!id) return;

  const item = STATE.studyItems.find((i) => i.id === id);
  if (!item || item.status === newStatus) return;

  // Enforce clean status flow when dragging
  const flow = ["Not Started", "In Progress", "Completed"];
  const fromIdx = flow.indexOf(item.status);
  const toIdx = flow.indexOf(newStatus);

  // Allow any direction (user is in control via board)
  item.status = newStatus;
  saveStudyItems();

  // Warn if too many In Progress after drop
  if (newStatus === "In Progress") {
    const ipCount = STATE.studyItems.filter(
      (i) => i.status === "In Progress",
    ).length;
    if (ipCount > 3) {
      const warn = document.getElementById("in-progress-warn");
      if (warn) {
        warn.classList.remove("hidden");
        setTimeout(() => warn.classList.add("hidden"), 3000);
      }
    }
  }

  renderStudyBoard();
  renderStudyFocusWidget();
  renderTodayView();
}

/* ---- 14J: MASTER RENDER STUDY VIEW ---- */

function renderStudyView() {
  if (STATE.studyViewMode === "table") {
    renderStudyTable();
  } else {
    renderStudyBoard();
  }
}

/* ---- 14K: DASHBOARD FOCUS WIDGET ---- */
/**
 * Shows top 1-3 non-completed study items on the dashboard.
 */
function renderStudyFocusWidget() {
  const currentEl = document.getElementById("sfw-current");
  const nextEl = document.getElementById("sfw-next");
  if (!currentEl) return;

  const active = sortStudyItems(
    STATE.studyItems.filter((i) => i.status !== "Completed"),
  );

  if (active.length === 0) {
    currentEl.innerHTML = `<div class="sfw-empty">No pending study tasks. All clear — or add some in Study tab.</div>`;
    if (nextEl) nextEl.innerHTML = "";
    return;
  }

  // Current focus = top item
  const top = active[0];
  currentEl.innerHTML = `
          <div class="sfw-course-tag">${top.course} · ${top.type}</div>
          <div class="sfw-item-name">${top.course} ${top.type}</div>
          <div class="sfw-meta">
            ${diffBadgeHTML(top.difficulty)}
            ${statusBadgeHTML(top)}
            ${top.deadline ? deadlineBadgeHTML(top.deadline) : ""}
          </div>
        `;

  // Next chips = items 2 and 3
  if (nextEl) {
    const upcoming = active.slice(1, 3);
    nextEl.innerHTML = upcoming
      .map(
        (item) => `
            <div class="sfw-next-chip">
              <strong>${item.course}</strong> ${item.type}
              ${item.deadline ? `· ${deadlineBadgeHTML(item.deadline)}` : ""}
            </div>
          `,
      )
      .join("");
  }
}

/* ---- 14L: TODAY VIEW (Daily Battlefield) ---- */
/**
 * Filters study items to show:
 * - status ≠ Completed AND
 * - (deadline within 3 days OR no deadline but difficulty ≥ 4)
 * Sorted by priority engine.
 */
function renderTodayView() {
  const focusContent = document.getElementById("today-focus-content");
  const todayList = document.getElementById("today-list");
  const todaySlotsEl = document.getElementById("today-slots");
  if (!todayList) return;

  const now = nowInMinutes();

  /* ── 1. CURRENT FOCUS ─────────────────────────────────────
           Show whatever is happening RIGHT NOW from the live schedule.
           If nothing is active, show the next upcoming timetable event. */
  if (focusContent) {
    const { current, next } = getCurrentTask();
    const active = current || next;

    if (!active) {
      focusContent.innerHTML = `<div class="sfw-empty">No more scheduled tasks today. Rest up.</div>`;
    } else {
      const isCurrent = !!current;
      const minsLeft = active.endMins - now;
      focusContent.innerHTML = `
              <div class="sfw-course-tag" style="color:${isCurrent ? "var(--accent)" : "var(--text-dim)"}">
                ${isCurrent ? "▶ RIGHT NOW" : "⏭ UP NEXT"}
              </div>
              <div class="sfw-item-name" style="font-size:1.15rem;font-weight:800;margin:0.3rem 0;">
                ${active.name}
              </div>
              <div class="sfw-meta">
                <div class="type-badge small badge-${active.type}">${active.type}</div>
                <span style="font-family:'Space Mono',monospace;font-size:0.75rem;color:var(--text-dim);">
                  ${active.start} – ${active.end}
                </span>
                ${
                  isCurrent
                    ? `<span style="font-family:'Space Mono',monospace;font-size:0.75rem;color:var(--accent);font-weight:700;">${formatDuration(minsLeft)} left</span>`
                    : `<span style="font-family:'Space Mono',monospace;font-size:0.75rem;color:var(--growth);font-weight:700;">in ${formatDuration(active.startMins - now)}</span>`
                }
              </div>
            `;
    }
  }

  /* ── 2. MUST DO TODAY LIST ────────────────────────────────
           Combines:
           A) Remaining timetable events for today (not past, not buffers)
           B) Study tracker items that are urgent or high priority       */

  // A — upcoming timetable events (non-buffer, not yet passed)
  const upcomingSchedule = STATE.schedule
    .filter((ev) => ev.endMins > now && !ev.isBuffer && ev.type !== "BUFFER")
    .slice(0, 6); // cap at 6 so it doesn't flood

  // B — urgent study items
  const urgentStudy = sortStudyItems(
    STATE.studyItems.filter((item) => {
      if (item.status === "Completed") return false;
      if (item.difficulty >= 4) return true;
      if (item.deadline) return daysUntilDeadline(item.deadline) <= 3;
      return false;
    }),
  );

  // Build combined list
  const scheduleRows = upcomingSchedule
    .map((ev, idx) => {
      const isCurrent = now >= ev.startMins && now < ev.endMins;
      return `
            <div class="today-item ${isCurrent ? "is-top" : ""}" style="${isCurrent ? "" : "opacity:0.85"}">
              <div class="today-item-rank" style="color:${isCurrent ? "var(--accent)" : "var(--text-muted)"}">
                ${isCurrent ? "▶" : String(idx + 1).padStart(2, "0")}
              </div>
              <div class="today-item-body">
                <div class="today-item-name">${ev.name}</div>
                <div class="today-item-meta">
                  <div class="type-badge small badge-${ev.type}">${ev.type}</div>
                  <span style="font-family:'Space Mono',monospace;font-size:0.68rem;color:var(--text-dim);">
                    ${ev.start} – ${ev.end}
                  </span>
                  ${
                    isCurrent
                      ? `<span style="font-family:'Space Mono',monospace;font-size:0.68rem;color:var(--accent);font-weight:700;">${formatDuration(ev.endMins - now)} left</span>`
                      : `<span style="font-family:'Space Mono',monospace;font-size:0.68rem;color:var(--text-dim);">in ${formatDuration(ev.startMins - now)}</span>`
                  }
                </div>
              </div>
            </div>
          `;
    })
    .join("");

  const studyRows = urgentStudy
    .map(
      (item, idx) => `
          <div class="today-item ${item.atRisk ? "at-risk" : ""}">
            <div class="today-item-rank" style="color:var(--rest);">S${idx + 1}</div>
            <div class="today-item-body">
              <div class="today-item-name">
                ${item.course} — ${item.type}
                ${item.atRisk ? '<span class="at-risk-badge">AT RISK</span>' : ""}
                ${item.pinned ? '<span class="pinned-badge">PINNED</span>' : ""}
              </div>
              <div class="today-item-meta">
                ${diffBadgeHTML(item.difficulty)}
                ${statusBadgeHTML(item)}
                ${item.deadline ? deadlineBadgeHTML(item.deadline) : ""}
              </div>
            </div>
            <button class="tbl-delete-btn" onclick="deleteStudyItem('${item.id}')" title="Remove">✕</button>
          </div>
        `,
    )
    .join("");

  if (!scheduleRows && !studyRows) {
    todayList.innerHTML = `<div class="today-empty">Nothing left for today. You're done — or nothing's been added yet.</div>`;
  } else {
    // Section dividers
    const scheduleSection = scheduleRows
      ? `<div class="tasks-section-title" style="margin:0.75rem 0 0.5rem;">TODAY'S TIMETABLE</div>${scheduleRows}`
      : "";
    const studySection = studyRows
      ? `<div class="tasks-section-title" style="margin:1rem 0 0.5rem;color:var(--rest);">STUDY PRIORITIES</div>${studyRows}`
      : "";
    todayList.innerHTML = scheduleSection + studySection;
  }

  /* ── 3. RECOMMENDED STUDY SLOTS ──────────────────────────
           Show upcoming GROWTH blocks from the schedule and map
           the top study priority onto each one. */
  if (todaySlotsEl) {
    const studySlots = STATE.schedule
      .filter(
        (ev) => ev.type === "GROWTH" && ev.startMins > now && !ev.isBuffer,
      )
      .slice(0, 3);

    if (studySlots.length === 0) {
      todaySlotsEl.innerHTML = `<div class="today-empty">No upcoming study slots remaining today.</div>`;
    } else {
      todaySlotsEl.innerHTML = studySlots
        .map((slot, i) => {
          const matchItem = urgentStudy[i] || urgentStudy[0];
          return `
                <div class="slot-item">
                  <div class="slot-time">${slot.start} – ${slot.end}</div>
                  <div class="slot-suggestion">
                    <span>${slot.name}</span>
                    ${
                      matchItem
                        ? ` → <strong style="color:var(--text);margin-left:2px;">${matchItem.course} ${matchItem.type}</strong> ${diffBadgeHTML(matchItem.difficulty)}`
                        : " — free study slot"
                    }
                  </div>
                </div>
              `;
        })
        .join("");
    }
  }
}

/* ============================================================
         SECTION 15: INITIALISATION
         ============================================================ */

function init() {
  // 1. Load saved tasks + study items from localStorage
  loadTasks();
  loadStudyItems();

  // 2. Load or build today's schedule
  const scheduleLoaded = loadSchedule();
  if (!scheduleLoaded || STATE.schedule.length === 0) {
    buildFullSchedule(todayDayIndex());
  }

  // 3. Check notification permission state
  if ("Notification" in window) {
    STATE.notifPermission = Notification.permission;
    updateNotifButton();
  }

  // 4. Render the initial dashboard + study widget
  renderDashboard();
  renderTaskList();
  renderStudyFocusWidget();

  // 5. Start the clock (every second for visual clock)
  updateClock();
  setInterval(updateClock, 1000);

  // 6. Start the main ticker (every 60 seconds for logic)
  tick(); // immediate first run
  setInterval(tick, 60 * 1000);

  // 7. Request notification permission if not yet decided
  if (STATE.notifPermission === "default") {
    setTimeout(() => {
      // Wait 3 seconds before asking (less intrusive)
      requestNotificationPermission();
    }, 3000);
  }

  console.log("[PES] Initialised. Schedule items:", STATE.schedule.length);
  console.log("[PES] Today:", dayName(todayDayIndex()));
}

// Boot the app when DOM is ready
document.addEventListener("DOMContentLoaded", init);

// Re-render study table when screen is resized/rotated
// so it switches between table and card layout at the right breakpoint
window.addEventListener("resize", () => {
  const studyView = document.getElementById("view-study");
  if (
    studyView &&
    studyView.classList.contains("active") &&
    STATE.studyViewMode === "table"
  ) {
    renderStudyTable();
  }
});

/* ============================================================
         SECTION 16: PWA — SERVICE WORKER + INSTALL PROMPT
      ============================================================ */

let deferredInstallPrompt = null;

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker
    .register("./sw.js")
    .then((reg) => {
      console.log("[PES] SW registered:", reg.scope);
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "SNOOZE") handleNotificationSnooze();
        if (event.data?.type === "FOCUS_TASK") switchView("dashboard");
      });
    })
    .catch((err) => console.warn("[PES] SW failed:", err));
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  if (!localStorage.getItem("pes_install_dismissed")) {
    setTimeout(() => {
      document.getElementById("pwa-install-banner").classList.remove("hidden");
    }, 3000);
  }
});

function triggerPWAInstall() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  deferredInstallPrompt.userChoice.then((choice) => {
    if (choice.outcome === "accepted") dismissInstallBanner();
    deferredInstallPrompt = null;
  });
}

function dismissInstallBanner() {
  document.getElementById("pwa-install-banner").classList.add("hidden");
  localStorage.setItem("pes_install_dismissed", "1");
}

/* ============================================================
         SECTION 17: STRICT EXECUTION RULES ENGINE
      ============================================================ */

const OVERRIDE_STATE = {
  pendingItemId: null,
  blockedByItemId: null,
  selectedReason: null,
  snoozedUntil: null,
};

function checkStrictRules(targetItemId) {
  const target = STATE.studyItems.find((i) => i.id === targetItemId);
  if (!target) return true;

  const inProgress = STATE.studyItems.filter((i) => i.status === "In Progress");

  if (inProgress.length >= 1) {
    if (inProgress[0].id === targetItemId) return true;
    const sorted = sortStudyItems(
      STATE.studyItems.filter((i) => i.status !== "Completed"),
    );
    const topItem = sorted[0];
    if (topItem && topItem.id === targetItemId) return true;
    triggerOverrideModal(targetItemId, inProgress[0].id);
    return false;
  }

  const sorted = sortStudyItems(
    STATE.studyItems.filter(
      (i) => i.status !== "Completed" && i.id !== targetItemId,
    ),
  );

  if (sorted.length > 0 && sorted[0].id !== targetItemId && !target.pinned) {
    triggerOverrideModal(targetItemId, sorted[0].id);
    return false;
  }

  return true;
}

function triggerOverrideModal(targetId, blockedById) {
  OVERRIDE_STATE.pendingItemId = targetId;
  OVERRIDE_STATE.blockedByItemId = blockedById;
  OVERRIDE_STATE.selectedReason = null;

  const blocked = STATE.studyItems.find((i) => i.id === blockedById);
  document.getElementById("override-blocked-name").textContent = blocked
    ? `${blocked.course} — ${blocked.type}`
    : "Higher-priority task";

  document
    .querySelectorAll(".override-reason-btn")
    .forEach((b) => b.classList.remove("selected"));
  document.getElementById("override-other-text").classList.remove("visible");
  document.getElementById("override-other-text").value = "";
  document.getElementById("override-confirm-btn").classList.remove("ready");
  document.getElementById("override-overlay").classList.remove("hidden");
}

function selectOverrideReason(btn) {
  document
    .querySelectorAll(".override-reason-btn")
    .forEach((b) => b.classList.remove("selected"));
  btn.classList.add("selected");
  OVERRIDE_STATE.selectedReason = btn.dataset.reason;

  const otherInput = document.getElementById("override-other-text");
  if (btn.dataset.reason === "Other") {
    otherInput.classList.add("visible");
    otherInput.focus();
    document.getElementById("override-confirm-btn").classList.remove("ready");
  } else {
    otherInput.classList.remove("visible");
    document.getElementById("override-confirm-btn").classList.add("ready");
  }
}

function onOverrideOtherInput() {
  const val = document.getElementById("override-other-text").value.trim();
  OVERRIDE_STATE.selectedReason = val || null;
  document
    .getElementById("override-confirm-btn")
    .classList.toggle("ready", val.length > 0);
}

function cancelOverride() {
  OVERRIDE_STATE.pendingItemId = null;
  OVERRIDE_STATE.blockedByItemId = null;
  OVERRIDE_STATE.selectedReason = null;
  document.getElementById("override-overlay").classList.add("hidden");
}

function confirmOverride() {
  if (!OVERRIDE_STATE.selectedReason) return;

  const targetId = OVERRIDE_STATE.pendingItemId;
  const blockedId = OVERRIDE_STATE.blockedByItemId;

  const target = STATE.studyItems.find((i) => i.id === targetId);
  if (target) {
    target.pinned = true;
    target.status = "In Progress";
  }

  const blocked = STATE.studyItems.find((i) => i.id === blockedId);
  if (blocked) {
    blocked.atRisk = true;
    blocked.priority = Math.min(5, (blocked.priority || 3) + 1);
    blocked.interruptAt = Date.now() + 20 * 60 * 1000;
  }

  const log = JSON.parse(localStorage.getItem("pes_overrides") || "[]");
  log.push({
    ts: Date.now(),
    targetId,
    blockedId,
    reason: OVERRIDE_STATE.selectedReason,
  });
  localStorage.setItem("pes_overrides", JSON.stringify(log));

  saveStudyItems();
  cancelOverride();

  renderStudyView();
  renderStudyFocusWidget();
  renderTodayView();
  renderDashboard();

  notifyViaServiceWorker(
    "⚠️ Task Flagged At Risk",
    `${blocked?.course || "A task"} was overridden. It will interrupt in 20 min.`,
    "pes-atrisk",
    false,
  );
}

/* ============================================================
         SECTION 18: ACTIVE NOTIFICATION ENGINE (PWA)
      ============================================================ */

let reminderInterval = null;
let taskTimerInterval = null;
let taskTimerStart = null;

function notifyViaServiceWorker(title, body, tag, requireInteraction = false) {
  if (!("serviceWorker" in navigator)) {
    if (Notification.permission === "granted")
      new Notification(title, { body, tag });
    return;
  }
  navigator.serviceWorker.ready.then((reg) => {
    reg.active?.postMessage({
      type: "SHOW_NOTIFICATION",
      title,
      body,
      tag,
      requireInteraction,
    });
  });
}

function startTaskTimer() {
  taskTimerStart = Date.now();
  if (taskTimerInterval) clearInterval(taskTimerInterval);
  taskTimerInterval = setInterval(() => {
    const timerEl = document.getElementById("task-live-timer");
    if (!timerEl) return;
    const elapsed = Math.floor((Date.now() - taskTimerStart) / 1000);
    const h = Math.floor(elapsed / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((elapsed % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (elapsed % 60).toString().padStart(2, "0");
    timerEl.textContent = elapsed >= 3600 ? `${h}:${m}:${s}` : `${m}:${s}`;
  }, 1000);
}

function stopTaskTimer() {
  if (taskTimerInterval) clearInterval(taskTimerInterval);
  taskTimerInterval = null;
  taskTimerStart = null;
}

function startReminderLoop() {
  if (reminderInterval) clearInterval(reminderInterval);

  // Run every minute — piggybacks on the same cadence as tick()
  // Covers cases where the app is open but user isn't looking at it
  reminderInterval = setInterval(() => {
    checkScheduleReminders();
    checkStudyReminders();
    checkInterruptionAlerts();
  }, 60 * 1000);
}

/**
 * Schedule reminders — fires when a task has been running for
 * a while with no interaction, or is overdue.
 */
function checkScheduleReminders() {
  if (OVERRIDE_STATE.snoozedUntil && Date.now() < OVERRIDE_STATE.snoozedUntil)
    return;
  const now = nowInMinutes();

  // Find the current active schedule event
  const current = STATE.schedule.find(
    (ev) => now >= ev.startMins && now < ev.endMins && !ev.isBuffer,
  );

  if (current) {
    // Remind every 30 mins during very long blocks (e.g. siesta, study)
    const elapsed = now - current.startMins;
    const reminderKey = `ongoing_${current.id}_${Math.floor(elapsed / 30)}`;
    if (
      elapsed > 0 &&
      elapsed % 30 === 0 &&
      !STATE.notifiedIds.has(reminderKey)
    ) {
      STATE.notifiedIds.add(reminderKey);
      const remaining = current.endMins - now;
      notifyViaServiceWorker(
        `🔔 Still on: ${current.name}`,
        `${formatDuration(elapsed)} in · ${formatDuration(remaining)} remaining`,
        `pes-ongoing-${current.id}`,
        false,
      );
    }
  }

  // Find the next upcoming event and warn if it starts in exactly 15 min
  const next = STATE.schedule.find((ev) => ev.startMins > now && !ev.isBuffer);
  if (next) {
    const minsAway = next.startMins - now;
    const warn15Key = `warn15_${next.id}`;
    if (minsAway === 15 && !STATE.notifiedIds.has(warn15Key)) {
      STATE.notifiedIds.add(warn15Key);
      notifyViaServiceWorker(
        `📅 Coming up in 15 min`,
        `${next.name} — ${next.start} to ${next.end}`,
        `pes-warn15-${next.id}`,
        false,
      );
    }
  }
}

/**
 * Study reminders — fires for high-priority or overdue study items.
 */
function checkStudyReminders() {
  if (OVERRIDE_STATE.snoozedUntil && Date.now() < OVERRIDE_STATE.snoozedUntil)
    return;

  const sorted = sortStudyItems(
    STATE.studyItems.filter((i) => i.status === "Not Started"),
  );
  if (sorted.length === 0) return;

  const top = sorted[0];
  const days = top.deadline ? daysUntilDeadline(top.deadline) : null;

  // Only remind during a GROWTH block — right time for study
  const now = nowInMinutes();
  const inStudyBlock = STATE.schedule.some(
    (ev) => ev.type === "GROWTH" && now >= ev.startMins && now < ev.endMins,
  );
  if (!inStudyBlock) return;

  const remindKey = `study_${top.id}_${Math.floor(now / 30)}`;
  if (STATE.notifiedIds.has(remindKey)) return;
  STATE.notifiedIds.add(remindKey);

  if (days !== null && days < 0) {
    notifyViaServiceWorker(
      `🚨 OVERDUE: ${top.course}`,
      `${top.type} was due ${Math.abs(days)}d ago — do it NOW during this study block`,
      "pes-overdue",
      true,
    );
  } else if (days !== null && days <= 3) {
    notifyViaServiceWorker(
      `⚠️ Due soon: ${top.course}`,
      `${top.type} due in ${days}d — use this study block`,
      "pes-urgent-study",
      false,
    );
  } else {
    notifyViaServiceWorker(
      `▶ Study suggestion`,
      `Work on ${top.course} ${top.type} during this block`,
      "pes-study-suggest",
      false,
    );
  }
}

function checkAndNotifyPendingTasks() {
  // Legacy alias — now handled by checkStudyReminders
  checkStudyReminders();
}

function checkInterruptionAlerts() {
  STATE.studyItems.forEach((item) => {
    if (item.interruptAt && Date.now() >= item.interruptAt) {
      notifyViaServiceWorker(
        `⚡ Interruption: ${item.course}`,
        `You overrode this task 20 min ago. Time to return to it.`,
        "pes-interrupt",
        true,
      );
      item.interruptAt = null;
      saveStudyItems();
    }
  });
}

function handleNotificationSnooze() {
  OVERRIDE_STATE.snoozedUntil = Date.now() + 10 * 60 * 1000;
  console.log("[PES] Snoozed 10 min.");
}

/* ============================================================
         SECTION 19: STRICT RENDER ENHANCEMENTS
         These EXTEND existing functions without redeclaring them.
         We patch via the tick() and direct calls — no _orig needed.
      ============================================================ */

function renderStrictLimitWarning() {
  let warnEl = document.getElementById("strict-limit-warn");
  if (!warnEl) {
    warnEl = document.createElement("div");
    warnEl.id = "strict-limit-warn";
    warnEl.className = "strict-limit-warn hidden";
    warnEl.innerHTML =
      "⛔ Max 3 active tasks per day reached. Complete one before adding more.";
    const statsRow = document.querySelector(".stats-row");
    if (statsRow) statsRow.after(warnEl);
  }
  const activeCount = STATE.studyItems.filter(
    (i) => i.status !== "Completed",
  ).length;
  warnEl.classList.toggle("hidden", activeCount < 3);
}

function injectTaskTimer() {
  const inProgress = STATE.studyItems.find((i) => i.status === "In Progress");
  const heroBlock = document.querySelector(".hero-block");
  if (!heroBlock) return;
  let timerEl = document.getElementById("task-live-timer");
  if (inProgress) {
    if (!timerEl) {
      const t = document.createElement("div");
      t.id = "task-live-timer";
      t.className = "task-timer";
      t.textContent = "00:00";
      heroBlock.appendChild(t);
    }
    if (!taskTimerStart) startTaskTimer();
  } else {
    if (timerEl) timerEl.remove();
    stopTaskTimer();
  }
}

function injectAtRiskClasses() {
  // Study table rows
  const container = document.getElementById("study-table-container");
  if (container) {
    STATE.studyItems
      .filter((i) => i.atRisk)
      .forEach((item) => {
        container.querySelectorAll("tr").forEach((row) => {
          if (row.innerHTML.includes(item.id)) row.classList.add("at-risk");
        });
      });
  }
  // Today list items
  const todayList = document.getElementById("today-list");
  if (todayList) {
    STATE.studyItems
      .filter((i) => i.atRisk)
      .forEach((item) => {
        todayList.querySelectorAll(".today-item").forEach((el) => {
          if (
            el.innerHTML.includes(item.course) &&
            el.innerHTML.includes(item.type)
          ) {
            el.classList.add("at-risk");
          }
        });
      });
  }
}

// Patch cycleStudyStatus — replace the existing one cleanly
// Since JS hoists function declarations, we use a flag-based approach
// instead of _orig to avoid infinite recursion.
let _cycleStudyStatusGuard = false;

const _realCycleStudyStatus = (function () {
  // Capture the flow logic inline — no reference to the outer name
  return function (id) {
    const item = STATE.studyItems.find((i) => i.id === id);
    if (!item) return;

    const flow = ["Not Started", "In Progress", "Completed"];
    const idx = flow.indexOf(item.status);
    const next = flow[(idx + 1) % flow.length];

    // Warn if too many In Progress
    if (next === "In Progress") {
      const ipCount = STATE.studyItems.filter(
        (i) => i.id !== id && i.status === "In Progress",
      ).length;
      if (ipCount >= 3) {
        const warn = document.getElementById("in-progress-warn");
        if (warn) {
          warn.classList.remove("hidden");
          setTimeout(() => warn.classList.add("hidden"), 3000);
        }
      }
    }

    item.status = next;
    if (item.status !== "In Progress") item.pinned = false;
    saveStudyItems();
    renderStudyView();
    renderStudyFocusWidget();
    renderTodayView();
  };
})();

// Override cycleStudyStatus with strict-mode version
// Uses a non-function-declaration so it doesn't hoist over the original
window.cycleStudyStatus = function (id) {
  if (_cycleStudyStatusGuard) return;

  const item = STATE.studyItems.find((i) => i.id === id);
  if (!item) return;

  const flow = ["Not Started", "In Progress", "Completed"];
  const next = flow[(flow.indexOf(item.status) + 1) % flow.length];

  if (next === "In Progress") {
    const allowed = checkStrictRules(id);
    if (!allowed) return;
  }

  _cycleStudyStatusGuard = true;
  _realCycleStudyStatus(id);
  _cycleStudyStatusGuard = false;

  injectTaskTimer();
  renderStrictLimitWarning();
};

/* ============================================================
         SECTION 20: PWA INIT — runs after the main init()
      ============================================================ */

// We use a separate DOMContentLoaded listener instead of
// redeclaring init(), which caused the hoisting crash.
document.addEventListener("DOMContentLoaded", function () {
  registerServiceWorker();
  startReminderLoop();
  setTimeout(checkAndNotifyPendingTasks, 5000);

  // Run strict render extras after each tick
  const _origTick = tick;
  // Patch tick via reassignment (not function declaration)
  window.tick = function () {
    _origTick();
    injectTaskTimer();
    injectAtRiskClasses();
    renderStrictLimitWarning();
  };
});

window.addEventListener("resize", () => {
  const studyView = document.getElementById("view-study");
  if (
    studyView &&
    studyView.classList.contains("active") &&
    STATE.studyViewMode === "table"
  ) {
    renderStudyTable();
  }
});
