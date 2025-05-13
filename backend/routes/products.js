const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  getProductByBarcode,
  deleteProduct,
  putProduct
} = require("../controllers/productController");

router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/barcode/:barcode", getProductByBarcode);
router.post("/", createProduct);
router.put("/:id", putProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
