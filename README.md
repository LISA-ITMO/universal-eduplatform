![](docs/img/logo.jpg)

# Cross-testing platform | Образовательная платформа для проведения кросс-тестирования

## Краткое описание

Платформа предназначена для создания, проведения и аналитической оценки тестов в образовательной среде. Пользователи могут создавать тесты, проходить их, а аналитические модули вычисляют показатели компетенций (аналитичность, лидерство и др.). Система включает веб‑интерфейсы (студент/админ), Telegram‑бота, сервер на NestJS с GraphQL и Prisma, а также интеграцию с AI‑провайдерами (Qwen, Ollama).

## Описание платформы

- Клиенты: `frontend/web` (студенты), `frontend/admin` (администраторы), `tgbot` (Telegram‑бот).
- Сервер: `server` (NestJS + GraphQL). Важные модули: Auth, Tests, Bot, Analytics, Prisma.
- Хранилище: PostgreSQL (Prisma). Redis используется для очередей/кеша.
- AI‑ассистент: BotModule вызывает внешние модели для генерации тестов и анализа; результаты сохраняются в `aiReport`.

## Документация

Документация и вспомогательные материалы находятся в каталоге `docs/`:

- [`docs/createUser.md`](./docs/createUser.md) — Краткая инструкция по созданию нового пользователя через ТГ бота

## Установка и быстрая локальная настройка

Минимальные шаги для запуска в режиме разработки (Windows / PowerShell):

1. Клонируйте репозиторий и перейдите в рабочую ветку:

```powershell
git clone <repo_url>
cd Quiz-platform
git checkout develop
```

2. Установите зависимости для серверной и фронтенд частей:

```powershell
# пример: установить в папках frontend и server
cd frontend
pnpm install
cd ..\server
pnpm install
```

3. Настройте переменные окружения для сервера (`server/.env`):

- DATABASE_URL — строка подключения к PostgreSQL
- AI_MODEL_PROVIDER, AI_MODEL_API_URL, AI_MODEL_API_KEY — опционально для интеграции с AI
- AI_BOT_USERNAME, AI_BOT_PASSWORD — учётные данные для бота (role=student)

4. Выполните миграции и сгенерируйте Prisma клиент:

```powershell
cd server
npx prisma migrate dev --name init
npx prisma generate
```

5. Запустите сервер и фронтенд в режиме разработки:

```powershell
# Сервер (NestJS)
pnpm dev # или npm run start:dev

# В другом терминале: фронтенд admin/web
cd frontend/packages/admin
pnpm dev
```

6. Дополнительно: в проекте есть `docker-compose.yml` для развёртывания — настройте .env и используйте Docker Compose при необходимости.

## Контакты

_В процессе заполнения_

## Научные руководители

- [Грудинин Владимир Алексеевич](https://itmo.ru/ru/viewperson/434/grudinin_vladimir_alekseevich.htm)
- [Горелик Самуил Лейбович](https://edu.itmo.ru/ru/lecturers_and_professors/175676)

## Научные статьи

- [Алгоритм оценивания индивидуальных способностей в сервисе для интеллектуального кросс-тестирования](https://kmu.itmo.ru/digests/article/13777)
- [Разработка мобильного приложения для сервиса по составлению и прохождению тестов учащимися](https://kmu.itmo.ru/digests/article/12401)
- [Разработка интеллектуальной системы с возможностью генерации и персонализации под пользователя вопросов на основе учебных материалов](https://kmu.itmo.ru/digests/article/13672)
- [Управление образовательным процессом](https://science-education.ru/ru/article/view?id=13932)
- [Образование в цифровую эпоху](https://magellan.pro/2019/03/04/obrazovanie-v-cifrovuju-jepohu/)
  ...
