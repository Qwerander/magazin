import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Divider,
  Box,
  Link
} from '@mui/material';
import { Google as GoogleIcon, Facebook as FacebookIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, setCredentials, setError } from '../store/slices/authSlice';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [localErrors, setLocalErrors] = useState({
    email: '',
    password: ''
  });

  const error = useSelector((state) => state.auth.error);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    dispatch(clearError());
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

    try {
      const response = await fetch('http://localhost:5000/api/auth/signin', {
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

      dispatch(setCredentials({
        user: { username: data.username, email: data.email },
        token: data.token
      }));

      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      navigate('/');
    } catch (error) {
      dispatch(setError(error.message));
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
        >
          Войти
        </Button>

        <Divider sx={{ my: 3 }}>Или войти через</Divider>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={() => {}}
          >
            Google
          </Button>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<FacebookIcon />}
            onClick={() => {}}
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