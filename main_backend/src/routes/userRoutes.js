const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/profile', authMiddleware.verifyToken, userController.getProfile);
router.put('/profile', authMiddleware.verifyToken, userController.updateProfile);
router.put('/password', authMiddleware.verifyToken, userController.updatePassword);

// Lấy danh sách tất cả bác sĩ
router.get('/doctors', authMiddleware.verifyToken, userController.getAllDoctors);

// Route dành cho Bác sĩ và Admin
router.get('/patients', authMiddleware.verifyToken, authMiddleware.checkRole(['DOCTOR', 'ADMIN']), userController.getMyPatients);
router.post('/patients/assign', authMiddleware.verifyToken, authMiddleware.checkRole(['DOCTOR', 'ADMIN']), userController.assignPatient);

module.exports = router;