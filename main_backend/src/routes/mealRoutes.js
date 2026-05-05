const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/menu', authMiddleware.verifyToken, mealController.getAllDishes);
router.get('/daily-goal', authMiddleware.verifyToken, mealController.getDailyNutritionGoal);
router.get('/analyze/:id', authMiddleware.verifyToken, mealController.analyzeDishNutrition);

router.get('/ingredients', authMiddleware.verifyToken, mealController.getAllIngredients);
router.post('/ingredients', authMiddleware.verifyToken, mealController.createCustomIngredient);
router.post('/custom-dish', authMiddleware.verifyToken, mealController.createCustomDish);
router.put('/custom-dish/:id', authMiddleware.verifyToken, mealController.updateCustomDish);
router.post('/schedule', authMiddleware.verifyToken, mealController.scheduleMeal);
router.get('/schedule', authMiddleware.verifyToken, mealController.getWeeklySchedule);
router.delete('/schedule/:id', authMiddleware.verifyToken, mealController.removeScheduledMeal);
router.delete('/custom-dish/:id', authMiddleware.verifyToken, mealController.deleteCustomDish);
router.delete('/clear-all', authMiddleware.verifyToken, mealController.clearUserDishes);
module.exports = router;
