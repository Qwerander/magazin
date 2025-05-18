const User = require("../models/User");
const bcrypt = require("bcryptjs");

async function createAdminUser() {
  const adminExists = await User.findOne({ email: "admin@admin.com" });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("password", 12);

    const admin = new User({
      username: "Administrator",
      email: "admin@admin.com",
      password: hashedPassword,
      isAdmin: true
    });

    await admin.save();
    console.log("Admin user created with hashed password");
  }
}

module.exports = createAdminUser();
