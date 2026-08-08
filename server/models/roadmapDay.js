const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const roadmapDaySchema = new mongoose.Schema(
  {
    dayNumber: {
      type: Number,
      required: true,
      unique: true
    },
    phase: {
      type: String,
      required: true
    },
    topic: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    tasks: [taskSchema],
    status: {
      type: String,
      enum: ['TODO', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED'],
      default: 'TODO'
    },
    notes: {
      type: String,
      default: ''
    },
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

module.exports = mongoose.model('RoadmapDay', roadmapDaySchema);
