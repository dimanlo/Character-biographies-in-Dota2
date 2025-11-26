# Lore Service

Сервис связей и избранного.

## API

### Получение связей персонажа
- **GET** `/api/lore/hero/:id/relationships`
- **Описание**: Получение всех связей для конкретного персонажа
- **Ответ**:
```json
[
  {
    "id": 1,
    "hero_id": 1,
    "related_hero_id": 2,
    "relationship_type": "ally",
    "description": "Союзники в битве"
  }
]
```

### Создание связи между персонажами (только для администраторов)
- **POST** `/api/lore/relationships`
- **Описание**: Создание новой связи между персонажами
- **Заголовки**: `Authorization: Bearer <access_token>`
- **Тело запроса**:
```json
{
  "hero_id": 1,
  "related_hero_id": 2,
  "relationship_type": "ally",
  "description": "Союзники в битве"
}
```
- **Ответ**:
```json
{
  "id": 1,
  "hero_id": 1,
  "related_hero_id": 2,
  "relationship_type": "ally",
  "description": "Союзники в битве"
}
```

### Добавление персонажа в избранное
- **POST** `/api/lore/favorites`
- **Описание**: Добавление персонажа в избранное текущего пользователя
- **Заголовки**: `Authorization: Bearer <access_token>`
- **Тело запроса**:
```json
{
  "hero_id": 1
}
```
- **Ответ**:
```json
{
  "id": 1,
  "user_id": 1,
  "hero_id": 1
}
```

### Получение избранных персонажей пользователя
- **GET** `/api/lore/favorites`
- **Описание**: Получение списка всех избранных персонажей текущего пользователя
- **Заголовки**: `Authorization: Bearer <access_token>`
- **Ответ**:
```json
[
  {
    "id": 1,
    "user_id": 1,
    "hero_id": 1,
    "hero": {
      "id": 1,
      "name": "Antimage",
      "localized_name": "Anti-Mage",
      "img": "/apps/dota2/images/dota_react/heroes/antimage.png"
    }
  }
]
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
docker build -t lore-service .
docker run -p 4003:4003 lore-service
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
