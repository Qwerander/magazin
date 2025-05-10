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

const CartPage = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [openModal, setOpenModal] = useState(false);

  const handleCheckout = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Корзина
      </Typography>

      {cart.items.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" gutterBottom>
            Ваша корзина пуста
          </Typography>
          <Button variant="contained" color="primary" component={RouterLink} to="/">
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
              <Button
                variant="contained"
                color="primary"
                onClick={handleCheckout}
              >
                Оформить заказ
              </Button>
            </Box>
          </Box>
        </>
      )}

      <ThankYouModal open={openModal} onClose={handleCloseModal} />
    </Box>
  );
};

export default CartPage;