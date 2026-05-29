const { Appointment, PatientProfile, User, Notification } = require('../models');
const { Op } = require('sequelize');

exports.createAppointment = async (req, res) => {
    try {
        const { appointment_date, appointment_time, reason } = req.body;
        const user = req.user;
        let doctor_id, patient_profile_id, creator_name, receiver_id;

        if (user.role === 'DOCTOR') {
            doctor_id = user.id;
            patient_profile_id = req.body.patient_profile_id;
            
            // Get patient user_id for notification
            const patientProfile = await PatientProfile.findByPk(patient_profile_id);
            if (!patientProfile) return res.status(404).json({ error: "Không tìm thấy hồ sơ bệnh nhân" });
            receiver_id = patientProfile.user_id;
            
            const docInfo = await User.findByPk(user.id);
            creator_name = `Bác sĩ ${docInfo.full_name}`;
        } else if (user.role === 'PATIENT') {
            const patientProfile = await PatientProfile.findOne({ where: { user_id: user.id } });
            if (!patientProfile || !patientProfile.managed_by_doctor_id) {
                return res.status(400).json({ error: "Bệnh nhân chưa được quản lý bởi bác sĩ nào." });
            }
            patient_profile_id = patientProfile.id;
            doctor_id = patientProfile.managed_by_doctor_id;
            receiver_id = doctor_id;
            creator_name = `Bệnh nhân`; // Or query real name
        }

        const newAppointment = await Appointment.create({
            doctor_id,
            patient_profile_id,
            appointment_date,
            appointment_time,
            reason,
            status: 'PENDING',
            created_by_role: user.role
        });

        // Create Notification
        if (receiver_id) {
            await Notification.create({
                user_id: receiver_id,
                title: 'Lịch hẹn mới cần xác nhận',
                message: `${creator_name} vừa gửi một yêu cầu đặt lịch khám vào lúc ${appointment_time} ngày ${appointment_date}. Vui lòng kiểm tra và xác nhận.`,
                type: 'APPOINTMENT',
                link: '/appointments'
            });
        }

        res.status(201).json({ status: 'success', data: newAppointment });
    } catch (error) {
        console.error("Lỗi tạo lịch hẹn:", error);
        res.status(500).json({ error: "Lỗi hệ thống khi tạo lịch hẹn." });
    }
};

exports.getAppointments = async (req, res) => {
    try {
        const { date, status } = req.query;
        let whereClause = {};

        if (req.user.role === 'DOCTOR') {
            whereClause.doctor_id = req.user.id;
        } else if (req.user.role === 'PATIENT') {
            const patientProfile = await PatientProfile.findOne({ where: { user_id: req.user.id } });
            if (!patientProfile) return res.status(200).json({ status: 'success', data: [] });
            whereClause.patient_profile_id = patientProfile.id;
        }

        if (date) whereClause.appointment_date = date;
        if (status) whereClause.status = status;

        const appointments = await Appointment.findAll({
            where: whereClause,
            include: [{
                model: PatientProfile,
                as: 'Patient',
                include: [{ model: User, attributes: ['full_name', 'email', 'phone'] }]
            }, {
                model: User,
                as: 'Doctor',
                attributes: ['full_name', 'email', 'phone']
            }],
            order: [['appointment_date', 'ASC'], ['appointment_time', 'ASC']]
        });

        res.status(200).json({ status: 'success', data: appointments });
    } catch (error) {
        console.error("Lỗi tải lịch hẹn:", error);
        res.status(500).json({ error: "Lỗi hệ thống khi tải lịch hẹn." });
    }
};

exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        const user = req.user;

        let whereClause = { id };
        
        if (user.role === 'DOCTOR') {
            whereClause.doctor_id = user.id;
        } else if (user.role === 'PATIENT') {
            const patientProfile = await PatientProfile.findOne({ where: { user_id: user.id } });
            if (patientProfile) {
                whereClause.patient_profile_id = patientProfile.id;
            } else {
                return res.status(403).json({ error: "Không có quyền cập nhật." });
            }
        }

        const appointment = await Appointment.findOne({ 
            where: whereClause,
            include: [{ model: PatientProfile, as: 'Patient' }]
        });
        
        if (!appointment) return res.status(404).json({ error: "Không tìm thấy lịch hẹn hoặc không có quyền!" });

        if (status) appointment.status = status;
        if (notes !== undefined) appointment.notes = notes;

        await appointment.save();

        // Notification
        const receiver_id = user.role === 'DOCTOR' ? appointment.Patient.user_id : appointment.doctor_id;
        const creator_name = user.role === 'DOCTOR' ? 'Bác sĩ' : 'Bệnh nhân';
        
        let statusText = status === 'CONFIRMED' ? 'Đã Chấp nhận' : (status === 'CANCELLED' ? 'Đã Hủy/Từ chối' : 'Đã Cập nhật');
        
        if (status === 'CONFIRMED' || status === 'CANCELLED') {
            await Notification.create({
                user_id: receiver_id,
                title: `Lịch hẹn ${statusText}`,
                message: `${creator_name} ${statusText.toLowerCase()} yêu cầu lịch hẹn lúc ${appointment.appointment_time} ngày ${appointment.appointment_date}.`,
                type: 'APPOINTMENT',
                link: '/appointments'
            });
        }

        res.status(200).json({ status: 'success', data: appointment });
    } catch (error) {
        console.error("Lỗi cập nhật lịch hẹn:", error);
        res.status(500).json({ error: "Lỗi hệ thống khi cập nhật lịch hẹn." });
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        let whereClause = { id };
        
        if (req.user.role === 'DOCTOR') {
            whereClause.doctor_id = req.user.id;
        } else if (req.user.role === 'PATIENT') {
            const patientProfile = await PatientProfile.findOne({ where: { user_id: req.user.id } });
            whereClause.patient_profile_id = patientProfile.id;
        }
        
        const appointment = await Appointment.findOne({ where: whereClause });
        if (!appointment) return res.status(404).json({ error: "Không tìm thấy lịch hẹn!" });

        await appointment.destroy();
        res.status(200).json({ status: 'success', message: 'Đã xóa lịch hẹn.' });
    } catch (error) {
        console.error("Lỗi xóa lịch hẹn:", error);
        res.status(500).json({ error: "Lỗi hệ thống khi xóa lịch hẹn." });
    }
};
