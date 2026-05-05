const { Dish, Ingredient, DishIngredient, MedicalRecord } = require('../models');
const { Op } = require('sequelize');
const { PatientMeal, PatientProfile } = require('../models');
exports.getAllIngredients = async (req, res) => {
    try {
        const ingredients = await Ingredient.findAll({
            where: {[Op.or]: [{ user_id: null }, { user_id: req.user.id }] },
            order: [['name', 'ASC']]
        });
        
        const uniqueMap = new Map();
        for (const ing of ingredients) {
            if (!uniqueMap.has(ing.name)) {
                uniqueMap.set(ing.name, ing);
            }
        }
        
        res.status(200).json({ status: "success", data: Array.from(uniqueMap.values()) });
    } catch (error) {
        res.status(500).json({ error: "Lỗi lấy danh sách nguyên liệu!" });
    }
};

exports.createCustomIngredient = async (req, res) => {
    try {
        const { name, calories_per_100g, carbs_per_100g, protein_per_100g, fat_per_100g } = req.body;
        const newIng = await Ingredient.create({
            name, calories_per_100g, carbs_per_100g, protein_per_100g, fat_per_100g,
            user_id: req.user.id
        });
        res.status(201).json({ status: "success", data: newIng });
    } catch (error) {
        res.status(500).json({ error: "Lỗi tạo nguyên liệu mới!" });
    }
};

exports.createCustomDish = async (req, res) => {
    try {
        const { name, category, ingredients } = req.body;

        const existingDish = await Dish.findOne({
            where: {
                name: name.trim(),
                [Op.or]:[{ user_id: null }, { user_id: req.user.id }]
            }
        });

        if (existingDish) {
            return res.status(400).json({ error: "Tên món ăn này đã tồn tại. Vui lòng chọn tên khác!" });
        }

        const newDish = await Dish.create({
            name: name.trim(), 
            category: category || 'Tự chọn',
            user_id: req.user.id
        });

        const dishIngredientsData = ingredients.map(ing => ({
            dish_id: newDish.id,
            ingredient_id: ing.id,
            weight_grams: ing.weight
        }));
        
        await DishIngredient.bulkCreate(dishIngredientsData);

        res.status(201).json({ status: "success", message: "Tạo món ăn thành công!", data: newDish });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi lưu công thức món ăn!" });
    }
};

exports.analyzeDishNutrition = async (req, res) => {
    try {
        const dish = await Dish.findByPk(req.params.id, {
            include:[{ model: Ingredient, through: { attributes: ['weight_grams'] } }]
        });

        if (!dish) return res.status(404).json({ error: "Không tìm thấy món ăn!" });

        let sumCalories = 0, sumCarbs = 0, sumProtein = 0, sumFat = 0;
        let ingredientDetails = [];

        if (dish.calories_per_100g > 0) {
            sumCalories = dish.calories_per_100g;
            sumCarbs = dish.carbs_per_100g;
            sumProtein = dish.protein_per_100g;
            sumFat = dish.fat_per_100g;
            ingredientDetails = [{ name: "Thông số từ AI", weight_grams: 100, calories: sumCalories }];
        } else {
            ingredientDetails = dish.Ingredients.map(ing => {
                const weight = parseFloat(ing.DishIngredient.weight_grams) || 0;
                const ratio = weight / 100; 
                const cal = (parseFloat(ing.calories_per_100g) || 0) * ratio;
                const carb = (parseFloat(ing.carbs_per_100g) || 0) * ratio;
                const pro = (parseFloat(ing.protein_per_100g) || 0) * ratio;
                
                sumCalories += cal; sumCarbs += carb; sumProtein += pro;

                return { name: ing.name, weight_grams: weight, calories: cal.toFixed(1), carbs: carb.toFixed(1) };
            });
        }

        let medicalWarning = sumCarbs > 60 ? "⚠️ Cảnh báo: Lượng Tinh bột/Đường khá cao!" : null;

        return res.status(200).json({
            status: "success", 
            dish_name: dish.name,
            is_ai_generated: dish.is_ai_generated,
            total_nutrition: {
                total_calories: sumCalories.toFixed(1), 
                total_carbs: sumCarbs.toFixed(1), 
                total_protein: sumProtein.toFixed(1)
            },
            serving_size_g: dish.serving_size_g || 100,
            medical_warning: medicalWarning, 
            ingredients_breakdown: ingredientDetails
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi tính toán Dinh dưỡng!" });
    }
};

exports.getAllDishes = async (req, res) => {
    try {
        const dishes = await Dish.findAll({
            where: { 
                [Op.or]:[{ user_id: null }, { user_id: req.user.id }],
                is_deleted: false
            },
            include: [{ 
                model: Ingredient, 
                through: { attributes:['weight_grams'] } 
            }],
            order: [['user_id', 'DESC'],['name', 'ASC']]
        });
        
        const data = dishes.map(dish => {
            let totalWeight = dish.serving_size_g || 0;
            
            if (dish.Ingredients && dish.Ingredients.length > 0) {
                const sumWeight = dish.Ingredients.reduce((sum, ing) => sum + (parseFloat(ing.DishIngredient?.weight_grams) || 0), 0);
                if (sumWeight > 0) totalWeight = sumWeight;
            }
            
            if (totalWeight === 0) totalWeight = 100;

            return {
                ...dish.toJSON(),
                is_custom: dish.user_id === req.user.id,
                is_ai_generated: dish.is_ai_generated,
                serving_size_g: totalWeight
            };
        });

        res.status(200).json({ status: "success", data });
    } catch (error) {
        res.status(500).json({ error: "Lỗi lấy danh sách món ăn!" });
    }
};

exports.getDailyNutritionGoal = async (req, res) => {
    try {
        const userId = req.user.id;

        const profile = await PatientProfile.findOne({ where: { user_id: userId } });
        if (!profile) return res.status(404).json({ error: "Không tìm thấy hồ sơ." });

        const latestRecord = await MedicalRecord.findOne({
            where: { patient_id: profile.id },
            order: [['createdAt', 'DESC']]
        });

        let riskScore = 0;
        let healthData = {};
        if (latestRecord) {
            riskScore = latestRecord.ai_risk_score;
            healthData = typeof latestRecord.health_indicators === 'string' 
                ? JSON.parse(latestRecord.health_indicators) 
                : latestRecord.health_indicators;
        }

        const weightKg = parseFloat(profile.weight_kg) || 65;
        const heightCm = parseFloat(profile.height_cm) || 165; 
        
        const sex = parseInt(healthData.Sex) || 1;
        const estimatedAge = (parseInt(healthData.Age || 5) * 5) + 17;
        const isActive = parseInt(healthData.PhysActivity) || 0;

        let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * estimatedAge);
        bmr = sex === 1 ? bmr + 5 : bmr - 161;

        const activityFactor = isActive === 1 ? 1.55 : 1.2; 
        let tdee = bmr * activityFactor;

        const currentBmi = weightKg / ((heightCm / 100) * (heightCm / 100));
        
        let medicalAdvice = "Cân nặng và rủi ro ổn định. Hãy duy trì ngân sách năng lượng này để bảo vệ sức khỏe.";
        
        if (riskScore > 50 || currentBmi >= 25) {
            tdee -= 500;
            medicalAdvice = `AI phát hiện rủi ro cao hoặc BMI ở mức Thừa cân (${currentBmi.toFixed(1)}). Hệ thống đã tự động cắt giảm 500 kcal/ngày vào ngân sách để ép cân an toàn.`;
        }
        
        const minCalories = sex === 1 ? 1500 : 1200;
        let targetCalories = Math.max(tdee, minCalories);

        const targetCarbs = (targetCalories * 0.45) / 4;
        const targetProtein = (targetCalories * 0.20) / 4;

        res.status(200).json({
            status: "success",
            advice: medicalAdvice,
            data: {
                calories: Math.round(targetCalories),
                carbs: Math.round(targetCarbs),
                protein: Math.round(targetProtein)
            }
        });

    } catch (error) {
        console.error("Lỗi tính toán Y khoa:", error);
        res.status(500).json({ error: "Lỗi hệ thống!" });
    }
};
exports.scheduleMeal = async (req, res) => {
    try {
        const { dish_id, meal_time, date, total_calories_calculated, total_carbs_calculated, total_protein_calculated } = req.body;
        
        const profile = await PatientProfile.findOne({ where: { user_id: req.user.id } });
        if (!profile) return res.status(404).json({ error: "Không tìm thấy hồ sơ bệnh nhân!" });

        const newMeal = await PatientMeal.create({
            patient_id: profile.id,
            dish_id,
            meal_time,
            date,
            total_calories_calculated,
            total_carbs_calculated,
            total_protein_calculated,
            weight_grams: req.body.weight_grams || 100
        });

        res.status(201).json({ status: "success", data: newMeal });
    } catch (error) {
        res.status(500).json({ error: "Lỗi lưu bữa ăn!" });
    }
};

exports.getWeeklySchedule = async (req, res) => {
    try {
        const { date } = req.query;
        const profile = await PatientProfile.findOne({ where: { user_id: req.user.id } });
        
        const meals = await PatientMeal.findAll({
            where: { patient_id: profile.id, date: date },
            include: [{ model: Dish, attributes:['name'] }],
        });

        res.status(200).json({ status: "success", data: meals });
    } catch (error) {
        res.status(500).json({ error: "Lỗi tải lịch trình!" });
    }
};

exports.deleteCustomDish = async (req, res) => {
    try {
        const dishId = req.params.id;
        
        const dish = await Dish.findOne({ where: { id: dishId, user_id: req.user.id } });
        if (!dish) return res.status(403).json({ error: "Bạn không có quyền xóa món này!" });

        await dish.update({ is_deleted: true });
        
        res.status(200).json({ status: "success", message: "Đã xóa món ăn." });
    } catch (error) {
        res.status(500).json({ error: "Lỗi hệ thống khi xóa!" });
    }
};

exports.removeScheduledMeal = async (req, res) => {
    try {
        const mealId = req.params.id;
        const profile = await PatientProfile.findOne({ where: { user_id: req.user.id } });
        if (!profile) return res.status(404).json({ error: "Không tìm thấy hồ sơ!" });

        const scheduledMeal = await PatientMeal.findOne({ 
            where: { id: mealId, patient_id: profile.id } 
        });

        if (!scheduledMeal) return res.status(403).json({ error: "Bạn không có quyền xóa bữa ăn này!" });

        await scheduledMeal.destroy();
        res.status(200).json({ status: "success", message: "Đã xóa khỏi nhật ký." });
    } catch (error) {
        res.status(500).json({ error: "Lỗi xóa bữa ăn!" });
    }
};

exports.clearUserDishes = async (req, res) => {
    try {
        const userId = req.user.id;
        await Dish.destroy({ where: { user_id: userId } });
        res.status(200).json({ status: "success", message: "Đã làm sạch kho món ăn cá nhân!" });
    } catch (error) {
        res.status(500).json({ error: "Lỗi dọn kho dữ liệu!" });
    }
};
exports.updateCustomDish = async (req, res) => {
    try {
        const dishId = req.params.id;
        const { name, category, ingredients } = req.body;
        const trimmedName = name.trim();

        const dish = await Dish.findOne({ where: { id: dishId, user_id: req.user.id } });
        if (!dish) return res.status(403).json({ error: "Bạn không có quyền sửa món này!" });

        const existingDish = await Dish.findOne({
            where: {
                name: trimmedName,
                id: { [Op.ne]: dishId },
                [Op.or]:[{ user_id: null }, { user_id: req.user.id }]
            }
        });

        if (existingDish) {
            return res.status(400).json({ error: "Tên món ăn đã tồn tại. Vui lòng chọn tên khác!" });
        }

        await dish.update({ name: trimmedName, category });

        await DishIngredient.destroy({ where: { dish_id: dishId } });
        
        const dishIngredientsData = ingredients.map(ing => ({
            dish_id: dishId,
            ingredient_id: ing.id,
            weight_grams: ing.weight
        }));
        await DishIngredient.bulkCreate(dishIngredientsData);

        res.status(200).json({ status: "success", message: "Đã cập nhật món ăn!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi cập nhật món ăn!" });
    }
};