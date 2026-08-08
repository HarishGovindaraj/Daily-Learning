const RoadmapDay = require('../models/roadmapDay');
const User = require('../models/user');
const { getCurrentRoadmapDayNumber } = require('../jobs/reminderJob');

// GET /api/roadmap
exports.getAllDays = async (req, res) => {
  try {
    const days = await RoadmapDay.find().sort({ dayNumber: 1 });
    res.json(days);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/roadmap/:dayNumber
exports.getDayByNumber = async (req, res) => {
  try {
    const day = await RoadmapDay.findOne({ dayNumber: req.params.dayNumber });
    if (!day) {
      return res.status(404).json({ message: 'Roadmap day not found' });
    }
    res.json(day);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/roadmap/:dayNumber
exports.updateDay = async (req, res) => {
  try {
    const { status, notes, tasks } = req.body;
    const day = await RoadmapDay.findOne({ dayNumber: req.params.dayNumber });
    if (!day) {
      return res.status(404).json({ message: 'Roadmap day not found' });
    }

    if (status) {
      day.status = status;
      if (status === 'COMPLETED') {
        day.completedAt = new Date();
      } else if (status === 'IN_PROGRESS') {
        if (!day.startedAt) day.startedAt = new Date();
      }
    }
    if (notes !== undefined) {
      day.notes = notes;
    }
    if (tasks) {
      day.tasks = tasks;
    }

    await day.save();
    res.json(day);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/roadmap/:dayNumber/start
exports.startDay = async (req, res) => {
  try {
    const day = await RoadmapDay.findOne({ dayNumber: req.params.dayNumber });
    if (!day) {
      return res.status(404).json({ message: 'Roadmap day not found' });
    }

    day.status = 'IN_PROGRESS';
    if (!day.startedAt) {
      day.startedAt = new Date();
    }
    await day.save();
    res.json(day);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/roadmap/:dayNumber/complete
exports.completeDay = async (req, res) => {
  try {
    const day = await RoadmapDay.findOne({ dayNumber: req.params.dayNumber });
    if (!day) {
      return res.status(404).json({ message: 'Roadmap day not found' });
    }

    day.status = 'COMPLETED';
    day.completedAt = new Date();
    // Also mark all tasks as completed when marking day complete
    day.tasks.forEach(task => {
      task.completed = true;
    });

    await day.save();
    res.json(day);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/roadmap/:dayNumber/tasks/:taskId
exports.updateTask = async (req, res) => {
  try {
    const { completed } = req.body;
    const day = await RoadmapDay.findOne({ dayNumber: req.params.dayNumber });
    if (!day) {
      return res.status(404).json({ message: 'Roadmap day not found' });
    }

    const task = day.tasks.id(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.completed = completed;
    
    // Automatically transition to IN_PROGRESS if a task is completed and day was in TODO
    if (completed && day.status === 'TODO') {
      day.status = 'IN_PROGRESS';
      if (!day.startedAt) {
        day.startedAt = new Date();
      }
    }

    await day.save();
    res.json(day);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/roadmap/:dayNumber/notes
exports.updateNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    const day = await RoadmapDay.findOne({ dayNumber: req.params.dayNumber });
    if (!day) {
      return res.status(404).json({ message: 'Roadmap day not found' });
    }

    day.notes = notes;
    await day.save();
    res.json(day);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/dashboard
exports.getDashboardData = async (req, res) => {
  try {
    const days = await RoadmapDay.find();
    const user = await User.findOne();
    
    const totalDays = days.length || 45;
    const completedCount = days.filter(d => d.status === 'COMPLETED').length;
    const inProgressCount = days.filter(d => d.status === 'IN_PROGRESS').length;
    const todoCount = days.filter(d => d.status === 'TODO').length;
    const skippedCount = days.filter(d => d.status === 'SKIPPED').length;
    
    const overallProgress = totalDays > 0 ? parseFloat(((completedCount / totalDays) * 100).toFixed(2)) : 0;

    let todayDay = null;
    let todayDayNumber = 1;

    if (user) {
      todayDayNumber = getCurrentRoadmapDayNumber(user.roadmapStartDate, user.timezone);
      // Bound it between 1 and 45
      let searchDayNum = todayDayNumber;
      if (searchDayNum < 1) searchDayNum = 1;
      if (searchDayNum > 45) searchDayNum = 45;
      
      todayDay = days.find(d => d.dayNumber === searchDayNum);
    } else {
      todayDay = days.find(d => d.dayNumber === 1);
    }

    // Determine continue day: first incomplete day (status is not COMPLETED and not SKIPPED)
    const sortedDays = [...days].sort((a, b) => a.dayNumber - b.dayNumber);
    const continueDay = sortedDays.find(d => d.status !== 'COMPLETED' && d.status !== 'SKIPPED') || null;

    res.json({
      stats: {
        totalDays,
        completed: completedCount,
        inProgress: inProgressCount,
        todo: todoCount,
        skipped: skippedCount,
        overallProgress
      },
      todayDayNumber,
      todayDay,
      continueDayNumber: continueDay ? continueDay.dayNumber : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
