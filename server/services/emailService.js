const nodemailer = require('nodemailer');

/**
 * Send an email reminder.
 * If credentials are missing and isTest is false, it logs a warning and returns a mocked response.
 * If isTest is true, it throws an error if credentials are missing to give feedback to the user.
 */
const sendEmail = async ({ to, subject, html, isTest = false }) => {
  const isConfigured = !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASSWORD
  );

  if (!isConfigured) {
    const logMsg = `[MOCK EMAIL] To: ${to} | Subject: ${subject}\nContent Summary:\n${html.replace(/<[^>]*>/g, ' ').substring(0, 300)}...`;
    console.log(logMsg);
    
    if (isTest) {
      throw new Error('SMTP server is not configured in backend .env');
    }
    return { success: true, mocked: true, info: 'Mock email sent (no SMTP configuration)' };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: parseInt(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.REMINDER_EMAIL || `"Data Engineering Roadmap" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html
  };

  const info = await transporter.sendMail(mailOptions);
  return { success: true, info };
};

module.exports = { sendEmail };
