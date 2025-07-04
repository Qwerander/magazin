# Инструкция по запуску и использованию приложения

## Запуск приложения

Для запуска приложения выполните следующую команду:

```bash
docker-compose up --build
```

### Авторизация
В системе по умолчанию существует администратор с учетными данными:

- Email: admin@admin.com

- Password: password

### Функционал

Для администратора:

- Доступна админ-панель для управления
- Добавление/изменение/удаление товара
- Просмотр всех заказов
- Просмотр всех пользователей

Для зарегистрированных пользователей:

- Доступна страница заказов
- Возможность оформления заказов
- Возможность отправки отзывов

Для новых пользователей:

- Доступна форма регистрации для создания нового аккаунта

### Важно
Оформление заказов и отправка отзывов доступны только авторизованным пользователям