import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip
} from "@mui/material";
import { loadProducts } from "../store/slices/productSlice";
import { useDispatch } from "react-redux";

const AddProductForm = ({ onProductAdded }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    weight: "",
    barcode: "",
    type_plant: [],
    description: "",
    price: "",
    id: "",
    stock: ""
  });

  const plantTypes = [
    "Комнатные растения",
    "Растения для горшков",
    "Садовые растения"
  ];

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

    onProductAdded(formData);
    dispatch(loadProducts());
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Штрих-код"
        name="barcode"
        value={formData.barcode}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Тип растения</InputLabel>
        <Select
          multiple
          name="type_plant"
          value={formData.type_plant}
          onChange={handlePlantTypeChange}
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
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Колличество"
        name="stock"
        type="number"
        value={formData.stock}
        onChange={handleChange}
        required
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
        sx={{ mb: 2 }}
      />

      <Button type="submit" variant="contained" fullWidth>
        Добавить товар
      </Button>
    </Box>
  );
};

export default AddProductForm;
