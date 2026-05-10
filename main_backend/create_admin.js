const bcrypt = require('bcryptjs');
const { User } = require('./src/models');

async function createAdmin() {
    try {
        const email = 'admin@clinicalai.com';
        const password = 'admin123';
        const fullName = 'Hệ Thống Admin';

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            console.log(`User with email ${email} already exists.`);
            // Update to admin if it exists but is not admin
            if (existingUser.role !== 'ADMIN') {
                await existingUser.update({ role: 'ADMIN' });
                console.log('User role updated to ADMIN.');
            }
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            email,
            password_hash: hashedPassword,
            full_name: fullName,
            role: 'ADMIN',
            phone: '0999999999',
            is_active: true
        });

        console.log('✅ Admin account created successfully!');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
    } catch (error) {
        console.error('❌ Error creating admin account:', error);
    } finally {
        process.exit();
    }
}

createAdmin();
