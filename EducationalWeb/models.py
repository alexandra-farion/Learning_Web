from django.contrib.postgres.fields import ArrayField
from django.db.models import CharField, OneToOneField, IntegerField
from django.db.models import Model, CASCADE


class Classes(Model):
    clazz = CharField(max_length=3)
    school = CharField(max_length=100)
    classroom = CharField(max_length=10)
    subjects = ArrayField(CharField(max_length=100))


class Peoples(Model):
    nickname = CharField(max_length=100, primary_key=True)
    name = CharField(max_length=100)
    password = CharField(max_length=100)
    school = CharField(max_length=100)


class Students(Model):
    nickname = OneToOneField(Peoples, on_delete=CASCADE, db_column="nickname")
    clazz = CharField(max_length=3)
    grouping = CharField(max_length=50)


class Teachers(Model):
    nickname = OneToOneField(Peoples, on_delete=CASCADE, db_column="nickname")
    character = CharField(max_length=7)
    fixed_classes = ArrayField(ArrayField(CharField(max_length=100)))


class Diary(Model):
    school = CharField(max_length=100)
    clazz = CharField(max_length=3)
    week = CharField(max_length=8)
    schedule = ArrayField(ArrayField(ArrayField(CharField(max_length=100))))


class Marks(Model):
    nickname = OneToOneField(Peoples, on_delete=CASCADE, db_column="nickname")
    date = CharField(max_length=20)
    weight = IntegerField()
    value = IntegerField()
    theme = CharField(max_length=5000)
    subject = CharField(max_length=100)
