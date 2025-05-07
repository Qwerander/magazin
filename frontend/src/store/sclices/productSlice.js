import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createProduct, fetchProducts } from '../../services/api';

export const loadProducts = createAsyncThunk(
  'products/loadProducts',
  async (filters, { rejectWithValue }) => {
    try {
      const data = await fetchProducts(filters);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addNewProduct = createAsyncThunk(
  'products/addNewProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const newProduct = await createProduct(productData);
      return newProduct;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    filters: {},
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export const { setFilters } = productsSlice.actions;
export default productsSlice.reducer;

export const selectAllProducts = (state) => state.products.items;
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;
export const selectProductsFilters = (state) => state.products.filters;