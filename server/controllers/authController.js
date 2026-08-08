const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { sendEmail } = require('../services/emailService');

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secretkeykeykeykeykeykeykeykeykeykeykeykeykeykeykeykeykey', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please add all required fields (name, email, password)' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password, // Password is hashed pre-save in User Schema middleware
      phoneNumber: phoneNumber || '+919876543210'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        timezone: user.timezone,
        reminderTime: user.reminderTime,
        emailReminderEnabled: user.emailReminderEnabled,
        smsReminderEnabled: user.smsReminderEnabled,
        activeRoadmap: user.activeRoadmap,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    console.error('[Signup Error]:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both email and password' });
    }

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        timezone: user.timezone,
        reminderTime: user.reminderTime,
        emailReminderEnabled: user.emailReminderEnabled,
        smsReminderEnabled: user.smsReminderEnabled,
        activeRoadmap: user.activeRoadmap,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('[Login Error]:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Generate and send OTP for password recovery
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Please enter your email address' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User with this email does not exist' });
    }

    // Generate 6 digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = expires;
    await user.save();

    // Prepare email layout
    const mailSubject = '📚 Roadmap Tracker — Reset Password OTP';
    const mailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="font-size: 2.5rem;">🔑</span>
          <h2 style="color: #4f46e5; margin: 8px 0 0 0;">Password Reset Request</h2>
        </div>
        <p>Hello ${user.name},</p>
        <p>You requested to reset your password. Use the following 6-digit One Time Password (OTP) to complete the reset process. This OTP is valid for <strong>10 minutes</strong>.</p>
        
        <div style="text-align: center; margin: 24px 0;">
          <span style="font-family: monospace; font-size: 2.5rem; font-weight: 800; letter-spacing: 6px; padding: 12px 24px; background-color: #f1f5f9; border-radius: 8px; color: #0f172a; border: 1px solid #cbd5e1; display: inline-block;">
            ${otp}
          </span>
        </div>
        
        <p style="color: #64748b; font-size: 0.9em;">If you did not request this reset, please ignore this email or contact support if you suspect unauthorized access.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 0.8em; color: #94a3b8; text-align: center;">— Roadmap Tracker App</p>
      </div>
    `;

    console.log(`[Forgot Password] Generating OTP ${otp} for ${user.email}`);
    
    // Dispatch email
    await sendEmail({
      to: user.email,
      subject: mailSubject,
      html: mailHtml,
      isTest: true // If test, throws error if configuration is incorrect
    });

    res.json({
      success: true,
      message: 'OTP sent successfully to your email'
    });
  } catch (error) {
    console.error('[Forgot Password Error]:', error.message);
    res.status(400).json({ error: error.message || 'Failed to send OTP email.' });
  }
};

// @desc    Verify OTP and reset password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Please enter email, OTP, and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify OTP matching and expiry
    if (
      !user.resetPasswordOTP ||
      user.resetPasswordOTP !== otp ||
      new Date() > user.resetPasswordOTPExpires
    ) {
      return res.status(400).json({ error: 'Invalid or expired OTP. Please request a new one.' });
    }

    // Update password
    user.password = newPassword; // Hashed automatically by pre-save schema middleware
    user.resetPasswordOTP = null;
    user.resetPasswordOTPExpires = null;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful! You can now log in.'
    });
  } catch (error) {
    console.error('[Reset Password Error]:', error.message);
    res.status(500).json({ error: error.message });
  }
};
