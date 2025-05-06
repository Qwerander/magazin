import React, { useState } from 'react';
import { TextField, Button, Box, Typography, MenuItem } from '@mui/material';
import { createProduct } from '../services/api';

const AddProductForm = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    image: '',
    stock: ''
  });

  const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newProduct = await createProduct({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock)
      });
      onProductAdded(newProduct);
      setFormData({
        name: '',
        price: '',
        description: '',
        category: '',
        image: '',
        stock: ''
      });
      alert('Товар успешно добавлен!');
    } catch (error) {
      console.error('Ошибка при добавлении товара:', error);
      alert('Ошибка при добавлении товара');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, maxWidth: 500 }}>
      <Typography variant="h6" gutterBottom>Добавить новый товар</Typography>

      <TextField
        fullWidth
        margin="normal"
        label="Название"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        label="Цена"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        label="Категория"
        name="category"
        select
        value={formData.category}
        onChange={handleChange}
        required
      >
        {categories.map(category => (
          <MenuItem key={category} value={category}>{category}</MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        margin="normal"
        label="Описание"
        name="description"
        multiline
        rows={3}
        value={formData.description}
        onChange={handleChange}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Ссылка на изображение"
        name="image"
        value={formData.image}
        onChange={handleChange}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Количество на складе"
        name="stock"
        type="number"
        value={formData.stock}
        onChange={handleChange}
      />

      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 2 }}
      >
        Добавить товар
      </Button>
    </Box>
  );
};

export default AddProductForm;