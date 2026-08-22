const User = require('../models/user');
const NotificationLog = require('../models/notificationLog');
const { sendEmail } = require('../services/emailService');

// POST /api/notifications/test-email
exports.sendTestEmail = async (req, res) => {
  try {
    // req.user is attached by the auth middleware
    const user = req.user;

    const testSubject = '📚 Data Engineering Roadmap — Test Email';
    const testHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #52c41a; text-align: center;">✅ Test Connection Successful</h2>
        <p>Hello ${user.name || 'Student'},</p>
        <p>This is a test notification confirming that your SMTP/email server settings are working properly.</p>
        <p>Your current configuration details:</p>
        <ul>
          <li><strong>Recipient Email:</strong> ${user.email}</li>
          <li><strong>Timezone:</strong> ${user.timezone}</li>
          <li><strong>Daily Reminder:</strong> ${user.reminderTime}</li>
          <li><strong>Active Learning Path:</strong> ${user.activeRoadmap}</li>
        </ul>
        <p>You will receive daily learning reminders at your configured time if the active day is not marked as COMPLETED.</p>
        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;"/>
        <p style="font-size: 0.85em; color: #888; text-align: center;">— Data Engineering Roadmap</p>
      </div>
    `;

    console.log(`[Test Email] Attempting test email to ${user.email}...`);
    const result = await sendEmail({
      to: user.email,
      subject: testSubject,
      html: testHtml,
      isTest: true
    });

    // Log the successful test notification
    await NotificationLog.create({
      userId: user._id,
      dayNumber: 0, 
      type: 'EMAIL',
      status: 'SUCCESS',
      message: `Test email sent successfully to ${user.email}. ${result.mocked ? '(MOCK)' : ''}`
    });

    res.json({
      success: true,
      message: `Test email sent successfully to ${user.email}.`,
      mocked: result.mocked
    });
  } catch (error) {
    console.error('[Test Email Error]:', error);
    
    try {
      await NotificationLog.create({
        userId: req.user ? req.user._id : null,
        dayNumber: 0,
        type: 'EMAIL',
        status: 'FAILED',
        error: error.message,
        message: 'Test email failed to send'
      });
    } catch (logErr) {
      console.error('Failed to log email notification failure in DB:', logErr);
    }

    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// POST /api/notifications/test-sms
exports.sendTestSMS = async (req, res) => {
  res.status(400).json({
    success: false,
    error: 'SMS reminder features are currently disabled/commented out by configuration.'
  });
};

// GET /api/notifications/brevo-logs
const { getBrevoLogs, getDatabaseNotificationLogs } = require('../services/brevoLogService');
exports.getBrevoLogsEndpoint = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const fileLogs = getBrevoLogs(limit);
    const databaseLogs = await getDatabaseNotificationLogs(limit);
    res.json({
      success: true,
      fileLogCount: fileLogs.length,
      fileLogs,
      databaseLogCount: databaseLogs.length,
      databaseLogs
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
