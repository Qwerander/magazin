const Product = require("../models/Products");

class ProductService {
  async getProducts(filterParams) {
    const { type_plant, minPrice, maxPrice, sortBy, weight } = filterParams;
    const filter = {};

    if (type_plant) {
      filter.type_plant = Array.isArray(type_plant)
        ? { $in: type_plant }
        : type_plant;
    }
    if (weight) filter.weight = weight;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sortOptions = {};
    if (sortBy === "price_asc") sortOptions.price = 1;
    if (sortBy === "price_desc") sortOptions.price = -1;

    const products = await Product.find(filter).sort(sortOptions);
    return products.map((p) => p.toObject({ virtuals: true }));
  }

  async createProduct(productData) {
    const { title, price, barcode, weight } = productData;
    if (!title || !price || !barcode || !weight) {
      throw new Error(
        "Необходимо указать название, цену, штрих-код и вес товара"
      );
    }

    const product = new Product({
      url: productData.url || "",
      title,
      weight,
      barcode,
      type_plant: productData.type_plant || [],
      description: productData.description || "",
      price,
      rating: productData.rating || 0,
      stock: productData.stock || 0
    });

    const savedProduct = await product.save();
    return savedProduct.toObject({ virtuals: true });
  }

  async getProductById(id) {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Товар не найден");
    }
    return product.toObject({ virtuals: true });
  }

  async getProductByBarcode(barcode) {
    const product = await Product.findOne({ barcode });
    if (!product) {
      throw new Error("Товар с указанным штрих-кодом не найден");
    }
    return product.toObject({ virtuals: true });
  }
  async updateProduct(id, productData) {
    const product = await Product.findByIdAndUpdate(id, productData, {
      new: true,
      runValidators: true
    });

    if (!product) {
      throw new Error("Товар не найден");
    }

    return product.toObject({ virtuals: true });
  }

  async deleteProduct(id) {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      throw new Error("Товар не найден");
    }
  }

  async updateProductRating(productId, newRating) {
    const product = await Product.findByIdAndUpdate(
      productId,
      { rating: newRating },
      { new: true }
    );
    return product.toObject({ virtuals: true });
  }

  async updateProductStock(productId, newStock) {
    const product = await Product.findByIdAndUpdate(
      productId,
      { stock: newStock },
      { new: true }
    );
    return product.toObject({ virtuals: true });
  }
}

module.exports = new ProductService();
