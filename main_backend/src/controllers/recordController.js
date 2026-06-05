const crypto = require('crypto');
const axios = require('axios');
const { MedicalRecord, PatientProfile, Dish, Exercise, Ingredient, DishIngredient, Notification, AICache } = require('../models');
const { Sequelize, Op } = require('sequelize');
const { logAction } = require('./auditController');

// Background Job xử lý Gemini (Bất đồng bộ)
const runGeminiBackgroundJob = async (recordId, userId, aiResult, hashInput) => {
    let aiFullResponse = {}, aiNutritionPlan = "", recommendedFoods = [], recommendedActivities = [];
    
    try {
        console.log("🥗 [BACKGROUND] Đang gọi Bác sĩ Dinh dưỡng AI (Gemini)...");
        const nutritionResponse = await axios.post('http://127.0.0.1:8000/api/v1/ai/generate-plan', aiResult, { timeout: 120000 });
        aiFullResponse = nutritionResponse.data;
    } catch (geminiError) {
        console.error("⚠️ [BACKGROUND] Lỗi gọi Gemini AI (Hết Quota/Rate Limit), dùng phác đồ mặc định:", geminiError.message);
        aiFullResponse = {
            ai_nutritionist_plan: "Hệ thống AI Dinh dưỡng hiện đang quá tải. Dưới đây là phác đồ tham khảo cơ bản:\n\n1. Duy trì chế độ ăn nhiều rau xanh.\n2. Hạn chế đường và tinh bột nhanh.\n3. Tập thể dục ít nhất 30 phút mỗi ngày.",
            recommended_foods: [],
            recommended_activities: []
        };
    }

    if (typeof aiFullResponse === 'object' && aiFullResponse.ai_nutritionist_plan) {
        aiNutritionPlan = aiFullResponse.ai_nutritionist_plan;
        recommendedFoods = aiFullResponse.recommended_foods || [];
        recommendedActivities = aiFullResponse.recommended_activities || [];
    } else {
        try {
            const text = typeof aiFullResponse === 'string' ? aiFullResponse : JSON.stringify(aiFullResponse);
            const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
            if (jsonMatch) {
                const jsonData = JSON.parse(jsonMatch[1].trim());
                recommendedFoods = jsonData.recommended_foods || [];
                recommendedActivities = jsonData.recommended_activities || [];
                aiNutritionPlan = text.replace(jsonMatch[0], '').trim();
            } else {
                aiNutritionPlan = text;
            }
        } catch (parseError) {
            console.error("❌ [BACKGROUND] Lỗi bóc tách JSON từ AI:", parseError);
            aiNutritionPlan = typeof aiFullResponse === 'string' ? aiFullResponse : "Lỗi bóc tách thực đơn.";
        }
    }

    // 1. Update MedicalRecord
    try {
        await MedicalRecord.update({ ai_nutrition_plan: aiNutritionPlan }, { where: { id: recordId } });
        console.log("✅ [BACKGROUND] Đã cập nhật Phác đồ cho Bệnh án:", recordId);
    } catch (err) {
        console.error("❌ [BACKGROUND] Lỗi cập nhật Bệnh án:", err);
    }

    // 2. Lưu vào Cache
    try {
        await AICache.create({
            input_hash: hashInput,
            ai_risk_score: aiResult.risk_probability,
            ai_diagnosis: aiResult.diagnosis,
            ai_explanation: aiResult.explanation,
            ai_nutrition_plan: aiNutritionPlan,
            recommended_foods: recommendedFoods,
            recommended_activities: recommendedActivities
        });
        console.log("💾 [BACKGROUND] Đã lưu kết quả mới vào AI Cache!");
    } catch (cacheErr) {
        console.error("❌ [BACKGROUND] Lỗi lưu Cache:", cacheErr.message);
    }

    // 3. Tạo Foods & Exercises
    if (recommendedFoods.length > 0 && userId) {
        for (let food of recommendedFoods) {
            try {
                const existingDish = await Dish.findOne({ 
                    where: {[Op.and]:[
                        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), (food.name || "").toLowerCase()),
                        { [Op.or]:[{ user_id: null }, { user_id: userId }] }
                    ]} 
                });
                if (!existingDish) {
                    const newDish = await Dish.create({
                        name: food.name, category: food.category || 'Tự chọn', user_id: userId, is_ai_generated: true,
                        calories_per_100g: food.calories_per_100g || 0, carbs_per_100g: food.carbs_per_100g || 0,
                        protein_per_100g: food.protein_per_100g || 0, fat_per_100g: food.fat_per_100g || 0, serving_size_g: food.serving_size_g || 100
                    });
                    if (food.ingredients && Array.isArray(food.ingredients)) {
                        for (let ing of food.ingredients) {
                            let [dbIng] = await Ingredient.findOrCreate({
                                where: { name: ing.name },
                                defaults: {
                                    calories_per_100g: ing.calories_per_100g, carbs_per_100g: ing.carbs_per_100g,
                                    protein_per_100g: ing.protein_per_100g, fat_per_100g: ing.fat_per_100g, is_ai_generated: true
                                }
                            });
                            await DishIngredient.create({ dish_id: newDish.id, ingredient_id: dbIng.id, weight_grams: ing.weight_g || 100 });
                        }
                    }
                }
            } catch (e) { console.error("Lỗi tạo món ăn", e); }
        }
    }

    if (recommendedActivities.length > 0 && userId) {
        for (let activity of recommendedActivities) {
            try {
                const existingActivity = await Exercise.findOne({ where: { name: activity.name, user_id: userId } });
                if (!existingActivity) {
                    await Exercise.create({
                        name: activity.name, category: activity.category || 'Khác',
                        met_value: activity.met_value || 4.0, user_id: userId, is_ai_generated: true
                    });
                }
            } catch (e) { console.error("Lỗi tạo bài tập", e); }
        }
    }
};

exports.createDiagnosticRecord = async (req, res) => {
    try {
        const patientData = req.body;
        
        const featureKeys = ['HighBP', 'HighChol', 'CholCheck', 'BMI', 'Smoker', 'Stroke', 'HeartDiseaseorAttack', 'PhysActivity', 'Fruits', 'Veggies', 'HvyAlcoholConsump', 'AnyHealthcare', 'NoDocbcCost', 'GenHlth', 'MentHlth', 'PhysHlth', 'DiffWalk', 'Sex', 'Age', 'Education', 'Income'];
        let hashPayload = {};
        featureKeys.forEach(k => hashPayload[k] = patientData[k]);
        const hashInput = crypto.createHash('md5').update(JSON.stringify(hashPayload)).digest('hex');

        let aiResult, aiNutritionPlan = "PROCESSING";

        // 1. Kiểm tra Cache
        const cached = await AICache.findOne({ where: { input_hash: hashInput } });
        let isCached = false;
        
        if (cached) {
            console.log("⚡ [CACHE HIT] Đã tìm thấy kết quả AI trong Cache!");
            aiResult = {
                risk_probability: cached.ai_risk_score,
                diagnosis: cached.ai_diagnosis,
                explanation: typeof cached.ai_explanation === 'string' ? JSON.parse(cached.ai_explanation) : cached.ai_explanation
            };
            aiNutritionPlan = cached.ai_nutrition_plan; // Đã có sẵn phác đồ
            isCached = true;
        } else {
            console.log("📥 Đã nhận dữ liệu, đang gọi AI dự đoán...");
            const predictResponse = await axios.post('http://127.0.0.1:8000/api/v1/ai/predict', hashPayload);
            aiResult = predictResponse.data;
            console.log("🤖 AI đã chẩn đoán xong nguy cơ!");
            // Chưa có phác đồ, đánh dấu là PROCESSING
        }

        // 2. Lưu Bệnh án (Trả kết quả ngay lập tức cho Frontend)
        let pId = req.body.patientProfileId || null;
        let dId = null;

        if (req.user.role === 'PATIENT') {
            const profile = await PatientProfile.findOne({ where: { user_id: req.user.id } });
            if (profile) {
                pId = profile.id;
                dId = profile.managed_by_doctor_id; 
            }
        } else if (req.user.role === 'DOCTOR') {
            dId = req.user.id; 
        }

        const newRecord = await MedicalRecord.create({
            patient_id: pId,
            doctor_id: dId,
            health_indicators: patientData,
            ai_risk_score: aiResult.risk_probability,
            ai_diagnosis: aiResult.diagnosis,
            ai_explanation: aiResult.explanation,
            ai_nutrition_plan: aiNutritionPlan,
        });

        // 3. Kích hoạt Background Job nếu CHƯA có Cache
        if (!isCached) {
            // Không `await` để Frontend nhận kết quả ngay!
            runGeminiBackgroundJob(newRecord.id, req.user.id, aiResult, hashInput).catch(e => console.error("Background Job Failed:", e));
        } else {
            // Nếu có cache, giả vờ gọi background job để tạo món ăn (nếu thiếu) nhưng thực ra ta có thể bỏ qua.
        }

        // 4. Kích hoạt chuông thông báo cho bác sĩ nếu nguy cơ cao (>66)
        if (aiResult.risk_probability > 66 && dId) {
            await Notification.create({
                user_id: dId,
                title: 'Cảnh báo Bệnh nhân Rủi ro cao!',
                message: `Hệ thống vừa phát hiện nguy cơ cao (${aiResult.risk_probability}%) ở một bệnh nhân của bạn. Vui lòng kiểm tra.`,
                type: 'URGENT_RISK',
                link: `/history/${newRecord.id}`
            });
        }

        res.status(200).json({
            status: "success",
            message: isCached ? "Đã lấy dữ liệu từ Cache thành công!" : "Đã phân tích xong Ma trận, đang sinh Phác đồ nền...",
            data: newRecord
        });

    } catch (error) {
        console.error("❌ Lỗi Hệ thống Microservice:", error.message);
        res.status(500).json({ error: "Hệ thống AI đang bảo trì hoặc quá tải, vui lòng thử lại sau." });
    }
};

exports.getRecordById = async (req, res) => {
    try {
        const record = await MedicalRecord.findByPk(req.params.id);
        if (!record) return res.status(404).json({ error: "Không tìm thấy hồ sơ!" });
        
        // Kiểm tra quyền truy cập (IDOR Fix)
        if (req.user.role === 'DOCTOR') {
            const profile = await PatientProfile.findByPk(record.patient_id);
            if (!profile || profile.managed_by_doctor_id !== req.user.id) {
                return res.status(403).json({ error: "Yêu cầu không hợp lệ. Bạn không có quyền truy cập." });
            }
        } else if (req.user.role === 'PATIENT') {
            const profile = await PatientProfile.findOne({ where: { user_id: req.user.id } });
            if (!profile || record.patient_id !== profile.id) {
                return res.status(403).json({ error: "Yêu cầu không hợp lệ. Bạn không có quyền truy cập." });
            }
        }
        
        let responseData = record.toJSON();
        if (typeof responseData.health_indicators === 'string') {
            responseData.health_indicators = JSON.parse(responseData.health_indicators);
        }
        
        // Ghi log bảo mật (chỉ khi có req.user, nghĩa là có người dùng truy cập)
        if (req.user) {
            await logAction(
                req.user.id,
                'VIEW_RECORD_DETAIL',
                'MedicalRecord',
                record.id,
                req.ip || req.connection.remoteAddress,
                { patient_id: record.patient_id, viewer_role: req.user.role }
            );
        }

        res.status(200).json({ status: "success", data: responseData });
    } catch (error) {
        console.error("Lỗi getRecordById:", error.message);
        res.status(500).json({ error: "Yêu cầu không thể thực hiện, vui lòng thử lại sau." });
    }
};

exports.getPatientHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        let targetPatientProfileId = null;

        if (role === 'PATIENT') {
            const profile = await PatientProfile.findOne({ where: { user_id: userId } });
            if (!profile) {
                return res.status(404).json({ error: "Không tìm thấy hồ sơ bệnh nhân!" });
            }
            targetPatientProfileId = profile.id;
        } else if (role === 'DOCTOR' || role === 'ADMIN') {
            const { patientId } = req.query;
            if (!patientId) {
                return res.status(400).json({ error: "Thông tin không đầy đủ." });
            }
            if (role === 'DOCTOR') {
                const profile = await PatientProfile.findByPk(patientId);
                if (!profile || profile.managed_by_doctor_id !== userId) {
                    return res.status(403).json({ error: "Yêu cầu không hợp lệ. Bạn không có quyền xem hồ sơ này." });
                }
            }
            targetPatientProfileId = patientId;
        }

        const records = await MedicalRecord.findAll({
            where: { patient_id: targetPatientProfileId },
            order: [['createdAt', 'ASC']] 
        });

       const chartData = records.map(record => {
            const indicators = typeof record.health_indicators === 'string' 
                ? JSON.parse(record.health_indicators) 
                : (record.health_indicators || {});

            let explanation = record.ai_explanation;
            if (typeof explanation === 'string') {
                try { explanation = JSON.parse(explanation); } catch (e) { explanation = null; }
            }

            return {
                id: record.id,
                date: new Date(record.createdAt).toLocaleString('vi-VN', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                }),
                risk_score: parseFloat(record.ai_risk_score || 0).toFixed(1),
                bmi: parseFloat(indicators.BMI || 0).toFixed(1),
                ai_diagnosis: record.ai_diagnosis,
                ai_nutrition_plan: record.ai_nutrition_plan,
                ai_explanation: explanation,
                health_status: indicators.GenHlth || 0,
                doctor_notes: record.doctor_notes || null
            };
        });

        res.status(200).json({ status: "success", data: chartData });
    } catch (error) {
        console.error("❌ Lỗi API History:", error);
        res.status(500).json({ error: "Hệ thống đang bận, vui lòng thử lại sau." });
    }
};