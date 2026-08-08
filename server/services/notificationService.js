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

  const emailSubject = `📚 Data Engineering — Day ${day.dayNumber} Learning Reminder`;
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #1890ff; text-align: center;">📚 Data Engineering Learning Tracker</h2>
      <p>Hello ${user.name || 'Student'},</p>
      <p>You haven't completed today's Data Engineering learning yet.</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 15px 0;">
        <strong>Today's Topic:</strong><br/>
        <span style="font-size: 1.1em; color: #333;">Day ${day.dayNumber} — ${day.topic}</span>
      </div>

      <div style="margin: 15px 0;">
        <strong>Progress:</strong><br/>
        <span>${completedTasks} / ${totalTasks} tasks completed</span><br/>
        <span>Remaining: ${remainingTasks} tasks</span>
      </div>

      <p>Please complete today's learning.</p>
      
      <div style="text-align: center; margin: 25px 0;">
        <a href="${appUrl}" style="background-color: #1890ff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Open Roadmap</a>
      </div>

      <p>Good luck!</p>
      <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;"/>
      <p style="font-size: 0.85em; color: #888; text-align: center;">— Data Engineering Roadmap</p>
    </div>
  `;

  const smsBody = `📚 Data Engineering Reminder:
Day ${day.dayNumber} — ${day.topic}
Progress: ${completedTasks}/${totalTasks} tasks completed.
Complete today's learning before the day ends.`;

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
