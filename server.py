# -*- coding: utf-8 -*-

import orjson
from fastapi import FastAPI, Response
from fastapi.responses import FileResponse
from uvicorn import run

from scripts.data_base import DataBase

app = FastAPI()
db_peoples = DataBase("peoples", False, ("Surname", "text PRIMARY KEY"), ("Password", "text"),
                      ("School", "text"), ("Class", "text"), ("Character", "text"))
db_diary = DataBase("diary", False, ("School", "text"), ("Class", "text"), ("Week", "integer"),
                    ("Schedule", "text[][][]"))


def serialize(value: str):
    code = ""
    for i in value:
        code += str(ord(i)) + " "
    return code[:-1]


@app.get("/post_schedule/{schedule}")
def post_schedule(schedule: str):
    data = orjson.loads(schedule)
    old_schedule = get_schedule(data["School"], data["Class"], data["Week"])["schedule"][0]
    new_data = data["Schedule"]

    for i in range(len(new_data)):
        day = new_data[i]
        old_day = old_schedule[i]
        for j in range(len(day)):
            subj = day[j]
            change = False

            for q in range(len(old_day)):
                try:
                    old_subj = old_day[q][0]
                    if subj == old_subj:
                        new_data[i][j] = [subj, old_day[q][1]]
                        old_schedule[i][q][0] = "---+---"
                        change = True
                        break
                except IndexError:
                    break

            if not change:
                if subj == "":
                    new_data[i][j] = ["", ""]
                else:
                    new_data[i][j] = [subj, "Не задано"]

    db_diary.update_data("Schedule='" + str(new_data).replace("]", "}").replace("[", "{").replace("'", '"') + "'",
                         "Class='" + data["Class"] + "' AND School='" + data["School"] + "' AND Week=" + str(
                             data["Week"]))


@app.get("/get_schedule/{school}/{clazz}/{week}")
def get_schedule(school: str, clazz: str, week: int):
    return {"schedule": db_diary.get_data("Schedule",
                                          "School='" + school + "' AND Class='" + clazz + "' AND Week=" + str(week))}


@app.get("/enter/{surname}/{password}/{school}")
async def enter(response: Response, surname: str, password: str, school: str):
    if db_peoples.contains_data("Surname='" + surname + "' AND Password='" +
                                password + "' AND School='" + school.replace('"', "") + "'"):
        data = db_peoples.get_data("*", "Surname='" + surname + "'")

        response.set_cookie(key="user_data", value=str({"Surname": serialize(data[1]),
                                                        "School": serialize(data[3]),
                                                        "Class": serialize(data[4]),
                                                        "Character": serialize(data[5])}), httponly=False)
        return data[-1]
    return "None"


@app.get("/")
def sign():
    return file("sign_in.html")


@app.get("/{name}")
def file(name: str):
    match name[-1]:
        case "l":
            return FileResponse("templates/" + name)
        case "s":
            return FileResponse("js/" + name)
        case "g":
            return FileResponse("img/" + name)
        case "4":
            return FileResponse("video/" + name)


@app.on_event("startup")
async def run_server():
    db_peoples.connect()
    db_diary.connect()


@app.on_event("shutdown")
def stop_server():
    db_peoples.disconnect()
    db_diary.disconnect()


if __name__ == '__main__':
    run("server:app", host="0.0.0.0", port=49147)
