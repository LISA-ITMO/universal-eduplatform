FROM python:3.10-slim

WORKDIR /app

COPY uni_eduplatform_bot.py .

RUN pip install pyTelegramBotAPI requests python-dotenv

CMD ["python", "uni_eduplatform_bot.py"]
