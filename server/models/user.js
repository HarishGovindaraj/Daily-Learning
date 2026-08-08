const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
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
      default: false // Disabled by default per user configuration
    },
    roadmapStartDate: {
      type: String,
      default: new Date().toISOString().split('T')[0] // Default to today
    },
    activeRoadmap: {
      type: String,
      enum: ['data-engineering', 'full-stack', 'java', 'flutter', 'angular', 'sql-database'],
      default: null
    },
    resetPasswordOTP: {
      type: String,
      default: null
    },
    resetPasswordOTPExpires: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
