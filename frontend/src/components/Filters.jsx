import { useState } from "react";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  Typography,
  Slider,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";

const Filters = ({
  onFilterChange,
  onSortChange,
  onResetFilters,
  filters,
  sortBy,
  uniquePlantTypes,
  priceRange
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handlePriceChange = (event, newValue) => {
    onFilterChange({ priceRange: newValue });
  };

  const handlePlantTypeChange = (type) => {
    const newTypes = filters.type_plant.includes(type)
      ? filters.type_plant.filter((t) => t !== type)
      : [...filters.type_plant, type];
    onFilterChange({ type_plant: newTypes });
  };

  const handleSortChange = (e) => {
    onSortChange(e.target.value);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {isMobile && (
        <Button
          startIcon={<FilterListIcon />}
          onClick={handleDrawerToggle}
          sx={{ mb: 2 }}
        >
          Фильтры
        </Button>
      )}

      {isMobile ? (
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
        >
          <Box sx={{ width: 280, p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2
              }}
            >
              <Typography variant="h6">Фильтры</Typography>
              <IconButton onClick={handleDrawerToggle}>
                <CloseIcon />
              </IconButton>
            </Box>
            <FilterContent />
          </Box>
        </Drawer>
      ) : (
        <Box sx={{ width: 280, p: 2 }}>
          <FilterContent />
        </Box>
      )}
    </>
  );

  function FilterContent() {
    return (
      <>
        <Divider sx={{ my: 2 }} />

        <Typography gutterBottom>
          Цена: {filters.priceRange[0]} - {filters.priceRange[1]} ₽
        </Typography>
        <Slider
          value={filters.priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={priceRange.min}
          max={priceRange.max}
          sx={{ mb: 3 }}
        />

        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Тип растения
        </Typography>
        <FormGroup>
          {uniquePlantTypes.map((type) => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox
                  checked={filters.type_plant.includes(type)}
                  onChange={() => handlePlantTypeChange(type)}
                />
              }
              label={type}
            />
          ))}
        </FormGroup>

        <Divider sx={{ my: 3 }} />

        <Select
          fullWidth
          value={sortBy}
          onChange={handleSortChange}
          displayEmpty
          sx={{ mb: 3 }}
        >
          <MenuItem value="">По умолчанию</MenuItem>
          <MenuItem value="price_asc">Цена (по возрастанию)</MenuItem>
          <MenuItem value="price_desc">Цена (по убыванию)</MenuItem>
        </Select>

        <Button
          fullWidth
          variant="outlined"
          onClick={onResetFilters}
          sx={{ mb: 2 }}
        >
          Сбросить фильтры
        </Button>
      </>
    );
  }
};

export default Filters;
