const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const authMiddleware = require('../middlewares/authMiddleware');

const isDoctor = [authMiddleware.verifyToken, authMiddleware.checkRole(['DOCTOR'])];

// Thống kê tổng quan dashboard bác sĩ
router.get('/stats', isDoctor, doctorController.getDoctorStats);

// Danh sách bệnh nhân sắp xếp theo mức độ rủi ro
router.get('/patients/risk', isDoctor, doctorController.getHighRiskPatients);

// Cập nhật ghi chú bác sĩ cho một bản ghi y tế
router.put('/records/:id/notes', isDoctor, doctorController.updateDoctorNotes);

// Hồ chứa bệnh nhân chờ
router.get('/pool', isDoctor, doctorController.getPatientPool);
router.post('/pool/claim', isDoctor, doctorController.claimPatient);

module.exports = router;
