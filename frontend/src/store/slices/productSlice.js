import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createProduct, fetchProducts } from '../../services/api';

export const loadProducts = createAsyncThunk(
  'products/loadProducts',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchProducts();
      return data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addNewProduct = createAsyncThunk(
  'products/addNewProduct',
  async (productData, { rejectWithValue }) => {
    try {
      // Преобразуем данные перед отправкой
      const dataToSend = {
        ...productData,
        _id: productData.id
      };

      const newProduct = await createProduct(dataToSend);
      // Преобразуем полученные данные
      return newProduct;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const applyFiltersAndSorting = (state) => {
  let filteredItems = [...state.allItems];

  // Apply price range filter
  filteredItems = filteredItems.filter(
    item => item.price >= state.filters.priceRange[0] &&
            item.price <= state.filters.priceRange[1]
  );

  // Apply weight filter
  if (state.filters.weight) {
    filteredItems = filteredItems.filter(
      item => item.weight.includes(state.filters.weight)
    );
  }

  // Apply plant type filter
  if (state.filters.type_plant.length > 0) {
    filteredItems = filteredItems.filter(item =>
      item.type_plant.some(type => state.filters.type_plant.includes(type))
    );
  }

  // Apply sorting
  if (state.sortBy === 'price_asc') {
    filteredItems.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === 'price_desc') {
    filteredItems.sort((a, b) => b.price - a.price);
  }

  state.items = filteredItems;
};

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    allItems: [],
    status: 'idle',
    error: null,
    filters: {
      priceRange: [0, 1000],
      weight: '',
      type_plant: [],
    },
    sortBy: '',
    currentPage: 1,
    itemsPerPage: 6,
    uniquePlantTypes: [],
    minPrice: 0,
    maxPrice: 1000,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
      applyFiltersAndSorting(state);
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      state.currentPage = 1;
      applyFiltersAndSorting(state);
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        priceRange: [state.minPrice, state.maxPrice],
        weight: '',
        type_plant: [],
      };
      state.sortBy = '';
      state.currentPage = 1;
      applyFiltersAndSorting(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allItems = action.payload;

        // Calculate min and max prices
        const prices = action.payload.map(p => p.price);
        state.minPrice = Math.min(...prices);
        state.maxPrice = Math.max(...prices);
        state.filters.priceRange = [state.minPrice, state.maxPrice];

        // Extract unique plant types
        const allTypes = action.payload.flatMap(product => product.type_plant);
        state.uniquePlantTypes = [...new Set(allTypes)];

        // Apply initial filters
        applyFiltersAndSorting(state);
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.allItems.unshift(action.payload);

        // Update price range if needed
        const newPrice = action.payload.price;
        if (newPrice < state.minPrice) state.minPrice = newPrice;
        if (newPrice > state.maxPrice) state.maxPrice = newPrice;

        // Update unique plant types if new types were added
        const newTypes = action.payload.type_plant.filter(
          type => !state.uniquePlantTypes.includes(type)
        );
        if (newTypes.length > 0) {
          state.uniquePlantTypes = [...state.uniquePlantTypes, ...newTypes];
        }

        applyFiltersAndSorting(state);
      });
  },
});

export const {
  setFilters,
  setSortBy,
  setCurrentPage,
  resetFilters
} = productsSlice.actions;

export default productsSlice.reducer;

export const selectAllProducts = (state) => {
  const { items, currentPage, itemsPerPage } = state.products;
  const startIndex = (currentPage - 1) * itemsPerPage;
  return items.slice(startIndex, startIndex + itemsPerPage);
};

export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;
export const selectProductsFilters = (state) => state.products.filters;
export const selectSortBy = (state) => state.products.sortBy;
export const selectCurrentPage = (state) => state.products.currentPage;
export const selectTotalPages = (state) =>
  Math.ceil(state.products.items.length / state.products.itemsPerPage);
export const selectUniquePlantTypes = (state) => state.products.uniquePlantTypes;
export const selectPriceRange = (state) => ({
  min: state.products.minPrice,
  max: state.products.maxPrice,
  current: state.products.filters.priceRange,
});