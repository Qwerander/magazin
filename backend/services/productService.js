const Product = require("../models/Products");

class ProductService {
  async getProducts(filterParams) {
    const { category, minPrice, maxPrice, sortBy } = filterParams;
    const filter = {};

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sortOptions = {};
    if (sortBy === "price_asc") sortOptions.price = 1;
    if (sortBy === "price_desc") sortOptions.price = -1;
    if (sortBy === "rating") sortOptions.rating = -1;

    return await Product.find(filter).sort(sortOptions);
  }

  async createProduct(productData) {
    const { name, price, category } = productData;
    if (!name || !price || !category) {
      throw new Error("Необходимо указать название, цену и категорию товара");
    }

    const product = new Product({
      name,
      price,
      description: productData.description || "",
      category,
      image: productData.image || "",
      stock: productData.stock || 0
    });

    return await product.save();
  }

  async getProductById(id) {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Товар не найден");
    }
    return product;
  }

  async updateProductRating(productId, newRating) {
    return await Product.findByIdAndUpdate(productId, { rating: newRating });
  }
}

module.exports = new ProductService();