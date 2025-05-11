const mongoose = require('mongoose');
const { OrderSchema } = require('./Order'); // Импортируем схему

const UserDataSchema = new mongoose.Schema({
  orders: [OrderSchema]
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  user_data: { type: UserDataSchema, default: () => ({}) },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);