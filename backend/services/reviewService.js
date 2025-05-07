const Review = require("../models/Review");
const productService = require("./productService");

class ReviewService {
  async addReview(productId, reviewData) {
    const review = new Review({ ...reviewData, productId });
    await review.save();

    const reviews = await this.getReviewsByProduct(productId);
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await productService.updateProductRating(productId, avgRating);

    return review;
  }

  async getReviewsByProduct(productId) {
    return await Review.find({ productId });
  }
}

module.exports = new ReviewService();