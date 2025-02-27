![ITMO](https://raw.githubusercontent.com/aimclub/open-source-ops/43bb283758b43d75ec1df0a6bb4ae3eb20066323/badges/ITMO_badge_rus.svg)
[![license](https://badgen.net/static/license/MIT/blue)](https://badgen.net/static/license/MIT/blue)
[![python](https://badgen.net/badge/python/3.9|3.10|3.11/blue?icon=python)](https://www.python.org/)
[![react](https://badgen.net/static/react/18.2/orange)](https://github.com/LISA-ITMO/universal-eduplatform/issues)

[<img src="./docs/img/logo.jpg" width="450" />](docs/img/logo.jpg)
# Quiz-platform for education | Платформа викторин для образования

This repository contains a tool — an interactive platform for analyzing personal competencies in the areas of analytical thinking and creativity. The platform is designed for educational environments and provides the ability to create tests as well as take tests from other users to assess skills and knowledge.

The key advantage is the integration of an AI assistant that is trained on a limited sample of data from teachers and students, allowing it to be adapted first for one, and then for several study groups.

Development is being carried out on the [DEV](https://github.com/LISA-ITMO/universal-eduplatform/tree/DEV) branch.

- Read the user manual before you get started - [User manual](docs/user_manual.md)

- Available at the link - [Quiz-platform for education]()

> Please help us improve this project, share your feedback with [opening issue](https://github.com/LISA-ITMO/universal-eduplatform/issues)


## Demo

<p align="center">
  <a href="https://www.youtube.com/watch?v=example">
    <img src="docs/Demo.gif" alt="Demo video" style="width:100%;">
  </a>
</p>

### How to use it in practice:

<p align="center">
  <a href="https://www.youtube.com/watch?v=example">
    <img src="docs/Conducting-cross-testing.gif" alt="Demo video of cross-testing" style="width:100%;">
  </a>
</p>

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


## Publications About Quiz-platform for education
- [Индивидуальный цифровой имидж человека как фактор капитализации личности](https://research-journal.org/archive/7-145-2024-july/10.60797/IRJ.2024.145.91)
- [Как AI-ассистент и кросс-тестирование меняют подход к обучению](https://vc.ru/ai/1824697-kak-ai-assistent-i-kross-testirovanie-menyayut-podhod-k-obucheniyu)
- [Сервис для интеллектуального кросс-тестирования учащихся](https://studnauka.itmo.ru/assets/files/sborniki/sbornik_almanac_2024_tom_2.pdf)
- [Алгоритм оценивания индивидуальных способностей в сервисе для интеллектуального кросс-тестирования](https://kmu.itmo.ru/digests/article/13777)
- [Разработка мобильного приложения для сервиса по составлению и прохождению тестов учащимися](https://kmu.itmo.ru/digests/article/12401)
- [Разработка интеллектуальной системы с возможностью генерации и персонализации под пользователя вопросов на основе учебных материалов](https://kmu.itmo.ru/digests/article/13672)
