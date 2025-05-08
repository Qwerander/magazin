const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  url: { type: String }, // URL изображения
  title: { type: String }, // Название продукта
  type_volume: { type: String }, // "Объём" или "Вес"
  volume: { type: String }, // "500мл", "50г" и т.д.
  barcode: { type: String, unique: true }, // Штрих-код
  manufactur: { type: String }, // Производитель
  brand: { type: String }, // Бренд
  type_care: [{ type: String }], // Массив категорий ухода
  description: { type: String }, // Описание продукта
  price: { type: Number }, // Цена
  // Дополнительные поля
  rating: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);