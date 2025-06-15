from peewee import Model, AutoField, CharField, TextField
from app.config import db

class Theme(Model):
    id    = AutoField()
    name  = CharField(max_length=255)
    descr = TextField()

    class Meta:
        database = db
        table_name = "themes"