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

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Имя пользователя обязательно';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка регистрации');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      navigate('/');
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      setErrors({ submit: error.message });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
        GREENSHOP
      </Typography>

      <Typography variant="h5" component="h2" gutterBottom align="center">
        Создать аккаунт
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Имя пользователя"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={!!errors.username}
          helperText={errors.username}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Пароль"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Подтвердите пароль"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />

        {errors.submit && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {errors.submit}
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
          Создать аккаунт
        </Button>

        <Divider sx={{ my: 3 }}>Или зарегистрироваться через</Divider>

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
          Уже есть аккаунт?{' '}
          <Link href="/login" underline="hover">
            Войти
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default SignUp;