# -*- coding: utf-8 -*-

import datetime

from fastapi import FastAPI, Request, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import ORJSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from uvicorn import run

from scripts.data_base import DataBase

app = FastAPI(default_response_class=ORJSONResponse)
app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")
db_peoples = DataBase("peoples", False, ("Nickname", "text PRIMARY KEY"), ("Name", "text"),
                      ("Password", "text"), ("School", "text"), ("Character", "text"), ("Class", "text"),
                      ("Subject", "text"))

db_diary = DataBase("diary", False, ("School", "text"), ("Class", "text"), ("Week", "integer"),
                    ("Schedule", "text[][][]"))

db_marks = DataBase("marks", False, ("Nickname", "text"), ("Date", "text"),
                    ("Weight", "integer"), ("Value", "integer"), ("Theme", "text"), ("Subject", "text"))

base_schedule = [[["", ""] for i in range(8)] for j in range(6)]


@app.get('/')
async def sign(request: Request):
    return templates.TemplateResponse("sign_in.html", {"request": request})


@app.get('/diary')
async def sign(request: Request):
    return templates.TemplateResponse("main_diary.html", {"request": request})


@app.post("/enter")
async def enter(request: Request):
    data = await request.json()
    nickname = data["nickname"]
    password = data["password"]
    school = data["school"]

    if db_peoples.contains_data(f"Nickname='{nickname}' AND Password='{password}' AND School='{school}'"):
        data = db_peoples.get_data("*", f"Nickname='{nickname}'")[0]

        return ORJSONResponse(content=jsonable_encoder({
            "role": [data[5], templates.TemplateResponse(data[5] + "_main.html", {"request": request}).body],
            "nickname": data[1],
            "name": data[2],
            "school": data[4],
            "class": data[6],
            "subject": data[7]
        }))
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Incorrect PASSWORD / NAME")


@app.post("/html")
async def html(request: Request):
    data = await request.json()
    return templates.TemplateResponse(data["html"] + ".html", {"request": request})


@app.post("/get_schedule")
async def get_schedule(request: Request):
    data = await request.json()
    schedule = get_schedule_from_bd(data["school"], data["class"], data["week"])
    if schedule:
        schedule = schedule[0]
    else:
        schedule = base_schedule
    return {"schedule": schedule}


@app.post("/post_schedule")
async def post_schedule(info: Request):
    data = await info.json()
    school = data["school"]
    clazz = data["class"]
    week = data["week"]
    new_schedule = data["schedule"]

    old_schedule = get_schedule_from_bd(school, clazz, week)

    if old_schedule:
        db_diary.update_data(f"Schedule='{join_schedules(old_schedule[0], new_schedule)}'",
                             f"School='{school}' AND Class='{clazz}' AND Week='{week}'")
    else:
        print("Создаю новое расписание")
        db_diary.add_data(school, clazz, week, join_schedules(base_schedule, new_schedule))


def get_schedule_from_bd(school, clazz, week):
    return db_diary.get_data("Schedule", f"School='{school}' AND Class='{clazz}' AND Week='{week}'")[0]


def join_schedules(old_schedule, new_schedule):
    for i in range(len(old_schedule)):
        day = old_schedule[i]

        for j in range(len(day)):
            new_subj = new_schedule[i][j]

            if day[j][0] != new_subj:
                arr = [new_subj, "Не задано"]
                if not new_subj:
                    arr = ["", ""]
                old_schedule[i][j] = arr

    return str(old_schedule).replace("]", "}").replace("[", "{").replace("'", '"')


@app.post("/get_students")
async def get_students(info: Request):
    data = await info.json()
    school = data["school"]
    clazz = data["class"]
    date = data["date"]
    subject = data["subject"]

    students = db_peoples.get_data("Nickname, Name", f"School='{school}' AND Class='{clazz}' AND Character='student'")

    if students[0]:
        marks = []
        theme = ""
        weight = ""

        for student in students:
            student = student[0]
            mark = db_marks.get_data("Value", f"Date='{date}' AND Nickname='{student}' AND Subject='{subject}'")[0]
            if mark:
                if len(theme) == 0:
                    theme, weight = db_marks.get_data("Theme, Weight", f"Date='{date}' AND Nickname='{student}'")[0]
                marks.append(mark[0])
            else:
                marks.append("")

        return {"students": students, "marks": marks, "theme": theme, "weight": weight}
    return {"students": []}


@app.post("/post_marks")
async def post_marks(info: Request):
    data = await info.json()
    date = data["date"]
    theme = data["theme"]
    weight = data["weight"]
    subject = data["subject"]

    for nickname, mark in data["marks"]:
        condition = f"Nickname='{nickname}' AND Date='{date}' AND Subject='{subject}'"
        if db_marks.contains_data(condition):
            if mark != 0:
                db_marks.update_data(f"Value={mark}, Theme='{theme}', Weight={weight}", condition)
            else:
                db_marks.delete_data(condition)
        elif mark != 0:
            db_marks.add_data(nickname, date, weight, mark, theme, subject)


@app.post("/get_marks")
async def get_marks(info: Request):
    data = await info.json()
    week = data["week"]
    nickname = data["nickname"]

    date = datetime.datetime.strptime(week + '-1', "%Y-W%W-%w")
    marks = []

    for i in range(7):
        data = db_marks.get_data("Value, Weight, Theme, Subject",
                                 f"Date='{date.strftime('%Y-%m-%d')}' AND Nickname='{nickname}'")
        if not data[0]:
            data = []
        marks.append(data)
        date += datetime.timedelta(days=1)

    return {"marks": marks}


@app.on_event("startup")
def run_server():
    db_peoples.connect()
    db_diary.connect()
    db_marks.connect()


@app.on_event("shutdown")
def stop_server():
    db_peoples.disconnect()
    db_diary.disconnect()
    db_marks.disconnect()


if __name__ == '__main__':
    run("server:app", host="0.0.0.0", port=49147)
