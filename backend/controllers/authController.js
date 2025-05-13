const AuthService = require("../services/authService");

class AuthController {
  static async signup(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const result = await AuthService.signup(username, email, password);

      res.status(201).json({
        message: "User created successfully",
        ...result
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message || "Server error" });
    }
  }

  static async signin(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const result = await AuthService.signin(email, password);

      res.json({
        message: "Login successful",
        ...result
      });
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: error.message || "Server error" });
    }
  }
}

module.exports = AuthController;
