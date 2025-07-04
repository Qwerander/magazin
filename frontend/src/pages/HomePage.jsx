import { Box, Typography } from "@mui/material";
import ProductList from "../components/ProductList";

const HomePage = () => {
  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", p: 3 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            mb: 2,
            fontSize: {
              xs: "2rem",
              sm: "3rem",
              md: "3.75rem"
            }
          }}
        >
          Добро пожаловать в&nbsp;Greenshop
        </Typography>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Давайте сделаем планету лучше
        </Typography>
        <Typography sx={{ mb: 3, maxWidth: 600, mx: "auto" }}>
          Мы интернет-магазин растений, предлагающий широкий ассортимент
          недорогих и модных растений. Создайте свой городской сад с нашими
          растениями. Закажите свои любимые растения!
        </Typography>
      </Box>
      <ProductList />
    </Box>
  );
};

export default HomePage;
