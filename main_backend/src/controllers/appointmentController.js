const { Appointment, PatientProfile, User } = require('../models');
const { Op } = require('sequelize');

exports.createAppointment = async (req, res) => {
    try {
        const { patient_profile_id, appointment_date, appointment_time, reason } = req.body;
        const doctor_id = req.user.id;

        const newAppointment = await Appointment.create({
            doctor_id,
            patient_profile_id,
            appointment_date,
            appointment_time,
            reason
        });

        res.status(201).json({ status: 'success', data: newAppointment });
    } catch (error) {
        console.error("Lỗi tạo lịch hẹn:", error);
        res.status(500).json({ error: "Lỗi hệ thống khi tạo lịch hẹn." });
    }
};

exports.getAppointments = async (req, res) => {
    try {
        const { date, status } = req.query;
        let whereClause = { doctor_id: req.user.id };

        if (date) whereClause.appointment_date = date;
        if (status) whereClause.status = status;

        const appointments = await Appointment.findAll({
            where: whereClause,
            include: [{
                model: PatientProfile,
                as: 'Patient',
                include: [{ model: User, attributes: ['full_name', 'email', 'phone'] }]
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

        const appointment = await Appointment.findOne({ where: { id, doctor_id: req.user.id } });
        if (!appointment) return res.status(404).json({ error: "Không tìm thấy lịch hẹn!" });

        if (status) appointment.status = status;
        if (notes !== undefined) appointment.notes = notes;

        await appointment.save();

        res.status(200).json({ status: 'success', data: appointment });
    } catch (error) {
        console.error("Lỗi cập nhật lịch hẹn:", error);
        res.status(500).json({ error: "Lỗi hệ thống khi cập nhật lịch hẹn." });
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findOne({ where: { id, doctor_id: req.user.id } });
        
        if (!appointment) return res.status(404).json({ error: "Không tìm thấy lịch hẹn!" });

        await appointment.destroy();
        res.status(200).json({ status: 'success', message: 'Đã hủy lịch hẹn.' });
    } catch (error) {
        console.error("Lỗi xóa lịch hẹn:", error);
        res.status(500).json({ error: "Lỗi hệ thống khi xóa lịch hẹn." });
    }
};
