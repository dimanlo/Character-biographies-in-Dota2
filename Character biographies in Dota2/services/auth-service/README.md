# Auth Service

Сервис аутентификации.

## API

### Регистрация пользователя
- **POST** `/api/auth/register`
- **Описание**: Регистрация нового пользователя
- **Тело запроса**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Имя пользователя"
}
```
- **Ответ**:
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "Имя пользователя"
}
```

### Вход в систему
- **POST** `/api/auth/login`
- **Описание**: Аутентификация пользователя и выдача токенов
- **Тело запроса**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Ответ**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Имя пользователя"
  }
}
```

### Получение информации о текущем пользователе
- **GET** `/api/auth/me`
- **Описание**: Получение информации о текущем авторизованном пользователе
- **Заголовки**: `Authorization: Bearer <access_token>`
- **Ответ**:
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "Имя пользователя"
}
```

## Запуск

### Локальная разработка
```bash
npm install
cp env.example .env
npm run dev
```

### Docker
```bash
docker build -t auth-service .
docker run -p 4001:4001 auth-service
```

## Переменные окружения

- `NODE_ENV` - Режим работы (development/production)
- `DB_HOST` - Хост базы данных
- `DB_PORT` - Порт базы данных
- `DB_NAME` - Имя базы данных
- `DB_USER` - Пользователь базы данных
- `DB_PASSWORD` - Пароль базы данных
- `JWT_SECRET` - Секретный ключ для JWT
- `PORT` - Порт приложения
