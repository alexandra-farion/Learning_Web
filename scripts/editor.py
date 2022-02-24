# -*- coding: utf-8 -*-
import datetime

from data_base import DataBase


class DB:
    def __init__(self):
        self.__db_diary = DataBase("diary", False, ("School", "text"), ("Class", "text"), ("Week", "text"),
                                   ("Schedule", "text[][][]"))
        self.__db_diary.connect()
        self.__db_peoples = DataBase("peoples", False, ("Surname", "text PRIMARY KEY"), ("Password", "text"),
                                     ("School", "text"), ("Class", "text"), ("Character", "text"))
        self.__db_peoples.connect()
        self.__db_marks = DataBase("marks", False, ("Surname", "text"), ("Date", "text"), ("Position", "integer"),
                                   ("Weight", "integer"), ("Value", "integer"))
        self.__db_marks.connect()

    def kill_human(self):
        self.__db_peoples.kill_base()

    def kill_diary(self):
        self.__db_diary.kill_base()

    def kill_marks(self):
        self.__db_marks.kill_base()

    def add_people(self):
        self.__db_peoples.add_data("Мухортов", "0000", 'МАОУ "Лицей №6"', "11А", "student")
        self.__db_peoples.add_data("Учитель1", "1111", 'МАОУ "Лицей №6"', "0", "teacher")
        self.__db_peoples.add_data("1", "1", 'МАОУ "Лицей №6"', "11А", "student")
        self.__db_peoples.add_data("Админ", "777", 'МАОУ "Лицей №6"', "0", "admin")

    def add_diary(self):
        date = datetime.date.today().isocalendar()
        week = str(date[1])
        if len(week) == 1:
            week = "0" + week
        self.__db_diary.add_data('МАОУ "Лицей №6"', "11А",
                                 str(date[0]) + "-W" + week,
                                 '{'
                                 '{{"Информатика", "§30"}, '
                                 '{"Информатика", "§31"}, '
                                 '{"Химия", "параграф 14 упр. 2-4"}, '
                                 '{"Математика", "вариант 2, часть 2 № 12, 14, 15, 17 (Ященко И.В.)"}, '
                                 '{"Математика", ""}, '
                                 '{"Литература", ""}, '
                                 '{"Литература", ""}, '
                                 '{"Спецкурс по математике", ""}}, '

                                 '{{"Математика", "п. 61, 62, 63, № 555, 558, 568"}, '
                                 '{"Математика", ""}, '
                                 '{"История", "принести 3 часть учебника Истории России"}, '
                                 '{"Физика", ""}, '
                                 '{"Физика", ""}, '
                                 '{"", ""}, '
                                 '{"", ""}, '
                                 '{"", ""}}, '

                                 '{{"", ""}, '
                                 '{"ОБЖ", "Правовые основы военной службы"}, '
                                 '{"Обществознание", "§31"}, '
                                 '{"Физ-ра", "параграф 14 упр. 2-4"}, '
                                 '{"Литература", ""}, '
                                 '{"Английский", "стр 63 № В наизусть"}, '
                                 '{"Физика", ""}, '
                                 '{"", ""}}, '

                                 '{{"Математика", ""}, '
                                 '{"Математика", ""}, '
                                 '{"Физ-ра", ""}, '
                                 '{"Английский", ""}, '
                                 '{"Проект", "Записи в тетради"}, '
                                 '{"Информатика", ""}, '
                                 '{"Информатика", ""}, '
                                 '{"", ""}}, '

                                 '{{"Математика", ""}, '
                                 '{"Математика", ""}, '
                                 '{"Физика", ""}, '
                                 '{"Английский", ""}, '
                                 '{"Физика", ""}, '
                                 '{"Русский яз", ""}, '
                                 '{"Родной...", ""}, '
                                 '{"", ""}}, '

                                 '{{"Шахматы", ""}, '
                                 '{"История", ""}, '
                                 '{"География", ""}, '
                                 '{"Биология", "§17, 18"}, '
                                 '{"Общество", ""}, '
                                 '{"", ""}, '
                                 '{"", ""}, '
                                 '{"", ""}} '
                                 '}')

    def add_marks(self):
        self.__db_marks.add_data("Мухортов", str(datetime.date.today()), 1, 10, 2)

    def add_all(self):
        self.add_people()
        self.add_diary()
        self.add_marks()

    def kill_all(self):
        self.kill_diary()
        self.kill_human()
        self.kill_marks()

    def print(self):
        self.__db_diary.print()
        self.__db_peoples.print()
        self.__db_marks.print()

    def disconnect(self):
        self.__db_diary.disconnect()
        self.__db_peoples.disconnect()
        self.__db_marks.disconnect()


db = DB()

# db.kill_all()
# db.add_all()
db.print()
db.disconnect()
