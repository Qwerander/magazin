// pages/AdminPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import {
  loadAllUsers,
  loadAllOrders,
  changeOrderStatus,
  selectAllUsers,
  selectAllOrders,
  selectAdminStatus,
  selectAdminError
} from "../store/slices/adminSlice";
import { loadProducts, addNewProduct } from "../store/slices/productSlice";
import ProductList from "../components/ProductList";
import ProductForm from "../components/ProductForm";
import { selectCurrentToken, selectIsAdmin } from "../store/slices/authSlice";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminPage = () => {
  const [value, setValue] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const token = useSelector(selectCurrentToken);
  const isAdmin = useSelector(selectIsAdmin);
  const dispatch = useDispatch();

  // Products state
  const { status: productsStatus, error: productsError } = useSelector(
    (state) => state.products
  );

  // Admin state
  const users = useSelector(selectAllUsers);
  const orders = useSelector(selectAllOrders);
  const adminStatus = useSelector(selectAdminStatus);
  const adminError = useSelector(selectAdminError);

  useEffect(() => {
    if (isAdmin) {
      if (value === 0) {
        dispatch(loadProducts());
      } else if (value === 1 && token) {
        dispatch(loadAllOrders(token));
      } else if (value === 2 && token) {
        dispatch(loadAllUsers(token));
      }
    }
  }, [dispatch, value, token, isAdmin]);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  // В AdminPage.jsx замените handleProductAdded на:
  const handleProductAdded = async (newProduct) => {
    try {
      await dispatch(
        addNewProduct({
          productData: newProduct,
          token
        })
      ).unwrap();
      setShowAddForm(false);
      alert("Товар успешно добавлен!");
      dispatch(loadProducts()); // Обновляем список товаров
    } catch (error) {
      console.error("Error adding product:", error);
      alert(`Ошибка при добавлении товара: ${error.message}`);
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    if (token) {
      dispatch(changeOrderStatus({ token, orderId, status: newStatus }));
    }
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Административная панель
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={value} onChange={handleChangeTab} aria-label="admin tabs">
          <Tab label="Товары" />
          <Tab label="Заказы" />
          <Tab label="Пользователи" />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <Button
          variant="contained"
          onClick={() => setShowAddForm(!showAddForm)}
          sx={{ mb: 3 }}
        >
          {showAddForm ? "Скрыть форму" : "Добавить товар"}
        </Button>

        {showAddForm && (
          <ProductForm
            onSubmit={handleProductAdded}
            onClose={() => setShowAddForm(false)}
          />
        )}

        {productsStatus === "loading" ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : productsError ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {productsError}
          </Alert>
        ) : (
          <ProductList adminMode={true} />
        )}
      </TabPanel>

      <TabPanel value={value} index={1}>
        {adminStatus === "loading" ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : adminError ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {adminError}
          </Alert>
        ) : (
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>№ Заказа</TableCell>
                  <TableCell>Пользователь</TableCell>
                  <TableCell>Товары</TableCell>
                  <TableCell>Сумма</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>Дата</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>#{order._id.slice(-6).toUpperCase()}</TableCell>
                    <TableCell>
                      {order.username || "Неизвестный пользователь"}
                    </TableCell>
                    <TableCell>
                      {order.items.map((item) => (
                        <Box key={item._id} sx={{ mb: 1 }}>
                          {item.title}: {item.quantity} ×{" "}
                          {item.price} ₽
                        </Box>
                      ))}
                    </TableCell>
                    <TableCell>{order.totalPrice} ₽</TableCell>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <Select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                        >
                          <MenuItem value="pending">Ожидает</MenuItem>
                          <MenuItem value="processing">В обработке</MenuItem>
                          <MenuItem value="shipped">Отправлен</MenuItem>
                          <MenuItem value="delivered">Доставлен</MenuItem>
                          <MenuItem value="cancelled">Отменен</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>

      <TabPanel value={value} index={2}>
        {adminStatus === "loading" ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : adminError ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {adminError}
          </Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Имя</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Роль</TableCell>
                  <TableCell>Дата регистрации</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user._id.substring(0, 6)}...</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "inline-block",
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: user.isAdmin ? "primary.light" : "grey.200",
                          color: user.isAdmin
                            ? "primary.contrastText"
                            : "text.primary"
                        }}
                      >
                        {user.isAdmin ? "Админ" : "Пользователь"}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>
    </Box>
  );
};

export default AdminPage;
