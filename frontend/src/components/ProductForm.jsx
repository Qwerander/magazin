import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from "@mui/material";
import { Delete, Close } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { updateExistingProduct, removeProduct } from "../store/slices/productSlice";

const ProductForm = ({
  product = null,
  onClose = () => {},
  onSubmit = () => {},
  onDelete = () => {}
}) => {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    weight: "",
    barcode: "",
    type_plant: [],
    description: "",
    price: "",
    stock: ""
  });

  const plantTypes = [
    "Комнатные растения",
    "Растения для горшков",
    "Маленькие растения",
    "Большие растения",
    "Озеленение",
    "Садовые растения",
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        url: product.url || "",
        weight: product.weight || "",
        barcode: product.barcode || "",
        type_plant: product.type_plant || [],
        description: product.description || "",
        price: product.price || "",
        stock: product.stock || ""
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlantTypeChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, type_plant: value }));
  };

const handleSubmit = (e) => {
  e.preventDefault();
  // Проверяем, что все обязательные поля заполнены
  if (
    !formData.title ||
    !formData.url ||
    !formData.weight ||
    !formData.barcode ||
    formData.type_plant.length === 0 ||
    !formData.description ||
    !formData.price ||
    !formData.stock
  ) {
    alert("Пожалуйста, заполните все обязательные поля");
    return;
  }

  onSubmit({
    ...formData,
    price: Number(formData.price),
    stock: Number(formData.stock)
  });
  console.log(formData);

};

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Название"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="URL изображения"
        name="url"
        value={formData.url}
        onChange={handleChange}
        required
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Вес"
        name="weight"
        value={formData.weight}
        onChange={handleChange}
        required
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Штрих-код"
        name="barcode"
        value={formData.barcode}
        onChange={handleChange}
        required
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Тип растения *</InputLabel>
        <Select
          multiple
          name="type_plant"
          value={formData.type_plant}
          onChange={handlePlantTypeChange}
          required
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {plantTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Описание"
        name="description"
        value={formData.description}
        onChange={handleChange}
        multiline
        rows={4}
        required
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Количество"
        name="stock"
        type="number"
        value={formData.stock}
        onChange={handleChange}
        required
        inputProps={{ min: 0 }}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Цена"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        required
        inputProps={{ min: 0, step: 0.01 }}
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {product && (
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={() => onDelete(product._id)}
          >
            Удалить
          </Button>
        )}

        <Box>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ mr: 2 }}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            variant="contained"
          >
            {product ? 'Сохранить' : 'Добавить'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductForm;