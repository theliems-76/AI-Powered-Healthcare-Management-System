const { User, PatientProfile, MedicalRecord, Notification } = require('../models');
const bcrypt = require('bcryptjs');

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId, {
            attributes:['id', 'email', 'full_name', 'phone', 'role'],
            include: [{ 
                model: PatientProfile, 
                as: 'Profile',
                include: [{
                    model: User,
                    as: 'Doctor',
                    attributes: ['id', 'full_name', 'email', 'phone']
                }]
            }]
        });

        if (!user) return res.status(404).json({ error: "Không tìm thấy người dùng!" });

        res.status(200).json({ status: "success", data: user });
    } catch (error) {
        console.error("Lỗi getProfile:", error);
        res.status(500).json({ error: "Lỗi tải thông tin cá nhân!" });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { full_name, phone, date_of_birth, gender, address, weight_kg, height_cm } = req.body;

        await User.update(
            { full_name, phone },
            { where: { id: userId } }
        );

        if (req.user.role === 'PATIENT') {
            const profile = await PatientProfile.findOne({ where: { user_id: userId } });
            
            if (profile) {
                await profile.update({
                    date_of_birth,
                    gender,
                    address,
                    weight_kg: parseFloat(weight_kg) || profile.weight_kg,
                    height_cm: parseFloat(height_cm) || profile.height_cm
                });
            } else {
                await PatientProfile.create({
                    user_id: userId,
                    date_of_birth,
                    gender,
                    address,
                    weight_kg: parseFloat(weight_kg) || 65,
                    height_cm: parseFloat(height_cm) || 165
                });
            }
        }

        res.status(200).json({ status: "success", message: "Đã cập nhật hồ sơ thành công!" });
    } catch (error) {
        console.error("Lỗi updateProfile:", error);
        res.status(500).json({ error: "Lỗi lưu thông tin cá nhân!" });
    }
};

exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await User.findAll({
            where: { role: 'DOCTOR', is_active: true },
            attributes: ['id', 'full_name', 'email']
        });
        res.status(200).json({ status: 'success', data: doctors });
    } catch (error) {
        console.error("Lỗi getAllDoctors:", error);
        res.status(500).json({ error: "Lỗi tải danh sách bác sĩ" });
    }
};

exports.getMyPatients = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const offset = (page - 1) * limit;

        const whereCondition = req.user.role === 'ADMIN' ? {} : { managed_by_doctor_id: req.user.id };

        const { count, rows: patients } = await PatientProfile.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            include:[
                { 
                    model: User, 
                    attributes: ['full_name', 'email', 'phone'] 
                },
                { 
                    model: MedicalRecord,
                    separate: true,
                    limit: 1,
                    order: [['createdAt', 'DESC']],
                    attributes: ['ai_risk_score', 'ai_diagnosis', 'createdAt']
                }
            ]
        });

        const formattedPatients = patients.map(p => {
            const latestRecord = p.MedicalRecords && p.MedicalRecords.length > 0 ? p.MedicalRecords[0] : null;
            
            return {
                id: p.id,
                user_id: p.user_id,
                full_name: p.User.full_name,
                email: p.User.email,
                phone: p.User.phone,
                gender: p.gender,
                date_of_birth: p.date_of_birth,
                latest_risk_score: latestRecord ? latestRecord.ai_risk_score : null,
                latest_diagnosis: latestRecord ? latestRecord.ai_diagnosis : 'Chưa khám',
                last_visit: latestRecord ? new Date(latestRecord.createdAt).toLocaleDateString('vi-VN') : null
            };
        });

        res.status(200).json({ 
            status: "success", 
            data: formattedPatients,
            pagination: {
                total: count,
                page,
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error("Lỗi getMyPatients:", error);
        res.status(500).json({ error: "Lỗi hệ thống khi tải danh sách bệnh nhân!" });
    }
};

exports.assignPatient = async (req, res) => {
    try {
        if (req.user.role !== 'DOCTOR' && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: "Không có quyền thực hiện!" });
        }

        const { patient_email } = req.body;
        if (!patient_email) {
            return res.status(400).json({ error: "Vui lòng nhập email bệnh nhân!" });
        }

        const targetUser = await User.findOne({
            where: { email: patient_email, role: 'PATIENT' }
        });
        if (!targetUser) {
            return res.status(404).json({ error: "Không tìm thấy bệnh nhân với email này!" });
        }

        if (!targetUser.is_active) {
            return res.status(403).json({ error: "Tài khoản bệnh nhân này chưa được kích hoạt!" });
        }

        const profile = await PatientProfile.findOne({ where: { user_id: targetUser.id } });
        if (!profile) {
            return res.status(404).json({ error: "Bệnh nhân chưa có hồ sơ y tế!" });
        }

        if (profile.managed_by_doctor_id === req.user.id) {
            return res.status(400).json({ error: "Bệnh nhân này đã trong danh sách của bạn!" });
        }

        // Gửi Notification cho Bệnh nhân
        await Notification.create({
            user_id: targetUser.id,
            title: 'Yêu cầu kết nối từ Bác sĩ',
            message: `Bác sĩ ${req.user.full_name} muốn thêm bạn vào danh sách bệnh nhân quản lý.`,
            type: 'DOCTOR_REQUEST',
            link: req.user.id // Lưu id của bác sĩ gửi yêu cầu
        });

        res.status(200).json({
            status: "success",
            message: `Đã gửi yêu cầu kết nối đến bệnh nhân ${targetUser.full_name}. Vui lòng chờ xác nhận!`,
        });
    } catch (error) {
        console.error("Lỗi assignPatient:", error);
        res.status(500).json({ error: "Lỗi hệ thống khi gán bệnh nhân!" });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { current_password, new_password } = req.body;

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ error: "Không tìm thấy người dùng!" });

        const isMatch = await bcrypt.compare(current_password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: "Mật khẩu hiện tại không đúng!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);

        await user.update({ password_hash: hashedPassword });

        res.status(200).json({ status: "success", message: "Đổi mật khẩu thành công!" });
    } catch (error) {
        console.error("Lỗi updatePassword:", error);
        res.status(500).json({ error: "Lỗi hệ thống khi đổi mật khẩu!" });
    }
};

exports.requestDoctor = async (req, res) => {
    try {
        const { doctor_id } = req.body;
        const patient = await User.findByPk(req.user.id);
        const doctor = await User.findByPk(doctor_id);

        if (!doctor || doctor.role !== 'DOCTOR') return res.status(404).json({ error: "Không tìm thấy bác sĩ!" });

        const profile = await PatientProfile.findOne({ where: { user_id: req.user.id } });
        if (!profile) return res.status(400).json({ error: "Vui lòng cập nhật hồ sơ cá nhân trước khi chọn bác sĩ." });

        if (profile.managed_by_doctor_id) {
            return res.status(400).json({ error: "Bạn đã có bác sĩ phụ trách rồi. Vui lòng hủy kết nối trước khi chọn bác sĩ mới." });
        }

        await Notification.create({
            user_id: doctor.id,
            title: 'Yêu cầu kết nối từ Bệnh nhân',
            message: `Bệnh nhân ${patient.full_name} muốn chọn bạn làm Bác sĩ phụ trách.`,
            type: 'PATIENT_REQUEST',
            link: patient.id
        });

        res.status(200).json({ status: 'success', message: 'Đã gửi yêu cầu đến Bác sĩ. Vui lòng chờ xác nhận!' });
    } catch (error) {
        console.error("Lỗi requestDoctor:", error);
        res.status(500).json({ error: "Lỗi gửi yêu cầu kết nối." });
    }
};

exports.acceptRequest = async (req, res) => {
    try {
        const { notification_id } = req.params;
        const notification = await Notification.findByPk(notification_id);
        if (!notification || notification.user_id !== req.user.id) {
            return res.status(404).json({ error: "Không tìm thấy yêu cầu!" });
        }

        let patient_id, doctor_id;
        let patientUser, doctorUser;

        if (notification.type === 'DOCTOR_REQUEST') {
            patient_id = req.user.id;
            doctor_id = notification.link;
            patientUser = await User.findByPk(patient_id);
            doctorUser = await User.findByPk(doctor_id);
        } else if (notification.type === 'PATIENT_REQUEST') {
            doctor_id = req.user.id;
            patient_id = notification.link;
            patientUser = await User.findByPk(patient_id);
            doctorUser = await User.findByPk(doctor_id);
        } else {
            return res.status(400).json({ error: "Loại yêu cầu không hợp lệ." });
        }

        const profile = await PatientProfile.findOne({ where: { user_id: patient_id } });
        if (!profile) return res.status(404).json({ error: "Bệnh nhân không có hồ sơ." });

        if (profile.managed_by_doctor_id) {
            await notification.update({ is_read: true });
            return res.status(400).json({ error: "Bệnh nhân này đã có bác sĩ phụ trách!" });
        }

        await profile.update({ managed_by_doctor_id: doctor_id });
        await notification.update({ is_read: true });

        // Gửi thông báo 2 chiều
        const notifyTargetId = notification.type === 'DOCTOR_REQUEST' ? doctor_id : patient_id;
        const notifyMsg = notification.type === 'DOCTOR_REQUEST' 
            ? `Bệnh nhân ${patientUser.full_name} đã CHẤP NHẬN yêu cầu kết nối của bạn.`
            : `Bác sĩ ${doctorUser.full_name} đã CHẤP NHẬN yêu cầu kết nối của bạn.`;

        await Notification.create({
            user_id: notifyTargetId,
            title: 'Chấp nhận kết nối',
            message: notifyMsg,
            type: 'SYSTEM'
        });

        res.status(200).json({ status: 'success', message: 'Đã chấp nhận kết nối!' });
    } catch (error) {
        console.error("Lỗi acceptRequest:", error);
        res.status(500).json({ error: "Lỗi xử lý yêu cầu." });
    }
};

exports.rejectRequest = async (req, res) => {
    try {
        const { notification_id } = req.params;
        const notification = await Notification.findByPk(notification_id);
        if (!notification || notification.user_id !== req.user.id) {
            return res.status(404).json({ error: "Không tìm thấy yêu cầu!" });
        }

        await notification.update({ is_read: true });

        // Gửi thông báo từ chối
        const targetId = notification.link;
        const myUser = await User.findByPk(req.user.id);
        await Notification.create({
            user_id: targetId,
            title: 'Từ chối kết nối',
            message: `${myUser.full_name} đã TỪ CHỐI yêu cầu kết nối của bạn.`,
            type: 'SYSTEM'
        });

        res.status(200).json({ status: 'success', message: 'Đã từ chối yêu cầu.' });
    } catch (error) {
        res.status(500).json({ error: "Lỗi hệ thống." });
    }
};

exports.removeDoctor = async (req, res) => {
    try {
        const profile = await PatientProfile.findOne({ where: { user_id: req.user.id } });
        if (!profile || !profile.managed_by_doctor_id) return res.status(400).json({ error: "Bạn chưa có Bác sĩ phụ trách." });

        const oldDoctorId = profile.managed_by_doctor_id;
        await profile.update({ managed_by_doctor_id: null });

        const patientUser = await User.findByPk(req.user.id);
        await Notification.create({
            user_id: oldDoctorId,
            title: 'Hủy kết nối',
            message: `Bệnh nhân ${patientUser.full_name} đã hủy kết nối Bác sĩ phụ trách với bạn.`,
            type: 'SYSTEM'
        });

        res.status(200).json({ status: 'success', message: 'Đã hủy kết nối Bác sĩ.' });
    } catch (error) {
        res.status(500).json({ error: "Lỗi hủy kết nối." });
    }
};

exports.removePatient = async (req, res) => {
    try {
        const { id } = req.params; // Profile ID
        const profile = await PatientProfile.findByPk(id);
        if (!profile || profile.managed_by_doctor_id !== req.user.id) {
            return res.status(403).json({ error: "Không có quyền xóa bệnh nhân này." });
        }

        await profile.update({ managed_by_doctor_id: null });

        const docUser = await User.findByPk(req.user.id);
        await Notification.create({
            user_id: profile.user_id,
            title: 'Hủy kết nối',
            message: `Bác sĩ ${docUser.full_name} đã ngừng phụ trách hồ sơ của bạn.`,
            type: 'SYSTEM'
        });

        res.status(200).json({ status: 'success', message: 'Đã xóa bệnh nhân khỏi danh sách.' });
    } catch (error) {
        res.status(500).json({ error: "Lỗi xóa bệnh nhân." });
    }
};