const { sendEmail } = require('./emailService');
const { sendSMS } = require('./smsService');
const NotificationLog = require('../models/notificationLog');

/**
 * Coordinate sending of reminders (Email & SMS) and logging of success/failure.
 */
const sendDailyReminder = async (user, day, isTest = false) => {
  const totalTasks = day.tasks.length;
  const completedTasks = day.tasks.filter(t => t.completed).length;
  const remainingTasks = totalTasks - completedTasks;
  const appUrl = process.env.APP_URL || 'http://localhost:5173';

  const roadmapTitles = {
    'data-engineering': 'Data Engineering',
    'full-stack': 'Full Stack Development',
    'java': 'Java Backend Development',
    'flutter': 'Flutter App Development',
    'angular': 'Angular Frontend Development',
    'sql-database': 'SQL & Database Engineering'
  };
  const roadmapName = roadmapTitles[user.activeRoadmap] || 'Daily Learning';

  const emailSubject = `⚠️ Action Required: Day ${day.dayNumber} is Pending — Maintain Your ${roadmapName} Streak!`;
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="font-size: 2.5rem;">🔥</span>
        <h2 style="color: #4f46e5; margin: 8px 0 0 0;">${roadmapName} Daily Learning</h2>
        <span style="display: inline-block; margin-top: 8px; padding: 4px 12px; background-color: #fef2f2; color: #dc2626; border: 1px solid #fecaca; border-radius: 9999px; font-weight: 600; font-size: 0.85rem;">
          ⚠️ Day ${day.dayNumber} Incomplete / Pending
        </span>
      </div>

      <p style="font-size: 1rem; line-height: 1.5;">Hello <strong>${user.name || 'Learner'}</strong>,</p>
      
      <p style="font-size: 0.95rem; line-height: 1.5; color: #475569;">
        You have not finished today's scheduled learning module. <strong>Day ${day.dayNumber} is still pending</strong>. To keep your momentum going and <strong>maintain your daily streak</strong>, make sure to complete today's tasks before the day ends!
      </p>
      
      <div style="background-color: #f8fafc; padding: 18px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
        <div style="font-size: 0.85rem; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 4px;">Target Module</div>
        <div style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin-bottom: 12px;">Day ${day.dayNumber} — ${day.topic}</div>
        
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 6px; color: #334155;">
          <span><strong>Tasks Completed:</strong></span>
          <span style="font-weight: 700; color: ${completedTasks > 0 ? '#16a34a' : '#dc2626'};">${completedTasks} / ${totalTasks}</span>
        </div>
        <div style="font-size: 0.85rem; color: #64748b;">
          Remaining tasks to finish: <strong>${remainingTasks}</strong>
        </div>
      </div>

      <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px; margin: 20px 0; font-size: 0.9rem; color: #92400e;">
        ⚡ <strong>Streak Alert:</strong> Skipping days breaks consistency. Spend 15–20 minutes now to review and complete Day ${day.dayNumber} to keep your daily learning streak alive!
      </div>
      
      <div style="text-align: center; margin: 28px 0;">
        <a href="${appUrl}/day/${day.dayNumber}" style="background-color: #4f46e5; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 1rem; display: inline-block; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
          🚀 Complete Day ${day.dayNumber} Now
        </a>
      </div>

      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;"/>
      <p style="font-size: 0.8rem; color: #94a3b8; text-align: center; margin: 0;">— ${roadmapName} Roadmap Tracker</p>
    </div>
  `;

  const smsBody = `⚠️ ${roadmapName} Reminder: Day ${day.dayNumber} (${day.topic}) is still pending! Complete your ${remainingTasks} remaining tasks today to maintain your learning streak.`;

  const logs = [];

  // Check email settings
  if (user.emailReminderEnabled) {
    try {
      const emailResult = await sendEmail({
        to: user.email,
        subject: emailSubject,
        html: emailHtml,
        isTest
      });
      const log = await NotificationLog.create({
        userId: user._id,
        dayNumber: day.dayNumber,
        type: 'EMAIL',
        status: 'SUCCESS',
        message: `Email reminder sent to ${user.email}. ${emailResult.mocked ? '(MOCK)' : ''}`
      });
      logs.push(log);
    } catch (error) {
      console.error(`Failed email notification: ${error.message}`);
      const log = await NotificationLog.create({
        userId: user._id,
        dayNumber: day.dayNumber,
        type: 'EMAIL',
        status: 'FAILED',
        error: error.message,
        message: `Failed to send email to ${user.email}`
      });
      logs.push(log);
    }
  }

  // Check SMS settings
  /*
  if (user.smsReminderEnabled) {
    try {
      const smsResult = await sendSMS({
        to: user.phoneNumber,
        body: smsBody,
        isTest
      });
      const log = await NotificationLog.create({
        userId: user._id,
        dayNumber: day.dayNumber,
        type: 'SMS',
        status: 'SUCCESS',
        message: `SMS reminder sent to ${user.phoneNumber}. ${smsResult.mocked ? '(MOCK)' : ''}`
      });
      logs.push(log);
    } catch (error) {
      console.error(`Failed SMS notification: ${error.message}`);
      const log = await NotificationLog.create({
        userId: user._id,
        dayNumber: day.dayNumber,
        type: 'SMS',
        status: 'FAILED',
        error: error.message,
        message: `Failed to send SMS to ${user.phoneNumber}`
      });
      logs.push(log);
    }
  }
  */

  return logs;
};

module.exports = { sendDailyReminder };
