const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/profile', authMiddleware.verifyToken, userController.getProfile);
router.put('/profile', authMiddleware.verifyToken, userController.updateProfile);
router.get('/patients', authMiddleware.verifyToken, userController.getMyPatients);
router.post('/patients/assign', authMiddleware.verifyToken, userController.assignPatient);
module.exports = router;