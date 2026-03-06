import os
import re
import requests
from typing import Dict, Any

import telebot
from telebot import types
from dotenv import load_dotenv

# Load .env
load_dotenv()

TOKEN = os.getenv('TG_BOT_TOKEN')
TEACHER_CODE = os.getenv('TEACHER_CODE')
PLATFORM_ADDRESS_SERVER = os.getenv('PLATFORM_ADDRESS_SERVER')
PLATFORM_ADDRESS_CLIENT = os.getenv('PLATFORM_ADDRESS_CLIENT')

if not TOKEN:
	raise RuntimeError('Telegram bot token not found in environment (.env: TG_BOT_TOKEN or BOT_TOKEN)')

bot = telebot.TeleBot(TOKEN)

# In-memory registration/change-password state per chat
states: Dict[int, Dict[str, Any]] = {}


# NOTE: local sqlite DB was removed; bot uses platform GraphQL API directly.
# The old connect_db() and sqlite logic have been deleted.


def send_welcome(chat_id: int):
	markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
	markup.row(types.KeyboardButton('Регистрация'), types.KeyboardButton('Изменение пароля'))
	# Authorization button marked as in-development
	markup.add(types.KeyboardButton('Авторизация (в разработке)'))
	bot.send_message(
		chat_id,
		'Добро пожаловать! Бот создан для регистрации и авторизации пользователей на платформе кросс-тестирования. Для продолжения выберите действие',
		reply_markup=markup,
	)


@bot.message_handler(commands=['start'])
def start_message(message):
	chat_id = message.chat.id
	states.pop(chat_id, None)
	send_welcome(chat_id)


def reset_state(chat_id: int):
	states.pop(chat_id, None)
	send_welcome(chat_id)


def make_cancel_markup():
	markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
	markup.add(types.KeyboardButton('Отменить регистрацию'))
	return markup


def is_valid_login(login: str) -> bool:
	return bool(re.match(r'^[A-Za-z0-9_]{3,30}$', login))


def is_valid_fullname(fullname: str) -> bool:
	parts = fullname.strip().split()
	if len(parts) != 3:
		return False
	# allow Cyrillic and Latin letters and hyphen
	for p in parts:
		if not re.match(r'^[A-Za-zА-Яа-яЁё\-]+$', p):
			return False
	return True


def is_valid_email(email: str) -> bool:
	return bool(re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', email))


def normalize_phone(phone: str) -> str:
	digits = re.sub(r'\D', '', phone)
	if phone.startswith('+') and digits.startswith('7'):
		digits = '7' + digits[1:]
	return digits


def is_valid_phone(phone: str) -> bool:
	# Accept formats starting with +7 or 8 and total 11 digits
	digits = re.sub(r'\D', '', phone)
	return len(digits) == 11 and (phone.startswith('+7') or phone.startswith('8'))


def is_valid_password(pwd: str) -> bool:
	if len(pwd) < 8:
		return False
	if not any(c.isdigit() for c in pwd):
		return False
	if not any(not c.isalnum() for c in pwd):
		return False
	# All letters must be ASCII (latin)
	for c in pwd:
		if c.isalpha() and (ord(c) > 127):
			return False
	return True


def graphql_query(query: str, variables: dict = None) -> dict:
	# TODO: enforce HTTPS in production (validate TLS). Currently bot accepts PLATFORM_ADDRESS with http or https for testing.
	url = PLATFORM_ADDRESS_SERVER.rstrip('/') + '/graphql'
	headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
	payload = {'query': query}
	if variables is not None:
		payload['variables'] = variables
	try:
		r = requests.post(url, json=payload, headers=headers, timeout=10)
		try:
			r.raise_for_status()
		except requests.HTTPError as http_err:
			# include response body for easier debugging
			text = r.text
			return {'ok': False, 'errors': [f'HTTP {r.status_code}: {text}']}
		data = r.json()
		if 'errors' in data:
			return {'ok': False, 'errors': data['errors']}
		return {'ok': True, 'data': data.get('data')}
	except Exception as e:
		return {'ok': False, 'errors': [str(e)]}


def is_login_available(login: str) -> bool:
	query = '''query IsLoginAvailable($username: String!) { isLoginAvailable(username: $username) }'''
	res = graphql_query(query, {'username': login})
	if not res['ok']:
		return False
	data = res['data'] or {}
	return bool(data.get('isLoginAvailable'))


def register_user(payload: dict) -> (bool, str):
	query = '''mutation Register($input: RegisterInput!) { register(input: $input) { user { id username } accessToken } }'''
	variables = {'input': payload}
	res = graphql_query(query, variables)
	if not res['ok']:
		errs = res.get('errors')
		return False, str(errs)
	data = res.get('data') or {}
	reg = data.get('register')
	if not reg:
		return False, 'no register payload in response'
	user = reg.get('user') if isinstance(reg, dict) else None
	if user and user.get('username'):
		return True, ''
	return False, f'unexpected register response: {reg}'


def change_password_by_login(login: str, old_password: str, new_password: str) -> (bool, str):
	query = '''mutation ChangePasswordByLogin($login: String!, $oldPassword: String!, $newPassword: String!) { changePasswordByLogin(login: $login, oldPassword: $oldPassword, newPassword: $newPassword) }'''
	variables = {'login': login, 'oldPassword': old_password, 'newPassword': new_password}
	res = graphql_query(query, variables)
	if not res['ok']:
		return False, str(res.get('errors'))
	data = res.get('data') or {}
	ok = data.get('changePasswordByLogin')
	return bool(ok), '' if ok else 'invalid credentials or server rejected request'


@bot.message_handler(func=lambda m: m.text == 'Регистрация')
def start_registration(message):
	chat_id = message.chat.id
	states[chat_id] = {'mode': 'register', 'step': 'role', 'data': {}}
	markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
	markup.row(types.KeyboardButton('Студент'), types.KeyboardButton('Преподаватель'))
	markup.add(types.KeyboardButton('Отменить регистрацию'))
	bot.send_message(chat_id, 'Укажите роль пользователя - Студент/Преподаватель. Выбор роли преподавателя потребует подтверждающего кода', reply_markup=markup)


@bot.message_handler(func=lambda m: m.text == 'Отменить регистрация' or m.text == 'Отменить регистрацию')
def cancel_registration(message):
	chat_id = message.chat.id
	reset_state(chat_id)


@bot.message_handler(func=lambda m: m.text == 'Авторизация (в разработке)')
def auth_in_dev(message):
	bot.send_message(message.chat.id, 'Авторизация временно в разработке')


@bot.message_handler(func=lambda m: m.text == 'Изменение пароля')
def start_change_password(message):
	chat_id = message.chat.id
	states[chat_id] = {'mode': 'change_password', 'step': 'login', 'data': {}}
	bot.send_message(chat_id, 'Укажите логин в системе:', reply_markup=make_cancel_markup())


@bot.message_handler(func=lambda m: m.chat.id in states)
def registration_flow(message):
	chat_id = message.chat.id
	state = states.get(chat_id)
	text = message.text.strip() if message.text else ''

	# Allow cancel at any time
	if text in ['Отменить регистрация', 'Отменить регистрацию']:
		reset_state(chat_id)
		return

	# Handle change password flow
	if state.get('mode') == 'change_password':
		step = state.get('step')
		data = state['data']
		if step == 'login':
			login = text
			if not is_valid_login(login):
				bot.send_message(chat_id, 'Неверный формат данных. Укажите логин заново:', reply_markup=make_cancel_markup())
				return
			data['login'] = login
			state['step'] = 'old_password'
			bot.send_message(chat_id, 'Введите старый пароль:', reply_markup=make_cancel_markup())
			return
		if step == 'old_password':
			data['old_password'] = text
			state['step'] = 'new_password'
			bot.send_message(chat_id, 'Укажите новый пароль:', reply_markup=make_cancel_markup())
			return
		if step == 'new_password':
			if not is_valid_password(text):
				bot.send_message(chat_id, 'Пароль должен состоять минимум из 8 символов, содержать только символы латиницы, иметь минимум одну цифру и спецсимвол', reply_markup=make_cancel_markup())
				return
			data['new_password'] = text
			state['step'] = 'confirm_password'
			# provide reset option
			markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
			markup.row(types.KeyboardButton('Сбросить пароль'), types.KeyboardButton('Отменить регистрацию'))
			bot.send_message(chat_id, 'Повторите новый пароль (для повтора ввода пароля введите команду "Сбросить пароль"):', reply_markup=markup)
			return
		if step == 'confirm_password':
			if text == 'Сбросить пароль':
				state['step'] = 'new_password'
				bot.send_message(chat_id, 'Укажите пароль для пользователя:', reply_markup=make_cancel_markup())
				return
			if text != data.get('new_password'):
				bot.send_message(chat_id, 'Пароли не совпадают', reply_markup=make_cancel_markup())
				return
			# Call platform to change password by login
			ok, err = change_password_by_login(data.get('login'), data.get('old_password'), text)
			if not ok:
				bot.send_message(chat_id, f'Не удалось изменить пароль: {err}', reply_markup=make_cancel_markup())
				reset_state(chat_id)
				return
			bot.send_message(chat_id, 'Пароль успешно изменён')
			reset_state(chat_id)
			return

	# Handle registration flow
	if state.get('mode') == 'register':
		step = state.get('step')
		data = state['data']

		if step == 'role':
			if text not in ['Студент', 'Преподаватель']:
				bot.send_message(chat_id, 'Неверный формат данных. Укажите роль: Студент или Преподаватель', reply_markup=types.ReplyKeyboardMarkup(resize_keyboard=True).row(types.KeyboardButton('Студент'), types.KeyboardButton('Преподаватель')))
				return
			data['role'] = 'teacher' if text == 'Преподаватель' else 'student'
			if text == 'Преподаватель':
				state['step'] = 'teacher_code'
				bot.send_message(chat_id, 'Введите код доступа:', reply_markup=make_cancel_markup())
				return
			else:
				state['step'] = 'login'
				bot.send_message(chat_id, 'Укажите логин в системе:', reply_markup=make_cancel_markup())
				return

		if step == 'teacher_code':
			code = text
			if code != TEACHER_CODE:
				bot.send_message(chat_id, 'Введен неверный код')
				states.pop(chat_id, None)
				send_welcome(chat_id)
				return
			state['step'] = 'login'
			bot.send_message(chat_id, 'Код подтвержден. Укажите логин в системе:', reply_markup=make_cancel_markup())
			return

		if step == 'login':
			login = text
			if not is_valid_login(login):
				bot.send_message(chat_id, 'Неверный формат данных. Укажите логин заново:', reply_markup=make_cancel_markup())
				return
			available = is_login_available(login)
			if not available:
				bot.send_message(chat_id, 'Пользователь с таким логином уже существует в системе или сервис недоступен', reply_markup=make_cancel_markup())
				return
			data['login'] = login
			state['step'] = 'fullname'
			bot.send_message(chat_id, 'Укажите ФИО (Фамилия Имя Отчество):', reply_markup=make_cancel_markup())
			return

		if step == 'fullname':
			if not is_valid_fullname(text):
				bot.send_message(chat_id, 'Неверный формат данных. Укажите ФИО в формате: Фамилия Имя Отчество', reply_markup=make_cancel_markup())
				return
			parts = text.split()
			data['last_name'], data['first_name'], data['middle_name'] = parts[0], parts[1], parts[2]
			state['step'] = 'email'
			bot.send_message(chat_id, 'Укажите email:', reply_markup=make_cancel_markup())
			return

		if step == 'email':
			if not is_valid_email(text):
				bot.send_message(chat_id, 'Почта должна соответствовать шаблону "example@example.com"', reply_markup=make_cancel_markup())
				return
			data['email'] = text
			state['step'] = 'phone'
			markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
			markup.row(types.KeyboardButton('Пропустить'), types.KeyboardButton('Отменить регистрацию'))
			bot.send_message(chat_id, 'Укажите телефон (необязательно). Введите через +7 или 8 (11 цифр), либо нажмите Пропустить', reply_markup=markup)
			return

		if step == 'phone':
			if text == 'Пропустить':
				data['phone'] = None
				state['step'] = 'password'
				bot.send_message(chat_id, 'Укажите пароль для пользователя:', reply_markup=make_cancel_markup())
				return
			if not is_valid_phone(text):
				bot.send_message(chat_id, 'Неверный формат номера телефона', reply_markup=make_cancel_markup())
				return
			data['phone'] = normalize_phone(text)
			state['step'] = 'password'
			bot.send_message(chat_id, 'Укажите пароль для пользователя:', reply_markup=make_cancel_markup())
			return

		if step == 'password':
			if not is_valid_password(text):
				bot.send_message(chat_id, 'Пароль должен состоять минимум из 8 символов, содержать только символы латиницы, иметь минимум одну цифру и спецсимвол', reply_markup=make_cancel_markup())
				return
			data['password'] = text
			state['step'] = 'confirm_password'
			markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
			markup.row(types.KeyboardButton('Сбросить пароль'), types.KeyboardButton('Отменить регистрация'))
			bot.send_message(chat_id, 'Повторите пароль (для повтора ввода пароля введите команду "Сбросить пароль"):', reply_markup=markup)
			return

		if step == 'confirm_password':
			if text == 'Сбросить пароль':
				state['step'] = 'password'
				bot.send_message(chat_id, 'Укажите пароль для пользователя:', reply_markup=make_cancel_markup())
				return
			if text != data.get('password'):
				bot.send_message(chat_id, 'Пароли не совпадают', reply_markup=make_cancel_markup())
				return

			# All data collected — create user via platform GraphQL
			input_payload = {
				'username': data.get('login'),
				'email': data.get('email'),
				'password': data.get('password'),
				'role': data.get('role'),
				'firstName': data.get('first_name'),
				'lastName': data.get('last_name'),
				'middleName': data.get('middle_name'),
				'phone': data.get('phone'),
			}
			ok, err = register_user(input_payload)
			if not ok:
				bot.send_message(chat_id, f'Ошибка при создании пользователя: {err}', reply_markup=make_cancel_markup())
				reset_state(chat_id)
				return

			bot.send_message(chat_id, f"Пользователь успешно создан\nЛогин для авторизации: {data.get('login')}\nСистема доступна по адресу: {PLATFORM_ADDRESS_CLIENT}")
			states.pop(chat_id, None)
			send_welcome(chat_id)
			return

	# Fallback: if state not recognized, show welcome
	send_welcome(chat_id)


if __name__ == '__main__':
	bot.polling()
