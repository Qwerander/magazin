const Review = require("../models/Review");
const Product = require("../models/Products");

// Добавить отзыв
exports.addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const review = new Review({ ...req.body, productId });
    await review.save();

    // Обновляем рейтинг товара
    const reviews = await Review.find({ productId });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(productId, { rating: avgRating });

    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Получить отзывы товара
exports.getReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};