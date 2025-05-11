import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  orders: [],
  status: 'idle',
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.cart = action.payload.cart || [];
      state.orders = action.payload.orders || [];
    },
    addToCart: (state, action) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.cart.find(item => item.productId === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cart.push({ productId, quantity });
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.productId !== action.payload);
    },
    updateCartItem: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cart.find(item => item.productId === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
    addOrder: (state, action) => {
      state.orders.unshift(action.payload);
    },
    setLoading: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const {
  setUserData,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  addOrder,
  setLoading,
  setError
} = userSlice.actions;

export default userSlice.reducer;

export const selectCart = state => state.user.cart;
export const selectOrders = state => state.user.orders;
export const selectUserStatus = state => state.user.status;
export const selectUserError = state => state.user.error;