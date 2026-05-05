'use strict';
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync('123456', salt);
    const now = new Date();

    const doctorId = crypto.randomUUID();
    const patient1Id = crypto.randomUUID();
    const patient2Id = crypto.randomUUID();

    await queryInterface.bulkInsert('Users',[
      { id: doctorId, email: 'doctor@demo.com', password_hash: hashPassword, full_name: 'Dr. John Doe', role: 'DOCTOR', phone: '0901111111', createdAt: now, updatedAt: now },
      { id: patient1Id, email: 'patient1@demo.com', password_hash: hashPassword, full_name: 'Nguyễn Văn A (Nguy cơ)', role: 'PATIENT', phone: '0902222222', createdAt: now, updatedAt: now },
      { id: patient2Id, email: 'patient2@demo.com', password_hash: hashPassword, full_name: 'Trần Thị B (Khỏe mạnh)', role: 'PATIENT', phone: '0903333333', createdAt: now, updatedAt: now }
    ], {});

    const profile1Id = crypto.randomUUID();
    const profile2Id = crypto.randomUUID();

    await queryInterface.bulkInsert('PatientProfiles',[
      { id: profile1Id, user_id: patient1Id, managed_by_doctor_id: doctorId, date_of_birth: '1980-05-15', gender: 'M', address: 'Hà Nội', createdAt: now, updatedAt: now },
      { id: profile2Id, user_id: patient2Id, managed_by_doctor_id: doctorId, date_of_birth: '1995-10-20', gender: 'F', address: 'TP.HCM', createdAt: now, updatedAt: now }
    ], {});

    const ingredientsData =[
      { name: 'Bánh phở tươi', calories_per_100g: 143, carbs_per_100g: 32, protein_per_100g: 3.2, fat_per_100g: 0 },
      { name: 'Thịt bò loại 1 (nạc)', calories_per_100g: 118, carbs_per_100g: 0, protein_per_100g: 21, fat_per_100g: 3.8 },
      { name: 'Gạo tẻ (nấu chín/cơm)', calories_per_100g: 130, carbs_per_100g: 28.2, protein_per_100g: 2.7, fat_per_100g: 0.3 },
      { name: 'Sườn cốt lết lợn', calories_per_100g: 190, carbs_per_100g: 0, protein_per_100g: 19, fat_per_100g: 13 },
      { name: 'Trứng gà (luộc)', calories_per_100g: 155, carbs_per_100g: 1.1, protein_per_100g: 13, fat_per_100g: 11 },
      { name: 'Rau muống', calories_per_100g: 23, carbs_per_100g: 4.3, protein_per_100g: 3.2, fat_per_100g: 0 },
      { name: 'Đường cát trắng', calories_per_100g: 397, carbs_per_100g: 99.3, protein_per_100g: 0, fat_per_100g: 0 }
    ];
    await queryInterface.bulkInsert('Ingredients', ingredientsData, {});

    const ingredients = await queryInterface.sequelize.query('SELECT id, name FROM Ingredients;');
    const ingMap = {};
    ingredients[0].forEach(ing => { ingMap[ing.name] = ing.id; });

    await queryInterface.bulkInsert('Dishes',[
      { name: 'Phở Bò Tái Nạm', category: 'Sáng', createdAt: now, updatedAt: now },
      { name: 'Cơm Tấm Sườn Trứng', category: 'Trưa/Tối', createdAt: now, updatedAt: now },
      { name: 'Rau Muống Luộc', category: 'Trưa/Tối', createdAt: now, updatedAt: now }
    ], {});

    const dishes = await queryInterface.sequelize.query('SELECT id, name FROM Dishes;');
    const dishMap = {};
    dishes[0].forEach(d => { dishMap[d.name] = d.id; });

    const recipes =[
      { dish_id: dishMap['Phở Bò Tái Nạm'], ingredient_id: ingMap['Bánh phở tươi'], weight_grams: 150 },
      { dish_id: dishMap['Phở Bò Tái Nạm'], ingredient_id: ingMap['Thịt bò loại 1 (nạc)'], weight_grams: 60 },
      { dish_id: dishMap['Cơm Tấm Sườn Trứng'], ingredient_id: ingMap['Gạo tẻ (nấu chín/cơm)'], weight_grams: 200 },
      { dish_id: dishMap['Cơm Tấm Sườn Trứng'], ingredient_id: ingMap['Sườn cốt lết lợn'], weight_grams: 100 },
      { dish_id: dishMap['Cơm Tấm Sườn Trứng'], ingredient_id: ingMap['Trứng gà (luộc)'], weight_grams: 50 },
      { dish_id: dishMap['Rau Muống Luộc'], ingredient_id: ingMap['Rau muống'], weight_grams: 200 }
    ];
    await queryInterface.bulkInsert('DishIngredients', recipes, {});

    await queryInterface.bulkInsert('Exercises',[
      { name: 'Đi bộ nhanh', met_value: 4.3, category: 'Cardio' },
      { name: 'Chạy bộ (8km/h)', met_value: 8.3, category: 'Cardio' },
      { name: 'Đạp xe (thư giãn)', met_value: 4.0, category: 'Cardio' },
      { name: 'Yoga / Kéo giãn', met_value: 2.5, category: 'Flexibility' },
      { name: 'Nâng tạ cơ bản', met_value: 3.5, category: 'Strength' }
    ], {});
    const exercises = await queryInterface.sequelize.query('SELECT id, name FROM Exercises;');
    const exMap = {};
    exercises[0].forEach(ex => { exMap[ex.name] = ex.id; });

    const month1 = new Date(now); month1.setMonth(now.getMonth() - 2);
    const month2 = new Date(now); month2.setMonth(now.getMonth() - 1);
    
    await queryInterface.bulkInsert('MedicalRecords',[
      {
        id: crypto.randomUUID(), patient_id: profile1Id, doctor_id: doctorId,
        health_indicators: JSON.stringify({ Glucose: 130, BMI: 28.5, BloodPressure: 145 }),
        ai_risk_score: 85.5, ai_diagnosis: 'Nguy cơ tiểu đường tuýp 2 cao', ai_explanation: JSON.stringify({ features: ["Glucose", "BMI"] }),
        ai_nutrition_plan: 'Giảm tinh bột, tăng cường rau xanh.', doctor_notes: 'Bệnh nhân cần theo dõi sát sao.',
        createdAt: month1, updatedAt: month1
      },
      {
        id: crypto.randomUUID(), patient_id: profile1Id, doctor_id: doctorId,
        health_indicators: JSON.stringify({ Glucose: 115, BMI: 27.0, BloodPressure: 135 }),
        ai_risk_score: 65.0, ai_diagnosis: 'Nguy cơ tiểu đường trung bình', ai_explanation: JSON.stringify({ features:["BMI"] }),
        ai_nutrition_plan: 'Tiếp tục duy trì chế độ ăn hiện tại.', doctor_notes: 'Có tiến triển tốt.',
        createdAt: month2, updatedAt: month2
      },
      {
        id: crypto.randomUUID(), patient_id: profile1Id, doctor_id: doctorId,
        health_indicators: JSON.stringify({ Glucose: 105, BMI: 26.2, BloodPressure: 125 }),
        ai_risk_score: 45.0, ai_diagnosis: 'Nguy cơ thấp', ai_explanation: JSON.stringify({ features: ["BloodPressure"] }),
        ai_nutrition_plan: 'Duy trì tập thể dục.', doctor_notes: 'Chỉ số ổn định.',
        createdAt: now, updatedAt: now
      }
    ], {});

    const meals = [];
    const workouts =[];
    
    for (let i = 0; i < 3; i++) {
      const logDate = new Date(now);
      logDate.setDate(now.getDate() - i);
      const dateString = logDate.toISOString().split('T')[0];

      meals.push({ id: crypto.randomUUID(), patient_id: profile1Id, dish_id: dishMap['Phở Bò Tái Nạm'], meal_time: 'Sáng', date: dateString, total_calories_calculated: 350, is_approved: true, createdAt: logDate, updatedAt: logDate });
      meals.push({ id: crypto.randomUUID(), patient_id: profile1Id, dish_id: dishMap['Cơm Tấm Sườn Trứng'], meal_time: 'Trưa', date: dateString, total_calories_calculated: 650, is_approved: true, createdAt: logDate, updatedAt: logDate });
      
      workouts.push({ id: crypto.randomUUID(), patient_id: profile1Id, exercise_id: exMap['Đi bộ nhanh'], duration_minutes: 45, calories_burned: 250, date: dateString, createdAt: logDate, updatedAt: logDate });
    }

    await queryInterface.bulkInsert('PatientMeals', meals, {});
    await queryInterface.bulkInsert('PatientExercises', workouts, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('PatientExercises', null, {});
    await queryInterface.bulkDelete('PatientMeals', null, {});
    await queryInterface.bulkDelete('MedicalRecords', null, {});
    await queryInterface.bulkDelete('DishIngredients', null, {});
    await queryInterface.bulkDelete('Exercises', null, {});
    await queryInterface.bulkDelete('Dishes', null, {});
    await queryInterface.bulkDelete('Ingredients', null, {});
    await queryInterface.bulkDelete('PatientProfiles', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};