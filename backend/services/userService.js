const User = require('../models/User');

class UserService {
  async getUserById(userId) {
    return await User.findById(userId).populate('user_data.cart.productId user_data.orders.products.productId');
  }

  async addToCart(userId, productId, quantity = 1) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const existingItemIndex = user.user_data.cart.findIndex(
      item => item.productId.toString() === productId.toString()
    );

    if (existingItemIndex >= 0) {
      user.user_data.cart[existingItemIndex].quantity += quantity;
    } else {
      user.user_data.cart.push({ productId, quantity });
    }

    await user.save();
    return user.user_data.cart;
  }

  async removeFromCart(userId, productId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    user.user_data.cart = user.user_data.cart.filter(
      item => item.productId.toString() !== productId.toString()
    );

    await user.save();
    return user.user_data.cart;
  }

  async updateCartItemQuantity(userId, productId, quantity) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const cartItem = user.user_data.cart.find(
      item => item.productId.toString() === productId.toString()
    );

    if (cartItem) {
      cartItem.quantity = quantity;
      await user.save();
    }

    return user.user_data.cart;
  }

  async clearCart(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    user.user_data.cart = [];
    await user.save();
    return user.user_data.cart;
  }

  async createOrder(userId, orderData) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const newOrder = {
      products: orderData.products,
      totalPrice: orderData.totalPrice,
      status: 'pending'
    };

    user.user_data.orders.push(newOrder);
    await user.save();
    return user.user_data.orders[user.user_data.orders.length - 1];
  }

  async getOrders(userId) {
    const user = await User.findById(userId).populate('user_data.orders.products.productId');
    if (!user) throw new Error('User not found');

    return user.user_data.orders;
  }
}

module.exports = new UserService();