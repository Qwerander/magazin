import { configureStore } from '@reduxjs/toolkit';
import authReducer from './sclices/authSlice';
import productsReducer from './sclices/productSlice';
import { loadAuthState, saveAuthState } from '../services/authPersist';

const preloadedState = loadAuthState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveAuthState(store.getState());
});