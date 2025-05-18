const Product = require("../models/Products");
const Review = require("../models/Review");
const mockData = require("../products.json");

async function initializeDatabase() {
  try {
    console.log("🔄 Начало очистки базы...");
    await Product.deleteMany({});
    await Review.deleteMany({});
    console.log("✅ База очищена");

    console.log("🔄 Добавление моковых данных...");
    const result = await Product.insertMany(mockData);
    console.log(`✅ Добавлено ${result.length} товаров`);

    // Проверка количества документов в базе
    const count = await Product.countDocuments();
    console.log(`📊 Всего товаров в базе: ${count}`);
  } catch (err) {
    console.error("❌ Ошибка инициализации:", err.message);
    if (err.errors) {
      console.error("Детали ошибок валидации:", err.errors);
    }
  }
}

module.exports = initializeDatabase();
