const Product = require("../models/Products");

class ProductService {
  async getProducts(filterParams) {
    const { type_care, minPrice, maxPrice, sortBy, brand } = filterParams;
    const filter = {};

    if (type_care) filter.type_care = type_care;
    if (brand) filter.brand = brand;
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
    const { title, price, brand, manufactur, barcode } = productData;
    if (!title || !price || !brand || !manufactur || !barcode) {
      throw new Error("Необходимо указать название, цену, бренд, производителя и штрих-код товара");
    }

    const product = new Product({
      url: productData.url || "",
      title,
      type_volume: productData.type_volume || "",
      volume: productData.volume || "",
      barcode,
      manufactur,
      brand,
      type_care: productData.type_care || [],
      description: productData.description || "",
      price,
      rating: productData.rating || 0,
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

  async getProductByBarcode(barcode) {
    const product = await Product.findOne({ barcode });
    if (!product) {
      throw new Error("Товар с указанным штрих-кодом не найден");
    }
    return product;
  }

  async updateProductRating(productId, newRating) {
    return await Product.findByIdAndUpdate(
      productId,
      { rating: newRating },
      { new: true } // Возвращает обновленный документ
    );
  }

  async updateProductStock(productId, newStock) {
    return await Product.findByIdAndUpdate(
      productId,
      { stock: newStock },
      { new: true }
    );
  }
}

module.exports = new ProductService();