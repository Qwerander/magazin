import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Badge
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectCurrentUser } from "../store/slices/authSlice";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const user = useSelector(selectCurrentUser);
  const cartItemsCount = useSelector((state) => state.cart.totalQuantity);
  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    handleMenuClose();
  };

  const navItems = [{ text: "Главная", path: "/" }];

  // useEffect((
  //   dispatch
  // ) => {})

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {navItems.map((item) => (
          <ListItem
            button="true"
            key={item.text}
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem
          button="true"
          component={Link}
          to="/cart"
          onClick={handleDrawerToggle}
        >
          <ListItemText primary="Корзина" />
          {cartItemsCount > 0 && (
            <Badge badgeContent={cartItemsCount} color="primary" />
          )}
        </ListItem>
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        {user ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar>{user?.username?.charAt(0).toUpperCase()}</Avatar>
            <Typography>{user.username}</Typography>
          </Box>
        ) : (
          <Button
            fullWidth
            color="primary"
            component={Link}
            to="/login"
            variant="outlined"
            sx={{
              borderColor: "primary.main",
              "&:hover": { borderColor: "primary.dark" }
            }}
          >
            Войти
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "white",
        color: "primary.main",
        boxShadow: "none",
        maxWidth: 1200,
        margin: "0 auto",
        pt: 4
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
          GREENSHOP
        </Typography>

        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          {navItems.map((item) => (
            <Button
              key={item.text}
              color="inherit"
              component={Link}
              to={item.path}
            >
              {item.text}
            </Button>
          ))}
        </Box>

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 2
          }}
        >
          <IconButton
            color="inherit"
            component={Link}
            to="/cart"
            sx={{ mr: 1 }}
          >
            <Badge badgeContent={cartItemsCount} color="primary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {user ? (
            <>
              <Button
                color="inherit"
                onClick={handleMenuOpen}
                startIcon={
                  <Avatar sx={{ width: 24, height: 24 }}>
                    {user?.username?.charAt(0).toUpperCase()}
                  </Avatar>
                }
              >
                {user.username}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleLogout}>Выйти</MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              variant="outlined"
              sx={{
                borderColor: "primary.main",
                "&:hover": { borderColor: "primary.dark" }
              }}
            >
              Войти
            </Button>
          )}
        </Box>

        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <Drawer
        anchor="right"
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 }
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;
