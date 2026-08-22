const fs = require('fs');
const path = require('path');
const NotificationLog = require('../models/notificationLog');

const LOGS_DIR = path.resolve(__dirname, '../logs');
const LOG_FILE = path.join(LOGS_DIR, 'brevo_emails.log');

// Ensure the logs directory exists
const ensureLogDir = () => {
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  }
};

/**
 * Append a Brevo email dispatch entry to the log file.
 * @param {Object} entry
 * @param {string} entry.to - Recipient email
 * @param {string} entry.subject - Email subject
 * @param {string} entry.status - 'SUCCESS' | 'FAILED' | 'ERROR'
 * @param {string} [entry.messageId] - Message ID returned by Brevo
 * @param {string} [entry.error] - Error message if failed
 * @param {string} [entry.details] - Additional context
 */
const logBrevoEmail = ({ to, subject, status, messageId, error, details }) => {
  try {
    ensureLogDir();
    const timestamp = new Date().toISOString();
    const cleanSubject = (subject || '').replace(/[\r\n]+/g, ' ');
    const logLine = `[${timestamp}] STATUS: ${status.padEnd(7)} | TO: ${to} | SUBJECT: "${cleanSubject}" | MSG_ID: ${messageId || 'N/A'}${error ? ` | ERROR: ${error}` : ''}${details ? ` | DETAILS: ${details}` : ''}\n`;
    
    fs.appendFileSync(LOG_FILE, logLine, 'utf8');
    console.log(`[Brevo Log] Recorded ${status} email log for ${to}`);
  } catch (err) {
    console.error('[Brevo Log Error] Failed to write to log file:', err.message);
  }
};

/**
 * Clean up log entries older than 90 days from brevo_emails.log and the database.
 * @param {number} days - Age limit in days (default: 90)
 */
const cleanOldLogs = async (days = 90) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  console.log(`[Log Cleanup] Running cleanup for entries older than ${days} days (cutoff: ${cutoffDate.toISOString()})...`);

  // 1. Clean file-based brevo_emails.log
  try {
    if (fs.existsSync(LOG_FILE)) {
      const content = fs.readFileSync(LOG_FILE, 'utf8');
      const lines = content.split('\n').filter(line => line.trim().length > 0);
      
      let keptCount = 0;
      let removedCount = 0;

      const filteredLines = lines.filter(line => {
        // Extract timestamp from [YYYY-MM-DDTHH:mm:ss.sssZ]
        const match = line.match(/^\[([^\]]+)\]/);
        if (match && match[1]) {
          const logDate = new Date(match[1]);
          if (!isNaN(logDate.getTime())) {
            if (logDate < cutoffDate) {
              removedCount++;
              return false;
            }
          }
        }
        keptCount++;
        return true;
      });

      fs.writeFileSync(LOG_FILE, filteredLines.length > 0 ? filteredLines.join('\n') + '\n' : '', 'utf8');
      console.log(`[Log Cleanup] File brevo_emails.log updated: ${removedCount} entries removed, ${keptCount} entries retained.`);
    }
  } catch (err) {
    console.error('[Log Cleanup Error] Failed to clean brevo_emails.log:', err.message);
  }

  // 2. Clean database NotificationLog records older than 90 days
  try {
    const dbResult = await NotificationLog.deleteMany({
      sentAt: { $lt: cutoffDate }
    });
    console.log(`[Log Cleanup] Database notification logs cleaned: ${dbResult.deletedCount || 0} expired records removed.`);
  } catch (err) {
    console.error('[Log Cleanup Error] Failed to delete expired DB notification logs:', err.message);
  }
};

/**
 * Read the recent lines from brevo_emails.log
 * @param {number} limit - Maximum number of lines to return
 */
const getBrevoLogs = (limit = 100) => {
  try {
    if (!fs.existsSync(LOG_FILE)) {
      return [];
    }
    const content = fs.readFileSync(LOG_FILE, 'utf8');
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    return lines.slice(-limit).reverse();
  } catch (err) {
    console.error('[Brevo Log Error] Failed to read log file:', err.message);
    return [];
  }
};

/**
 * Get all notification logs from MongoDB Atlas (persisted across Render cloud & local)
 * @param {number} limit - Maximum number of records
 */
const getDatabaseNotificationLogs = async (limit = 100) => {
  try {
    const logs = await NotificationLog.find()
      .populate('userId', 'name email')
      .sort({ sentAt: -1 })
      .limit(limit);
    return logs;
  } catch (err) {
    console.error('[Notification Log DB Error]:', err.message);
    return [];
  }
};

module.exports = {
  logBrevoEmail,
  cleanOldLogs,
  getBrevoLogs,
  getDatabaseNotificationLogs,
  LOG_FILE
};
