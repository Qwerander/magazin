import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import userReducer from './slices/userSlice';
import adminReducer from './slices/adminSlice';
import { loadAuthState, saveAuthState } from '../services/authPersist';

const preloadedState = loadAuthState();

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    admin: adminReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveAuthState(store.getState());
});