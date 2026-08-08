const cron = require('node-cron');
const moment = require('moment-timezone');
const User = require('../models/user');
const RoadmapDay = require('../models/roadmapDay');
const { sendDailyReminder } = require('../services/notificationService');

let scheduledJob = null;

/**
 * Calculates current roadmap day based on start date.
 */
const getCurrentRoadmapDayNumber = (startDateStr, timezone) => {
  const tz = timezone || 'Asia/Kolkata';
  const now = moment().tz(tz).startOf('day');
  const start = moment.tz(startDateStr, 'YYYY-MM-DD', tz).startOf('day');
  const diffDays = now.diff(start, 'days');
  return diffDays + 1; // Day 1 = start date
};

/**
 * The reminder logic check executed by the cron.
 */
const runReminderJob = async () => {
  try {
    console.log('[Scheduler] Running scheduled reminder check...');
    const user = await User.findOne();
    if (!user) {
      console.log('[Scheduler] No settings/user found, skipping check.');
      return;
    }

    const timezone = user.timezone || 'Asia/Kolkata';
    const dayNumber = getCurrentRoadmapDayNumber(user.roadmapStartDate, timezone);

    console.log(`[Scheduler] Today is day number: ${dayNumber}`);

    if (dayNumber < 1 || dayNumber > 45) {
      console.log(`[Scheduler] Day number ${dayNumber} is out of bounds (1-45). Reminder skipped.`);
      return;
    }

    const day = await RoadmapDay.findOne({ dayNumber });
    if (!day) {
      console.log(`[Scheduler] Roadmap day ${dayNumber} not found in database.`);
      return;
    }

    if (day.status === 'COMPLETED') {
      console.log(`[Scheduler] Day ${dayNumber} is already COMPLETED. Reminder skipped.`);
      return;
    }

    console.log(`[Scheduler] Day ${dayNumber} status is ${day.status}. Sending reminders.`);
    await sendDailyReminder(user, day);
  } catch (error) {
    console.error('[Scheduler] Error in scheduled reminder job:', error);
  }
};

/**
 * Helper to parse "08:00 PM" (or similar formats) into node-cron format "m h * * *"
 */
const parseTimeToCron = (timeStr) => {
  const regex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
  const match = timeStr.trim().match(regex);
  if (!match) {
    // Default fallback to 8:00 PM (20:00)
    console.log(`[Scheduler] Failed to parse time string "${timeStr}". Defaulting to 8:00 PM.`);
    return '0 20 * * *';
  }

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();

  if (ampm === 'PM' && hours < 12) {
    hours += 12;
  } else if (ampm === 'AM' && hours === 12) {
    hours = 0;
  }

  return `${minutes} ${hours} * * *`;
};

/**
 * Reschedule the active cron job.
 */
const rescheduleReminderJob = (timeStr, timezone) => {
  if (scheduledJob) {
    console.log('[Scheduler] Stopping active reminder job...');
    scheduledJob.stop();
  }

  const cronPattern = parseTimeToCron(timeStr);
  const tz = timezone || 'Asia/Kolkata';

  console.log(`[Scheduler] Scheduling daily reminder for: "${timeStr}" (${cronPattern}) in Timezone: "${tz}"`);

  scheduledJob = cron.schedule(cronPattern, runReminderJob, {
    scheduled: true,
    timezone: tz
  });
};

/**
 * Initialize scheduler with DB configuration on start.
 */
const initScheduler = async () => {
  try {
    let user = await User.findOne();
    if (!user) {
      user = await User.create({
        name: 'Student',
        email: 'user@example.com',
        phoneNumber: '+919876543210',
        timezone: 'Asia/Kolkata',
        reminderTime: '08:00 PM',
        emailReminderEnabled: true,
        smsReminderEnabled: true,
        roadmapStartDate: moment().tz('Asia/Kolkata').format('YYYY-MM-DD')
      });
      console.log('[Scheduler] Created default user settings in DB.');
    }

    rescheduleReminderJob(user.reminderTime, user.timezone);
  } catch (error) {
    console.error('[Scheduler] Error during scheduler initialization:', error);
  }
};

module.exports = {
  initScheduler,
  rescheduleReminderJob,
  getCurrentRoadmapDayNumber
};
