const mongoose = require('mongoose');

const notificationLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional if multiple users or single user setup starts without ID
  },
  dayNumber: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['EMAIL', 'SMS'],
    required: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILED'],
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('NotificationLog', notificationLogSchema);
