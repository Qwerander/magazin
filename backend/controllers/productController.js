const productService = require("../services/productService");

exports.getProducts = async (req, res) => {
  try {
    const filters = {
      ...req.query,
      type_plant: req.query.type_plant ?
        (Array.isArray(req.query.type_plant) ? req.query.type_plant : [req.query.type_plant])
        : undefined
    };

    const products = await productService.getProducts(filters);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  } catch (err) {
    if (err.message === "Товар не найден") {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.getProductByBarcode = async (req, res) => {
  try {
    const product = await productService.getProductByBarcode(req.params.barcode);
    res.json(product);
  } catch (err) {
    if (err.message === "Товар с указанным штрих-кодом не найден") {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};