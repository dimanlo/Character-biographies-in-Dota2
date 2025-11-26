# Heroes Service

Сервис управления персонажами.

## API

### Получение списка персонажей
- **GET** `/api/heroes`
- **Описание**: Получение списка всех персонажей с пагинацией
- **Параметры запроса**:
  - `page` (опционально) - Номер страницы (по умолчанию 1)
  - `limit` (опционально) - Количество элементов на странице (по умолчанию 20)
- **Ответ**:
```json
[
  {
    "id": 1,
    "name": "Antimage",
    "localized_name": "Anti-Mage",
    "primary_attr": "agi",
    "attack_type": "Melee",
    "roles": ["Carry", "Escape", "Nuker"],
    "img": "/apps/dota2/images/dota_react/heroes/antimage.png"
  }
]
```

### Получение персонажа по ID
- **GET** `/api/heroes/:id`
- **Описание**: Получение подробной информации о персонаже по его ID
- **Ответ**:
```json
{
  "id": 1,
  "name": "Antimage",
  "localized_name": "Anti-Mage",
  "primary_attr": "agi",
  "attack_type": "Melee",
  "roles": ["Carry", "Escape", "Nuker"],
  "img": "/apps/dota2/images/dota_react/heroes/antimage.png",
  "icon": "/apps/dota2/images/dota_react/heroes/icons/antimage.png",
  "base_health": 200,
  "base_mana": 75,
  "base_armor": -1,
  "base_mr": 25,
  "base_attack_min": 29,
  "base_attack_max": 33,
  "base_str": 23,
  "base_agi": 24,
  "base_int": 12,
  "str_gain": 1.6,
  "agi_gain": 1.9,
  "int_gain": 1.8,
  "attack_range": 150,
  "projectile_speed": 0,
  "attack_rate": 1.4,
  "move_speed": 310,
  "turn_rate": 0.5,
  "cm_enabled": true,
  "legs": 2
}
```

### Создание нового персонажа (только для администраторов)
- **POST** `/api/heroes`
- **Описание**: Создание нового персонажа
- **Заголовки**: `Authorization: Bearer <access_token>`
- **Тело запроса**:
```json
{
  "name": "NewHero",
  "localized_name": "Новый Герой",
  "primary_attr": "str",
  "attack_type": "Melee",
  "roles": ["Support"],
  "img": "/apps/dota2/images/dota_react/heroes/newhero.png"
}
```
- **Ответ**:
```json
{
  "id": 125,
  "name": "NewHero",
  "localized_name": "Новый Герой",
  "primary_attr": "str",
  "attack_type": "Melee",
  "roles": ["Support"],
  "img": "/apps/dota2/images/dota_react/heroes/newhero.png"
}
```

### Обновление персонажа (только для администраторов)
- **PUT** `/api/heroes/:id`
- **Описание**: Обновление информации о персонаже
- **Заголовки**: `Authorization: Bearer <access_token>`
- **Тело запроса**:
```json
{
  "localized_name": "Обновленный Герой",
  "roles": ["Support", "Nuker"]
}
```
- **Ответ**:
```json
{
  "id": 125,
  "name": "NewHero",
  "localized_name": "Обновленный Герой",
  "primary_attr": "str",
  "attack_type": "Melee",
  "roles": ["Support", "Nuker"],
  "img": "/apps/dota2/images/dota_react/heroes/newhero.png"
}
```

### Удаление персонажа (только для администраторов)
- **DELETE** `/api/heroes/:id`
- **Описание**: Удаление персонажа
- **Заголовки**: `Authorization: Bearer <access_token>`
- **Ответ**: Статус 204 No Content

## Запуск

### Локальная разработка
```bash
npm install
cp env.example .env
npm run dev
```

### Docker
```bash
docker build -t heroes-service .
docker run -p 4002:4002 heroes-service
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
