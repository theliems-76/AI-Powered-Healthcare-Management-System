require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const recordRoutes = require('./routes/recordRoutes');
const authRoutes = require('./routes/authRoutes');
const mealRoutes = require('./routes/mealRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/records', recordRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
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