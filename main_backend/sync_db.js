const db = require('./src/models');
console.log("Đang bắt đầu đồng bộ hóa Database với các cột mới...");
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Cập nhật cấu trúc Database thành công!");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Lỗi khi cập nhật Database:", err);
    process.exit(1);
  });
