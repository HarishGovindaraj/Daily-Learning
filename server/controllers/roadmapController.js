const RoadmapTemplate = require('../models/roadmapTemplate');
const UserProgress = require('../models/userProgress');
const User = require('../models/user');
const { getCurrentRoadmapDayNumber } = require('../jobs/reminderJob');

// Helper to get or create a user's progress record for a specific day
const getOrCreateProgress = async (userId, roadmapType, dayNumber) => {
  let progress = await UserProgress.findOne({ userId, roadmapType, dayNumber });
  if (!progress) {
    const template = await RoadmapTemplate.findOne({ roadmapType, dayNumber });
    if (!template) {
      throw new Error(`Roadmap template for ${roadmapType} Day ${dayNumber} not found.`);
    }

    const tasks = template.tasks.map(title => ({
      title,
      completed: false
    }));

    progress = await UserProgress.create({
      userId,
      roadmapType,
      dayNumber,
      status: 'TODO',
      tasks,
      notes: ''
    });
  }
  return progress;
};

// Helper to merge a static template with user-specific progress details
const mergeTemplateWithProgress = (template, progress) => {
  if (!progress) {
    return {
      dayNumber: template.dayNumber,
      phase: template.phase,
      topic: template.topic,
      description: template.description,
      status: 'TODO',
      notes: '',
      tasks: template.tasks.map(title => ({ title, completed: false })),
      startedAt: null,
      completedAt: null
    };
  }

  // Merge tasks to ensure templates are synchronized with completed states
  const mergedTasks = template.tasks.map(title => {
    const userTask = progress.tasks.find(t => t.title === title);
    return {
      _id: userTask ? userTask._id : undefined,
      title,
      completed: userTask ? userTask.completed : false
    };
  });

  return {
    _id: progress._id,
    dayNumber: template.dayNumber,
    phase: template.phase,
    topic: template.topic,
    description: template.description,
    status: progress.status,
    notes: progress.notes || '',
    tasks: mergedTasks,
    startedAt: progress.startedAt,
    completedAt: progress.completedAt
  };
};

// GET /api/roadmap
exports.getAllDays = async (req, res) => {
  try {
    const roadmapType = req.user.activeRoadmap;
    if (!roadmapType) {
      return res.json([]);
    }
    const templates = await RoadmapTemplate.find({ roadmapType }).sort({ dayNumber: 1 });
    const progresses = await UserProgress.find({ userId: req.user._id, roadmapType });

    const mergedDays = templates.map(template => {
      const progress = progresses.find(p => p.dayNumber === template.dayNumber);
      return mergeTemplateWithProgress(template, progress);
    });

    res.json(mergedDays);
  } catch (error) {
    console.error('[getAllDays Error]:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/roadmap/:dayNumber
exports.getDayByNumber = async (req, res) => {
  try {
    const roadmapType = req.user.activeRoadmap;
    const template = await RoadmapTemplate.findOne({ roadmapType, dayNumber: req.params.dayNumber });
    if (!template) {
      return res.status(404).json({ message: 'Roadmap template day not found' });
    }

    const progress = await UserProgress.findOne({ userId: req.user._id, roadmapType, dayNumber: req.params.dayNumber });
    const merged = mergeTemplateWithProgress(template, progress);
    res.json(merged);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/roadmap/:dayNumber
exports.updateDay = async (req, res) => {
  try {
    const roadmapType = req.user.activeRoadmap;
    const { status, notes } = req.body;
    const progress = await getOrCreateProgress(req.user._id, roadmapType, req.params.dayNumber);

    if (status) {
      progress.status = status;
      if (status === 'COMPLETED') {
        progress.completedAt = new Date();
        progress.tasks.forEach(t => { t.completed = true; });
      } else if (status === 'IN_PROGRESS') {
        if (!progress.startedAt) progress.startedAt = new Date();
      }
    }

    if (notes !== undefined) {
      progress.notes = notes;
    }

    await progress.save();

    const template = await RoadmapTemplate.findOne({ roadmapType, dayNumber: req.params.dayNumber });
    const merged = mergeTemplateWithProgress(template, progress);
    res.json(merged);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/roadmap/:dayNumber/start
exports.startDay = async (req, res) => {
  try {
    const roadmapType = req.user.activeRoadmap;
    const progress = await getOrCreateProgress(req.user._id, roadmapType, req.params.dayNumber);

    progress.status = 'IN_PROGRESS';
    if (!progress.startedAt) {
      progress.startedAt = new Date();
    }
    await progress.save();

    const template = await RoadmapTemplate.findOne({ roadmapType, dayNumber: req.params.dayNumber });
    const merged = mergeTemplateWithProgress(template, progress);
    res.json(merged);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/roadmap/:dayNumber/complete
exports.completeDay = async (req, res) => {
  try {
    const roadmapType = req.user.activeRoadmap;
    const progress = await getOrCreateProgress(req.user._id, roadmapType, req.params.dayNumber);

    progress.status = 'COMPLETED';
    progress.completedAt = new Date();
    progress.tasks.forEach(task => {
      task.completed = true;
    });

    await progress.save();

    const template = await RoadmapTemplate.findOne({ roadmapType, dayNumber: req.params.dayNumber });
    const merged = mergeTemplateWithProgress(template, progress);
    res.json(merged);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/roadmap/:dayNumber/tasks/:taskId
exports.updateTask = async (req, res) => {
  try {
    const roadmapType = req.user.activeRoadmap;
    const { completed } = req.body;
    const progress = await getOrCreateProgress(req.user._id, roadmapType, req.params.dayNumber);

    // Mongoose id() helper works because progress.tasks has subdoc _ids
    const task = progress.tasks.id(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found in progress logs' });
    }

    task.completed = completed;

    // Transition status to IN_PROGRESS if a task is checked and day was in TODO
    if (completed && progress.status === 'TODO') {
      progress.status = 'IN_PROGRESS';
      if (!progress.startedAt) {
        progress.startedAt = new Date();
      }
    }

    await progress.save();

    const template = await RoadmapTemplate.findOne({ roadmapType, dayNumber: req.params.dayNumber });
    const merged = mergeTemplateWithProgress(template, progress);
    res.json(merged);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/roadmap/:dayNumber/notes
exports.updateNotes = async (req, res) => {
  try {
    const roadmapType = req.user.activeRoadmap;
    const { notes } = req.body;
    const progress = await getOrCreateProgress(req.user._id, roadmapType, req.params.dayNumber);

    progress.notes = notes;
    await progress.save();

    const template = await RoadmapTemplate.findOne({ roadmapType, dayNumber: req.params.dayNumber });
    const merged = mergeTemplateWithProgress(template, progress);
    res.json(merged);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/dashboard
exports.getDashboardData = async (req, res) => {
  try {
    const roadmapType = req.user.activeRoadmap;
    if (!roadmapType) {
      return res.json({
        stats: {
          totalDays: 0,
          completed: 0,
          inProgress: 0,
          todo: 0,
          skipped: 0,
          overallProgress: 0
        },
        todayDayNumber: 0,
        todayDay: null,
        continueDayNumber: null,
        noActiveRoadmap: true
      });
    }
    const templates = await RoadmapTemplate.find({ roadmapType }).sort({ dayNumber: 1 });
    const progresses = await UserProgress.find({ userId: req.user._id, roadmapType });

    const totalDays = templates.length;
    const completedCount = progresses.filter(p => p.status === 'COMPLETED').length;
    const inProgressCount = progresses.filter(p => p.status === 'IN_PROGRESS').length;
    const skippedCount = progresses.filter(p => p.status === 'SKIPPED').length;
    const todoCount = totalDays - completedCount - inProgressCount - skippedCount;

    const overallProgress = totalDays > 0 ? parseFloat(((completedCount / totalDays) * 100).toFixed(2)) : 0;

    const todayDayNumber = getCurrentRoadmapDayNumber(req.user.roadmapStartDate, req.user.timezone);
    
    // Bound today's day number between 1 and totalDays
    let searchDayNum = todayDayNumber;
    if (searchDayNum < 1) searchDayNum = 1;
    if (searchDayNum > totalDays) searchDayNum = totalDays;

    const todayTemplate = templates.find(t => t.dayNumber === searchDayNum);
    const todayProgress = progresses.find(p => p.dayNumber === searchDayNum);
    
    const todayDay = todayTemplate ? mergeTemplateWithProgress(todayTemplate, todayProgress) : null;

    // Find the first incomplete day
    let continueDayNumber = null;
    for (let template of templates) {
      const prog = progresses.find(p => p.dayNumber === template.dayNumber);
      if (!prog || (prog.status !== 'COMPLETED' && prog.status !== 'SKIPPED')) {
        continueDayNumber = template.dayNumber;
        break;
      }
    }

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
      continueDayNumber,
      activeRoadmap: roadmapType
    });
  } catch (error) {
    console.error('[Dashboard Error]:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// POST /api/roadmap/select
exports.selectRoadmap = async (req, res) => {
  try {
    const { roadmapType } = req.body;
    const allowed = ['data-engineering', 'full-stack', 'java', 'flutter'];

    if (!allowed.includes(roadmapType)) {
      return res.status(400).json({ error: 'Invalid roadmap type selected' });
    }

    const user = await User.findById(req.user._id);
    
    // Check if user already has an active roadmap and has not completed it yet
    if (user.activeRoadmap) {
      const totalTemplates = await RoadmapTemplate.countDocuments({ roadmapType: user.activeRoadmap });
      const completedCount = await UserProgress.countDocuments({
        userId: user._id,
        roadmapType: user.activeRoadmap,
        status: 'COMPLETED'
      });

      if (totalTemplates > 0 && completedCount < totalTemplates) {
        return res.status(400).json({
          error: `You cannot change your active path. You must complete your current roadmap (${user.activeRoadmap}) first!`
        });
      }
    }

    user.activeRoadmap = roadmapType;
    await user.save();

    res.json({
      message: `Successfully selected active roadmap: ${roadmapType}`,
      activeRoadmap: user.activeRoadmap
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
