## Architecture

The structure of the service is based on a microservice architecture that allows users to interact through the client part from different devices:

![](docs/img/Architecture.jpg)

- Module `Authorisation` - allows you to register/authorise on the platform and receive an authorisation token, which allows you to interact with the platform;

- Module `Subjects` - stores information about subjects, topics on which it is possible to create and solve tests;

- Module `Tests` - stores information about tests, authors, test questions with answer options, information about correct answers, test moderation and their status;

- Module `Intelligent Analytics` - stores information about users, their achievements, which were analysed on the basis of compiled and passed tests, and received awards. This information is used to analyse user behaviour, assess their knowledge and skills.
