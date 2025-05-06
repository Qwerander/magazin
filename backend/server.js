const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://frontend:80']
}));
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected via Docker'))
.catch(err => console.error('MongoDB connection error:', err));

// Тестовый роут
app.get('/', (req, res) => {
  res.send('Online Store Backend is running!');
});

// Подключение роутов
const productRoutes = require('./routes/products');
const reviewRoutes = require('./routes/reviews');

app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});