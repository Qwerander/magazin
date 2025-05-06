import React, { useEffect, useState } from "react";
import { fetchProducts } from "../services/api";
import ProductCard from "./ProductCard";
import AddProductForm from "./AddProductForm";
import Filters from "./Filters";
import { Button } from "@mui/material";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts(filters);
        setProducts(data || []);

      } catch (error) {
        console.error("Error loading products:", error);
      }
    };
    loadProducts();
  }, [filters]);

  const handleProductAdded = async (newProduct) => {
    try {
      const data = await fetchProducts(filters);
      setProducts(data);
      setShowAddForm(false);
    } catch (error) {
      console.error("Error after adding product:", error);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => setShowAddForm(!showAddForm)}
        sx={{ mb: 3 }}
      >
        {showAddForm ? "Скрыть форму" : "Добавить товар"}
      </Button>

      {showAddForm && <AddProductForm onProductAdded={handleProductAdded} />}
      <Filters onFilterChange={setFilters} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {products?.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p>Товары не найдены</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
