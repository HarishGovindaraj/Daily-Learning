const express = require('express');
const router = express.Router();
const roadmapController = require('../controllers/roadmapController');
const settingsController = require('../controllers/settingsController');
const notificationController = require('../controllers/notificationController');

// Roadmap endpoints
router.get('/roadmap', roadmapController.getAllDays);
router.get('/roadmap/:dayNumber', roadmapController.getDayByNumber);
router.put('/roadmap/:dayNumber', roadmapController.updateDay);
router.post('/roadmap/:dayNumber/start', roadmapController.startDay);
router.post('/roadmap/:dayNumber/complete', roadmapController.completeDay);
router.put('/roadmap/:dayNumber/tasks/:taskId', roadmapController.updateTask);
router.put('/roadmap/:dayNumber/notes', roadmapController.updateNotes);

// Dashboard endpoint
router.get('/dashboard', roadmapController.getDashboardData);

// Settings endpoints
router.get('/settings', settingsController.getSettings);
router.put('/settings', settingsController.updateSettings);

// Test notification endpoints
router.post('/notifications/test-email', notificationController.sendTestEmail);
router.post('/notifications/test-sms', notificationController.sendTestSMS);

module.exports = router;
