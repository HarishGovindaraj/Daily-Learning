const mongoose = require('mongoose');

const roadmapTemplateSchema = new mongoose.Schema(
  {
    roadmapType: {
      type: String,
      required: true,
      enum: ['data-engineering', 'full-stack', 'java', 'flutter', 'angular', 'sql-database']
    },
    dayNumber: {
      type: Number,
      required: true
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
    tasks: [String] // Static template task titles
  },
  {
    timestamps: true
  }
);

// Ensure unique index per roadmap and day number
roadmapTemplateSchema.index({ roadmapType: 1, dayNumber: 1 }, { unique: true });

module.exports = mongoose.model('RoadmapTemplate', roadmapTemplateSchema);
