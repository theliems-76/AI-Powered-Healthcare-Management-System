const { Exercise, Dish } = require('./src/models');

const exercisesData = [
  { name: "Đi bộ chậm", met_value: 2.0, category: "Cardio" },
  { name: "Đi bộ nhanh", met_value: 4.3, category: "Cardio" },
  { name: "Chạy bộ (8 km/h)", met_value: 8.3, category: "Cardio" },
  { name: "Đạp xe chậm", met_value: 4.0, category: "Cardio" },
  { name: "Đạp xe nhanh", met_value: 8.0, category: "Cardio" },
  { name: "Bơi lội", met_value: 6.0, category: "Thể thao nước" },
  { name: "Nhảy dây", met_value: 10.0, category: "Cardio cường độ cao" },
  { name: "Tập tạ (Nhẹ)", met_value: 3.0, category: "Sức mạnh" },
  { name: "Tập tạ (Nặng)", met_value: 6.0, category: "Sức mạnh" },
  { name: "Yoga", met_value: 2.5, category: "Linh hoạt" },
  { name: "Pilates", met_value: 3.0, category: "Linh hoạt" },
  { name: "Bóng đá", met_value: 7.0, category: "Thể thao đồng đội" },
  { name: "Bóng rổ", met_value: 6.5, category: "Thể thao đồng đội" },
  { name: "Cầu lông", met_value: 5.5, category: "Thể thao đối kháng" },
  { name: "Quần vợt (Tennis)", met_value: 7.3, category: "Thể thao đối kháng" }
];

const dishesData = [
  { name: "Phở bò", category: "Món chính", calories_per_100g: 150, carbs_per_100g: 20, protein_per_100g: 10, fat_per_100g: 4 },
  { name: "Cơm tấm sườn bì", category: "Món chính", calories_per_100g: 220, carbs_per_100g: 35, protein_per_100g: 12, fat_per_100g: 8 },
  { name: "Bún chả Hà Nội", category: "Món chính", calories_per_100g: 180, carbs_per_100g: 15, protein_per_100g: 14, fat_per_100g: 9 },
  { name: "Bánh mì thịt", category: "Món ăn sáng", calories_per_100g: 250, carbs_per_100g: 30, protein_per_100g: 10, fat_per_100g: 12 },
  { name: "Gỏi cuốn", category: "Khai vị", calories_per_100g: 90, carbs_per_100g: 15, protein_per_100g: 5, fat_per_100g: 1 },
  { name: "Chả giò chiên", category: "Ăn vặt", calories_per_100g: 300, carbs_per_100g: 25, protein_per_100g: 8, fat_per_100g: 18 },
  { name: "Canh chua cá lóc", category: "Món canh", calories_per_100g: 45, carbs_per_100g: 4, protein_per_100g: 6, fat_per_100g: 1 },
  { name: "Thịt kho tàu", category: "Món mặn", calories_per_100g: 210, carbs_per_100g: 3, protein_per_100g: 15, fat_per_100g: 16 },
  { name: "Gà luộc", category: "Món chính", calories_per_100g: 165, carbs_per_100g: 0, protein_per_100g: 31, fat_per_100g: 3 },
  { name: "Rau muống xào tỏi", category: "Món rau", calories_per_100g: 60, carbs_per_100g: 4, protein_per_100g: 2, fat_per_100g: 4 },
  { name: "Cơm trắng", category: "Tinh bột", calories_per_100g: 130, carbs_per_100g: 28, protein_per_100g: 2.7, fat_per_100g: 0.3 },
  { name: "Trứng ốp la", category: "Món mặn", calories_per_100g: 196, carbs_per_100g: 1, protein_per_100g: 13, fat_per_100g: 15 }
];

async function seedData() {
    try {
        console.log("Đang nạp Bài tập hệ thống...");
        for (let ex of exercisesData) {
            await Exercise.findOrCreate({
                where: { name: ex.name, user_id: null },
                defaults: { ...ex, user_id: null }
            });
        }

        console.log("Đang nạp Món ăn hệ thống...");
        for (let dish of dishesData) {
            await Dish.findOrCreate({
                where: { name: dish.name, user_id: null },
                defaults: { ...dish, user_id: null }
            });
        }

        console.log("Hoàn tất nạp dữ liệu mồi!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedData();
