const nodemailer = require('nodemailer');

/**
 * Send an email reminder.
 * If credentials are missing and isTest is false, it logs a warning and returns a mocked response.
 * If isTest is true, it throws an error if credentials are missing to give feedback to the user.
 */
const sendEmail = async ({ to, subject, html, isTest = false }) => {
  // If RESEND_API_KEY is configured, use Resend's HTTP API (port 443) which is never blocked by cloud hosts.
  if (process.env.RESEND_API_KEY) {
    try {
      console.log(`[Email Service] Attempting to send email via Resend API to ${to}...`);
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.REMINDER_EMAIL || 'onboarding@resend.dev',
          to,
          subject,
          html
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        return { success: true, info: data };
      }
      
      console.warn(`[Email Service] Resend API rejected recipient (${to}):`, data.message);
      console.warn('[Email Service] Attempting SMTP fallback...');
    } catch (error) {
      console.warn(`[Email Service] Resend fetch error to ${to}:`, error.message);
      console.warn('[Email Service] Attempting SMTP fallback...');
    }
  }

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
    from: (process.env.REMINDER_EMAIL && !process.env.REMINDER_EMAIL.includes('resend.dev'))
      ? process.env.REMINDER_EMAIL
      : `"Roadmap Tracker" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html
  };

  const info = await transporter.sendMail(mailOptions);
  return { success: true, info };
};

module.exports = { sendEmail };
