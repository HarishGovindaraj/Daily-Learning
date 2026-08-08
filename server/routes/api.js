const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const roadmapController = require('../controllers/roadmapController');
const settingsController = require('../controllers/settingsController');
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const { verifyCaptcha } = require('../middleware/captcha');

// Public Authentication Routes
router.get('/auth/config', authController.getAuthConfig);
router.post('/auth/signup', verifyCaptcha, authController.signup);
router.post('/auth/login', verifyCaptcha, authController.login);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password', authController.resetPassword);

// Protected Roadmap Routes
router.get('/roadmap', protect, roadmapController.getAllDays);
router.get('/roadmap/:dayNumber', protect, roadmapController.getDayByNumber);
router.put('/roadmap/:dayNumber', protect, roadmapController.updateDay);
router.post('/roadmap/:dayNumber/start', protect, roadmapController.startDay);
router.post('/roadmap/:dayNumber/complete', protect, roadmapController.completeDay);
router.put('/roadmap/:dayNumber/tasks/:taskId', protect, roadmapController.updateTask);
router.put('/roadmap/:dayNumber/notes', protect, roadmapController.updateNotes);
router.post('/roadmap/select', protect, roadmapController.selectRoadmap);

// Protected Dashboard Route
router.get('/dashboard', protect, roadmapController.getDashboardData);

// Protected Settings Routes
router.get('/settings', protect, settingsController.getSettings);
router.put('/settings', protect, settingsController.updateSettings);

// Protected Test Notification Routes
router.post('/notifications/test-email', protect, notificationController.sendTestEmail);
router.post('/notifications/test-sms', protect, notificationController.sendTestSMS);

module.exports = router;
