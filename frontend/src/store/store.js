import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import { loadAuthState, saveAuthState } from '../services/authPersist';

const preloadedState = loadAuthState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveAuthState(store.getState());
});