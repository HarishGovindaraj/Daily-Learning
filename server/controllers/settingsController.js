const User = require('../models/user');

// GET /api/settings
exports.getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User settings not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/settings
exports.updateSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User settings not found' });
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

    res.json({
      message: 'Settings updated successfully',
      settings: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        timezone: user.timezone,
        reminderTime: user.reminderTime,
        emailReminderEnabled: user.emailReminderEnabled,
        smsReminderEnabled: user.smsReminderEnabled,
        roadmapStartDate: user.roadmapStartDate,
        activeRoadmap: user.activeRoadmap
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
