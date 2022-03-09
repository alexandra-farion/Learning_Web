# -*- coding: utf-8 -*-
import datetime

from postgresgl import *


class DB:
    def __init__(self):
        async def i():
            async with await connect() as connection:
                async with connection.cursor() as cursor:
                    await cursor.execute("""CREATE TABLE IF NOT EXISTS diary
                                            (school TEXT, class TEXT, week TEXT, schedule TEXT[][][]);

                                            CREATE TABLE IF NOT EXISTS peoples
                                            (nickname TEXT PRIMARY KEY, name TEXT, password TEXT, school TEXT, 
                                            character TEXT, class TEXT, subject TEXT[]);

                                            CREATE TABLE IF NOT EXISTS marks
                                            (nickname TEXT, date TEXT, weight INTEGER, value INTEGER, 
                                            theme TEXT, subject TEXT);
                                        """)

        asyncio.run(i())

    async def __kill(self, name):
        async with await connect() as connection:
            async with connection.cursor() as cursor:
                await cursor.execute(f"DROP TABLE {name}")
                print(f"DB {name} dropped")

    async def kill_human(self):
        await self.__kill("peoples")

    async def kill_diary(self):
        await self.__kill("diary")

    async def kill_marks(self):
        await self.__kill("marks")

    async def add_people(self):
        async with await connect() as connection:
            async with connection.cursor() as cursor:
                with open("students.csv", encoding='utf-8') as file:
                    arr = file.readlines()
                    arr.reverse()

                    for i in range(len(arr) - 1):
                        student = arr[i][:-1]
                        await self.__add_people(cursor, (student.split()[0], student, "0000", 'МАОУ "Лицей №6"',
                                                         "student", "11А", [None]))

                    student = arr[-1][1:-1]
                    await self.__add_people(cursor, (student.split()[0], student, "0000", 'МАОУ "Лицей №6"',
                                                     "student", "11А", [None]))

                    with open("teachers.csv", encoding='utf-8') as file:
                        arr = file.readlines()
                        line = arr[0][1:-1].split(";")
                        await self.__add_people(cursor, (line[0].split()[0], line[0], "1111",
                                                         'МАОУ "Лицей №6"', "teacher", None, line[1::]))
                        for i in range(1, len(arr)):
                            line = arr[i][:-1].split(";")
                            await self.__add_people(cursor, (line[0].split()[0], line[0], "1111",
                                                             'МАОУ "Лицей №6"', "teacher", None, line[1::]))

    async def __add_people(self, cursor, data: tuple):
        await cursor.execute("INSERT INTO peoples VALUES (%s, %s, %s, %s, %s, %s, %s)", data)

    async def add_diary(self):
        date = datetime.date.today().isocalendar()
        week = str(date[1])
        if len(week) == 1:
            week = "0" + week

        async with await connect() as connection:
            async with connection.cursor() as cursor:
                await cursor.execute("INSERT INTO diary VALUES (%s, %s, %s, %s)",
                                     ('МАОУ "Лицей №6"', "11А", f"{date[0]}-W{week}",
                                      [
                                          [["Информатика", "§30"],
                                           ["Информатика", "§31"],
                                           ["Химия", "параграф 14 упр. 2-4"],
                                           ["Математика", "вариант 2, часть 2 № 12, 14, 15, 17 (Ященко И.В.)"],
                                           ["Математика", ""],
                                           ["Литература", ""],
                                           ["Литература", ""],
                                           ["Спецкурс по математике", ""]],

                                          [["Математика", "п. 61, 62, 63, № 555, 558, 568"],
                                           ["Математика", ""],
                                           ["История", "принести 3 часть учебника Истории России"],
                                           ["Физика", ""],
                                           ["Физика", ""],
                                           ["", ""],
                                           ["", ""],
                                           ["", ""]],

                                          [["", ""],
                                           ["ОБЖ", "Правовые основы военной службы"],
                                           ["Обществознание", "§31"],
                                           ["Физ-ра", "параграф 14 упр. 2-4"],
                                           ["Литература", ""],
                                           ["Английский", "стр 63 № В наизусть"],
                                           ["Физика", ""],
                                           ["", ""]],

                                          [["Математика", ""],
                                           ["Математика", ""],
                                           ["Физ-ра", ""],
                                           ["Английский", ""],
                                           ["Проект", "Записи в тетради"],
                                           ["Информатика", ""],
                                           ["Информатика", ""],
                                           ["", ""]],

                                          [["Математика", ""],
                                           ["Математика", ""],
                                           ["Физика", ""],
                                           ["Английский", ""],
                                           ["Физика", ""],
                                           ["Русский яз", ""],
                                           ["Родной...", ""],
                                           ["", ""]],

                                          [["Шахматы", ""],
                                           ["История", ""],
                                           ["География", ""],
                                           ["Биология", "§17, 18"],
                                           ["Общество", ""],
                                           ["", ""],
                                           ["", ""],
                                           ["", ""]]
                                      ]))

    def add_all(self):
        asyncio.run(self.add_people())
        asyncio.run(self.add_diary())

    def kill_all(self):
        asyncio.run(self.kill_diary())
        asyncio.run(self.kill_human())
        asyncio.run(self.kill_marks())

    async def __print(self, cursor, name):
        await cursor.execute(f"SELECT * FROM {name}")
        print(f"---------------{name}")
        for i in await cursor.fetchall():
            print(i)
        print("    ")

    def print(self):
        async def p():
            async with await connect() as connection:
                async with connection.cursor() as cursor:
                    await self.__print(cursor, "diary")
                    await self.__print(cursor, "peoples")
                    await self.__print(cursor, "marks")

        asyncio.run(p())

    def set_admin(self, name):
        async def s():
            async with await connect() as connection:
                async with connection.cursor() as cursor:
                    await cursor.execute(f"""UPDATE peoples
                                            SET character = 'admin'
                                            WHERE name = '{name}'
                                        """)

        asyncio.run(s())


db = DB()
# db.kill_all()
# db.add_all()
# db.set_admin("Фокина Елена Валерьевна")
# db.set_admin("Журило Лия Владимировна")
db.print()
# db.kill_marks()
