const express = require('express');
const router = express.Router();
const {
  getUserData,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  createOrder,
  getOrders
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', getUserData);
router.post('/cart', addToCart);
router.delete('/cart/:productId', removeFromCart);
router.put('/cart/:productId', updateCartItem);
router.delete('/cart', clearCart);
router.post('/orders', createOrder);
router.get('/orders', getOrders);

module.exports = router;