import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import ProductCard from "./ProductCard";
import AddProductForm from "./AddProductForm";
import Filters from "./Filters";
import { useDispatch, useSelector } from "react-redux";
import { loadProducts, addNewProduct, selectAllProducts, selectProductsStatus, setFilters } from "../store/sclices/productSlice";

const ProductList = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadProducts());
  }, [dispatch]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
    dispatch(loadProducts(newFilters));
  };

  const handleProductAdded = async (newProduct) => {
    try {
      await dispatch(addNewProduct(newProduct)).unwrap();
      setShowAddForm(false);
      alert('Товар успешно добавлен!');
    } catch (error) {
      console.error("Error adding product:", error);
      alert('Ошибка при добавлении товара');
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
      <Filters onFilterChange={handleFilterChange} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {status === 'loading' ? (
          <p>Loading...</p>
        ) : products?.length > 0 ? (
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