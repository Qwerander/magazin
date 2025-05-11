const User = require("../models/User");

class UserService {
  async getUserById(userId) {
    return await User.findById(userId)
      .select("-password")
      .populate("user_data.orders.items.productId");
  }

  async createOrder(userId, orderData) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const newOrder = {
      items: orderData.items,
      totalPrice: orderData.totalPrice,
      status: orderData.status || "pending",
      createdAt: new Date()
    };

    user.user_data.orders.push(newOrder);
    await user.save();

    return await this.getUserById(userId);
  }

  async getOrders(userId) {
    const user = await this.getUserById(userId);
    if (!user) throw new Error("User not found");

    return user.user_data.orders;
  }

  async getAllUsers() {
    return await User.find({}).select("-password");
  }

  async getAllOrders() {
    const users = await User.find({ "user_data.orders.0": { $exists: true } })
      .select("username email user_data.orders")
      .populate("user_data.orders.items.productId");

    return users.flatMap((user) =>
      user.user_data.orders.map((order) => ({
        ...order.toObject(),
        userId: user._id,
        username: user.username,
        email: user.email
      }))
    );
  }
}

module.exports = new UserService();
