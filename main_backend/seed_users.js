const bcrypt = require('bcryptjs');
const { User, PatientProfile } = require('./src/models');

async function seedUsers() {
    try {
        console.log("Đang tạo thêm tài khoản bệnh nhân để test phân trang...");
        
        for (let i = 11; i <= 25; i++) {
            const email = `patient_test_${i}@example.com`;
            const phone = `09012345${i.toString().padStart(2, '0')}`;
            const fullName = `Bệnh nhân Test ${i}`;
            
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash("123456", salt);

            const user = await User.create({
                email,
                password_hash,
                full_name: fullName,
                phone,
                role: 'PATIENT'
            });

            // Date fix (e.g. 1990 + (i % 10))
            const year = 1980 + i;
            await PatientProfile.create({
                user_id: user.id,
                gender: i % 2 === 0 ? 'M' : 'F',
                weight_kg: 60 + (i % 10),
                height_cm: 160 + (i % 10),
                date_of_birth: `${year}-01-01`
            });

            console.log(`Đã tạo: ${email} | Pass: 123456`);
        }
        
        console.log("Hoàn tất tạo dữ liệu test!");
        process.exit(0);
    } catch (error) {
        console.error("Lỗi:", error.message);
        process.exit(1);
    }
}

seedUsers();
