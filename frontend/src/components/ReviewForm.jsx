import React, { useState } from "react";
import { TextField, Button, Box, Rating, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/slices/authSlice"; // Предполагается, что у вас есть такой селектор

const ReviewForm = ({ onSubmit }) => {
  const [review, setReview] = useState({
    rating: 5,
    comment: "",
  });

  const user = useSelector(selectCurrentUser); // Получаем данные пользователя из хранилища

  const handleSubmit = (e) => {
    e.preventDefault();
    // Добавляем имя пользователя из store к данным отзыва
    onSubmit({
      ...review,
      userName: user.username, // или user.name, в зависимости от структуры вашего store
    });
    setReview({ rating: 5, comment: "" });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        От имени: {user.username} {/* Показываем имя пользователя */}
      </Typography>
      <Rating
        value={review.rating}
        onChange={(e, newValue) => setReview({ ...review, rating: newValue })}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Комментарий"
        multiline
        rows={4}
        value={review.comment}
        onChange={(e) => setReview({ ...review, comment: e.target.value })}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained">
        Отправить отзыв
      </Button>
    </Box>
  );
};

export default ReviewForm;