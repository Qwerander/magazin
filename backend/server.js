const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const createAdminUser = require("./scripts/createAdminUser");
const initializeDatabase = require("./scripts/initializeDatabase");

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

const mongoUri =
  process.env.NODE_ENV === "prod"
    ? process.env.MONGO_URI
    : "mongodb://admin:password@localhost:27017/?authSource=admin";

mongoose
  .connect(mongoUri, {
    serverSelectionTimeoutMS: 5000 // 5 секунд таймаута
  })
  .then(async () => {
    console.log("Connected to MongoDB Atlas");
    if (process.env.INIT_DB === "true") {
      await createAdminUser();
      await initializeDatabase();
    }
  })
  .catch((err) => console.error("Atlas connection error:", err));

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
