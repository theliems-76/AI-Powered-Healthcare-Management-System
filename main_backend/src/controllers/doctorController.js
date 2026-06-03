const { User, PatientProfile, MedicalRecord, Notification } = require('../models');
const { Op, Sequelize } = require('sequelize');
const { logAction } = require('./auditController');

// ==========================================
// 1. THỐNG KÊ TỔNG QUAN CHO BẢNG ĐIỀU KHIỂN BÁC SĨ
// ==========================================
exports.getDoctorStats = async (req, res) => {
    try {
        const doctorId = req.user.id;

        // Đếm tổng số bệnh nhân
        const totalPatients = await PatientProfile.count({
            where: { managed_by_doctor_id: doctorId }
        });

        // Lấy tất cả bản ghi gần nhất của mỗi bệnh nhân để tính rủi ro
        const patients = await PatientProfile.findAll({
            where: { managed_by_doctor_id: doctorId },
            attributes: ['id'],
            include: [{
                model: MedicalRecord,
                separate: true,
                limit: 1,
                order: [['createdAt', 'DESC']],
                attributes: ['ai_risk_score', 'createdAt', 'doctor_notes']
            }]
        });

        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        let highRiskCount = 0;
        let newRecords24h = 0;
        let criticalPatients = [];

        patients.forEach(p => {
            const latest = p.MedicalRecords?.[0];
            if (!latest) return;

            const risk = parseFloat(latest.ai_risk_score || 0);
            if (risk > 66) {
                highRiskCount++;
            }
            if (new Date(latest.createdAt) >= oneDayAgo) {
                newRecords24h++;
            }
        });

        res.status(200).json({
            status: 'success',
            data: {
                totalPatients,
                highRiskCount,
                newRecords24h,
                lowRiskCount: patients.filter(p => {
                    const r = parseFloat(p.MedicalRecords?.[0]?.ai_risk_score || 0);
                    return r <= 33;
                }).length,
                mediumRiskCount: patients.filter(p => {
                    const r = parseFloat(p.MedicalRecords?.[0]?.ai_risk_score || 0);
                    return r > 33 && r <= 66;
                }).length
            }
        });
    } catch (error) {
        console.error('Lỗi getDoctorStats:', error);
        res.status(500).json({ error: 'Lỗi lấy thống kê bác sĩ!' });
    }
};

// ==========================================
// 2. DANH SÁCH BỆNH NHÂN THEO MỨC ĐỘ RỦI RO (URGENT ALERTS)
// ==========================================
exports.getHighRiskPatients = async (req, res) => {
    try {
        const doctorId = req.user.id;

        const patients = await PatientProfile.findAll({
            where: { managed_by_doctor_id: doctorId },
            include: [
                {
                    model: User,
                    attributes: ['full_name', 'email', 'phone']
                },
                {
                    model: MedicalRecord,
                    separate: true,
                    limit: 2,
                    order: [['createdAt', 'DESC']],
                    attributes: ['id', 'ai_risk_score', 'ai_diagnosis', 'createdAt', 'doctor_notes']
                }
            ]
        });

        const result = patients
            .map(p => {
                const records = p.MedicalRecords || [];
                const latest = records[0];
                const prev = records[1];
                if (!latest) return null;

                const latestRisk = parseFloat(latest.ai_risk_score || 0);
                const prevRisk = prev ? parseFloat(prev.ai_risk_score || 0) : null;
                const riskDelta = prevRisk !== null ? (latestRisk - prevRisk).toFixed(1) : null;

                return {
                    id: p.id,
                    full_name: p.User?.full_name || 'Bệnh nhân chưa xác định',
                    email: p.User?.email,
                    phone: p.User?.phone,
                    latest_risk_score: latestRisk.toFixed(1),
                    latest_diagnosis: latest.ai_diagnosis,
                    last_record_id: latest.id,
                    last_visit: new Date(latest.createdAt).toLocaleDateString('vi-VN'),
                    has_doctor_notes: !!latest.doctor_notes,
                    risk_delta: riskDelta
                };
            })
            .filter(Boolean)
            .sort((a, b) => parseFloat(b.latest_risk_score) - parseFloat(a.latest_risk_score));

        res.status(200).json({ status: 'success', data: result });
    } catch (error) {
        console.error('Lỗi getHighRiskPatients:', error);
        res.status(500).json({ error: 'Lỗi lấy danh sách bệnh nhân rủi ro cao!' });
    }
};

// ==========================================
// 3. CẬP NHẬT GHI CHÚ BÁC SĨ CHO MỘT BẢN GHI
// ==========================================
exports.updateDoctorNotes = async (req, res) => {
    try {
        const { id } = req.params;
        const { doctor_notes, ai_nutrition_plan } = req.body;

        const record = await MedicalRecord.findByPk(id);
        if (!record) return res.status(404).json({ error: 'Không tìm thấy bản ghi!' });

        // Kiểm tra quyền: chỉ bác sĩ đang quản lý bệnh nhân mới được ghi chú
        const patientProfile = await PatientProfile.findByPk(record.patient_id);
        if (!patientProfile || patientProfile.managed_by_doctor_id !== req.user.id) {
            return res.status(403).json({ error: 'Bạn không có quyền chỉnh sửa hồ sơ này!' });
        }

        const updateData = {};
        if (doctor_notes !== undefined) updateData.doctor_notes = doctor_notes;
        if (ai_nutrition_plan !== undefined) updateData.ai_nutrition_plan = ai_nutrition_plan;

        await record.update(updateData);

        // Tạo thông báo cho bệnh nhân
        await Notification.create({
            user_id: patientProfile.user_id,
            title: 'Bác sĩ đã cập nhật ghi chú',
            message: 'Bác sĩ của bạn vừa cập nhật nhận xét chuyên môn vào hồ sơ AI.',
            type: 'DOCTOR_NOTE',
            link: `/history/${record.id}`
        });

        // Ghi Audit Log
        await logAction(
            req.user.id,
            'UPDATE_DOCTOR_NOTES',
            'MedicalRecord',
            record.id,
            req.ip || req.connection.remoteAddress,
            { patient_id: record.patient_id }
        );

        res.status(200).json({
            status: 'success',
            message: 'Đã lưu ghi chú bác sĩ!',
            data: { doctor_notes: record.doctor_notes }
        });
    } catch (error) {
        console.error('Lỗi updateDoctorNotes:', error);
        res.status(500).json({ error: 'Lỗi lưu ghi chú!' });
    }
};

// ==========================================
// 4. HỒ CHỨA BỆNH NHÂN CHỜ (PATIENT POOL)
// ==========================================
exports.getPatientPool = async (req, res) => {
    try {
        // Lấy các bệnh nhân chưa có bác sĩ quản lý
        const unassignedProfiles = await PatientProfile.findAll({
            where: { managed_by_doctor_id: null },
            include: [
                {
                    model: User,
                    attributes: ['full_name', 'email', 'phone', 'is_active']
                },
                {
                    model: MedicalRecord,
                    separate: true,
                    limit: 1,
                    order: [['createdAt', 'DESC']],
                    attributes: ['id', 'ai_risk_score', 'ai_diagnosis', 'createdAt']
                }
            ]
        });

        const pool = unassignedProfiles
            .filter(p => {
                if (!p.User || !p.User.is_active) return false;
                const latest = p.MedicalRecords?.[0];
                if (!latest) return false;
                return parseFloat(latest.ai_risk_score || 0) > 66; // Chỉ lấy nguy cơ cao
            })
            .map(p => {
                const latest = p.MedicalRecords[0];
                return {
                    id: p.id,
                    user_id: p.user_id,
                    full_name: p.User.full_name,
                    email: p.User.email,
                    phone: p.User.phone,
                    risk_score: parseFloat(latest.ai_risk_score || 0).toFixed(1),
                    diagnosis: latest.ai_diagnosis,
                    last_record_id: latest.id,
                    created_at: new Date(latest.createdAt).toLocaleDateString('vi-VN')
                };
            })
            .sort((a, b) => parseFloat(b.risk_score) - parseFloat(a.risk_score));

        res.status(200).json({ status: 'success', data: pool });
    } catch (error) {
        console.error('Lỗi getPatientPool:', error);
        res.status(500).json({ error: 'Lỗi lấy danh sách hồ chờ!' });
    }
};

exports.claimPatient = async (req, res) => {
    try {
        const { patientProfileId } = req.body;
        const profile = await PatientProfile.findByPk(patientProfileId);

        if (!profile) return res.status(404).json({ error: 'Không tìm thấy hồ sơ bệnh nhân!' });
        if (profile.managed_by_doctor_id) {
            return res.status(400).json({ error: 'Bệnh nhân này đã có bác sĩ quản lý!' });
        }

        await profile.update({ managed_by_doctor_id: req.user.id });

        // Thông báo cho bệnh nhân
        await Notification.create({
            user_id: profile.user_id,
            title: 'Đã có Bác sĩ phụ trách',
            message: 'Hồ sơ rủi ro cao của bạn đã được Bác sĩ tiếp nhận xử lý. Vui lòng kiểm tra lịch hẹn hoặc liên hệ bác sĩ.',
            type: 'DOCTOR_ASSIGNED'
        });

        res.status(200).json({ status: 'success', message: 'Tiếp nhận bệnh nhân thành công!' });
    } catch (error) {
        console.error('Lỗi claimPatient:', error);
        res.status(500).json({ error: 'Lỗi tiếp nhận bệnh nhân!' });
    }
};
