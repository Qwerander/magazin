import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip
} from "@mui/material";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        minWidth: 280,
        cursor: "pointer",
        "&:hover": {
          boxShadow: 3
        }
      }}
      component={Link}
      to={`/product/${product.id}`}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          flexGrow: 1,
          textDecoration: "none",
          "&:hover": {
            textDecoration: "none"
          }
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            textDecoration: "none",
            "&:hover": {
              textDecoration: "none"
            }
          }}
        >
          {product.title}
        </Typography>

        <Box flex={1} sx={{ mb: 2 }}>
          {product.url && (
            <img
              src={product.url}
              alt={product.title}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "contain",
                borderRadius: "8px"
              }}
            />
          )}
        </Box>

        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          ${product.price}
        </Typography>
        <Typography variant="body2">
          Вес: {product.weight || "Не указан"}
        </Typography>
        <Typography variant="body2">Артикул: {product.barcode}</Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, my: 1 }}>
          {product.type_plant?.map((type) => (
            <Chip key={type} label={type} size="small" />
          ))}
        </Box>

        <Button
          variant="contained"
          color="success"
          sx={{
            mt: "auto",
            textTransform: "none"
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <span style={{ textDecoration: "none" }}>В корзину</span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
