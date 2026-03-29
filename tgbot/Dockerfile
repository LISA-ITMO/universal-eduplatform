FROM python:3.10-slim

WORKDIR /app

COPY uni_eduplatform_bot.py .

RUN pip install pyTelegramBotAPI requests[socks] python-dotenv PySocks

CMD ["python", "uni_eduplatform_bot.py"]
