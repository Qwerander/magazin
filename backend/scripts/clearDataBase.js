const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("../models/Products");
const Review = require("../models/Review");

async function clearDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Product.deleteMany({});
    await Review.deleteMany({});

    console.log("✅ База данных очищена");
    process.exit(0);
  } catch (err) {
    console.error("Ошибка очистки:", err);
    process.exit(1);
  }
}

clearDatabase();
