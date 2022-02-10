# -*- coding: utf-8 -*-

import json

from fastapi import FastAPI, Response, status, HTTPException, Request
from fastapi.responses import FileResponse
from uvicorn import run

from scripts.data_base import DataBase

app = FastAPI()
# cache = {}

db_peoples = DataBase("peoples", False, ("Surname", "text PRIMARY KEY"), ("Password", "text"),
                      ("School", "text"), ("Class", "text"), ("Character", "text"))
db_diary = DataBase("diary", False, ("School", "text"), ("Class", "text"), ("Week", "integer"),
                    ("Schedule", "text[][][]"))


@app.post("/post_schedule")
async def post_schedule(info: Request):
    data = await info.json()
    schedule = db_diary.get_data("Schedule", "School='" + data["School"] + "' AND Class='" + data["Class"]
                                 + "' AND Week=" + str(data["Week"]))
    new_schedule = data["Schedule"]

    if schedule:
        old_schedule = schedule["schedule"]

        for i in range(len(new_schedule)):
            day = new_schedule[i]
            old_day = old_schedule[i]
            for j in range(len(day)):
                subj = day[j]
                change = False

                for q in range(len(old_day)):
                    try:
                        old_subj = old_day[q][0]
                        if subj == old_subj:
                            new_schedule[i][j] = [subj, old_day[q][1]]
                            old_schedule[i][q][0] = "---+---"
                            change = True
                            break
                    except IndexError:
                        break

                if not change:
                    if subj == "":
                        new_schedule[i][j] = ["", ""]
                    else:
                        new_schedule[i][j] = [subj, "Не задано"]

        db_diary.update_data(
            "Schedule='" + str(new_schedule).replace("]", "}").replace("[", "{").replace("'", '"') + "'",
            "Class='" + data["Class"] + "' AND School='" + data["School"] + "' AND Week=" + data["Week"])
    else:
        print("Создаю новое расписание")
        for i in range(len(new_schedule)):
            day = new_schedule[i]
            for j in range(len(day)):
                if new_schedule[i][j] != "":
                    new_schedule[i][j] = [new_schedule[i][j], "Ничего не задано"]
                else:
                    new_schedule[i][j] = ["", ""]
        db_diary.add_data(data["School"], data["Class"], data["Week"],
                          str(new_schedule).replace("]", "}").replace("[", "{").replace("'", '"'))


@app.get("/get_schedule/{school}/{clazz}/{week}")
def get_schedule(school: str, clazz: str, week: str):
    schedule = db_diary.get_data("Schedule", "School='" + school + "' AND Class='" + clazz + "' AND Week=" + week)
    if schedule:
        return {"schedule": schedule[0]}
    print("There's no any schedule!")
    raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="There's no any schedule!")


@app.get("/enter/{surname}/{password}/{school}")
async def enter(response: Response, surname: str, password: str, school: str):
    if db_peoples.contains_data("Surname='" + surname + "' AND Password='" +
                                password + "' AND School='" + school + "'"):
        data = db_peoples.get_data("*", "Surname='" + surname + "'")

        val = json.dumps(data[1] + " " + data[3] + " " + data[4])[1:-1]

        response.set_cookie(key=data[5], value=val, httponly=False)
        return data[5]


@app.get("/")
def sign():
    return file("sign_in.html")


@app.get("/{name}")
def file(name: str):
    cache = {}
    if not cache.get(name):
        match name[-1]:
            case "l":
                cache[name] = FileResponse("templates/" + name)
            case "s":
                cache[name] = FileResponse("js/" + name)
            case "g":
                cache[name] = FileResponse("img/" + name)
            case "4":
                cache[name] = FileResponse("video/" + name)
    return cache[name]


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
