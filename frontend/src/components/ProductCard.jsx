import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Card sx={{ maxWidth: 300, height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        flexGrow: 1
      }}>
        <Typography variant="h6" marginBottom={'auto'}>{product.title}</Typography>
        <Box flex={1}>
          {product.url && (
            <img
              src={product.url}
              alt={product.title}
              style={{ maxWidth: "100%", borderRadius: "8px" }}
            />
          )}
        </Box>
        <Typography>${product.price}</Typography>
        <Typography>{product.category}</Typography>
        <Button
          component={Link}
          to={`/product/${product._id}`}
          variant="contained"
          sx={{ mt: "auto" }}
        >
          Подробнее
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;