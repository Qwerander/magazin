import React, { useState } from "react";
import { TextField, Button, Box, Rating } from "@mui/material";

const ReviewForm = ({ onSubmit }) => {
  const [review, setReview] = useState({
    userName: "",
    rating: 5,
    comment: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(review);
    setReview({ userName: "", rating: 5, comment: "" });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <TextField
        label="Ваше имя"
        value={review.userName}
        onChange={(e) => setReview({ ...review, userName: e.target.value })}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
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
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained">
        Отправить
      </Button>
    </Box>
  );
};

export default ReviewForm;