import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CssBaseline, Container } from "@mui/material";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import NotFoundPage from "./pages/NotFoundPage";
import Footer from "./components/Footer";
import CartPage from "./pages/CartPage";
import { setCredentials } from "./store/slices/authSlice";
import { loadAuthState } from "./services/authPersist";
import AdminPage from "./pages/AdminPage";
import PrivateRoute from "./components/PrivateRoute";
import OrdersPage from "./pages/OrdersPage";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const savedAuthState = loadAuthState();
    if (savedAuthState?.auth?.token) {
      const loadAuthUser = async () => {
        try {
          dispatch(
            setCredentials({
              user: savedAuthState.auth.user,
              isAdmin: savedAuthState.auth.isAdmin,
              token: savedAuthState.auth.token
            })
          );
        } catch (error) {
          console.error("Failed to load user data:", error);
        }
      };
      loadAuthUser();
    }
  }, [dispatch]);

  return (
    <>
      <CssBaseline />
      <Container
        maxWidth="xl"
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "start"
        }}
      >
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />

          {/* User routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/orders" element={<OrdersPage />} />
          </Route>

          {/* Admin routes */}
          <Route element={<PrivateRoute adminOnly />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </Container>
    </>
  );
}

export default App;
