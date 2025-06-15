from pydantic_settings import BaseSettings
from playhouse.db_url import connect

class Settings(BaseSettings):
    ai_model_endpoint: str = "http://localhost:8001"
    database_url: str = "postgres://user:P@ssw0rd@127.0.0.1:5432/lisa"

settings = Settings()

# инициализируем подключение Peewee по URL
db = connect(settings.database_url)