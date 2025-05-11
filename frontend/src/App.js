import { useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { CssBaseline, Container } from '@mui/material';
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import NotFoundPage from "./pages/NotFoundPage";
import Footer from "./components/Footer";
import CartPage from "./pages/CartPage";
// import OrdersPage from "./pages/OrdersPage";
import { getUserData } from './services/api';
import { setCredentials } from './store/slices/authSlice';
import { loadAuthState } from './services/authPersist';


function App() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    // Проверяем наличие сохраненного состояния аутентификации
    const savedAuthState = loadAuthState();
    if (savedAuthState?.auth?.token) {
      // Если есть токен, загружаем данные пользователя
      const loadUserData = async () => {
        try {
          const userData = await getUserData(savedAuthState.auth.token);
          dispatch(setCredentials({
            user: {
              ...savedAuthState.auth.user,
              user_data: userData
            },
            token: savedAuthState.auth.token
          }));
        } catch (error) {
          console.error('Failed to load user data:', error);
        }
      };
      loadUserData();
    }
  }, [dispatch]);

  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          {/* <Route path="/orders" element={<OrdersPage />} /> */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </Container>
    </>
  );
}

export default App;