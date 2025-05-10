// src/App.js
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import NotFoundPage from "./pages/NotFoundPage";
import { CssBaseline, Container } from '@mui/material';
import Footer from "./components/Footer";
import CartPage from "./pages/CartPage";

function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
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