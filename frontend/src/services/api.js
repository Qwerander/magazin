import axios from "axios";

const API_URL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_API_URL
  : process.env.REACT_APP_API_URL_PUBLIC;

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchProducts = async (filters = {}) => {
  const { category, minPrice, maxPrice, sortBy } = filters;
  const params = new URLSearchParams();

  if (category) params.append("category", category);
  if (minPrice) params.append("minPrice", minPrice);
  if (maxPrice) params.append("maxPrice", maxPrice);
  if (sortBy) params.append("sortBy", sortBy);

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

export const addReview = async (productId, reviewData) => {
  try {
    const response = await api.post(`/reviews/${productId}`, reviewData);
    return response.data;
  } catch (error) {
    console.error("Error adding review:", error);
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

export const createProduct = async (productData) => {
  try {
    const response = await api.post("/products", productData);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};