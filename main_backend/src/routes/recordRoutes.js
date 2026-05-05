const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/analyze', authMiddleware.verifyToken, recordController.createDiagnosticRecord);
router.get('/history', authMiddleware.verifyToken, recordController.getPatientHistory);
router.get('/:id', authMiddleware.verifyToken, recordController.getRecordById);
module.exports = router;