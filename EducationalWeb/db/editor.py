import asyncio
import csv
import datetime
import os
from pathlib import Path
from typing import Type

from EducationalWeb.models import *

directory = Path(__file__).resolve().parent
students_csv = os.path.join(directory, 'students.csv')
teachers_csv = os.path.join(directory, 'teachers.csv')
classes_csv = os.path.join(directory, 'classes.csv')
schedule_csv = os.path.join(directory, 'schedule.csv')


async def add_teachers():
    with open(teachers_csv, encoding='utf-8') as file:
        for teacher_and_classes in csv.reader(file, delimiter=";"):
            teacher = teacher_and_classes[0].replace("\ufeff", "")
            teacher_classes = []

            for j in teacher_and_classes[1:]:
                classes = j.split()
                teacher_classes.append(
                    [i.replace("-", " ") for i in classes] + ["" for _ in range(5 - len(classes))])

            await Peoples.objects.aget_or_create(nickname=teacher, name=teacher, password="1111",
                                                 school='МАОУ "Лицей №6"', is_student=False)

            await Teachers.objects.aget_or_create(nickname=teacher, character="teacher",
                                                  fixed_classes=teacher_classes)


async def add_students():
    with open(students_csv, encoding='utf-8') as file:
        for student_and_class in csv.reader(file, delimiter=";"):
            student, clazz, group = tuple(map(lambda x: x.replace("\ufeff", ""), student_and_class))

            await Peoples.objects.aget_or_create(nickname=student, name=student, password="0000",
                                                 school='МАОУ "Лицей №6"')
            await Students.objects.aget_or_create(nickname=student, clazz=clazz, grouping=group)


async def add_classes():
    with open(classes_csv, encoding='utf-8') as file:
        for clazz_subjects in csv.reader(file, delimiter=";"):
            await Classes.objects.aget_or_create(clazz=clazz_subjects[0].replace("\ufeff", ""),
                                                 school='МАОУ "Лицей №6"',
                                                 classroom=clazz_subjects[1], subjects=clazz_subjects[2:])


async def add_diary():
    date = datetime.date.today().isocalendar()
    week = str(date[1])
    if len(week) == 1:
        week = "0" + week
    date = f"{date[0]}-W{week}"

    with open(schedule_csv, encoding='utf-8') as file:
        schedule = []
        day = []
        classes = file.readline().replace("\n", "").replace("\ufeff", "").split(";")
        current_class = 0
        subjects_count = 0
        all_schedule = file.readlines()

        while current_class < len(classes):
            for subject in all_schedule:
                subject = subject.replace("\ufeff", "").replace("\n", "").split(";")[current_class]
                if subject != "":
                    if subject == "---":
                        day.append(["", ""])
                    else:
                        day.append([subject, "Не задано"])
                else:
                    schedule.append(day + [["", ""] for _ in range(8 - len(day))])
                    day = []
                    subjects_count += 1

                    if subjects_count == 6:
                        break

            await Diary.objects.aget_or_create(school='МАОУ "Лицей №6"', clazz=classes[current_class],
                                               week=date, schedule=schedule)

            schedule = []
            subjects_count = 0
            current_class += 1


def delete(db: Type[Model]):
    do(db.objects.all().adelete)


def delete_all():
    delete(Classes)
    delete(Peoples)
    delete(Students)
    delete(Teachers)
    delete(Diary)
    delete(Marks)


def full_db():
    do(add_classes)
    do(add_teachers)
    do(add_students)
    do(add_diary)


def do(func):
    asyncio.run(func())

# insert into python manage.py shell
# from EducationalWeb.db.editor import *
