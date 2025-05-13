const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/users", adminController.getAllUsers);
router.get("/orders", adminController.getAllOrders);

module.exports = router;
