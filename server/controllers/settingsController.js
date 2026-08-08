const User = require('../models/user');
const { rescheduleReminderJob } = require('../jobs/reminderJob');

// GET /api/settings
exports.getSettings = async (req, res) => {
  try {
    let user = await User.findOne();
    if (!user) {
      user = await User.create({
        name: 'Harish',
        email: [EMAIL_ADDRESS],
        phoneNumber: [USER_PHONE_NUMBER],
        timezone: 'Asia/Kolkata',
        reminderTime: '08:30 PM',
        emailReminderEnabled: true,
        smsReminderEnabled: false,
        roadmapStartDate: new Date().toISOString().split('T')[0]
      });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/settings
exports.updateSettings = async (req, res) => {
  try {
    let user = await User.findOne();
    if (!user) {
      user = new User();
    }

    const {
      name,
      email,
      phoneNumber,
      timezone,
      reminderTime,
      emailReminderEnabled,
      smsReminderEnabled,
      roadmapStartDate
    } = req.body;

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (timezone !== undefined) user.timezone = timezone;
    if (reminderTime !== undefined) user.reminderTime = reminderTime;
    if (emailReminderEnabled !== undefined) user.emailReminderEnabled = emailReminderEnabled;
    if (smsReminderEnabled !== undefined) user.smsReminderEnabled = smsReminderEnabled;
    if (roadmapStartDate !== undefined) user.roadmapStartDate = roadmapStartDate;

    await user.save();

    // Trigger rescheduling of the cron job
    rescheduleReminderJob(user.reminderTime, user.timezone);

    res.json({
      message: 'Settings updated successfully',
      settings: user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
