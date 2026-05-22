require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const recordRoutes = require('./routes/recordRoutes');
const authRoutes = require('./routes/authRoutes');
const mealRoutes = require('./routes/mealRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const path = require('path');
const app = express();

app.use(helmet());

// Giới hạn tốc độ gọi API toàn cầu (Global Rate Limiting) chống DDoS
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 1000, // Tối đa 1000 requests mỗi 15 phút từ một IP
    message: { success: false, error: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau!' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(globalLimiter);

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Phục vụ các file tĩnh trong thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/records', recordRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/appointments', appointmentRoutes);
app.get('/', (req, res) => {
    res.json({ message: "Main Backend (Node.js) is running smoothly!" });
});

const db = require('./models');

const PORT = process.env.PORT || 5000;

db.sequelize.sync().then(() => {
    console.log("✅ Database đã được đồng bộ thành công!");
    app.listen(PORT, () => {
        console.log(`🚀 Main Backend Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error("❌ Lỗi đồng bộ Database: ", err);
});