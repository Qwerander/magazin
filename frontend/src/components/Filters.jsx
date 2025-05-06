import React from "react";
import { TextField, MenuItem, Box } from "@mui/material";

const Filters = ({ onFilterChange }) => {
  const [filters, setFilters] = React.useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "",
  });

  const categories = ["Electronics", "Clothing", "Books", "Home", "Other"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3, minWidth: 120 }}>
      <TextField
        select
        label="Категория"
        name="category"
        value={filters.category}
        onChange={handleChange}
      >
        <MenuItem value="">Все</MenuItem>
        {categories.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Мин. цена"
        name="minPrice"
        type="number"
        value={filters.minPrice}
        onChange={handleChange}
      />
      <TextField
        label="Макс. цена"
        name="maxPrice"
        type="number"
        value={filters.maxPrice}
        onChange={handleChange}
      />
      <TextField
        select
        label="Сортировка"
        name="sortBy"
        value={filters.sortBy}
        onChange={handleChange}
      >
        <MenuItem value="">По умолчанию</MenuItem>
        <MenuItem value="price_asc">Цена (по возрастанию)</MenuItem>
        <MenuItem value="price_desc">Цена (по убыванию)</MenuItem>
        <MenuItem value="rating">По рейтингу</MenuItem>
      </TextField>
    </Box>
  );
};

export default Filters;