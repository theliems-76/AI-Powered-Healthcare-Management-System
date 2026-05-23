const { User, PatientProfile, MedicalRecord, Dish, Exercise } = require('../models');

const { Op } = require('sequelize');

// ==========================================
// 1. LẤY DANH SÁCH TẤT CẢ NGƯỜI DÙNG
// ==========================================
exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || '';
        const roleFilter = req.query.role;
        const offset = (page - 1) * limit;

        const whereCondition = {};
        
        if (roleFilter && roleFilter !== 'ALL') {
            whereCondition.role = roleFilter;
        }

        if (search) {
            whereCondition[Op.or] = [
                { full_name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { phone: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows: users } = await User.findAndCountAll({
            where: whereCondition,
            attributes:['id', 'email', 'full_name', 'phone', 'role', 'is_active', 'createdAt'],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        res.status(200).json({ 
            status: "success", 
            data: users,
            pagination: {
                total: count,
                page,
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error("Lỗi lấy danh sách user:", error);
        res.status(500).json({ error: "Lỗi hệ thống!" });
    }
};

// ==========================================
// 2. THAY ĐỔI QUYỀN (ROLE) CỦA USER
// ==========================================
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body; // 'ADMIN', 'DOCTOR', 'PATIENT'
        const userId = req.params.id;

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ error: "Không tìm thấy user!" });

        await user.update({ role });
        res.status(200).json({ status: "success", message: "Đã cập nhật phân quyền." });
    } catch (error) {
        res.status(500).json({ error: "Lỗi cập nhật quyền!" });
    }
};

// ==========================================
// 3. KHÓA / MỞ KHÓA TÀI KHOẢN (TOGGLE STATUS)
// ==========================================
exports.toggleUserStatus = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);
        
        if (!user) return res.status(404).json({ error: "Không tìm thấy user!" });
        if (user.id === req.user.id) return res.status(400).json({ error: "Không thể tự khóa chính mình!" });

        // Đảo ngược trạng thái hiện tại (Đang True -> False, đang False -> True)
        await user.update({ is_active: !user.is_active });
        
        res.status(200).json({ 
            status: "success", 
            message: user.is_active ? "Đã mở khóa tài khoản." : "Đã khóa tài khoản." 
        });
    } catch (error) {
        res.status(500).json({ error: "Lỗi cập nhật trạng thái!" });
    }
};

// ==========================================
// 4. LẤY THỐNG KÊ TỔNG QUAN (DÀNH CHO DASHBOARD ADMIN)
// ==========================================
exports.getSystemStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalPatients = await User.count({ where: { role: 'PATIENT' } });
        const totalDoctors = await User.count({ where: { role: 'DOCTOR' } });
        const totalRecords = await MedicalRecord.count();
        const totalDishes = await Dish.count({ where: { user_id: null, is_deleted: false } });

        // Risk distribution (AI Risk) - ONLY LATEST RECORD PER PATIENT
        const allRecords = await MedicalRecord.findAll({ 
            attributes: ['patient_id', 'ai_risk_score', 'createdAt'],
            order: [['createdAt', 'DESC']]
        });
        
        const latestRiskPerPatient = {};
        allRecords.forEach(r => {
            if (r.ai_risk_score != null && !latestRiskPerPatient[r.patient_id]) {
                latestRiskPerPatient[r.patient_id] = r.ai_risk_score;
            }
        });

        let riskHigh = 0, riskMedium = 0, riskLow = 0;
        Object.values(latestRiskPerPatient).forEach(score => {
            if (score > 66) riskHigh++;
            else if (score > 33) riskMedium++;
            else riskLow++;
        });

        const assessedPatientsCount = Object.keys(latestRiskPerPatient).length;
        const unassessedPatients = Math.max(0, totalPatients - assessedPatientsCount);

        const riskDistribution = [
            { name: "Nguy cơ cao", value: riskHigh, fill: "url(#riskHigh)" },
            { name: "Trung bình", value: riskMedium, fill: "url(#riskMedium)" },
            { name: "Khỏe mạnh", value: riskLow, fill: "url(#riskLow)" },
            { name: "Chưa đánh giá", value: unassessedPatients, fill: "url(#riskEmpty)" }
        ].filter(item => item.value > 0);

        // Record trend (last 6 months safely)
        const recordTrend = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `T${d.getMonth() + 1}/${d.getFullYear()}`;
            recordTrend.push({ name: key, records: 0 });
        }
        
        const records = await MedicalRecord.findAll({ attributes: ['createdAt'] });
        records.forEach(r => {
            const d = new Date(r.createdAt);
            const key = `T${d.getMonth() + 1}/${d.getFullYear()}`;
            const target = recordTrend.find(x => x.name === key);
            if (target) target.records += 1;
        });

        res.status(200).json({
            status: "success",
            data: { 
                totalUsers, totalPatients, totalDoctors, totalRecords, totalDishes,
                riskDistribution: riskDistribution.length > 0 ? riskDistribution : [{ name: "Chưa có dữ liệu", value: 1, fill: "#e2e8f0" }],
                recordTrend
            }
        });
    } catch (error) {
        console.error("Lỗi lấy thống kê:", error);
        res.status(500).json({ error: "Lỗi lấy thống kê!" });
    }
};

// ==========================================
// 5. LẤY DANH SÁCH BÀI TẬP HỆ THỐNG
// ==========================================
exports.getSystemExercises = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || '';
        const offset = (page - 1) * limit;

        const whereCondition = { user_id: null, is_deleted: false };
        if (search) {
            whereCondition.name = { [Op.like]: `%${search}%` };
        }

        const { count, rows: exercises } = await Exercise.findAndCountAll({
            where: whereCondition,
            order: [['name', 'ASC']],
            limit,
            offset
        });

        res.status(200).json({ status: "success", data: exercises, pagination: { total: count, page, totalPages: Math.ceil(count / limit) } });
    } catch (error) {
        res.status(500).json({ error: "Lỗi lấy bài tập hệ thống!" });
    }
};

// ==========================================
// 6. LẤY DANH SÁCH MÓN ĂN HỆ THỐNG
// ==========================================
exports.getSystemDishes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || '';
        const offset = (page - 1) * limit;

        const whereCondition = { user_id: null, is_deleted: false };
        if (search) {
            whereCondition.name = { [Op.like]: `%${search}%` };
        }

        const { count, rows: dishes } = await Dish.findAndCountAll({
            where: whereCondition,
            order: [['name', 'ASC']],
            limit,
            offset
        });

        res.status(200).json({ status: "success", data: dishes, pagination: { total: count, page, totalPages: Math.ceil(count / limit) } });
    } catch (error) {
        res.status(500).json({ error: "Lỗi lấy món ăn hệ thống!" });
    }
};

// ==========================================
// 7. IMPORT HÀNG LOẠT BÀI TẬP HỆ THỐNG
// ==========================================
exports.importSystemExercises = async (req, res) => {
    try {
        const { data } = req.body;
        if (!Array.isArray(data) || data.length === 0) {
            return res.status(400).json({ error: "Dữ liệu JSON không hợp lệ!" });
        }

        const exercises = data.map(item => ({
            name: item.name,
            met_value: parseFloat(item.met_value),
            category: item.category || 'Khác',
            user_id: null,
            is_ai_generated: true
        }));

        await Exercise.bulkCreate(exercises, { ignoreDuplicates: true });
        res.status(201).json({ status: "success", message: `Đã import thành công ${exercises.length} bài tập!` });
    } catch (error) {
        res.status(500).json({ error: "Lỗi import bài tập!" });
    }
};

// ==========================================
// 8. IMPORT HÀNG LOẠT MÓN ĂN HỆ THỐNG
// ==========================================
exports.importSystemDishes = async (req, res) => {
    try {
        const { data } = req.body;
        if (!Array.isArray(data) || data.length === 0) {
            return res.status(400).json({ error: "Dữ liệu JSON không hợp lệ!" });
        }

        const dishes = data.map(item => ({
            name: item.name,
            category: item.category || 'Khác',
            calories_per_100g: parseFloat(item.calories_per_100g) || 0,
            carbs_per_100g: parseFloat(item.carbs_per_100g) || 0,
            protein_per_100g: parseFloat(item.protein_per_100g) || 0,
            fat_per_100g: parseFloat(item.fat_per_100g) || 0,
            user_id: null,
            is_ai_generated: true
        }));

        await Dish.bulkCreate(dishes, { ignoreDuplicates: true });
        res.status(201).json({ status: "success", message: `Đã import thành công ${dishes.length} món ăn!` });
    } catch (error) {
        res.status(500).json({ error: "Lỗi import món ăn!" });
    }
};

// ==========================================
// 9. THÊM ĐƠN LẺ BÀI TẬP HỆ THỐNG
// ==========================================
exports.createSystemExercise = async (req, res) => {
    try {
        const { name, met_value, category } = req.body;
        if (!name || !met_value) return res.status(400).json({ error: "Thiếu tên hoặc MET value!" });

        const newEx = await Exercise.create({
            name,
            met_value: parseFloat(met_value),
            category: category || 'Khác',
            user_id: null,
            is_ai_generated: false
        });

        res.status(201).json({ status: "success", message: "Thêm bài tập thành công!", data: newEx });
    } catch (error) {
        res.status(500).json({ error: "Lỗi tạo bài tập!" });
    }
};

// ==========================================
// 10. THÊM ĐƠN LẺ MÓN ĂN HỆ THỐNG
// ==========================================
exports.createSystemDish = async (req, res) => {
    try {
        const { name, category, calories_per_100g, carbs_per_100g, protein_per_100g, fat_per_100g } = req.body;
        if (!name) return res.status(400).json({ error: "Tên món ăn là bắt buộc!" });

        const newDish = await Dish.create({
            name,
            category: category || 'Khác',
            calories_per_100g: parseFloat(calories_per_100g) || 0,
            carbs_per_100g: parseFloat(carbs_per_100g) || 0,
            protein_per_100g: parseFloat(protein_per_100g) || 0,
            fat_per_100g: parseFloat(fat_per_100g) || 0,
            user_id: null,
            is_ai_generated: false
        });

        res.status(201).json({ status: "success", message: "Thêm món ăn thành công!", data: newDish });
    } catch (error) {
        res.status(500).json({ error: "Lỗi tạo món ăn!" });
    }
};

exports.updateSystemExercise = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, met_value } = req.body;
        
        const exercise = await Exercise.findOne({ where: { id, user_id: null } });
        if (!exercise) return res.status(404).json({ error: "Không tìm thấy bài tập hệ thống!" });
        
        await exercise.update({ name, category, met_value });
        res.status(200).json({ status: "success", message: "Đã cập nhật bài tập!", data: exercise });
    } catch (error) {
        res.status(500).json({ error: "Lỗi cập nhật bài tập!" });
    }
};

exports.deleteSystemExercise = async (req, res) => {
    try {
        const { id } = req.params;
        const exercise = await Exercise.findOne({ where: { id, user_id: null } });
        if (!exercise) return res.status(404).json({ error: "Không tìm thấy bài tập hệ thống!" });
        
        await exercise.update({ is_deleted: true });
        res.status(200).json({ status: "success", message: "Đã xóa bài tập!" });
    } catch (error) {
        res.status(500).json({ error: "Lỗi xóa bài tập!" });
    }
};

exports.updateSystemDish = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, calories_per_100g, carbs_per_100g, protein_per_100g, fat_per_100g } = req.body;
        
        const dish = await Dish.findOne({ where: { id, user_id: null } });
        if (!dish) return res.status(404).json({ error: "Không tìm thấy món ăn hệ thống!" });
        
        await dish.update({ name, category, calories_per_100g, carbs_per_100g, protein_per_100g, fat_per_100g });
        res.status(200).json({ status: "success", message: "Đã cập nhật món ăn!", data: dish });
    } catch (error) {
        res.status(500).json({ error: "Lỗi cập nhật món ăn!" });
    }
};

exports.deleteSystemDish = async (req, res) => {
    try {
        const { id } = req.params;
        const dish = await Dish.findOne({ where: { id, user_id: null } });
        if (!dish) return res.status(404).json({ error: "Không tìm thấy món ăn hệ thống!" });
        
        await dish.update({ is_deleted: true });
        res.status(200).json({ status: "success", message: "Đã xóa món ăn!" });
    } catch (error) {
        res.status(500).json({ error: "Lỗi xóa món ăn!" });
    }
};