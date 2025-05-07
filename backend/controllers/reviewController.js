const reviewService = require("../services/reviewService");

exports.addReview = async (req, res) => {
  try {
    const review = await reviewService.addReview(req.params.productId, req.body);
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getReviewsByProduct(req.params.productId);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};