import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Divider,
  Box,
  Link,
  CircularProgress
} from '@mui/material';
import { Google as GoogleIcon, Facebook as FacebookIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, setError, clearError, selectAuthError, selectAuthStatus } from '../store/slices/authSlice';
import { getUserData } from '../services/api';
import { loadUserData } from '../store/slices/userSlice';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [localErrors, setLocalErrors] = useState({
    email: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const error = useSelector(selectAuthError);
  const status = useSelector(selectAuthStatus);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setLocalErrors({
      ...localErrors,
      [name]: ''
    });
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
      isValid = false;
    }

    setLocalErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    dispatch(clearError());

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка входа');
      }

      // Получаем полные данные пользователя после успешного входа
      // const userDataResponse = await getUserData(data.token);
      dispatch(loadUserData(data.token));

      dispatch(setCredentials({
        user: {
          _id: data.userId,
          username: data.username,
          email: data.email,
        },
        isAdmin: data.isAdmin,
        token: data.token
      }));

      navigate('/');
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
        GREENSHOP
      </Typography>

      <Typography variant="h5" component="h2" gutterBottom align="center">
        Вход
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={!!localErrors.email}
          helperText={localErrors.email}
          disabled={isLoading}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Пароль"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={!!localErrors.password}
          helperText={localErrors.password}
          disabled={isLoading}
        />

        {error && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          sx={{ mt: 3, mb: 2 }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Войти'}
        </Button>

        <Divider sx={{ my: 3 }}>Или войти через</Divider>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={() => {}}
            disabled={isLoading}
          >
            Google
          </Button>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<FacebookIcon />}
            onClick={() => {}}
            disabled={isLoading}
          >
            Facebook
          </Button>
        </Box>

        <Typography align="center">
          Нет аккаунта?{' '}
          <Link href="/signup" underline="hover">
            Зарегистрироваться
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default SignIn;