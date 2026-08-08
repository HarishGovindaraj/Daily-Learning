const mongoose = require('mongoose');

const progressTaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    roadmapType: {
      type: String,
      required: true,
      enum: ['data-engineering', 'full-stack', 'java', 'flutter', 'angular', 'sql-database']
    },
    dayNumber: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['TODO', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED'],
      default: 'TODO'
    },
    notes: {
      type: String,
      default: ''
    },
    tasks: [progressTaskSchema],
    startedAt: {
      type: Date
    },
    completedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Unique index to prevent duplicate user tracking entries
userProgressSchema.index({ userId: 1, roadmapType: 1, dayNumber: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);
