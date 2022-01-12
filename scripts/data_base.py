# -*- coding: utf-8 -*-

import psycopg


class DataBase:
    def __init__(self, name: str, with_primary: bool, *args: tuple):
        self.__name = name
        self.__connection = None
        self.__cursor = None
        self.__create = """CREATE TABLE IF NOT EXISTS """ + name + """ (id serial, """
        self.__insert = ["INSERT", "INTO", name]
        self.__delete = "DELETE FROM " + name + " WHERE id="
        self.__select = "SELECT * FROM " + name
        self.__drop = "DROP TABLE " + name
        self.__update = "UPDATE " + name + " SET "
        self.__contains = "SELECT id FROM " + name + " WHERE EXISTS (SELECT * FROM " + name + " peoples WHERE "
        if with_primary:
            self.__create = self.__create[:-2] + " PRIMARY KEY, "

        list_val = "("

        for i in args:
            self.__create += i[0] + " " + i[1] + ", "
            list_val += i[0] + ", "

        self.__insert.append(list_val[:-2] + ")")
        self.__insert.append("VALUES ")
        self.__insert = " ".join(self.__insert)

    def __try_catch(self, func):
        try:
            return func()
        except BaseException as e:
            self.__connection.rollback()
            self.__connection.close()
            print(e)
            print("ОТКАТ")

    def add_data(self, *args):
        def f():
            self.__cursor.execute(self.__insert + str(args))

        self.__try_catch(f)

    def delete_data(self, index: int):
        def f():
            self.__cursor.execute(self.__delete + str(index))

        self.__try_catch(f)

    def update_data(self, condition: str, where: str):
        def f():
            self.__cursor.execute(self.__update + condition + " WHERE " + where)

        self.__try_catch(f)

    def contains_data(self, condition: str):
        def f():
            self.__cursor.execute(self.__contains + condition + ")")
            return len(self.__cursor.fetchall()) != 0

        return self.__try_catch(f)

    def get_data(self, what: str, where: str):
        def f():
            self.__cursor.execute("SELECT " + what + " FROM " + self.__name + " WHERE " + where)
            return self.__cursor.fetchall()[-1][0]

        return self.__try_catch(f)

    def print(self):
        def f():
            self.__cursor.execute(self.__select)
            for record in self.__cursor.fetchall():
                print(record)
            print()

        self.__try_catch(f)

    def connect(self):
        self.__connection = psycopg.connect(dbname="test", user="postgres", password="7604")
        self.__cursor = self.__connection.cursor()
        self.__cursor.execute(self.__create[:-2] + ")")
        print("BD", self.__name, "connected")

    def disconnect(self):
        self.__connection.commit()
        self.__connection.close()
        print("BD", self.__name, "disconnected")

    def kill_base(self):
        self.__cursor.execute(self.__drop)
        print("DB", self.__name, "have dropped")
