const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  getProductByBarcode
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/barcode/:barcode', getProductByBarcode);
router.post('/', createProduct);

module.exports = router;