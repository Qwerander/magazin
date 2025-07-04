import { useEffect } from "react";
import { Pagination, Typography, Box, CircularProgress } from "@mui/material";
import ProductCard from "./ProductCard";
import Filters from "./Filters";
import { useDispatch, useSelector } from "react-redux";
import {
  loadProducts,
  selectAllProducts,
  selectProductsStatus,
  selectProductsFilters,
  selectSortBy,
  selectCurrentPage,
  selectTotalPages,
  selectUniquePlantTypes,
  selectPriceRange,
  setFilters,
  setSortBy,
  setCurrentPage,
  resetFilters
} from "../store/slices/productSlice";

const ProductList = ({ adminMode = false }) => {
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);
  const filters = useSelector(selectProductsFilters);
  const sortBy = useSelector(selectSortBy);
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  const uniquePlantTypes = useSelector(selectUniquePlantTypes);
  const priceRange = useSelector(selectPriceRange);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!adminMode) {
      dispatch(loadProducts());
    }
  }, [dispatch, adminMode]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handleSortChange = (newSort) => {
    dispatch(setSortBy(newSort));
  };

  const handlePageChange = (event, page) => {
    dispatch(setCurrentPage(page));
    window.scrollTo(0, 0);
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 3
      }}
    >
      {!adminMode && (
        <Box
          sx={{
            width: { md: 300 },
            flexShrink: 0
          }}
        >
          <Filters
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            onResetFilters={handleResetFilters}
            filters={filters}
            sortBy={sortBy}
            uniquePlantTypes={uniquePlantTypes}
            priceRange={priceRange}
          />
        </Box>
      )}

      <Box sx={{ flexGrow: 1 }}>
        {status === "loading" ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : products?.length > 0 ? (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(auto-fit, minmax(280px, 1fr))",
                  sm: "repeat(auto-fit, minmax(280px, 1fr))",
                  md: "repeat(auto-fit, minmax(280px, 1fr))",
                  lg: "repeat(auto-fit, minmax(280px, 1fr))"
                },
                gap: 3,
                width: "100%"
              }}
            >
              {products.map((product) => (
                <Box key={product._id} sx={{ height: "100%" }}>
                  <ProductCard product={product} adminMode={adminMode} />
                </Box>
              ))}
            </Box>
            {totalPages > 1 && (
              <Box
                sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}
              >
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        ) : (
          <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
            Товары не найдены. Попробуйте изменить параметры фильтрации.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ProductList;
