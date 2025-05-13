import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent
} from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, removeItemFromCart } from "../store/slices/cartSlice";
import { Add, Remove, Edit, Close } from "@mui/icons-material";
import ProductForm from "./ProductForm";
import {
  updateExistingProduct,
  removeProduct
} from "../store/slices/productSlice";
import { selectCurrentToken } from "../store/slices/authSlice";

const ProductCard = ({ product, adminMode }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectCurrentToken);
  const cartItems = useSelector((state) => state.cart.items);
  const cartItem = cartItems.find((item) => item.id === product.id);
  const [editModalOpen, setEditModalOpen] = useState(false);

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

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const handleUpdateProduct = async (productData) => {
    try {
      await dispatch(
        updateExistingProduct({
          token,
          productId: product._id,
          productData: {
            ...productData,
            price: Number(productData.price),
            stock: Number(productData.stock)
          }
        })
      ).unwrap();
      setEditModalOpen(false);
      alert("Товар успешно обновлен!");
    } catch (error) {
      console.error("Failed to update product:", error);
      alert(`Ошибка при обновлении товара: ${error.message}`);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Вы уверены, что хотите удалить этот товар?")) {
      try {
        await dispatch(removeProduct({ token, productId })).unwrap();
        setEditModalOpen(false);
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  return (
    <>
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
        to={adminMode ? "#" : `/product/${product.id}`}
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
          <Typography variant="body2">
            На складе: {product.stock} шт.
          </Typography>
          <Typography variant="body2">Артикул: {product.barcode}</Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, my: 1 }}>
            {product.type_plant?.map((type) => (
              <Chip key={type} label={type} size="small" />
            ))}
          </Box>
          {adminMode ? (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<Edit />}
              sx={{
                textTransform: "none"
              }}
              onClick={handleEditClick}
            >
              Редактировать
            </Button>
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

      <Dialog
        open={editModalOpen}
        onClose={handleCloseEditModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Редактирование товара
          <IconButton
            aria-label="close"
            onClick={handleCloseEditModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <ProductForm
            product={product}
            onSubmit={handleUpdateProduct}
            onClose={handleCloseEditModal}
            onDelete={handleDeleteProduct}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCard;
