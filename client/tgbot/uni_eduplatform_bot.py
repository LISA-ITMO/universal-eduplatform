import telebot
from telebot import types
import sqlite3
import numpy as np
import config_eduplatform

TOKEN = config_eduplatform.bot_token
bot = telebot.TeleBot(TOKEN)


def connect_db():
    """
    Connects to the SQLite database.

        Args:
            None

        Returns:
            sqlite3.Connection: A connection object for interacting with the database.
    """
    return sqlite3.connect("test_bot.db")


@bot.message_handler(commands=["start"])
def start_message(message):
    """
    Sends a welcome message with registration and login buttons.

        Args:
            message: The incoming message object from the bot.

        Returns:
            None
    """
    chat_id = message.chat.id
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    register_button = types.KeyboardButton("Регистрация")
    login_button = types.KeyboardButton("Авторизация")
    markup.add(register_button, login_button)
    bot.send_message(
        chat_id,
        "Добро пожаловать! Используйте кнопки ниже для навигации.",
        reply_markup=markup,
    )


@bot.message_handler(func=lambda message: message.text == "Регистрация")
def register(message):
    """
    Registers a new user.

        Checks if the user is already registered, and if not, prompts for their phone number.

        Args:
            message: The message object from the bot. Contains chat ID and text.

        Returns:
            None. Sends messages to the user via the bot.
    """
    chat_id = message.chat.id
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE id = ?", (chat_id,))
    if cursor.fetchone():
        bot.send_message(chat_id, "Вы уже зарегистрированы!")
    else:
        msg = bot.send_message(chat_id, "Введите номер телефона:")
        bot.register_next_step_handler(msg, process_register_phone)


def process_register_phone(message):
    """
    Processes the password input during user registration.

        Args:
            message: The message object containing the user's password input.
            phone: The phone number associated with the current registration process.

        Returns:
            None. This function does not explicitly return a value; it continues
            the registration flow by prompting for the user's name.
    """
    chat_id = message.chat.id
    phone = message.text
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE phone = ?", (phone,))
    if cursor.fetchone():
        bot.send_message(chat_id, "Этот номер телефона уже зарегистрирован.")
        return
    msg = bot.send_message(chat_id, "Введите пароль:")
    bot.register_next_step_handler(msg, process_register_password, phone)


def process_register_password(message, phone):
    """
    Processes the first name entered during user registration.

        This function extracts the first name from a message, stores it with
        the provided phone number and password for subsequent steps, and prompts
        the user to enter their last name.

        Args:
            message: The incoming message object containing the user's input.
            phone: The phone number collected in a previous step.
            password: The password chosen by the user in a previous step.

        Returns:
            None: This function does not explicitly return a value but initiates
                  the next step in the registration process using a handler.
    """
    chat_id = message.chat.id
    password = message.text
    msg = bot.send_message(chat_id, "Введите ваше имя:")
    bot.register_next_step_handler(msg, process_register_first_name, phone, password)


def process_register_first_name(message, phone, password):
    """
    Processes the last name during user registration.

        This function takes the user's last name from the message text and stores it
        along with previously collected information (phone number, password, and first name)
        in a database.  It then proceeds to the next step in the registration process.

        Args:
            message: The incoming Telegram message object containing the user's last name.
            phone: The user's phone number collected in a previous step.
            password: The user's password collected in a previous step.
            first_name: The user's first name collected in a previous step.

        Returns:
            None: This function does not explicitly return a value, but it registers the next step handler.
    """
    chat_id = message.chat.id
    first_name = message.text
    msg = bot.send_message(chat_id, "Введите вашу фамилию:")
    bot.register_next_step_handler(
        msg, process_register_last_name, phone, password, first_name
    )


def process_register_last_name(message, phone, password, first_name):
    """
    Registers a new user with the provided information and sends a welcome message.

        Args:
            first_name: The first name of the user.
            last_name: The last name of the user.
            phone: The phone number of the user (used as login).
            password: The password for the user account.
            chat_id: The unique identifier for the chat.
            bot: The Telegram bot instance.

        Returns:
            None: This function does not return a value; it interacts with a database and sends a message via the Telegram bot.
    """
    chat_id = message.chat.id
    last_name = message.text
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO users (id, phone, password, first_name, last_name, score) VALUES (?, ?, ?, ?, ?, ?)",
        (chat_id, phone, password, first_name, last_name, 0),
    )
    conn.commit()
    conn.close()

    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    createtest_button = types.KeyboardButton("Создать тест")
    starttest_button = types.KeyboardButton("Пройти тест")
    viewrating_button = types.KeyboardButton("Посмотреть рейтинг")
    markup.add(createtest_button, starttest_button, viewrating_button)
    bot.send_message(
        chat_id, f"Регистрация завершена! Ваш логин: {phone}", reply_markup=markup
    )


@bot.message_handler(func=lambda message: message.text == "Авторизация")
def login(message):
    """
    Handles the user login process.

        This method checks if a user exists in the database based on their phone number,
        and initiates a password request if found.  It currently only handles the
        initial message check for 'Авторизация' and starts the phone number collection.

        Args:
            message: The incoming message object from the bot. Contains chat information
                and the message text.

        Returns:
            None
    """
    chat_id = message.chat.id
    msg = bot.send_message(chat_id, "Введите номер телефона:")
    bot.register_next_step_handler(msg, process_login_phone)


def process_login_phone(message):
    """
    Processes the password entered by the user during login.

        This function checks if the provided password matches the one associated with the given phone number in the database.
        If a match is found, it updates the user's ID and proceeds with further actions (implementation incomplete in source).
        Otherwise, it informs the user that the credentials are incorrect.

        Args:
            message: The message object containing the password entered by the user.
            phone: The phone number associated with the login attempt.

        Returns:
            None: This function does not explicitly return a value. It interacts directly with the Telegram bot and database.
    """
    chat_id = message.chat.id
    phone = message.text
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE phone = ?", (phone,))
    user = cursor.fetchone()
    if user:
        msg = bot.send_message(chat_id, "Введите пароль:")
        bot.register_next_step_handler(msg, process_login_password, phone)
    else:
        bot.send_message(
            chat_id,
            "Пользователь с таким номером телефона не найден. Пожалуйста, зарегистрируйтесь или введите номер телефона повторно.",
        )
        login(message)


def process_login_password(message, phone):
    """
    Processes the login password and authenticates the user.

        Args:
            message: The message object containing the chat ID and password input.

        Returns:
            None. Sends a success or failure message to the user via the bot.
    """
    chat_id = message.chat.id
    password = message.text
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE phone = ? AND password = ?", (phone, password)
    )
    user = cursor.fetchone()
    if user:
        # Пользователь успешно авторизован
        user_id = user[0]
        cursor.execute("UPDATE users SET id = ? WHERE phone = ?", (chat_id, phone))
        conn.commit()

        markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
        createtest_button = types.KeyboardButton("Создать тест")
        starttest_button = types.KeyboardButton("Пройти тест")
        viewrating_button = types.KeyboardButton("Посмотреть рейтинг")
        markup.add(createtest_button, starttest_button, viewrating_button)
        bot.send_message(
            chat_id, f"Авторизация успешна! Ваш логин: {phone}", reply_markup=markup
        )
    else:
        bot.send_message(chat_id, "Неправильный пароль, попробуйте снова.")
        login(message)


@bot.message_handler(func=lambda message: message.text == "Создать тест")
def createtest(message):
    """
    Handles the creation of a new test based on user input.

        This function initiates the test creation process when the user sends the message 'Создать тест'.
        It prompts the user for the topic, difficulty level, and questions for the test.

        Args:
            message: The incoming message object from the bot. Contains chat ID and text.

        Returns:
            None: This function does not explicitly return a value. It interacts with the bot to send messages
                  and register next step handlers.
    """
    chat_id = message.chat.id
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE id = ?", (chat_id,))
    user = cursor.fetchone()
    if user:
        msg = bot.send_message(chat_id, "Введите тему теста:")
        bot.register_next_step_handler(msg, process_create_topic)
    else:
        bot.send_message(
            chat_id,
            "Пожалуйста, авторизуйтесь с помощью кнопки 'Авторизация' или зарегистрируйтесь с помощью кнопки 'Регистрация'.",
        )


def process_create_topic(message):
    """
    Adds a new question to the current test for the user.

        Args:
            message: The message object containing chat information and text.

        Returns:
            None
    """
    chat_id = message.chat.id
    topic = message.text
    user_tests[chat_id] = {"topic": topic, "questions": []}
    msg = bot.send_message(
        chat_id, "Выберите уровень сложности (легкий, средний, сложный):"
    )
    bot.register_next_step_handler(msg, process_create_difficulty)


def process_create_difficulty(message):
    """
    Processes the answers provided by the user for a question.

        This function handles the input of answer options from the user,
        and initiates the process to collect the correct answer. It also
        handles the 'Готово' (Done) command to move on to defining the
        correct answer.

        Args:
            message: The message object containing user input and chat information.

        Returns:
            None
    """
    chat_id = message.chat.id
    difficulty = message.text.lower()
    if difficulty in ["легкий", "средний", "сложный"]:
        user_tests[chat_id]["difficulty"] = difficulty
        msg = bot.send_message(chat_id, "Введите вопрос:")
        bot.register_next_step_handler(msg, process_create_question)
    else:
        bot.send_message(chat_id, "Некорректный уровень сложности. Попробуйте снова.")
        process_create_topic(message)


def process_create_question(message):
    """
    Processes the correct answers for a question.

        This function takes the user's input of comma-separated correct answers,
        stores them in the current test data structure, and then prompts the user
        to add another question.

        Args:
            message: The message object containing the user's response.  It is expected to contain the chat ID and text.

        Returns:
            None: This function does not explicitly return a value; it handles side effects through bot interactions.
    """
    chat_id = message.chat.id
    question = message.text
    user_tests[chat_id]["questions"].append(
        {"question": question, "answers": [], "correct_answers": []}
    )
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    add_answer_button = types.KeyboardButton("Добавить ответ")
    done_button = types.KeyboardButton("Готово")
    markup.add(add_answer_button, done_button)
    bot.send_message(
        chat_id,
        "Введите вариант ответа или нажмите 'Готово' для завершения:",
        reply_markup=markup,
    )
    bot.register_next_step_handler(message, process_create_answers)


def process_create_answers(message):
    """
    Processes the user's response to adding more questions.

        If the user responds 'да', prompts them to enter a new question.
        Otherwise, saves the current test data to the database and removes it from memory.

        Args:
            message: The message object received from the user.

        Returns:
            None
    """
    chat_id = message.chat.id
    if message.text == "Готово":
        msg = bot.send_message(
            chat_id, "Введите правильный ответ (если несколько, через запятую):"
        )
        bot.register_next_step_handler(msg, process_create_correct_answer)
    else:
        answer = message.text
        user_tests[chat_id]["questions"][-1]["answers"].append(answer)
        msg = bot.send_message(
            chat_id, "Введите вариант ответа или нажмите 'Готово' для завершения:"
        )
        bot.register_next_step_handler(msg, process_create_answers)


def process_create_correct_answer(message):
    """
    Inserts a question and its answers into the database, marking correct answers.

        Args:
            test_id: The ID of the test to which the question belongs.
            question: A dictionary containing the question text and a list of possible answers,
                including a 'correct_answers' key listing the correct answer(s).

        Returns:
            None
    """
    chat_id = message.chat.id
    correct_answers = message.text.split(",")
    user_tests[chat_id]["questions"][-1]["correct_answers"] = correct_answers
    msg = bot.send_message(chat_id, "Добавить еще один вопрос? (да/нет)")
    bot.register_next_step_handler(msg, process_add_more_questions)


def process_add_more_questions(message):
    """
    Adds more questions to an existing test.

        Args:
            bot: The bot instance.
            message: The incoming message from the user.
            test_id: The ID of the test to add questions to.

        Returns:
            None
    """
    chat_id = message.chat.id
    if message.text.lower() == "да":
        msg = bot.send_message(chat_id, "Введите вопрос:")
        bot.register_next_step_handler(msg, process_create_question)
    else:
        test = user_tests.pop(chat_id)
        conn = connect_db()
        cursor = conn.cursor()

        cursor.execute(
            "INSERT INTO tests (topic_id, difficulty) VALUES (?, ?)",
            (test["topic"], test["difficulty"]),
        )
        test_id = cursor.lastrowid

        for question in test["questions"]:
            cursor.execute(
                "INSERT INTO questions (test_id, question) VALUES (?, ?)",
                (test_id, question["question"]),
            )
            question_id = cursor.lastrowid
            for answer in question["answers"]:
                is_correct = 1 if answer in question["correct_answers"] else 0
                cursor.execute(
                    "INSERT INTO answers (question_id, answer, is_correct) VALUES (?, ?, ?)",
                    (question_id, answer, is_correct),
                )

        conn.commit()
        conn.close()

        bot.send_message(chat_id, "Тест успешно создан!")


@bot.message_handler(func=lambda message: message.text == "Пройти тест")
def starttest(message):
    """
    Handles the selection of a test difficulty and starts the test if valid.

        This function takes the chat ID and test ID as input, retrieves the user-specified
        difficulty level from the message text, queries the database for a matching test,
        and initiates the test by sending the first question if found.  If no test is
        found with the given ID and difficulty, an error message is sent to the user.

        Args:
            message: The incoming message object containing chat information and text.
            test_id: The ID of the test selected by the user.

        Returns:
            None
    """
    chat_id = message.chat.id
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE id = ?", (chat_id,))
    user = cursor.fetchone()
    if user:
        msg = bot.send_message(chat_id, "Введите ID теста, который хотите пройти:")
        bot.register_next_step_handler(msg, process_test_id)
    else:
        bot.send_message(
            chat_id,
            "Пожалуйста, авторизуйтесь с помощью кнопки 'Авторизация' или зарегистрируйтесь с помощью кнопки 'Регистрация'.",
        )


def process_test_id(message):
    """
    Sends a single question to the user with corresponding answer options.

        Args:
            chat_id: The ID of the chat to send the question to.
            test_id: The ID of the test the question belongs to.
            question_index: The index of the question to retrieve from the database.

        Returns:
            None: This function does not explicitly return a value; it interacts with the bot and database directly.
    """
    chat_id = message.chat.id
    test_id = int(message.text)
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM tests WHERE id = ?", (test_id,))
    test = cursor.fetchone()
    if test:
        msg = bot.send_message(
            chat_id, "Выберите уровень сложности (легкий, средний, сложный):"
        )
        bot.register_next_step_handler(msg, process_test_difficulty, test_id)
    else:
        bot.send_message(chat_id, "Тест с таким ID не найден. Попробуйте снова.")
        msg = bot.send_message(chat_id, "Введите ID теста, который хотите пройти:")
        bot.register_next_step_handler(msg, process_test_id)


def process_test_difficulty(message, test_id):
    """
    Processes the user's answer to a test question.

        Args:
            message: The message object containing the user's response.
            test_id: The ID of the current test.
            question_index: The index of the current question within the test.

        Returns:
            None.  This function interacts with a database and bot to manage the test flow,
                   but does not directly return a value.
    """
    chat_id = message.chat.id
    difficulty = message.text.lower()
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM tests WHERE id = ? AND difficulty = ?", (test_id, difficulty)
    )
    test = cursor.fetchone()
    if test:
        send_question(chat_id, test_id, 0)
    else:
        bot.send_message(
            chat_id, "Тест с таким уровнем сложности не найден. Попробуйте снова."
        )
        msg = bot.send_message(
            chat_id, "Выберите уровень сложности (легкий, средний, сложный):"
        )
        bot.register_next_step_handler(msg, process_test_difficulty, test_id)


def send_question(chat_id, test_id, question_index):
    """
    Sends the next question in a test to the user.

        Args:
            chat_id: The ID of the chat to send the question to.
            test_id: The ID of the current test.
            question_index: The index of the question to send (starting from 1).

        Returns:
            None
    """
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM questions WHERE test_id = ? LIMIT 1 OFFSET ?",
        (test_id, question_index),
    )
    question = cursor.fetchone()
    if question:
        cursor.execute("SELECT * FROM answers WHERE question_id = ?", (question[0],))
        answers = cursor.fetchall()

        markup = types.InlineKeyboardMarkup(row_width=2)
        for answer in answers:
            markup.add(
                types.InlineKeyboardButton(
                    answer[2], callback_data=f"{question[0]}_{answer[0]}"
                )
            )
        markup.add(
            types.InlineKeyboardButton(
                "Нет правильного ответа", callback_data=f"{question[0]}_None"
            )
        )

        bot.send_message(chat_id, f"Вопрос: {question[2]}", reply_markup=markup)
        bot.register_next_step_handler_by_chat_id(
            chat_id, process_test_answer, test_id, question_index
        )
    else:
        bot.send_message(chat_id, "Все вопросы теста завершены.")
        conn.close()


def process_test_answer(message, test_id, question_index):
    """
    Calculates the mean of scores after removing outliers using IQR.

        Args:
            scores: A list of numerical scores.

        Returns:
            float: The mean of the filtered scores, or 0 if no scores remain after filtering.
    """
    chat_id = message.chat.id
    selected_answers = message.data.split("_")
    question_id = int(selected_answers[0])
    answer_ids = selected_answers[1:]

    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id FROM answers WHERE question_id = ? AND is_correct = 1",
        (question_id,),
    )
    correct_answers = cursor.fetchall()
    correct_answer_ids = [answer[0] for answer in correct_answers]

    if all(answer_id in correct_answer_ids for answer_id in answer_ids):
        bot.send_message(chat_id, "Правильно!")
        cursor.execute("UPDATE users SET score = score + 1 WHERE id = ?", (chat_id,))
    else:
        correct_answers_text = ", ".join(
            [
                cursor.execute(
                    "SELECT answer FROM answers WHERE id = ?", (answer_id,)
                ).fetchone()[0]
                for answer_id in correct_answer_ids
            ]
        )
        bot.send_message(
            chat_id, f"Неправильно! Правильные ответы: {correct_answers_text}"
        )

    cursor.execute(
        "INSERT INTO test_results (test_id, user_id, score) VALUES (?, ?, ?)",
        (
            test_id,
            chat_id,
            (
                1
                if all(answer_id in correct_answer_ids for answer_id in answer_ids)
                else 0
            ),
        ),
    )

    conn.commit()
    conn.close()

    send_question(chat_id, test_id, question_index + 1)


def calculate_mean_without_outliers(scores):
    """
    Calculates the mean of a list of scores after removing outliers.

        Outliers are defined as scores that fall outside a specified threshold
        from the median.

        Args:
            scores: The list of numerical scores to analyze.
            threshold:  The number of standard deviations from the median to use as a cutoff for outlier removal.

        Returns:
            float: The mean of the scores after outliers have been removed, or None if no valid scores remain after filtering.
    """
    q1 = np.percentile(scores, 25)
    q3 = np.percentile(scores, 75)
    iqr = q3 - q1
    lower_bound = q1 - 1.5 * iqr
    upper_bound = q3 + 1.5 * iqr
    filtered_scores = [score for score in scores if lower_bound <= score <= upper_bound]
    if len(filtered_scores) == 0:
        return 0
    return np.mean(filtered_scores)


def calculate_median(scores):
    """
    Calculates the median of a list of scores.

      Args:
        scores: A list of numerical scores.

      Returns:
        float: The median value of the input scores. Returns None if the input
               list is empty.
    """
    return np.median(scores)


def calculate_creativity(question_scores):
    """
    Calculates creativity scores for users.

        This method appends a given score to the list of scores associated with each user in a dictionary,
        then retrieves the first and last name of each user from a database using their ID.

        Args:
            users_scores_dict: A dictionary where keys are user IDs and values are lists of creativity scores.
            cursor: A database cursor object used to execute SQL queries.

        Returns:
            None: This method does not return any value. It performs operations with side effects
                  (modifying the input dictionary and querying a database).
    """
    iq_range = np.percentile(question_scores, 75) - np.percentile(question_scores, 25)
    median_score = np.median(question_scores)
    if median_score == 0:
        return 0
    return iq_range / median_score


@bot.message_handler(func=lambda message: message.text == "Посмотреть рейтинг")
def request_topic_for_rating(message):
    """
    Requests the topic for which to display ratings.

        This function initiates a conversation with the user to determine the
        topic they want to see ratings for, then retrieves and displays those ratings.

        Args:
            message: The incoming message object from the bot.  Used to get chat ID and start interaction.

        Returns:
            None: This function does not explicitly return a value; it interacts with the user via Telegram messages.
    """
    chat_id = message.chat.id
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("SELECT name FROM topics")
    topics = cursor.fetchall()
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    for topic in topics:
        markup.add(types.KeyboardButton(topic[0]))

    msg = bot.send_message(
        chat_id, "Выберите тему для просмотра рейтинга:", reply_markup=markup
    )
    bot.register_next_step_handler(msg, view_rating)


def view_rating(message):
    """
    Views a specific rating.

      Args:
        rating_id: The ID of the rating to view.

      Returns:
        dict: A dictionary containing the rating details, or None if not found.
    """
    chat_id = message.chat.id
    topic_name = message.text
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM topics WHERE name = ?", (topic_name,))
    topic_id = cursor.fetchone()[0]

    cursor.execute(
        "SELECT user_id, score FROM test_results WHERE test_id IN (SELECT id FROM tests WHERE topic_id = ?)",
        (topic_id,),
    )
    user_scores = cursor.fetchall()

    users_scores_dict = {}
    for user_id, score in user_scores:
        if user_id not in users_scores_dict:
            users_scores_dict[user_id] = []
        users_scores_dict[user_id].append(score)

    ratings = []
    for user_id, scores in users_scores_dict.items():
        cursor.execute(
            "SELECT first_name, last_name FROM users WHERE id = ?", (user_id,)
        )
        first_name, last_name = cursor.fetchone()

        analytic_score = calculate_mean_without_outliers(scores)
        creativity_score = calculate_creativity(scores)

        ratings.append(
            f"{first_name} {last_name}: Аналитичность: {analytic_score}, Креативность: {creativity_score}"
        )

    bot.send_message(
        chat_id,
        "Рейтинг пользователей по теме '{}':\n".format(topic_name) + "\n".join(ratings),
    )


bot.polling()
