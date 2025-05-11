import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById, fetchReviews, addReview } from "../services/api";
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  TextField,
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

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    userName: "",
    rating: 5,
    comment: ""
  });

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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const newReview = await addReview(id, reviewForm);
      setReviews([...reviews, newReview]);
      setReviewForm({
        userName: "",
        rating: 5,
        comment: ""
      });
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
    <Box sx={{ maxWidth: 1200, margin: "0 auto", p: 3 }}>
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

          <Typography variant="body2" mt={2} color="text.secondary">
            Категория:{" "}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, my: 1 }}>
              {product.type_plant?.map((type) => (
                <Chip key={type} label={type} size="small" />
              ))}
            </Box>
          </Typography>

          <Typography variant="body2" color="text.secondary">
            На складе: {product.stock} шт.
          </Typography>
        </Box>
      </Box>

      <Box component="form" onSubmit={handleReviewSubmit} sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Оставить отзыв
        </Typography>

        <TextField
          fullWidth
          label="Ваше имя"
          value={reviewForm.userName}
          onChange={(e) =>
            setReviewForm({ ...reviewForm, userName: e.target.value })
          }
          required
          sx={{ mb: 2 }}
        />

        <Box sx={{ mb: 2 }}>
          <Typography component="legend">Оценка</Typography>
          <Rating
            value={reviewForm.rating}
            onChange={(e, newValue) =>
              setReviewForm({ ...reviewForm, rating: newValue })
            }
          />
        </Box>

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Комментарий"
          value={reviewForm.comment}
          onChange={(e) =>
            setReviewForm({ ...reviewForm, comment: e.target.value })
          }
          sx={{ mb: 2 }}
        />

        <Button type="submit" variant="contained">
          Отправить отзыв
        </Button>
      </Box>

      <Typography variant="h6" gutterBottom>
        Отзывы ({reviews.length})
      </Typography>

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
  );
};

export default ProductPage;
