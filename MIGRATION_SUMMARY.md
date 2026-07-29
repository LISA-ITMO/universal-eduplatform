# Сводка миграции клиента

## Выполнено

### ✅ Структура проекта
- Создана новая структура монорепо в `frontend/`
- `frontend/packages/ui` - shared UI библиотека с MUI компонентами
- `frontend/packages/web` - пользовательский клиент
- `frontend/packages/admin` - админ-панель (заготовка)

### ✅ GraphQL интеграция
- Созданы GraphQL queries и mutations в `frontend/packages/ui/src/graphql/`
- Настроен Apollo Client с авторизацией
- Создан хук `useAuth` для управления состоянием авторизации

### ✅ Перенесенные компоненты
- **Аутентификация**: Login, Register
- **Навигация**: MainPanel, NavPanel, UserPanel
- **Страницы**: Profile, Courses, Creation, Solution
- **Компоненты**: ProfileCard, SelectCourse, CreateForm, CreateTest, SolutionTest, ResultTest

### ✅ Обновления сервера
- Добавлен резолвер `testsBySubjectAndTheme` для получения тестов по subjectId и themeId
- Все существующие GraphQL резолверы работают

### ✅ Удалено
- Удалена директория `client/web-new` (функционал перенесен)

## Структура нового клиента

```
frontend/
├── packages/
│   ├── ui/                    # Shared библиотека
│   │   ├── src/
│   │   │   ├── components/    # Button, Form, Modal, Table
│   │   │   ├── hooks/         # useAuth, useApollo, usePagination
│   │   │   ├── layouts/       # MainLayout, AdminLayout
│   │   │   └── graphql/       # queries, mutations
│   │   └── package.json
│   │
│   ├── web/                   # Пользовательский клиент
│   │   ├── src/
│   │   │   ├── pages/         # Login, Profile, Courses, Creation, Solution
│   │   │   ├── components/    # MainPanel, NavPanel, ProfileCard, etc.
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   └── admin/                 # Админ-панель (заготовка)
│       └── package.json
│
└── package.json               # Workspace root
```

## Изменения в архитектуре

### До (REST API)
- Axios для HTTP запросов
- Cookies для хранения токенов
- Zustand для state management
- Chakra UI компоненты

### После (GraphQL)
- Apollo Client для GraphQL запросов
- localStorage для хранения токенов
- React hooks (useAuth) для state management
- MUI компоненты

## Настройка

### 1. Установка зависимостей
```bash
cd frontend
pnpm install  # или npm install
```

### 2. Настройка переменных окружения
Создайте `.env` в `frontend/packages/web/`:
```
VITE_GRAPHQL_URL=http://localhost:3000/graphql
```

### 3. Запуск
```bash
# Development
cd frontend
pnpm dev:web

# Build
pnpm build:web
```

## Следующие шаги

1. ⏳ Доработать компоненты CreateTest и SolutionTest (полная реализация форм)
2. ⏳ Добавить обработку ошибок и loading states
3. ⏳ Реализовать админ-панель в `frontend/packages/admin`
4. ⏳ Добавить тесты
5. ⏳ Настроить CI/CD

## Примечания

- Все компоненты адаптированы под GraphQL API
- Используется MUI вместо Chakra UI
- Авторизация через JWT tokens в localStorage
- Apollo Client настроен с автоматической подстановкой токена в headers