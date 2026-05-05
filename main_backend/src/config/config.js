require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: '#987654321',
    database: process.env.DB_NAME || 'healthcare_db',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    logging: false
  }
};