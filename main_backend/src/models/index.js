'use strict';
const { Sequelize, DataTypes } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  full_name: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('ADMIN', 'DOCTOR', 'PATIENT'), allowNull: false },
  phone: { type: DataTypes.STRING },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { timestamps: true });

db.PatientProfile = sequelize.define('PatientProfile', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  date_of_birth: { type: DataTypes.DATEONLY },
  gender: { type: DataTypes.ENUM('M', 'F', 'O') },
  address: { type: DataTypes.STRING },
  
  weight_kg: { type: DataTypes.FLOAT },
  height_cm: { type: DataTypes.FLOAT }
  
}, { timestamps: true });

db.MedicalRecord = sequelize.define('MedicalRecord', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  health_indicators: { type: DataTypes.JSON, comment: '21 chỉ số lúc nhập vào' },
  ai_risk_score: { type: DataTypes.FLOAT },
  ai_diagnosis: { type: DataTypes.STRING },
  ai_explanation: { type: DataTypes.JSON, comment: 'Kết quả giải thích SHAP' },
  ai_nutrition_plan: { type: DataTypes.TEXT, comment: 'Thực đơn Markdown từ Gemini' },
  doctor_notes: { type: DataTypes.TEXT }
}, { timestamps: true });

db.Ingredient = sequelize.define('Ingredient', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  calories_per_100g: { type: DataTypes.FLOAT, defaultValue: 0 },
  carbs_per_100g: { type: DataTypes.FLOAT, defaultValue: 0 },
  protein_per_100g: { type: DataTypes.FLOAT, defaultValue: 0 },
  fat_per_100g: { type: DataTypes.FLOAT, defaultValue: 0 },
  user_id: { type: DataTypes.UUID, allowNull: true },
  is_ai_generated: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { timestamps: false });

db.Dish = sequelize.define('Dish', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING },
  user_id: { type: DataTypes.UUID, allowNull: true },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_ai_generated: { type: DataTypes.BOOLEAN, defaultValue: false },
  calories_per_100g: { type: DataTypes.FLOAT, defaultValue: 0 },
  carbs_per_100g: { type: DataTypes.FLOAT, defaultValue: 0 },
  protein_per_100g: { type: DataTypes.FLOAT, defaultValue: 0 },
  fat_per_100g: { type: DataTypes.FLOAT, defaultValue: 0 },
  serving_size_g: { type: DataTypes.FLOAT, defaultValue: 100 }
}, { timestamps: true });

db.DishIngredient = sequelize.define('DishIngredient', {
  weight_grams: { type: DataTypes.FLOAT, allowNull: false, comment: 'Khối lượng nguyên liệu tính bằng Gram' }
}, { timestamps: false });

db.PatientMeal = sequelize.define('PatientMeal', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  meal_time: { type: DataTypes.ENUM('Sáng', 'Trưa', 'Tối', 'Phụ') },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  total_calories_calculated: { type: DataTypes.FLOAT },
  total_carbs_calculated: { type: DataTypes.FLOAT, defaultValue: 0 },
  total_protein_calculated: { type: DataTypes.FLOAT, defaultValue: 0 },
  weight_grams: { type: DataTypes.FLOAT, defaultValue: 100 },
  is_approved: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { timestamps: true });

db.Exercise = sequelize.define('Exercise', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  met_value: { type: DataTypes.FLOAT, allowNull: false },
  category: { type: DataTypes.STRING },
  user_id: { type: DataTypes.UUID, allowNull: true },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_ai_generated: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { timestamps: false });

db.PatientExercise = sequelize.define('PatientExercise', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  duration_minutes: { type: DataTypes.INTEGER, allowNull: false },
  calories_burned: { type: DataTypes.FLOAT },
  date: { type: DataTypes.DATEONLY, allowNull: false }
}, { timestamps: true });

db.User.hasOne(db.PatientProfile, { foreignKey: 'user_id', as: 'Profile' });
db.PatientProfile.belongsTo(db.User, { foreignKey: 'user_id' });

db.User.hasMany(db.PatientProfile, { foreignKey: 'managed_by_doctor_id', as: 'Patients' });
db.PatientProfile.belongsTo(db.User, { foreignKey: 'managed_by_doctor_id', as: 'Doctor' });

db.PatientProfile.hasMany(db.MedicalRecord, { foreignKey: 'patient_id' });
db.MedicalRecord.belongsTo(db.PatientProfile, { foreignKey: 'patient_id' });

db.User.hasMany(db.MedicalRecord, { foreignKey: 'doctor_id' });
db.MedicalRecord.belongsTo(db.User, { foreignKey: 'doctor_id' });

db.Dish.belongsToMany(db.Ingredient, { through: db.DishIngredient, foreignKey: 'dish_id' });
db.Ingredient.belongsToMany(db.Dish, { through: db.DishIngredient, foreignKey: 'ingredient_id' });

db.PatientProfile.hasMany(db.PatientMeal, { foreignKey: 'patient_id' });
db.PatientMeal.belongsTo(db.PatientProfile, { foreignKey: 'patient_id' });

db.Dish.hasMany(db.PatientMeal, { foreignKey: 'dish_id' });
db.PatientMeal.belongsTo(db.Dish, { foreignKey: 'dish_id' });

db.PatientProfile.hasMany(db.PatientExercise, { foreignKey: 'patient_id' });
db.PatientExercise.belongsTo(db.PatientProfile, { foreignKey: 'patient_id' });

db.Exercise.hasMany(db.PatientExercise, { foreignKey: 'exercise_id' });
db.PatientExercise.belongsTo(db.Exercise, { foreignKey: 'exercise_id' });
db.User.hasMany(db.Ingredient, { foreignKey: 'user_id' });
db.Ingredient.belongsTo(db.User, { foreignKey: 'user_id' });
db.User.hasMany(db.Dish, { foreignKey: 'user_id' });
db.Dish.belongsTo(db.User, { foreignKey: 'user_id' });

db.User.hasMany(db.Exercise, { foreignKey: 'user_id' });
db.Exercise.belongsTo(db.User, { foreignKey: 'user_id' });
module.exports = db;