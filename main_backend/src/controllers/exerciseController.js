const { Exercise, PatientExercise, PatientProfile } = require('../models');
const { Op } = require('sequelize');

exports.getAllExercises = async (req, res) => {
    try {
        const userId = req.user.id;
        const exercises = await Exercise.findAll({
            where: { 
                [Op.or]: [{ user_id: null }, { user_id: userId }],
                is_deleted: false
            },
            order: [['user_id', 'DESC'], ['name', 'ASC']]
        });
        
        const data = exercises.map(ex => ({
            ...ex.toJSON(),
            is_custom: ex.user_id === userId,
            is_ai_generated: ex.is_ai_generated || false
        }));

        res.status(200).json({ status: "success", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi lấy danh sách thể thao!" });
    }
};

exports.createCustomExercise = async (req, res) => {
    try {
        const { name, met_value, category } = req.body;
        const trimmedName = name.trim();

        const existingEx = await Exercise.findOne({
            where: {
                name: trimmedName,
                [Op.or]:[{ user_id: null }, { user_id: req.user.id }],
                is_deleted: false
            }
        });

        if (existingEx) return res.status(400).json({ error: "Môn tập này đã có trong hệ thống!" });

        const newEx = await Exercise.create({
            name: trimmedName, 
            met_value: parseFloat(met_value), 
            category: category || 'Khác',
            user_id: req.user.id
        });
        
        res.status(201).json({ status: "success", data: newEx });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi tạo bài tập mới!" });
    }
};

exports.updateCustomExercise = async (req, res) => {
    try {
        const exId = req.params.id;
        const { name, met_value, category } = req.body;
        const trimmedName = name.trim();

        const exercise = await Exercise.findOne({ where: { id: exId, user_id: req.user.id } });
        if (!exercise) return res.status(403).json({ error: "Bạn không có quyền sửa môn này!" });

        const existingEx = await Exercise.findOne({
            where: {
                name: trimmedName,
                id: { [Op.ne]: exId },
                [Op.or]:[{ user_id: null }, { user_id: req.user.id }],
                is_deleted: false
            }
        });

        if (existingEx) return res.status(400).json({ error: "Tên môn tập đã tồn tại!" });

        await exercise.update({ name: trimmedName, met_value: parseFloat(met_value), category });
        res.status(200).json({ status: "success", message: "Đã cập nhật môn tập!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi cập nhật môn tập!" });
    }
};

exports.deleteCustomExercise = async (req, res) => {
    try {
        const exId = req.params.id;
        const exercise = await Exercise.findOne({ where: { id: exId, user_id: req.user.id } });
        if (!exercise) return res.status(403).json({ error: "Bạn không có quyền xóa môn này!" });

        await exercise.update({ is_deleted: true });
        res.status(200).json({ status: "success", message: "Đã xóa môn tập." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi hệ thống khi xóa!" });
    }
};

exports.clearUserExercises = async (req, res) => {
    try {
        await Exercise.update({ is_deleted: true }, { where: { user_id: req.user.id } });
        res.status(200).json({ status: "success", message: "Đã làm sạch kho bài tập cá nhân!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi dọn kho dữ liệu!" });
    }
};

exports.scheduleExercise = async (req, res) => {
    try {
        const { exercise_id, duration_minutes, calories_burned, date } = req.body;
        
        const profile = await PatientProfile.findOne({ where: { user_id: req.user.id } });
        if (!profile) return res.status(403).json({ error: "Chỉ Bệnh nhân mới có thể lưu nhật ký!" });

        const newLog = await PatientExercise.create({
            patient_id: profile.id,
            exercise_id,
            duration_minutes,
            calories_burned,
            date
        });

        res.status(201).json({ status: "success", data: newLog });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi lưu nhật ký tập luyện!" });
    }
};

exports.getDailyExercises = async (req, res) => {
    try {
        const { date } = req.query;
        const profile = await PatientProfile.findOne({ where: { user_id: req.user.id } });
        
        if (!profile) return res.status(200).json({ status: "success", data:[] });
        
        const logs = await PatientExercise.findAll({
            where: { patient_id: profile.id, date: date },
            include:[{ model: Exercise, attributes: ['name', 'met_value'] }]
        });

        res.status(200).json({ status: "success", data: logs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi lấy dữ liệu tập luyện!" });
    }
};

exports.removeScheduledExercise = async (req, res) => {
    try {
        const logId = req.params.id;
        const profile = await PatientProfile.findOne({ where: { user_id: req.user.id } });
        if (!profile) return res.status(403).json({ error: "Chỉ bệnh nhân mới có quyền xóa!" });

        const log = await PatientExercise.findOne({ 
            where: { id: logId, patient_id: profile.id } 
        });

        if (!log) return res.status(403).json({ error: "Bạn không có quyền xóa bản ghi này!" });

        await log.destroy();
        res.status(200).json({ status: "success", message: "Đã xóa khỏi nhật ký." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi xóa bản ghi tập luyện!" });
    }
};