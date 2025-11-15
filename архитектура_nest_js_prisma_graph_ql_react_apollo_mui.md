# Архитектура системы

**Стек:**
- Backend: **NestJS** + **Prisma** + **GraphQL (Apollo)**
- Database: **PostgreSQL**
- Frontend (оба клиента): **React** + **Apollo Client** + **MUI**
- Монорепозиторий/рабочие пространства: `pnpm` / `yarn` workspaces (опционально)
- Авторизация: **JWT** (access + refresh) с заделом под 2FA (email/SMS OTP)
- Бот: отдельный модуль/сервис, взаимодействует с сервером по API/GraphQL и имеет ограниченные права

---

## Цели дизайна
1. Поддерживать 2 клиента (User и Admin) как единый кодовый набор с разными точками входа (поддомены/разные билды).
2. Повторное использование компонентов UI (shared component library на базе MUI).
3. Безопасная JWT-авторизация с поддержкой 2FA и refresh tokens.
4. Возможность добавить бот-модуль в будущем как сервис/worker.
5. Готовность к масштабированию и развёртыванию (Docker, CI/CD).

---

# 1. Общая схема компонентов

- **Clients**
  - `web` (пользовательский фронтенд) — `app.example.com`
  - `admin` (админ-панель) — `admin.example.com` (или отдельный билд/домен)
  - Оба используют один GraphQL API (`api.example.com/graphql`)

- **Server**
  - NestJS GraphQL (Apollo) — единый источник бизнес-логики
  - Prisma — ORM для PostgreSQL
  - Redis — кэш, хранилище для черного списка JWT / rate-limits / очередей
  - Postgres — основная БД
  - Optional: Message broker (RabbitMQ/Redis Streams) — для фоновой обработки задач бота

- **Bot**
  - Отдельный worker/service, который аутентифицируется через сервисный ключ (JWT/Client Credentials) и вызывает API сервера. Не имеет UI.

---

# 2. Backend: NestJS — модули и структура

```
server/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── common/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── filters/
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── admin/
│   │   ├── bot/
│   │   ├── notifications/
│   │   └── analytics/
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   └── graphql/
│       └── schema.gql (generated)
├── prisma/
│   └── schema.prisma
├── dockerfile
└── docker-compose.yml
```

**Описание модулей:**
- `auth` — регистрация, логин, JWT access/refresh, email verification, 2FA flows, guards (RolesGuard, 2fa guard).
- `users` — CRUD пользователей, профиль, настройки, аудит.
- `admin` — административные резолверы/сервисы (можно ограничить доступ только для ролей `admin`).
- `bot` — endpoint/механизмы для выдачи сервисных ключей/ограничений доступа бота, фоновые задачи.
- `notifications` — отправка email/SMS (адаптеры: SMTP/SendGrid, Twilio и т.д.).
- `analytics` — сбор событий, логирование, audit log.

---

# 3. Prisma — рекомендованная модель данных (фрагмент)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            Int       @id @default(autoincrement())
  email         String    @unique
  phone         String?   @unique
  passwordHash  String
  name          String?
  roles         Role[]    @relation("UserRoles")
  isEmailVerified Boolean @default(false)
  twoFactorEnabled Boolean @default(false)
  twoFactorSecret  String? // store hashed/encoded secret or OTP seed
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  refreshTokens RefreshToken[]
  auditLogs     AuditLog[]
}

model Role {
  id   Int    @id @default(autoincrement())
  name String @unique
  users User[] @relation("UserRoles")
}

model RefreshToken {
  id        Int      @id @default(autoincrement())
  tokenHash String   // hashed token
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
  expiresAt DateTime
  createdAt DateTime @default(now())
}

model AuditLog {
  id        Int      @id @default(autoincrement())
  userId    Int?
  user      User?    @relation(fields: [userId], references: [id])
  action    String
  meta      Json?
  createdAt DateTime @default(now())
}

model ServiceKey {
  id        Int      @id @default(autoincrement())
  name      String
  keyHash   String
  roles     Json?    // allowed scopes
  createdAt DateTime @default(now())
}
```

**Пояснения:**
- `RefreshToken` хранится в хешированном виде, используется для верификации refresh flow.
- `ServiceKey` — для бот/сервисной аутентификации (или использовать OAuth2 client credentials).
- `twoFactorSecret` может храниться в зашифрованном виде; OTP проверяется сервером при логине.

---

# 4. GraphQL — схема и разделение прав

- Используем `@nestjs/graphql` с Apollo Server.
- Структурируем схему по доменам: `User`, `Auth`, `Admin`, `Analytics`.
- Используем `guards` и `directives` для авторизации (например `@Roles('ADMIN')` или кастомный `@Require2FA`).

**Примеры типов/резолверов:**
```graphql
type Query {
  me: User
  users(pagination: PaginationInput): UserConnection @roles(requires: "ADMIN")
}

type Mutation {
  login(email: String!, password: String!): AuthPayload
  verifyEmail(token: String!): Boolean
  enable2FA(code: String!): Boolean @auth
}
```

**Защита:**
- Depth limit, complexity limit, throttling.
- Rate-limiting на мутациях (например: login, signup) — Redis.

---

# 5. Auth flow (JWT + Refresh + 2FA)

**Token model:**
- `accessToken` — короткоживущий JWT (например, 15 мин), содержит `sub`, `roles`, `2fa_passed` флаг.
- `refreshToken` — долгоживущий (например, 7–30 дней), хранится в БД в виде хэша.

**Хранение на клиенте:**
- `accessToken` в памяти (Apollo link context) или в short-lived httpOnly cookie.
- `refreshToken` — **httpOnly secure cookie** или хранить только хэш в БД и использовать rotating refresh tokens. Рекомендую httpOnly cookie + csrf token.

**Login flow (simplified):**
1. Клиент отправляет `login(email,password)`.
2. Сервер проверяет, возвращает `accessToken` и устанавливает `refreshToken` в httpOnly cookie. Если у пользователя включен 2FA — возвращает статус `2FA_REQUIRED`.
3. Если 2FA активна — клиент направляет `verify2FA(code)`; после успешной проверки сервер помечает в access token `2fa_passed=true`.
4. При истечении `accessToken` клиент делает `refresh` (использует cookie с refresh token) и получает новый access.

**2FA:**
- Поддержка OTP (TOTP) и одноразовых кодов по email/SMS.
- Для email/SMS: генерируем одноразовый код с short TTL, храним его в Redis или БД (хэш) и проверяем при подтверждении.
- Для TOTP (Authenticator apps): генерируем секрет, показываем QR при включении, хранится зашифрованным.

---

# 6. Frontend — структура и подход

Рекомендую монорепозиторий с тремя пакетами:
```
frontend/
├── packages/
│   ├── web/        # пользовательский клиент (Next.js или CRA)
│   ├── admin/      # админ-панель (React) - отдельный билд
│   └── ui/         # shared component library (MUI wrappers, общие hooks, auth helper)
└── package.json
```

**Shared UI (`ui/`)**
- Компоненты: `Button`, `Form`, `Modal`, `Table`, `DataGrid` (обёртки MUI)
- Hooks: `useAuth`, `useApollo`, `usePagination`, `useFormValidation`
- Layouts: `MainLayout`, `AdminLayout`

**Auth на фронте:**
- Apollo link, который подставляет `Authorization: Bearer <token>` если token есть.
- Redirect на отдельные логин-панели в зависимости от поддомена/билда.

**Разные точки входа / authorization panels:**
- `web` и `admin` имеют отдельные маршруты для вхождения:
  - `/auth/login` (user)
  - `/admin/login` (admin)
- При входе сервер возвращает role и `2FA_REQUIRED` состояние — фронт показывает соответствующий UI.

**Admin panel options:**
- Быстрая опция: **React-Admin** (основан на MUI) — предоставляет CRUD UI, списки, фильтры и поддерживает GraphQL adapter.
- Кастомная опция: собственный React + MUI, используя shared components.

---

# 7. Бот — как отдельный модуль

**Требования:**
- Не имеет UI.
- Аутентификация: сервисный JWT (service key) или OAuth2 client credentials.
- Доступ: только к тем API/резолверам, которые нужны (scoped roles).
- Архитектура: можно реализовать как `worker` (Docker service) или `serverless function`.
- Для фоновых задач (ETL/анализ) — использовать очереди (Redis/Bull / RabbitMQ).

**Примеры ролей/ограничений:**
- `bot_read_only` — доступ к данным, но не к мутациям.
- `bot_analytics` — доступ к агрегированным эндпоинтам.

---

# 8. DevOps / Deploy / Monitoring

- Контейнеризация: Docker Compose для локалки, Kubernetes для production.
- Секреты: Vault / cloud secrets manager.
- CI: GitHub Actions / GitLab CI — сборка backend, тесты, миграции Prisma, build фронтендов, деплой.
- Миграции: Prisma Migrate.
- Логи / метрики: Prometheus + Grafana, Sentry для ошибок.
- Health checks / readiness probes.

---

# 9. Безопасность и best practices

- Валидация входных данных (`class-validator` + DTO в NestJS).
- Использовать Helmet, CORS с whitelist (разные origin для admin/web).
- Rate limiting по IP и по endpoint (login, signup).
- Использовать httpOnly/secure cookies для refresh tokens (предотвращение XSS утечек).
- CSP, HSTS, secure cookies.
- Хеширование паролей (bcrypt/argon2).
- Хеширование refresh tokens и сервисных ключей в БД.
- Защита GraphQL: depth limit, query complexity, лимиты по времени, кеширование.
- Ролевая модель: минимальные привилегии.

---

# 10. План миграции/рефакторинга (пошагово)

1. Создать монорепо и вынести `ui` библиотеку (совместимые компоненты MUI).
2. Развернуть базовый NestJS skeleton + Prisma + GraphQL.
3. Сделать модель User + Auth (JWT + refresh) + basic resolvers.
4. Подключить web client к новому API (авторизация, профиль, базовые операции).
5. Сделать admin login и перенести критичные админ-функции в админ-панель.
6. Добавить 2FA и email verification.
7. Вынести бот как сервис (service key flow) и реализовать простой job.
8. Добавить наблюдение, логирование и безопасность (rate limit, CSP).

---

# 11. Checklist / артефакты, которые я могу подготовить дальше
- Boilerplate NestJS + GraphQL + Prisma (с примером auth module).
- Prisma schema + seed script.
- Shared UI lib (MUI) пример компонентов и Storybook.
- Пример интеграции React-Admin с GraphQL backend.
- CI/CD pipeline (GitHub Actions) конфигурация.

---

Если хочешь, могу сразу сгенерировать **boilerplate проекта (backend)** с реализацией auth (login, refresh, 2FA stub) и Prisma schema, либо **структуру монорепо для фронтенда** с `ui` библиотекой. Выбирай, с чего начнём.

