const Product = require("../models/Products");

exports.getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sortBy } = req.query;
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

    const products = await Product.find(filter).sort(sortOptions);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProduct = async (req, res) => {
    try {
      const { name, price, description, category, image, stock } = req.body;

      if (!name || !price || !category) {
        return res.status(400).json({ error: "Необходимо указать название, цену и категорию товара" });
      }

      const product = new Product({
        name,
        price,
        description: description || "",
        category,
        image: image || "",
        stock: stock || 0
      });

      await product.save();
      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


  exports.getProductById = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Товар не найден" });
      }
      res.json(product);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
