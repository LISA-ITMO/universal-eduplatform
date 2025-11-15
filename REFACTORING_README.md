# Рефакторинг Quiz Platform - Инструкции по миграции

## Обзор изменений

Проект был рефакторен с микросервисной архитектуры (Django) на монолитную архитектуру (NestJS + Prisma + GraphQL).

### Новая структура:

```
├── server/              # NestJS Backend
│   ├── src/
│   │   ├── modules/      # Модули: auth, users, subjects, tests, analytics, admin, notifications, bot
│   │   ├── prisma/       # Prisma service
│   │   ├── common/       # Guards, decorators, interceptors
│   │   └── graphql/      # GraphQL schema (автогенерация)
│   └── prisma/
│       └── schema.prisma  # Prisma schema (все модели из Django)
│
└── frontend/             # Монорепо для фронтенда
    └── packages/
        ├── web/          # Пользовательский клиент
        ├── admin/        # Админ-панель
        └── ui/           # Shared UI библиотека (MUI)
```

## Шаги миграции

### 1. Установка зависимостей

#### Backend:
```bash
cd server
npm install
```

#### Frontend:
```bash
cd frontend
pnpm install  # или npm install
```

### 2. Настройка базы данных

1. Создайте PostgreSQL базу данных:
```bash
createdb quizplatform
```

2. Скопируйте `.env.example` в `.env`:
```bash
cd server
cp .env.example .env
```

3. Обновите `DATABASE_URL` в `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/quizplatform"
```

4. Запустите миграции Prisma:
```bash
cd server
npx prisma migrate dev --name init
```

### 3. Миграция данных из Django

Данные нужно мигрировать из существующих SQLite баз данных в PostgreSQL. Используйте миграционные скрипты или вручную:

1. Экспортируйте данные из Django моделей
2. Импортируйте в PostgreSQL через Prisma

### 4. Запуск сервера

#### Development:
```bash
cd server
npm run start:dev
```

Сервер будет доступен на `http://localhost:3000/graphql`

#### Production (Docker):
```bash
cd server
docker-compose up -d
```

### 5. Запуск фронтенда

#### Development:
```bash
cd frontend

# Пользовательский клиент
pnpm dev:web

# Админ-панель
pnpm dev:admin
```

## Основные изменения

### Backend:
- ✅ Микросервисы (Django) → Монолит (NestJS)
- ✅ REST API → GraphQL API
- ✅ SQLite → PostgreSQL
- ✅ Django ORM → Prisma ORM
- ✅ JWT авторизация с refresh tokens
- ✅ Поддержка 2FA (TOTP)
- ✅ Ролевая модель (student, teacher, admin)

### Frontend:
- ✅ Монорепо структура (workspaces)
- ✅ Shared UI библиотека на базе MUI
- ✅ Apollo Client для GraphQL
- ✅ Разделение на web и admin клиенты

## Модули и их функции

### Auth Module
- Регистрация/логин
- JWT access/refresh tokens
- 2FA (TOTP)
- Email verification (готово к реализации)

### Users Module
- CRUD пользователей
- Профиль пользователя
- Управление ролями

### Subjects Module
- Управление предметами
- Темы
- Курсы
- Связи студент-курс-предмет

### Tests Module
- Создание тестов
- Вопросы и ответы
- Результаты тестов
- Решения (solutions)

### Analytics Module
- Аналитика по студентам
- Аналитика по тестам/темам/курсам
- Leadership и Analyticity метрики

### Admin Module
- Управление пользователями
- Управление тестами
- Audit logs

### Notifications Module
- Отправка email/SMS (готово к реализации)
- OTP коды

### Bot Module
- Сервисные ключи
- Фоновые задачи (готово к реализации)

## GraphQL API

Все эндпоинты доступны через GraphQL на `/graphql`.

Примеры запросов:

```graphql
# Логин
mutation {
  login(input: { email: "user@example.com", password: "password" }) {
    accessToken
    user {
      id
      username
      email
      role
    }
  }
}

# Получить текущего пользователя
query {
  me {
    id
    username
    email
    role
  }
}

# Получить все предметы
query {
  subjects {
    id
    nameSubject
    themes {
      id
      nameTheme
    }
  }
}
```

## Безопасность

- JWT tokens с коротким временем жизни (15 мин)
- Refresh tokens в httpOnly cookies
- Bcrypt для хеширования паролей
- Helmet для безопасности заголовков
- CORS настроен
- Rate limiting (готово к реализации через Redis)
- GraphQL depth/complexity limits (готово к настройке)

## Следующие шаги

1. ✅ Базовая структура создана
2. ⏳ Миграция данных из Django
3. ⏳ Реализация email/SMS отправки
4. ⏳ Настройка Redis для rate limiting
5. ⏳ Реализация бот-модуля
6. ⏳ Миграция существующего фронтенда
7. ⏳ Тестирование
8. ⏳ CI/CD настройка

## Полезные команды

```bash
# Prisma Studio (GUI для БД)
cd server
npm run prisma:studio

# Генерация Prisma Client
npm run prisma:generate

# Создание миграции
npm run prisma:migrate

# Запуск сервера
npm run start:dev

# Сборка для production
npm run build
npm run start:prod
```

## Примечания

- Все миграции из Django модулей (users, subjects, tests, analytics) сохранены в структуре Prisma schema
- Данные из SQLite баз нужно мигрировать в PostgreSQL вручную или через скрипты
- Старые Django сервисы можно оставить для постепенной миграции
- GraphQL схема генерируется автоматически в `src/graphql/schema.gql`




