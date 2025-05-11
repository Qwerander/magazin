import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  IconButton
} from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, removeItemFromCart } from "../store/slices/cartSlice";
import { Add, Remove } from "@mui/icons-material";

const ProductCard = ({ product, adminMode }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const cartItem = cartItems.find((item) => item.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addItemToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.url
      })
    );
  };

  const handleRemoveFromCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(removeItemFromCart(product.id));
  };

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
      to={adminMode ? '' : `/product/${product.id}`}
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
          {product.price} ₽
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
        {adminMode ? (
          <>
            {" "}
            <Button
              variant="contained"
              color="success"
              fullWidth
              sx={{
                textTransform: "none"
              }}
              onClick={() => {}}
            >
              Редактировать
            </Button>
          </>
        ) : (
          <Box sx={{ mt: "auto", display: "flex", alignItems: "center" }}>
            {cartItem ? (
              <>
                <IconButton
                  color="primary"
                  onClick={handleRemoveFromCart}
                  sx={{ border: "1px solid", borderColor: "divider" }}
                >
                  <Remove fontSize="small" />
                </IconButton>
                <Typography mx={1} sx={{ minWidth: 24, textAlign: "center" }}>
                  {cartItem.quantity}
                </Typography>
                <IconButton
                  color="primary"
                  onClick={handleAddToCart}
                  sx={{ border: "1px solid", borderColor: "divider" }}
                >
                  <Add fontSize="small" />
                </IconButton>
              </>
            ) : (
              <Button
                variant="contained"
                color="success"
                fullWidth
                sx={{
                  textTransform: "none"
                }}
                onClick={handleAddToCart}
              >
                В корзину
              </Button>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
