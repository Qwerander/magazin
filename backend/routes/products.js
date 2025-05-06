const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById, // Добавляем этот метод
  createProduct
} = require('../controllers/productController');

// Получение списка товаров
router.get('/', getProducts);

// Получение конкретного товара по ID
router.get('/:id', getProductById); // Добавляем этот роут

// Создание товара
router.post('/', createProduct);

module.exports = router;