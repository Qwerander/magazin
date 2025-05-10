const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  url: { type: String },
  title: { type: String, required: true },
  weight: { type: String, required: true },
  barcode: { type: String, required: true, unique: true },
  type_plant: [{ type: String }],
  description: { type: String },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);