import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductById, fetchReviews, addReview } from "../services/api";
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Rating,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Chip
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, removeItemFromCart } from "../store/slices/cartSlice";
import { selectCurrentToken, selectCurrentUser } from "../store/slices/authSlice";
import ReviewForm from "../components/ReviewForm";


const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const cartItem = cartItems.find((item) => item.id === id);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productData, reviewsData] = await Promise.all([
          fetchProductById(id),
          fetchReviews(id)
        ]);
        setProduct(productData);
        setReviews(reviewsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleReviewSubmit = async (reviewData) => {
    try {
      const newReview = await addReview(token, id, {
        ...reviewData,
        userName: user.username // Используем имя пользователя из store
      });
      setReviews([...reviews, newReview]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.url
      })
    );
  };

  const handleRemoveFromCart = () => {
    dispatch(removeItemFromCart(product.id));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Ошибка: {error}
      </Alert>
    );
  }

  if (!product) {
    return (
      <Typography variant="h6" mt={2}>
        Товар не найден
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", p: 3, width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        {product.title}
      </Typography>

      <Box display="flex" gap={4} mb={4}>
        <Box flex={1}>
          {product.url && (
            <img
              src={product.url}
              alt={product.title}
              style={{ maxWidth: "100%", borderRadius: "8px" }}
            />
          )}
        </Box>

        <Box flex={1}>
          <Typography variant="h5" gutterBottom>
            {product.price} ₽
          </Typography>

          <Rating value={product.rating} readOnly precision={0.5} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 3 }}>
            {cartItem ? (
              <>
                <IconButton
                  color="primary"
                  onClick={handleRemoveFromCart}
                  sx={{ border: "1px solid", borderColor: "divider" }}
                >
                  <Remove fontSize="small" />
                </IconButton>
                <Typography sx={{ minWidth: 24, textAlign: "center" }}>
                  {cartItem.quantity}
                </Typography>
                <IconButton
                  color="primary"
                  onClick={handleAddToCart}
                  sx={{ border: "1px solid", borderColor: "divider" }}
                >
                  <Add fontSize="small" />
                </IconButton>
              </>
            ) : (
              <Button
                variant="contained"
                color="success"
                onClick={handleAddToCart}
                sx={{ width: 200 }}
              >
                В корзину
              </Button>
            )}
          </Box>

          <Typography variant="body1" mt={2}>
            {product.description}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: 'column', alignItems: 'start', gap: 0.5, my: 1 }}>
            <Typography variant="body2" mt={2} color="text.secondary">
              Категория:{" "}
            </Typography>
            <Box
              sx={{ display: "flex", flexWrap: 'wrap', gap: 0.5, my: 1 }}
            >
              {product.type_plant?.map((type) => (
                <Chip key={type} label={type} size="small" />
              ))}
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary">
            На складе: {product.stock} шт.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Отзывы ({reviews.length})
        </Typography>

        {token ? (
          <ReviewForm onSubmit={handleReviewSubmit} />
        ) : (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="body1" gutterBottom>
              Войдите, чтобы оставить отзыв
            </Typography>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              color="primary"
            >
              Войти
            </Button>
          </Box>
        )}

        {reviews.length > 0 ? (
          <List>
            {reviews.map((review) => (
              <React.Fragment key={review._id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={review.userName}
                    secondary={
                      <>
                        <Rating value={review.rating} readOnly size="small" />
                        <Typography
                          component="span"
                          variant="body2"
                          display="block"
                        >
                          {review.comment}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body1" color="text.secondary">
            Пока нет отзывов. Будьте первым!
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ProductPage;