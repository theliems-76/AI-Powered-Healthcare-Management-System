const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/profile', authMiddleware.verifyToken, userController.getProfile);
router.put('/profile', authMiddleware.verifyToken, userController.updateProfile);
router.put('/password', authMiddleware.verifyToken, userController.updatePassword);

// Lấy danh sách tất cả bác sĩ
router.get('/doctors', authMiddleware.verifyToken, userController.getAllDoctors);

// Route dành cho Bệnh nhân gửi yêu cầu Bác sĩ
router.post('/request-doctor', authMiddleware.verifyToken, authMiddleware.checkRole(['PATIENT']), userController.requestDoctor);
router.delete('/remove-doctor', authMiddleware.verifyToken, authMiddleware.checkRole(['PATIENT']), userController.removeDoctor);

// Route xử lý yêu cầu chung (Accept/Reject)
router.post('/accept-request/:notification_id', authMiddleware.verifyToken, userController.acceptRequest);
router.post('/reject-request/:notification_id', authMiddleware.verifyToken, userController.rejectRequest);

// Route dành cho Bác sĩ và Admin
router.get('/patients', authMiddleware.verifyToken, authMiddleware.checkRole(['DOCTOR', 'ADMIN']), userController.getMyPatients);
router.post('/patients/assign', authMiddleware.verifyToken, authMiddleware.checkRole(['DOCTOR', 'ADMIN']), userController.assignPatient);
router.delete('/patients/:id', authMiddleware.verifyToken, authMiddleware.checkRole(['DOCTOR', 'ADMIN']), userController.removePatient);

module.exports = router;