const userService = require("../services/userService");

exports.getUserData = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.userId);
    res.json(user.user_data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await userService.addToCart(
      req.user.userId,
      productId,
      quantity
    );
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await userService.removeFromCart(req.user.userId, productId);
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const cart = await userService.updateCartItemQuantity(
      req.user.userId,
      productId,
      quantity
    );
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await userService.clearCart(req.user.userId);
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const order = await userService.createOrder(req.user.userId, req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await userService.getOrders(req.user.userId);
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await userService.getAllOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
