import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { loadUserData } from '../store/slices/userSlice';
import { selectUserOrders, selectUserStatus, selectUserError } from '../store/slices/userSlice';

const OrdersPage = () => {
  const dispatch = useDispatch();
   const token = useSelector((state) => state.auth.token);
  const orders = useSelector(selectUserOrders);
  const status = useSelector(selectUserStatus);
  const error = useSelector(selectUserError);

  console.log(orders);


  // Загружаем данные пользователя при монтировании
  useEffect(() => {
    dispatch(loadUserData(token));
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h6" align="center">
          У вас пока нет заказов
        </Typography>
      </Container>
    );
  }

  // Функция для форматирования даты
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  // Функция для определения цвета статуса
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'выполнен':
        return 'success';
      case 'processing':
      case 'в обработке':
        return 'info';
      case 'cancelled':
      case 'отменен':
        return 'error';
      case 'shipped':
      case 'отправлен':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Мои заказы
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>№ Заказа</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Дата</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Товары</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Сумма</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Статус</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id} hover>
                <TableCell>#{order._id.slice(-6).toUpperCase()}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>
                  {order.items.map((item) => (
                    <Box key={item.productId?._id || item._id} sx={{ mb: 1 }}>
                      <Typography>
                        {item.productId?.name || 'Товар'} × {item.quantity}
                      </Typography>
                      {item.productId?.price && (
                        <Typography variant="body2" color="text.secondary">
                          {item.productId.price} ₽ за шт.
                        </Typography>
                      )}
                    </Box>
                  ))}
                </TableCell>
                <TableCell>{order.totalPrice} ₽</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default OrdersPage;