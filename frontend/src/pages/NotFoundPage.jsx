import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h3">404</Typography>
      <Typography variant="h5">Страница не найдена</Typography>
      <Button component={Link} to="/" variant="contained" sx={{ mt: 3 }}>
        На главную
      </Button>
    </div>
  );
};

export default NotFoundPage;
