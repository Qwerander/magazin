import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_URL
    : process.env.REACT_APP_API_URL_PUBLIC;

// Базовый инстанс для неавторизованных запросов
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json"
  }
});

// Инстанс для авторизованных запросов
const createAuthApi = (token) => {
  return axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
};

// Функции для неавторизованных запросов
export const fetchProducts = async (filters = {}) => {
  const { type_plant, minPrice, maxPrice, sortBy, weight } = filters;
  const params = new URLSearchParams();

  if (type_plant) params.append("type_plant", type_plant);
  if (minPrice) params.append("minPrice", minPrice);
  if (maxPrice) params.append("maxPrice", maxPrice);
  if (sortBy) params.append("sortBy", sortBy);
  if (weight) params.append("weight", weight);

  try {
    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};

export const fetchProductByBarcode = async (barcode) => {
  try {
    const response = await api.get(`/products/barcode/${barcode}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by barcode:", error);
    throw error;
  }
};

export const fetchReviews = async (productId) => {
  try {
    const response = await api.get(`/reviews/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

// Функции для авторизованных запросов
export const addReview = async (token, productId, reviewData) => {
  try {
    const authApi = createAuthApi(token);
    const response = await authApi.post(`/reviews/${productId}`, reviewData);
    return response.data;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

export const createProduct = async (token, productData) => {
  try {
    const authApi = createAuthApi(token);
    const response = await authApi.post("/products", productData);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Функции для работы с корзиной и заказами
export const getUserData = async (token) => {
  try {
    const authApi = createAuthApi(token);
    const response = await authApi.get("/user");
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
};

export const addToCart = async (token, productId, quantity = 1) => {
  try {
    const authApi = createAuthApi(token);
    const response = await authApi.post("/user/cart", { productId, quantity });
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export const removeFromCart = async (token, productId) => {
  try {
    const authApi = createAuthApi(token);
    const response = await authApi.delete(`/user/cart/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};

export const updateCartItem = async (token, productId, quantity) => {
  try {
    const authApi = createAuthApi(token);
    const response = await authApi.put(`/user/cart/${productId}`, { quantity });
    return response.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

export const clearCart = async (token) => {
  try {
    const authApi = createAuthApi(token);
    const response = await authApi.delete("/user/cart");
    return response.data;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};

export const createOrder = async (token, orderData) => {
  try {

    const authApi = createAuthApi(token);
    const response = await authApi.post("/user/orders", orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const getOrders = async (token) => {
  try {
    const authApi = createAuthApi(token);
    const response = await authApi.get("/user/orders");
    return response.data;
  } catch (error) {
    console.error("Error getting orders:", error);
    throw error;
  }
};
export const updateProduct = async (token, productId, productData) => {
  try {
    const authApi = createAuthApi(token);
    const response = await authApi.put(`/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};
export const deleteProduct = async (token, productId) => {
  try {
    const authApi = createAuthApi(token);
    const response = await authApi.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const fetchAllUsers = async (token) => {
  try {
    const authApi = createAuthApi(token);
    const response = await authApi.get("/admin/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const fetchAllOrders = async (token) => {
  try {
    const authApi = createAuthApi(token);
    const response = await authApi.get("/admin/orders");
    console.log(response);

    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const updateOrderStatus = async (token, orderId, status) => {
  try {
    const authApi = createAuthApi(token);
    const response = await authApi.put(`/admin/orders/${orderId}/status`, {
      status
    });
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};
