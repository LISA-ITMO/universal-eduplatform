import telebot
from telebot import types
import sqlite3
import numpy as np
import config_eduplatform

TOKEN = config_eduplatform.bot_token
bot = telebot.TeleBot(TOKEN)


def connect_db():
    return sqlite3.connect('test_bot.db')


@bot.message_handler(commands=['start'])
def start_message(message):
    chat_id = message.chat.id
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    register_button = types.KeyboardButton('Регистрация')
    login_button = types.KeyboardButton('Авторизация')
    markup.add(register_button, login_button)
    bot.send_message(chat_id, "Добро пожаловать! Используйте кнопки ниже для навигации.", reply_markup=markup)


@bot.message_handler(func=lambda message: message.text == 'Регистрация')
def register(message):
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
    chat_id = message.chat.id
    password = message.text
    msg = bot.send_message(chat_id, "Введите ваше имя:")
    bot.register_next_step_handler(msg, process_register_first_name, phone, password)


def process_register_first_name(message, phone, password):
    chat_id = message.chat.id
    first_name = message.text
    msg = bot.send_message(chat_id, "Введите вашу фамилию:")
    bot.register_next_step_handler(msg, process_register_last_name, phone, password, first_name)


def process_register_last_name(message, phone, password, first_name):
    chat_id = message.chat.id
    last_name = message.text
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("INSERT INTO users (id, phone, password, first_name, last_name, score) VALUES (?, ?, ?, ?, ?, ?)",
                   (chat_id, phone, password, first_name, last_name, 0))
    conn.commit()
    conn.close()

    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    createtest_button = types.KeyboardButton('Создать тест')
    starttest_button = types.KeyboardButton('Пройти тест')
    viewrating_button = types.KeyboardButton('Посмотреть рейтинг')
    markup.add(createtest_button, starttest_button, viewrating_button)
    bot.send_message(chat_id, f"Регистрация завершена! Ваш логин: {phone}", reply_markup=markup)


@bot.message_handler(func=lambda message: message.text == 'Авторизация')
def login(message):
    chat_id = message.chat.id
    msg = bot.send_message(chat_id, "Введите номер телефона:")
    bot.register_next_step_handler(msg, process_login_phone)


def process_login_phone(message):
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
        bot.send_message(chat_id,
                         "Пользователь с таким номером телефона не найден. Пожалуйста, зарегистрируйтесь или введите номер телефона повторно.")
        login(message)


def process_login_password(message, phone):
    chat_id = message.chat.id
    password = message.text
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE phone = ? AND password = ?", (phone, password))
    user = cursor.fetchone()
    if user:
        # Пользователь успешно авторизован
        user_id = user[0]
        cursor.execute("UPDATE users SET id = ? WHERE phone = ?", (chat_id, phone))
        conn.commit()

        markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
        createtest_button = types.KeyboardButton('Создать тест')
        starttest_button = types.KeyboardButton('Пройти тест')
        viewrating_button = types.KeyboardButton('Посмотреть рейтинг')
        markup.add(createtest_button, starttest_button, viewrating_button)
        bot.send_message(chat_id, f"Авторизация успешна! Ваш логин: {phone}", reply_markup=markup)
    else:
        bot.send_message(chat_id, "Неправильный пароль, попробуйте снова.")
        login(message)


@bot.message_handler(func=lambda message: message.text == 'Создать тест')
def createtest(message):
    chat_id = message.chat.id
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE id = ?", (chat_id,))
    user = cursor.fetchone()
    if user:
        msg = bot.send_message(chat_id, "Введите тему теста:")
        bot.register_next_step_handler(msg, process_create_topic)
    else:
        bot.send_message(chat_id,
                         "Пожалуйста, авторизуйтесь с помощью кнопки 'Авторизация' или зарегистрируйтесь с помощью кнопки 'Регистрация'.")


def process_create_topic(message):
    chat_id = message.chat.id
    topic = message.text
    user_tests[chat_id] = {'topic': topic, 'questions': []}
    msg = bot.send_message(chat_id, "Выберите уровень сложности (легкий, средний, сложный):")
    bot.register_next_step_handler(msg, process_create_difficulty)


def process_create_difficulty(message):
    chat_id = message.chat.id
    difficulty = message.text.lower()
    if difficulty in ['легкий', 'средний', 'сложный']:
        user_tests[chat_id]['difficulty'] = difficulty
        msg = bot.send_message(chat_id, "Введите вопрос:")
        bot.register_next_step_handler(msg, process_create_question)
    else:
        bot.send_message(chat_id, "Некорректный уровень сложности. Попробуйте снова.")
        process_create_topic(message)


def process_create_question(message):
    chat_id = message.chat.id
    question = message.text
    user_tests[chat_id]['questions'].append({'question': question, 'answers': [], 'correct_answers': []})
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    add_answer_button = types.KeyboardButton('Добавить ответ')
    done_button = types.KeyboardButton('Готово')
    markup.add(add_answer_button, done_button)
    bot.send_message(chat_id, "Введите вариант ответа или нажмите 'Готово' для завершения:", reply_markup=markup)
    bot.register_next_step_handler(message, process_create_answers)


def process_create_answers(message):
    chat_id = message.chat.id
    if message.text == 'Готово':
        msg = bot.send_message(chat_id, "Введите правильный ответ (если несколько, через запятую):")
        bot.register_next_step_handler(msg, process_create_correct_answer)
    else:
        answer = message.text
        user_tests[chat_id]['questions'][-1]['answers'].append(answer)
        msg = bot.send_message(chat_id, "Введите вариант ответа или нажмите 'Готово' для завершения:")
        bot.register_next_step_handler(msg, process_create_answers)


def process_create_correct_answer(message):
    chat_id = message.chat.id
    correct_answers = message.text.split(',')
    user_tests[chat_id]['questions'][-1]['correct_answers'] = correct_answers
    msg = bot.send_message(chat_id, "Добавить еще один вопрос? (да/нет)")
    bot.register_next_step_handler(msg, process_add_more_questions)


def process_add_more_questions(message):
    chat_id = message.chat.id
    if message.text.lower() == 'да':
        msg = bot.send_message(chat_id, "Введите вопрос:")
        bot.register_next_step_handler(msg, process_create_question)
    else:
        test = user_tests.pop(chat_id)
        conn = connect_db()
        cursor = conn.cursor()

        cursor.execute("INSERT INTO tests (topic_id, difficulty) VALUES (?, ?)", (test['topic'], test['difficulty']))
        test_id = cursor.lastrowid

        for question in test['questions']:
            cursor.execute("INSERT INTO questions (test_id, question) VALUES (?, ?)", (test_id, question['question']))
            question_id = cursor.lastrowid
            for answer in question['answers']:
                is_correct = 1 if answer in question['correct_answers'] else 0
                cursor.execute("INSERT INTO answers (question_id, answer, is_correct) VALUES (?, ?, ?)",
                               (question_id, answer, is_correct))

        conn.commit()
        conn.close()

        bot.send_message(chat_id, "Тест успешно создан!")


@bot.message_handler(func=lambda message: message.text == 'Пройти тест')
def starttest(message):
    chat_id = message.chat.id
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE id = ?", (chat_id,))
    user = cursor.fetchone()
    if user:
        msg = bot.send_message(chat_id, "Введите ID теста, который хотите пройти:")
        bot.register_next_step_handler(msg, process_test_id)
    else:
        bot.send_message(chat_id,
                         "Пожалуйста, авторизуйтесь с помощью кнопки 'Авторизация' или зарегистрируйтесь с помощью кнопки 'Регистрация'.")


def process_test_id(message):
    chat_id = message.chat.id
    test_id = int(message.text)
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM tests WHERE id = ?", (test_id,))
    test = cursor.fetchone()
    if test:
        msg = bot.send_message(chat_id, "Выберите уровень сложности (легкий, средний, сложный):")
        bot.register_next_step_handler(msg, process_test_difficulty, test_id)
    else:
        bot.send_message(chat_id, "Тест с таким ID не найден. Попробуйте снова.")
        msg = bot.send_message(chat_id, "Введите ID теста, который хотите пройти:")
        bot.register_next_step_handler(msg, process_test_id)


def process_test_difficulty(message, test_id):
    chat_id = message.chat.id
    difficulty = message.text.lower()
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM tests WHERE id = ? AND difficulty = ?", (test_id, difficulty))
    test = cursor.fetchone()
    if test:
        send_question(chat_id, test_id, 0)
    else:
        bot.send_message(chat_id, "Тест с таким уровнем сложности не найден. Попробуйте снова.")
        msg = bot.send_message(chat_id, "Выберите уровень сложности (легкий, средний, сложный):")
        bot.register_next_step_handler(msg, process_test_difficulty, test_id)


def send_question(chat_id, test_id, question_index):
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM questions WHERE test_id = ? LIMIT 1 OFFSET ?", (test_id, question_index))
    question = cursor.fetchone()
    if question:
        cursor.execute("SELECT * FROM answers WHERE question_id = ?", (question[0],))
        answers = cursor.fetchall()

        markup = types.InlineKeyboardMarkup(row_width=2)
        for answer in answers:
            markup.add(types.InlineKeyboardButton(answer[2], callback_data=f"{question[0]}_{answer[0]}"))
        markup.add(types.InlineKeyboardButton("Нет правильного ответа", callback_data=f"{question[0]}_None"))

        bot.send_message(chat_id, f"Вопрос: {question[2]}", reply_markup=markup)
        bot.register_next_step_handler_by_chat_id(chat_id, process_test_answer, test_id, question_index)
    else:
        bot.send_message(chat_id, "Все вопросы теста завершены.")
        conn.close()


def process_test_answer(message, test_id, question_index):
    chat_id = message.chat.id
    selected_answers = message.data.split('_')
    question_id = int(selected_answers[0])
    answer_ids = selected_answers[1:]

    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM answers WHERE question_id = ? AND is_correct = 1", (question_id,))
    correct_answers = cursor.fetchall()
    correct_answer_ids = [answer[0] for answer in correct_answers]

    if all(answer_id in correct_answer_ids for answer_id in answer_ids):
        bot.send_message(chat_id, "Правильно!")
        cursor.execute("UPDATE users SET score = score + 1 WHERE id = ?", (chat_id,))
    else:
        correct_answers_text = ', '.join(
            [cursor.execute("SELECT answer FROM answers WHERE id = ?", (answer_id,)).fetchone()[0] for answer_id in
             correct_answer_ids])
        bot.send_message(chat_id, f"Неправильно! Правильные ответы: {correct_answers_text}")

    cursor.execute("INSERT INTO test_results (test_id, user_id, score) VALUES (?, ?, ?)",
                   (test_id, chat_id, 1 if all(answer_id in correct_answer_ids for answer_id in answer_ids) else 0))

    conn.commit()
    conn.close()

    send_question(chat_id, test_id, question_index + 1)


def calculate_mean_without_outliers(scores):
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
    return np.median(scores)


def calculate_creativity(question_scores):
    iq_range = np.percentile(question_scores, 75) - np.percentile(question_scores, 25)
    median_score = np.median(question_scores)
    if median_score == 0:
        return 0
    return iq_range / median_score


@bot.message_handler(func=lambda message: message.text == 'Посмотреть рейтинг')
def request_topic_for_rating(message):
    chat_id = message.chat.id
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("SELECT name FROM topics")
    topics = cursor.fetchall()
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    for topic in topics:
        markup.add(types.KeyboardButton(topic[0]))

    msg = bot.send_message(chat_id, "Выберите тему для просмотра рейтинга:", reply_markup=markup)
    bot.register_next_step_handler(msg, view_rating)


def view_rating(message):
    chat_id = message.chat.id
    topic_name = message.text
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM topics WHERE name = ?", (topic_name,))
    topic_id = cursor.fetchone()[0]

    cursor.execute("SELECT user_id, score FROM test_results WHERE test_id IN (SELECT id FROM tests WHERE topic_id = ?)",
                   (topic_id,))
    user_scores = cursor.fetchall()

    users_scores_dict = {}
    for user_id, score in user_scores:
        if user_id not in users_scores_dict:
            users_scores_dict[user_id] = []
        users_scores_dict[user_id].append(score)

    ratings = []
    for user_id, scores in users_scores_dict.items():
        cursor.execute("SELECT first_name, last_name FROM users WHERE id = ?", (user_id,))
        first_name, last_name = cursor.fetchone()

        analytic_score = calculate_mean_without_outliers(scores)
        creativity_score = calculate_creativity(scores)

        ratings.append(f"{first_name} {last_name}: Аналитичность: {analytic_score}, Креативность: {creativity_score}")

    bot.send_message(chat_id, "Рейтинг пользователей по теме '{}':\n".format(topic_name) + "\n".join(ratings))


bot.polling()
