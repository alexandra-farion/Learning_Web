# -*- coding: utf-8 -*-
from data_base import DataBase

db = DataBase("peoples", False, ("Surname", "text PRIMARY KEY"), ("Password", "text"),
              ("School", "text"), ("Class", "text"), ("Character", "text"))
db.connect()
# db.kill_base()
# db.add_data("Мухортов", "0000", "МАОУ Лицей №6", "11A", "Ученик")
# db.add_data("Учитель1", "1111", "МАОУ Лицей №6", "0", "Учитель")
# db.add_data("1", "1", "МАОУ Лицей №6", "0", "Ученик")

# db.add_data("Оно", "0000", "МАОУ Лицей №6", "11A", "Ученик")
# db.print()
# print(db.contains_data("Surname='ЕВ'"))
# db.update_data("Password=1111", "Surname='Оно'")
# print(db.get_data("Character", "Surname='Мухортов'"))

db.print()
db.disconnect()
