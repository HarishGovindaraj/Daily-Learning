const cron = require('node-cron');
const { cleanOldLogs } = require('../services/brevoLogService');

let cleanupCronJob = null;

/**
 * Initializes the log cleanup cron job that purges log entries older than 90 days.
 * Runs daily at midnight (00:00:00).
 */
const initLogCleanupJob = async () => {
  try {
    console.log('[Cleanup Job] Initializing 90-day log cleanup scheduler...');

    if (cleanupCronJob) {
      cleanupCronJob.stop();
    }

    // Run cleanup immediately on server startup to prune any accumulated logs
    await cleanOldLogs(90);

    // Schedule daily cleanup at 00:00 (Midnight)
    cleanupCronJob = cron.schedule('0 0 * * *', async () => {
      console.log('[Cleanup Job] Executing scheduled daily log cleanup (90-day retention)...');
      await cleanOldLogs(90);
    }, {
      scheduled: true
    });

    console.log('[Cleanup Job] 90-day retention cron job active (runs daily at 00:00).');
  } catch (error) {
    console.error('[Cleanup Job] Error initializing log cleanup cron job:', error);
  }
};

module.exports = {
  initLogCleanupJob
};
