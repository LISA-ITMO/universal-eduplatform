## Use case

![](docs/img/useCase.jpg)

### 1. Registration and authorisation
| Use case      | The initial registration in the system |
| ------------- | ------------- |
| Scope  | Web service for intelligent cross testing  |
| Prerequisite| Unregistered user  |
| Guarantees of success | User is on the registration welcome page  |
| Trigger  | User has gained temporary access to the system  |
| Description  | User wants to get test access to the system  |
| Extension  | 1. The system asks for a phone number/name <br> 2. User enters phone number/name <br> 3. The system checks the uniqueness of the entered data <br> 4. The system saves the user data 5. The system confirms the initial registration.|
| Main actor  | 3.1 The user receives a message that such user is already registered in the system <br> 3.2 The system offers to authorise/complete registration  |

| Use case      | Full registration in the system |
| ------------- | ------------- |
| Scope  | Web service for intelligent cross testing  |
| Prerequisite| User with initial registration in the system  |
| Guarantees of success | User is on the registration welcome page  |
| Trigger  | User has full access to the system  |
| Description  | User wants to get full access to the system  |
| Extension  | 1. The system asks for a phone number/name <br> 2. User enters phone number/name <br> 3. The system checks the uniqueness of the entered data <br> 4. The system prompts the user to fill in the registration form <br> 5. User fills in the registration form <br> 6. The system checks the uniqueness of the user login <br> 7. The system saves the entered user data <br> 8. The system confirms complete registration|
| Main actor  |  6.1 The user receives a message that a user with this login is already registered in the system <br> 6.2 The system offers to change the login  |

### 2. Authorisation
| Use case      | Authorisation in the system |
| ------------- | ------------- |
| Scope  | Web service for intelligent cross testing  |
| Prerequisite| Registered user  |
| Guarantees of success |  User is on the registration welcome page  |
| Trigger  | User has successfully logged in  |
| Description  | The user wants to log in  |
| Extension  |  1. The system asks for login and password <br> 2. The user enters the login and password <br> 3. The system checks the correctness of the entered data <br> 4. The system confirms login to the system |
| Main actor  |  3.1 The user receives a message that the login or password has been entered incorrectly <br> 3.2 The system offers to restore the password  |

### 3. Tests
| Use case      | Creating a test in the system |
| ------------- | ------------- |
| Scope  | Web service for intelligent cross testing  |
| Prerequisite| User with full registration  |
| Guarantees of success |  User is on the page of test creation  |
| Trigger  | Test created  |
| Description  | User wants to create a test  |
| Extension  |  1. The system asks to select a topic/subject <br> 2. The user selects a topic <br> 3. The system prompts the user to fill in the test settings <br> 4. User fills in the test settings <br> 5. The system prompts the user to fill in the test question and answers <br> 6. User adds a question to the test <br> 7. The system prompts the user to add answer choices to the test <br> 8. User adds answer choices answers to the question <br> 9. The system checks the number of answer choices <br> 10. The system prompts the user to tick the correct answer choice <br> 11. The user indicates the correct answer to the question <br> 12. The system prompts to fill in the "comment to the correct answer" field <br> 13. User adds a theoretical note about the correct answer <br> 14. The system prompts to cancel or save the question <br> 15. The system saves the question and answers. <br> 16. The system checks the number of saved questions in the quiz <br> The system prompts you to finish creating the quiz <br> 17.  The user completes the test creation |
| Main actor  |  4.1 The User sets a time limit <br> 4.2 The user sets a limit on the number of attempts <br> 9.1 User is notified that less than two answer choices have been added <br> 9.2 System returns to step 8 <br> 14.1 User cancels the question <br> 14.2 System returns to step 6 <br> 14.3 User saves the question <br> 14.4 System goes to step 15 <br> 16.1 User is notified that the number of questions is less than 3 <br> 16.2 System returns to step 5 |

| Use case      | Taking a test in the system |
| ------------- | ------------- |
| Scope  | Web service for intelligent cross testing  |
| Prerequisite| User with full registration  |
| Guarantees of success |  User is on the page of test passing  |
| Trigger  | User has received points for the test  |
| Description  | User wants to take the test  |
| Extension  |  1. The system asks the user to select a topic/subject <br> 2. The user selects a topic <br> 3. The system prompts the user to take a quiz <br> 4. User chooses to take the first test <br> 5. The system assigns the first test to the user <br> 6. The user answers the test questions <br> 7. The system checks the user's answers (If the user has not selected any answers - is it possible to move to the next question?). <br> 8. The system prompts the user to complete the test <br> 9. User completes the test <br> 10. The system displays the number of correct answers for the first test <br> 11. The system prompts the user to take the second test <br> 12. The user chooses to take the second test <br> 13. The system assigns the user the second test <br> 14. Repeat steps 6,7,8,9 <br> 15.  System displays the number of correct answers for the second test <br> 16. The system prompts you to view the results rating window. <br> 17. The user sees the results rating window. |
| Main actor  |  7.1 The user is notified to select at least one answer <br> 7.2 The system returns to step 6 |

