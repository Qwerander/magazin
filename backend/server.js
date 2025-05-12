const mockData = require("./products.json");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
require("dotenv").config();
const Product = require("./models/Products");
const Review = require("./models/Review");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://frontend:80"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);
app.use(express.json());

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

async function createAdminUser() {
  const User = require("./models/User");
  const adminExists = await User.findOne({ email: "admin@admin.com" });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("password", 12);

    const admin = new User({
      username: "Administrator",
      email: "admin@admin.com",
      password: hashedPassword,
      isAdmin: true
    });

    await admin.save();
    console.log("Admin user created with hashed password");
  }
}

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {

    console.log("MongoDB connected via Docker");

    if (process.env.INIT_DB === "true") {
      await createAdminUser();
      await initializeDatabase();
    }
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Online Store Backend is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
