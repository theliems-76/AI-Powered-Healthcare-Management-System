const { PatientMeal, PatientExercise, PatientProfile, MedicalRecord } = require('../models');
const { Op } = require('sequelize');

exports.getMonthlyStats = async (req, res) => {
    try {
        const { year, month } = req.query;
        if (!year || !month) return res.status(400).json({ error: "Missing year or month" });

        const profile = await PatientProfile.findOne({ where: { user_id: req.user.id } });
        if (!profile) return res.status(404).json({ error: "Profile not found" });

        const latestRecord = await MedicalRecord.findOne({
            where: { patient_id: profile.id },
            order: [['createdAt', 'DESC']]
        });

        let targetCalories = 2000;
        
        if (latestRecord) {
            const healthData = typeof latestRecord.health_indicators === 'string' 
                ? JSON.parse(latestRecord.health_indicators) 
                : (latestRecord.health_indicators || {});
            
            const riskScore = latestRecord.ai_risk_score || 0;

            const weightKg = parseFloat(profile.weight_kg) || 65;
            const heightCm = parseFloat(profile.height_cm) || 165;

            const sex = parseInt(healthData.Sex) || 1; 
            const isActive = parseInt(healthData.PhysActivity) || 0; 
            const estimatedAge = (parseInt(healthData.Age || 5) * 5) + 17; 

            let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * estimatedAge);
            bmr = sex === 1 ? bmr + 5 : bmr - 161;

            const activityFactor = isActive === 1 ? 1.55 : 1.2; 
            let tdee = bmr * activityFactor;

            const currentBmi = weightKg / ((heightCm / 100) * (heightCm / 100));

            if (riskScore > 50 || currentBmi >= 25) {
                tdee -= 500; 
            }
            
            const minCalories = sex === 1 ? 1500 : 1200;
            targetCalories = Math.max(tdee, minCalories);
        }

        const startDate = `${year}-${month.padStart(2, '0')}-01`;
        const lastDay = new Date(year, parseInt(month), 0).getDate();
        const endDate = `${year}-${month.padStart(2, '0')}-${lastDay}`;

        const meals = await PatientMeal.findAll({
            where: {
                patient_id: profile.id,
                date: { [Op.between]: [startDate, endDate] }
            }
        });

        const exercises = await PatientExercise.findAll({
            where: {
                patient_id: profile.id,
                date: {[Op.between]: [startDate, endDate] }
            }
        });

        const groupedData = {};

        meals.forEach(m => {
            if (!groupedData[m.date]) {
                groupedData[m.date] = { consumed: 0, carbs: 0, protein: 0, burned: 0, deficit: 0, hasData: true };
            }
            groupedData[m.date].consumed += parseFloat(m.total_calories_calculated || 0);
            groupedData[m.date].carbs += parseFloat(m.total_carbs_calculated || 0);
            groupedData[m.date].protein += parseFloat(m.total_protein_calculated || 0);
        });

        exercises.forEach(e => {
            if (!groupedData[e.date]) {
                groupedData[e.date] = { consumed: 0, carbs: 0, protein: 0, burned: 0, deficit: 0, hasData: true };
            }
            groupedData[e.date].burned += parseFloat(e.calories_burned || 0);
        });

        for (const date in groupedData) {
            const day = groupedData[date];
            day.deficit = (targetCalories + day.burned) - day.consumed;
            
            day.consumed = Math.round(day.consumed);
            day.carbs = Math.round(day.carbs);
            day.protein = Math.round(day.protein);
            day.burned = Math.round(day.burned);
            day.deficit = Math.round(day.deficit);
        }

        res.status(200).json({ 
            status: "success", 
            target_calories: Math.round(targetCalories),
            data: groupedData 
        });

    } catch (error) {
        console.error("Lỗi getMonthlyStats:", error);
        res.status(500).json({ error: "Lỗi tải dữ liệu lịch!" });
    }
};