const cron = require('node-cron');
const moment = require('moment-timezone');
const User = require('../models/user');
const UserProgress = require('../models/userProgress');
const RoadmapTemplate = require('../models/roadmapTemplate');
const { sendDailyReminder } = require('../services/notificationService');

let schedulerCronJob = null;

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
 * Checks all users and fires reminders if the current time matches their reminderTime.
 * Runs every minute in background.
 */
const checkAndSendReminders = async () => {
  try {
    const users = await User.find({
      $or: [
        { emailReminderEnabled: true },
        { smsReminderEnabled: true }
      ]
    });

    for (const user of users) {
      const tz = user.timezone || 'Asia/Kolkata';
      
      // Get current local time formatted (e.g., "08:30 PM" or "08:00 PM")
      const localNowTime = moment().tz(tz).format('hh:mm A');
      
      // Compare user's configured reminderTime with local current time
      if (localNowTime !== user.reminderTime) {
        continue; // Not the user's scheduled time
      }

      console.log(`[Scheduler] Firing reminder check for user: ${user.name} (${user.email})`);

      const dayNumber = getCurrentRoadmapDayNumber(user.roadmapStartDate, tz);
      
      // Templates are typically 1-45 days
      if (dayNumber < 1 || dayNumber > 45) {
        console.log(`[Scheduler] User ${user.name} is on Day ${dayNumber}. Out of bounds (1-45). Skipping.`);
        continue;
      }

      // Check if user has progress logged
      const progress = await UserProgress.findOne({
        userId: user._id,
        roadmapType: user.activeRoadmap,
        dayNumber
      });

      if (progress && progress.status === 'COMPLETED') {
        console.log(`[Scheduler] User ${user.name} has already completed Day ${dayNumber}. Skipping.`);
        continue;
      }

      // Load target curriculum template
      const template = await RoadmapTemplate.findOne({
        roadmapType: user.activeRoadmap,
        dayNumber
      });

      if (!template) {
        console.log(`[Scheduler] Roadmap template for ${user.activeRoadmap} Day ${dayNumber} not found.`);
        continue;
      }

      // Construct merged day data structure for reminder service
      const mockDay = {
        dayNumber,
        topic: template.topic,
        tasks: template.tasks.map(title => {
          const userTask = progress ? progress.tasks.find(t => t.title === title) : null;
          return {
            title,
            completed: userTask ? userTask.completed : false
          };
        })
      };

      console.log(`[Scheduler] Sending daily email reminders to ${user.email} for Day ${dayNumber}`);
      await sendDailyReminder(user, mockDay);
    }
  } catch (error) {
    console.error('[Scheduler] Error checking/dispatching reminders:', error);
  }
};

/**
 * Setup and start the cron running every minute.
 */
const initScheduler = async () => {
  try {
    console.log('[Scheduler] Initializing global minute-level reminder cron job...');
    
    if (schedulerCronJob) {
      schedulerCronJob.stop();
    }

    // Run every minute: checks all users timezones
    schedulerCronJob = cron.schedule('* * * * *', checkAndSendReminders, {
      scheduled: true
    });
    
    console.log('[Scheduler] Cron job active.');
  } catch (error) {
    console.error('[Scheduler] Error starting cron daemon:', error);
  }
};

// Deprecated in multi-user mode, keeping empty function to prevent startup crashes
const rescheduleReminderJob = () => {
  console.log('[Scheduler] Dynamic rescheduling bypassed. Multi-user cron runs dynamically every minute.');
};

module.exports = {
  initScheduler,
  rescheduleReminderJob,
  getCurrentRoadmapDayNumber
};
