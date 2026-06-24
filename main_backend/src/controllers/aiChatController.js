const axios = require('axios');
const { PatientProfile, MedicalRecord, Appointment, User, ChatHistory } = require('../models');

exports.processChat = async (req, res) => {
    try {
        const { messages } = req.body;
        
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Lịch sử tin nhắn không hợp lệ." });
        }

        let medical_context = null;
        let doctor_id = null;
        let doctor_name = null;
        let patient_profile_id = null;

        if (req.user.role === 'PATIENT') {
            const profile = await PatientProfile.findOne({ 
                where: { user_id: req.user.id },
                include: [{ model: User, as: 'Doctor', attributes: ['id', 'full_name'] }]
            });
            if (profile) {
                patient_profile_id = profile.id;
                doctor_id = profile.managed_by_doctor_id;
                if (profile.Doctor) {
                    doctor_name = profile.Doctor.full_name;
                }

                const latestRecord = await MedicalRecord.findOne({
                    where: { patient_id: profile.id },
                    order: [['createdAt', 'DESC']]
                });

                if (latestRecord) {
                    const indicators = typeof latestRecord.health_indicators === 'string' 
                        ? JSON.parse(latestRecord.health_indicators) 
                        : (latestRecord.health_indicators || {});

                    medical_context = {
                        bmi: indicators.BMI,
                        risk_score: latestRecord.ai_risk_score,
                        diagnosis: latestRecord.ai_diagnosis,
                        general_health: indicators.GenHlth,
                        physical_activity: indicators.PhysActivity,
                        last_updated: latestRecord.createdAt
                    };
                }
            }
        } else if (req.user.role === 'DOCTOR' || req.user.role === 'ADMIN') {
            const reqPatientId = req.body.patient_profile_id;
            if (reqPatientId) {
                const whereCondition = req.user.role === 'ADMIN' ? { id: reqPatientId } : { id: reqPatientId, managed_by_doctor_id: req.user.id };
                const profile = await PatientProfile.findOne({ where: whereCondition });
                
                if (profile) {
                    patient_profile_id = profile.id;
                    doctor_id = req.user.id;
                    doctor_name = req.user.name;

                    const latestRecord = await MedicalRecord.findOne({
                        where: { patient_id: profile.id },
                        order: [['createdAt', 'DESC']]
                    });

                    if (latestRecord) {
                        const indicators = typeof latestRecord.health_indicators === 'string' 
                            ? JSON.parse(latestRecord.health_indicators) 
                            : (latestRecord.health_indicators || {});

                        medical_context = {
                            bmi: indicators.BMI,
                            risk_score: latestRecord.ai_risk_score,
                            diagnosis: latestRecord.ai_diagnosis,
                            general_health: indicators.GenHlth,
                            physical_activity: indicators.PhysActivity,
                            last_updated: latestRecord.createdAt
                        };
                    }
                }
            }
        }

        // Lưu tin nhắn của User vào Database TRƯỚC KHI gọi AI
        const userLastMsg = messages[messages.length - 1];
        if (userLastMsg && userLastMsg.role === 'user') {
            await ChatHistory.create({
                user_id: req.user.id,
                role: 'user',
                content: userLastMsg.content
            });
        }

        const pythonAiResponse = await axios.post('http://127.0.0.1:8000/api/v1/ai/chat', {
            messages: messages,
            user_info: {
                user_id: req.user.id,
                role: req.user.role,
                name: req.user.name,
                medical_context: medical_context,
                patient_profile_id: patient_profile_id,
                doctor_id: doctor_id,
                doctor_name: doctor_name
            }
        });

        // Lưu tin nhắn của Model vào Database SAU KHI AI trả lời
        const aiResponseContent = pythonAiResponse.data.content;
        if (aiResponseContent) {
            await ChatHistory.create({
                user_id: req.user.id,
                role: 'model',
                content: aiResponseContent
            });
        }

        res.status(200).json({ 
            status: "success", 
            data: pythonAiResponse.data 
        });

    } catch (error) {
        console.error("❌ Lỗi gọi AI Chat:", error.message);
        res.status(500).json({ error: "Bác sĩ AI đang bận rộn, vui lòng thử lại sau giây lát." });
    }
};

exports.webhookBookAppointment = async (req, res) => {
    try {
        const { patient_profile_id, doctor_id, date, time, reason } = req.body;

        if (!patient_profile_id || !doctor_id || !date || !time) {
            return res.status(400).json({ error: "Thiếu thông tin bắt buộc để đặt lịch." });
        }

        // Tạo lịch khám
        const appointment = await Appointment.create({
            patient_profile_id,
            doctor_id,
            appointment_date: date,
            appointment_time: time,
            reason: reason || 'Khám tổng quát qua Bác sĩ AI',
            status: 'PENDING',
            created_by_role: 'PATIENT' // AI book on behalf of patient
        });

        res.status(201).json({
            status: "success",
            message: "Đã đặt lịch khám thành công.",
            appointment
        });
    } catch (error) {
        console.error("❌ Lỗi Webhook AI Đặt lịch:", error);
        res.status(500).json({ error: "Không thể tạo lịch khám tại hệ thống." });
    }
};

exports.getChatHistory = async (req, res) => {
    try {
        const history = await ChatHistory.findAll({
            where: { user_id: req.user.id },
            order: [['createdAt', 'ASC']]
        });
        
        const formattedHistory = history.map(item => ({
            role: item.role,
            content: item.content
        }));
        
        res.status(200).json({
            status: "success",
            data: formattedHistory
        });
    } catch (error) {
        console.error("❌ Lỗi lấy lịch sử Chat:", error.message);
        res.status(500).json({ error: "Lỗi tải lịch sử trò chuyện." });
    }
};
