const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  static async signup(username, email, password) {
    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Generate token
    const token = this.generateToken(user);

    return {
      userId: user._id,
      username: user.username,
      email: user.email,
      token,
      tokenExpiration: 3600
    };
  }

  static async signin(email, password) {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user);

    return {
      userId: user._id,
      username: user.username,
      email: user.email,
      token,
      tokenExpiration: 3600
    };
  }

  static generateToken(user) {
    return jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  }
}

module.exports = AuthService;