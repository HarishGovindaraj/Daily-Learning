const cron = require('node-cron');
const User = require('../models/user');
const NotificationLog = require('../models/notificationLog');
const { sendEmail } = require('../services/emailService');

let weeklyTestMailCronJob = null;

/**
 * Sends a system verification test email to all registered users.
 */
const sendWeeklyTestMailToAllUsers = async () => {
  try {
    console.log('[Weekly Test Mail] Starting weekly verification broadcast to all users...');
    const users = await User.find({ email: { $exists: true, $ne: '' } });
    console.log(`[Weekly Test Mail] Found ${users.length} users in database:`, users.map(u => u.email));

    const subject = '[Test Email] System Verification — Notification Pipeline Check';

    for (const user of users) {
      console.log(`[Weekly Test Mail] Dispatching test email to: ${user.name} (${user.email})...`);

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #4f46e5; margin: 8px 0 0 0;">System Verification Test</h2>
            <span style="display: inline-block; margin-top: 8px; padding: 4px 12px; background-color: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; border-radius: 9999px; font-weight: 600; font-size: 0.85rem;">
              Notification Pipeline Active
            </span>
          </div>

          <p style="font-size: 1rem; line-height: 1.5;">Hello <strong>${user.name || 'Learner'}</strong>,</p>
          
          <p style="font-size: 0.95rem; line-height: 1.6; color: #475569;">
            This is a <strong>weekly test email</strong> to confirm that the roadmap reminder service, email delivery pipeline, and automated logging system are functioning properly.
          </p>

          <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
            <div style="font-size: 0.85rem; color: #64748b; font-weight: 700; margin-bottom: 8px;">USER CONFIGURATION SUMMARY</div>
            <div style="margin-bottom: 4px;"><strong>Recipient:</strong> ${user.email}</div>
            <div style="margin-bottom: 4px;"><strong>Timezone:</strong> ${user.timezone || 'Asia/Kolkata'}</div>
            <div style="margin-bottom: 4px;"><strong>Scheduled Daily Reminder:</strong> ${user.reminderTime || '08:00 PM'}</div>
            <div style="margin-bottom: 4px;"><strong>Active Track:</strong> ${user.activeRoadmap || 'Not Selected'}</div>
          </div>

          <p style="font-size: 0.9rem; color: #64748b;">
            No action is required. You will continue to receive daily roadmap updates according to your configured schedule.
          </p>

          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;"/>
          <p style="font-size: 0.8rem; color: #94a3b8; text-align: center; margin: 0;">— Roadmap Tracker Weekly System Check</p>
        </div>
      `;

      try {
        await sendEmail({
          to: user.email,
          subject,
          html,
          isTest: false
        });

        await NotificationLog.create({
          userId: user._id,
          dayNumber: 0,
          type: 'EMAIL',
          status: 'SUCCESS',
          message: `Weekly test verification email sent to ${user.email}`
        });

        console.log(`[Weekly Test Mail SUCCESS] Email delivered to: ${user.email}`);
      } catch (err) {
        console.error(`[Weekly Test Mail FAILED] Failed to send to ${user.email}:`, err.message);
        await NotificationLog.create({
          userId: user._id,
          dayNumber: 0,
          type: 'EMAIL',
          status: 'FAILED',
          error: err.message,
          message: `Failed weekly test email to ${user.email}`
        });
      }
    }

    console.log('[Weekly Test Mail] Completed weekly test email broadcast.');
  } catch (error) {
    console.error('[Weekly Test Mail Fatal Error]:', error);
  }
};

/**
 * Initializes the weekly test mail cron scheduler.
 * Runs every Sunday at 09:00 AM (0 9 * * 0).
 */
const initWeeklyTestMailJob = () => {
  try {
    console.log('[Weekly Test Job] Initializing weekly test mail scheduler (Sundays at 09:00 AM)...');

    if (weeklyTestMailCronJob) {
      weeklyTestMailCronJob.stop();
    }

    // Schedule weekly execution on Sundays at 09:00 AM
    weeklyTestMailCronJob = cron.schedule('0 9 * * 0', async () => {
      console.log('[Weekly Test Job] Triggering scheduled Sunday 9:00 AM test email broadcast...');
      await sendWeeklyTestMailToAllUsers();
    }, {
      scheduled: true
    });

    console.log('[Weekly Test Job] Weekly test mail cron active (runs every Sunday at 09:00 AM).');
  } catch (error) {
    console.error('[Weekly Test Job Error]:', error);
  }
};

module.exports = {
  initWeeklyTestMailJob,
  sendWeeklyTestMailToAllUsers
};
