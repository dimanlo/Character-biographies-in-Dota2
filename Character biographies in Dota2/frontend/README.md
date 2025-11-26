# Frontend

React приложение для просмотра биографий персонажей Dota 2.

## Запуск

### Локальная разработка
```bash
npm install
npm start
```

### Сборка для продакшена
```bash
npm run build
```

### Docker
```bash
docker build -t dota2-frontend .
docker run -p 3000:3000 dota2-frontend
```

## Структура

- `src/api/` - API клиенты
- `src/pages/` - Страницы
- `src/store/` - Redux
- `src/components/` - Компоненты
- `src/App.js` - Главный компонент приложения
- `src/index.js` - Точка входа

## Основные страницы

- `/` - Главная страница со списком персонажей
- `/hero/:id` - Страница деталей персонажа
- `/favorites` - Избранные персонажи
- `/login` - Страница входа
- `/register` - Страница регистрации
- `/admin` - Админ-панель (только для администраторов)

## API клиенты

- `src/api/auth.js` - Функции для работы с аутентификацией
- `src/api/heroes.js` - Функции для работы с персонажами
- `src/api/lore.js` - Функции для работы со связями и избранным

## Хранилище (Redux)

- `src/store/slices/authSlice.js` - Слайс для управления состоянием аутентификации
