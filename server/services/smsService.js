const twilio = require('twilio');

/**
 * Send an SMS reminder via Twilio.
 * If credentials are missing and isTest is false, it logs a warning and returns a mocked response.
 * If isTest is true, it throws an error if credentials are missing.
 */
const sendSMS = async ({ to, body, isTest = false }) => {
  const isConfigured = !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  );

  if (!isConfigured) {
    const logMsg = `[MOCK SMS] To: ${to} | Body: ${body}`;
    console.log(logMsg);

    if (isTest) {
      throw new Error('Twilio credentials are not configured in backend .env');
    }
    return { success: true, mocked: true, info: 'Mock SMS sent (no Twilio configuration)' };
  }

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  const info = await client.messages.create({
    body,
    from: process.env.TWILIO_PHONE_NUMBER,
    to
  });

  return { success: true, info };
};

module.exports = { sendSMS };
