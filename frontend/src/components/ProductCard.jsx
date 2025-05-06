import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Card sx={{ maxWidth: 300 }}>
      <CardContent>
        <Typography variant="h6">{product.name}</Typography>
        <Typography>${product.price}</Typography>
        <Typography>{product.category}</Typography>
        <Button component={Link} to={`/product/${product._id}`} variant="contained">
          Подробнее
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;