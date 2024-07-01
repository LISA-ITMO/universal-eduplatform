![](docs/img/logo.jpg)
# Quiz-platform for education | Платформа викторин для образования

This repository contains a tool that is an interactive platform designed to analyse personal competencies in analytical thinking and leadership. It is intended for use in an educational environment and provides users with the ability to create their own tests and take tests from other users to assess their skills and knowledge in a particular area.

- Read the user manual before you get started - [User manual](docs/user_manual.md)

- Available at the link - [Quiz-platform for education]()

> Please help us improve this project, share your feedback with [opening a pull request]([https://github.com/LabsWorkLISA/Quiz-platform/pulls](https://github.com/LISA-ITMO/universal-eduplatform/issues))


## Demo
*in the process of implementation

![]()

## Documentation
Details of the documentation can be found at the links below:

- [The architecture of the Quiz platform for education](docs/architecture.md) - the overall architecture and modules of the platform are described here

- [Use cases of the Quiz platform for education](docs/use_case.md) - customised use cases are described here

- [ER-diagrams](docs/er_diagram.md), [Sequence Diagram](docs/sequence_diagrams.md)  - this document will help you determine what data you will get out and how you can use it.

- [Algorithm of assessment of individual competences](docs/evaluation_algorithm.md)  - here you can familiarise yourself with the algorithm of assessment of individual abilities - competences, which is embedded in the Quiz platform.


## Installation

### 1. Select the DEV branch
```
git checkout DEV
```

### 2. Create environment files:
```
touch ./compose/.env.analytics ./compose/.env.subjects ./compose/.env.tests ./compose/.env.users
```

### 3. Fill all environment files according to the same template
```bash
# Setting environment variables for Django project
SECRET_KEY = '<Django key>'
DEBUG = False
ALLOWED_HOSTS = <valid hosts through ,>
CSRF_TRUSTED_ORIGINS = <valid hosts through ,>
# Variables for creating a Django superuser
DJANGO_SUPERUSER_USERNAME=<username Django>
DJANGO_SUPERUSER_EMAIL=<user mail Django>
DJANGO_SUPERUSER_PASSWORD=<Django's password>
```

### 4. Create database files
```bash
mkdir dbs
touch ./dbs/.analytics_db.sqlite3 ./dbs/.subjects_db.sqlite3 ./dbs/.tests_db.sqlite3 ./dbs/.users_db.sqlite3
```

### 5. Start the image build
```bash
docker compose -f compose/docker-compose.yml up
```

### 6. The project is available localhost:8888

### 7. Admin panels are available at localhost:8888/<module name>/admin/

## Contacts
This platform is being developed at ITMO University, LISA laboratory as part of the research work on "Methods and algorithms for intelligent services and applications".

The team working on the project is listed below (everyone can be contacted personally):

- [Ishutina Yelizaveta](https://t.me/ishutachkaa) - Project manager. If you have any questions, please write to ([liz16z2001@mail.ru](mailto:liz16z2001@mail.ru))

- [Kuznetsov Vyacheslav](https://t.me/viacheslav_kuznetcov)-  Team leader

- [Kalacheva Vera](https://t.me/verkalacheva) - Backend developer

- [Antsiferova Tatiana](https://t.me/antsiferovaTA) - Backend developer

- [Sobol Vladimir](https://t.me/vovasobol1) - Backend developer

- [Soloveva Polina](https://t.me/solcticeranger) - Data Scientist

- [Orudzhev Eldar](https://t.me/eldar_oru) - Mobile-developer

- [Stabrovskiy Vladimir](https://t.me/godnesty) - Mobile-developer

- [Timonenko Nikolay](https://t.me/NikTimo) - DevOps engineer

### Scientific supervisors:
- [Grudinin Vladimir](https://itmo.ru/ru/viewperson/434/grudinin_vladimir_alekseevich.htm)
- [Gorelik Samuel](https://edu.itmo.ru/ru/lecturers_and_professors/175676)


## The science component of the Quiz platform
- [Алгоритм оценивания индивидуальных способностей в сервисе для интеллектуального кросс-тестирования](https://kmu.itmo.ru/digests/article/13777)
- [Разработка мобильного приложения для сервиса по составлению и прохождению тестов учащимися](https://kmu.itmo.ru/digests/article/12401)
- [Разработка интеллектуальной системы с возможностью генерации и персонализации под пользователя вопросов на основе учебных материалов](https://kmu.itmo.ru/digests/article/13672)
- [Управление образовательным процессом](https://science-education.ru/ru/article/view?id=13932)
- [Образование в цифровую эпоху](https://magellan.pro/2019/03/04/obrazovanie-v-cifrovuju-jepohu/)
