# -*- coding: utf-8 -*-

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
db_peoples = DataBase("peoples", False, ("Surname", "text PRIMARY KEY"), ("Password", "text"),
                      ("School", "text"), ("Class", "text"), ("Character", "text"))
db_diary = DataBase("diary", False, ("School", "text"), ("Class", "text"), ("Week", "integer"),
                    ("Schedule", "text[][][]"))
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
    surname = data["surname"]
    password = data["password"]
    school = data["school"]

    if db_peoples.contains_data("Surname='" + surname + "' AND Password='" +
                                password + "' AND School='" + school + "'"):
        data = db_peoples.get_data("*", "Surname='" + surname + "'")

        return ORJSONResponse(content=jsonable_encoder({
            "role": [data[5], templates.TemplateResponse(data[5] + "_main.html", {"request": request}).body],
            "surname": data[1],
            "school": data[3],
            "class": data[4]
        }, ))
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
        db_diary.update_data(
            "Schedule='" + join_schedules(old_schedule[0], new_schedule) + "'",
            "Class='" + clazz + "' AND School='" + school + "' AND Week='" + week + "'")
    else:
        print("Создаю новое расписание")
        db_diary.add_data(school, clazz, int(week), join_schedules(base_schedule, new_schedule))


def get_schedule_from_bd(school, clazz, week):
    return db_diary.get_data("Schedule", "School='" + school + "' AND Class='" + clazz + "' AND Week=" + week)


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
