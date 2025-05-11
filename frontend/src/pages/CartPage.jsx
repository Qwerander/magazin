import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Link
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemToCart,
  removeItemFromCart,
  deleteItemFromCart,
  clearCart
} from "../store/slices/cartSlice";
import { Link as RouterLink } from "react-router-dom";
import ThankYouModal from "../components/ThankYouModal";
import {
  logout,
  selectCurrentToken,
  selectCurrentUser
} from "../store/slices/authSlice";
import { createOrder } from "../services/api";
import { loadUserData } from "../store/slices/userSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user || !token) {
      console.error("Токен пользователя отсутствует");
      return;
    }

    setIsLoading(true);

    try {
      const orderData = {
        items: cart.items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalPrice: cart.totalAmount
      };

      await createOrder(token, orderData);
      dispatch(loadUserData(token));
      dispatch(clearCart());
      setOpenModal(true);
    } catch (error) {
      console.error("Ошибка при оформлении заказа:", error);
      if (error.response?.status === 401) {
        alert("Сессия истекла. Пожалуйста, войдите снова.");
        dispatch(logout());
      } else {
        alert(`Ошибка: ${error.response?.data?.error || error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", p: 3, width: "100%" }}>
      <Typography variant="h4" gutterBottom>
        Корзина
      </Typography>

      {cart.items.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" gutterBottom>
            Ваша корзина пуста
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/"
          >
            Вернуться к покупкам
          </Button>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Товар</TableCell>
                  <TableCell align="center">Количество</TableCell>
                  <TableCell align="right">Цена</TableCell>
                  <TableCell align="right">Сумма</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Link
                          component={RouterLink}
                          to={`/product/${item.id}`}
                          underline="none"
                          color="inherit"
                        >
                          <Box display="flex" alignItems="center">
                            <img
                              src={item.image}
                              alt={item.title}
                              style={{ width: 50, height: 50, marginRight: 16 }}
                            />
                            <Typography>{item.title}</Typography>
                          </Box>
                        </Link>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <IconButton
                          size="small"
                          onClick={() => dispatch(removeItemFromCart(item.id))}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        <Typography mx={2}>{item.quantity}</Typography>
                        <IconButton
                          size="small"
                          onClick={() => dispatch(addItemToCart(item))}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="right">{item.price} ₽</TableCell>
                    <TableCell align="right">{item.totalPrice} ₽</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="error"
                        onClick={() => dispatch(deleteItemFromCart(item.id))}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box mt={3} textAlign="right">
            <Typography variant="h6">Итого: {cart.totalAmount} ₽</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Товаров: {cart.totalQuantity} шт.
            </Typography>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => dispatch(clearCart())}
              >
                Очистить корзину
              </Button>
              {user ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? "Оформление..." : "Оформить заказ"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to="/login"
                >
                  Войти для оформления
                </Button>
              )}
            </Box>
          </Box>
        </>
      )}

      <ThankYouModal open={openModal} onClose={handleCloseModal} />
    </Box>
  );
};

export default CartPage;
