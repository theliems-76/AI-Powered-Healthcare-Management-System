const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/list', authMiddleware.verifyToken, exerciseController.getAllExercises);
router.post('/custom', authMiddleware.verifyToken, exerciseController.createCustomExercise);
router.put('/custom/:id', authMiddleware.verifyToken, exerciseController.updateCustomExercise);
router.delete('/custom/:id', authMiddleware.verifyToken, exerciseController.deleteCustomExercise);
router.delete('/clear-all', authMiddleware.verifyToken, exerciseController.clearUserExercises);

router.post('/schedule', authMiddleware.verifyToken, exerciseController.scheduleExercise);
router.get('/schedule', authMiddleware.verifyToken, exerciseController.getDailyExercises);
router.delete('/schedule/:id', authMiddleware.verifyToken, exerciseController.removeScheduledExercise);

module.exports = router;