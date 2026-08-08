const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Student'
    },
    email: {
      type: String,
      default: 'user@example.com'
    },
    phoneNumber: {
      type: String,
      default: '+919876543210'
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
    },
    reminderTime: {
      type: String,
      default: '08:00 PM'
    },
    emailReminderEnabled: {
      type: Boolean,
      default: true
    },
    smsReminderEnabled: {
      type: Boolean,
      default: true
    },
    roadmapStartDate: {
      type: String,
      default: '2026-08-08' // Format: YYYY-MM-DD
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
