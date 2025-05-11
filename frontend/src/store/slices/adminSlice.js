import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchAllUsers,
  fetchAllOrders,
  updateOrderStatus,
  updateProduct,
  deleteProduct
} from '../../services/api';

export const loadAllUsers = createAsyncThunk(
  'admin/loadAllUsers',
  async (token, { rejectWithValue }) => {
    try {
      return await fetchAllUsers(token);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const loadAllOrders = createAsyncThunk(
  'admin/loadAllOrders',
  async (token, { rejectWithValue }) => {
    try {
      return await fetchAllOrders(token);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const changeOrderStatus = createAsyncThunk(
  'admin/changeOrderStatus',
  async ({ token, orderId, status }, { rejectWithValue }) => {
    try {
      return await updateOrderStatus(token, orderId, status);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const editProduct = createAsyncThunk(
  'admin/editProduct',
  async ({ token, productId, productData }, { rejectWithValue }) => {
    try {
      return await updateProduct(token, productId, productData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeProduct = createAsyncThunk(
  'admin/removeProduct',
  async ({ token, productId }, { rejectWithValue }) => {
    try {
      await deleteProduct(token, productId);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  users: [],
  orders: [],
  status: 'idle',
  error: null
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    resetAdminState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Загрузка пользователей
      .addCase(loadAllUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadAllUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(loadAllUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Загрузка заказов
      .addCase(loadAllOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadAllOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(loadAllOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Обновление статуса заказа
      .addCase(changeOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })

      // Удаление товара
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(product => product._id !== action.payload);
      });
  }
});

export const { resetAdminState } = adminSlice.actions;
export const selectAllUsers = (state) => state.admin.users;
export const selectAllOrders = (state) => state.admin.orders;
export const selectAdminStatus = (state) => state.admin.status;
export const selectAdminError = (state) => state.admin.error;

export default adminSlice.reducer;