const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auditController = require('../controllers/auditController');
const authMiddleware = require('../middlewares/authMiddleware');

// Middleware kiểm tra quyền ADMIN cho toàn bộ route
router.get('/stats', authMiddleware.verifyToken, authMiddleware.checkRole(['ADMIN']), adminController.getSystemStats);
router.get('/users', authMiddleware.verifyToken, authMiddleware.checkRole(['ADMIN']), adminController.getAllUsers);
router.put('/users/:id/role', authMiddleware.verifyToken, authMiddleware.checkRole(['ADMIN']), adminController.updateUserRole);
router.put('/users/:id/status', authMiddleware.verifyToken, authMiddleware.checkRole(['ADMIN']), adminController.toggleUserStatus);

router.get('/logs', authMiddleware.verifyToken, authMiddleware.checkRole(['ADMIN']), auditController.getLogs);

const notificationController = require('../controllers/notificationController');
router.post('/notifications/broadcast', authMiddleware.verifyToken, authMiddleware.checkRole(['ADMIN']), notificationController.broadcast);

router.get('/exercises', authMiddleware.verifyToken, authMiddleware.checkRole(['ADMIN']), adminController.getSystemExercises);
router.post('/exercises', authMiddleware.verifyToken, authMiddleware.checkRole(['ADMIN']), adminController.createSystemExercise);
router.post('/exercises/bulk', authMiddleware.verifyToken, authMiddleware.checkRole(['ADMIN']), adminController.importSystemExercises);

router.get('/dishes', authMiddleware.verifyToken, authMiddleware.checkRole(['ADMIN']), adminController.getSystemDishes);
router.post('/dishes', authMiddleware.verifyToken, authMiddleware.checkRole(['ADMIN']), adminController.createSystemDish);
router.post('/dishes/bulk', authMiddleware.verifyToken, authMiddleware.checkRole(['ADMIN']), adminController.importSystemDishes);

router.put('/exercises/:id', authMiddleware.verifyToken, authMiddleware.checkRole(['ADMIN']), adminController.updateSystemExercise);
router.delete('/exercises/:id', authMiddleware.verifyToken, authMiddleware.checkRole(['ADMIN']), adminController.deleteSystemExercise);
router.put('/dishes/:id', authMiddleware.verifyToken, authMiddleware.checkRole(['ADMIN']), adminController.updateSystemDish);
router.delete('/dishes/:id', authMiddleware.verifyToken, authMiddleware.checkRole(['ADMIN']), adminController.deleteSystemDish);

module.exports = router;