import { useEffect } from "react";
import ReactDOM from "react-dom";
import { Box, Typography, Button, Modal } from "@mui/material";
import { useDispatch } from "react-redux";
import { clearCart } from "../store/slices/cartSlice";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  textAlign: "center"
};

const ThankYouModal = ({ open, onClose }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (open) {
      dispatch(clearCart());
    }
  }, [open, dispatch]);

  return ReactDOM.createPortal(
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="thank-you-modal"
      aria-describedby="thank-you-for-purchase"
    >
      <Box sx={modalStyle}>
        <Typography variant="h5" component="h2" gutterBottom>
          Спасибо за покупку!
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Ваш заказ успешно оформлен. Мы свяжемся с вами в ближайшее время.
        </Typography>
        <Button variant="contained" color="primary" onClick={onClose} fullWidth>
          Закрыть
        </Button>
      </Box>
    </Modal>,
    document.getElementById("modal-root")
  );
};

export default ThankYouModal;
