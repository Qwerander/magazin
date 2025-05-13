const express = require("express");
const router = express.Router();
const { addReview, getReviews } = require("../controllers/reviewController");

router.post("/:productId", addReview);
router.get("/:productId", getReviews);

module.exports = router;
