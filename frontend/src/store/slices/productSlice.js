// store/slices/productSlice.js
import {
  createSlice,
  createAsyncThunk,
  createSelector
} from "@reduxjs/toolkit";
import {
  createProduct,
  fetchProducts,
  updateProduct,
  deleteProduct
} from "../../services/api";

// Асинхронные Thunks
export const loadProducts = createAsyncThunk(
  "products/loadProducts",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchProducts();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addNewProduct = createAsyncThunk(
  "products/addNewProduct",
  async ({ productData, token }, { rejectWithValue }) => {
    try {
      console.log(productData);

      const dataToSend = {
        ...productData,
        _id: new Date().toString()
      };
      const newProduct = await createProduct(token, dataToSend);
      return newProduct;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// В productSlice.js обновим updateExistingProduct и removeProduct:

export const updateExistingProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ token, productId, productData }, { rejectWithValue }) => {
    console.log(token);
    console.log(productId);
    console.log(productData);

    try {
      const updatedProduct = await updateProduct(token, productId, productData);
      return updatedProduct;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeProduct = createAsyncThunk(
  "products/deleteProduct",
  async ({ token, productId }, { rejectWithValue }) => {
        console.log(token);
    console.log(productId);
    try {
      await deleteProduct(token, productId);
      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Вспомогательная функция для фильтрации и сортировки
const applyFiltersAndSorting = (state) => {
  let filteredItems = [...state.allItems];

  // Фильтрация по цене
  filteredItems = filteredItems.filter(
    (item) =>
      item.price >= state.filters.priceRange[0] &&
      item.price <= state.filters.priceRange[1]
  );

  // Фильтрация по весу
  if (state.filters.weight) {
    filteredItems = filteredItems.filter((item) =>
      item.weight.includes(state.filters.weight)
    );
  }

  // Фильтрация по типу растения
  if (state.filters.type_plant.length > 0) {
    filteredItems = filteredItems.filter((item) =>
      item.type_plant.some((type) => state.filters.type_plant.includes(type))
    );
  }

  // Сортировка
  if (state.sortBy === "price_asc") {
    filteredItems.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === "price_desc") {
    filteredItems.sort((a, b) => b.price - a.price);
  }

  state.items = filteredItems;
};

// Начальное состояние
const initialState = {
  items: [],
  allItems: [],
  status: "idle",
  error: null,
  filters: {
    priceRange: [0, 1000],
    weight: "",
    type_plant: []
  },
  sortBy: "",
  currentPage: 1,
  itemsPerPage: 6,
  uniquePlantTypes: [],
  minPrice: 0,
  maxPrice: 1000
};

// Создание slice
const productsSlice = createSlice({
  name: "products",
  initialState,
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
        weight: "",
        type_plant: []
      };
      state.sortBy = "";
      state.currentPage = 1;
      applyFiltersAndSorting(state);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allItems = action.payload;

        // Расчет цен
        const prices = action.payload.map((p) => p.price);
        state.minPrice = Math.min(...prices);
        state.maxPrice = Math.max(...prices);
        state.filters.priceRange = [state.minPrice, state.maxPrice];

        // Уникальные типы растений
        const allTypes = action.payload.flatMap(
          (product) => product.type_plant
        );
        state.uniquePlantTypes = [...new Set(allTypes)];

        applyFiltersAndSorting(state);
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.allItems.unshift(action.payload);

        // Обновление цен
        const newPrice = action.payload.price;
        if (newPrice < state.minPrice) state.minPrice = newPrice;
        if (newPrice > state.maxPrice) state.maxPrice = newPrice;

        // Обновление типов растений
        const newTypes = action.payload.type_plant.filter(
          (type) => !state.uniquePlantTypes.includes(type)
        );
        if (newTypes.length > 0) {
          state.uniquePlantTypes = [...state.uniquePlantTypes, ...newTypes];
        }

        applyFiltersAndSorting(state);
      })
      .addCase(updateExistingProduct.fulfilled, (state, action) => {
        const index = state.allItems.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) {
          state.allItems[index] = action.payload;
        }

        // Пересчет цен
        const prices = state.allItems.map((p) => p.price);
        state.minPrice = Math.min(...prices);
        state.maxPrice = Math.max(...prices);

        // Обновление типов растений
        const allTypes = state.allItems.flatMap(
          (product) => product.type_plant
        );
        state.uniquePlantTypes = [...new Set(allTypes)];

        applyFiltersAndSorting(state);
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.allItems = state.allItems.filter(
          (item) => item._id !== action.payload
        );

        // Пересчет цен
        if (state.allItems.length > 0) {
          const prices = state.allItems.map((p) => p.price);
          state.minPrice = Math.min(...prices);
          state.maxPrice = Math.max(...prices);
        } else {
          state.minPrice = 0;
          state.maxPrice = 1000;
        }

        // Обновление типов растений
        const allTypes = state.allItems.flatMap(
          (product) => product.type_plant
        );
        state.uniquePlantTypes = [...new Set(allTypes)];

        applyFiltersAndSorting(state);
      });
  }
});

export const { setFilters, setSortBy, setCurrentPage, resetFilters } =
  productsSlice.actions;

export const selectProductsState = (state) => state.products;

export const selectAllProducts = createSelector(
  [selectProductsState],
  (products) => {
    const startIndex = (products.currentPage - 1) * products.itemsPerPage;
    return products.items.slice(startIndex, startIndex + products.itemsPerPage);
  }
);

export const selectProductsStatus = createSelector(
  [selectProductsState],
  (products) => products.status
);

export const selectProductsError = createSelector(
  [selectProductsState],
  (products) => products.error
);

export const selectProductsFilters = createSelector(
  [selectProductsState],
  (products) => products.filters
);

export const selectSortBy = createSelector(
  [selectProductsState],
  (products) => products.sortBy
);

export const selectCurrentPage = createSelector(
  [selectProductsState],
  (products) => products.currentPage
);

export const selectTotalPages = createSelector(
  [selectProductsState],
  (products) => Math.ceil(products.items.length / products.itemsPerPage)
);

export const selectUniquePlantTypes = createSelector(
  [selectProductsState],
  (products) => products.uniquePlantTypes
);

export const selectPriceRange = createSelector(
  [
    (state) => state.products.minPrice,
    (state) => state.products.maxPrice,
    (state) => state.products.filters.priceRange
  ],
  (min, max, current) => ({
    min,
    max,
    current
  })
);

export default productsSlice.reducer;
