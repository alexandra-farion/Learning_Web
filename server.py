# -*- coding: utf-8 -*-

import datetime

from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import ORJSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from psycopg.rows import dict_row
from uvicorn import run

from scripts.postgresgl import *

app = FastAPI(default_response_class=ORJSONResponse)
app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

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

    async with await connect() as connection:
        async with connection.cursor(row_factory=dict_row) as cursor:
            await cursor.execute(f"""SELECT * 
                                    FROM peoples 
                                    WHERE Nickname='{nickname}' AND Password='{password}' AND School='{school}'
                                    """)
            student_data = await cursor.fetchone()
            if student_data:
                student_data["character"] = [student_data["character"], templates.TemplateResponse(
                    student_data["character"] + "_main.html", {"request": request}).body]
                return student_data

    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Incorrect PASSWORD / NAME")


@app.post("/html")
async def html(request: Request):
    return templates.TemplateResponse((await request.json())["html"] + ".html", {"request": request})


@app.post("/get_schedule")
async def get_schedule(request: Request):
    data = await request.json()
    schedule = await get_schedule_from_bd(data["school"], data["class"], data["week"])
    if schedule:
        return schedule[0]
    else:
        return base_schedule


@app.post("/post_schedule")
async def post_schedule(info: Request):
    data = await info.json()
    school = data["school"]
    clazz = data["class"]
    week = data["week"]
    new_schedule = data["schedule"]

    old_schedule = await get_schedule_from_bd(school, clazz, week)

    async with await connect() as connection:
        async with connection.cursor() as cursor:
            if old_schedule:
                await cursor.execute(f"""UPDATE diary
                                        SET schedule = %s
                                        WHERE School='{school}' AND Class='{clazz}' AND Week='{week}'
                                        """, (join_schedules(old_schedule[0], new_schedule),))
            else:
                print("Создаю новое расписание")
                await cursor.execute("""INSERT INTO diary VALUES (%s, %s, %s, %s)""",
                                     (school, clazz, week, join_schedules(base_schedule, new_schedule)))


async def get_schedule_from_bd(school, clazz, week):
    async with await connect() as connection:
        async with connection.cursor() as cursor:
            await cursor.execute(f"""SELECT schedule
                                    FROM diary
                                    WHERE School='{school}' AND Class='{clazz}' AND Week='{week}'
                                    """)
            return await cursor.fetchone()


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

    return old_schedule


@app.post("/get_students")
async def get_students(info: Request):
    data = await info.json()
    school = data["school"]
    clazz = data["class"]
    date = data["date"]
    subject = data["subject"]

    async with await connect() as connection:
        async with connection.cursor() as cursor:
            await cursor.execute(f"""SELECT nickname, name 
                                    FROM peoples
                                    WHERE School='{school}' AND Class='{clazz}' AND Character='student'
                                    """)

            students = await cursor.fetchall()
            marks = []
            theme = ""
            weight = ""

            for student in students:
                student = student[0]
                await cursor.execute(f"""SELECT value
                                        FROM marks
                                        WHERE Date='{date}' AND Nickname='{student}' AND Subject='{subject}'
                                        """)
                mark = await cursor.fetchone()
                if mark:
                    if len(theme) == 0:
                        await cursor.execute(f"""SELECT theme, weight
                                                FROM marks
                                                WHERE Date='{date}' AND Nickname='{student}'
                                                """)
                        theme, weight = await cursor.fetchone()
                    marks.append(mark[0])
                else:
                    marks.append("")

            return {"students": students, "marks": marks, "theme": theme, "weight": weight}


@app.post("/post_marks")
async def post_marks(info: Request):
    data = await info.json()
    date = data["date"]
    theme = data["theme"]
    weight = data["weight"]
    subject = data["subject"]

    async with await connect() as connection:
        async with connection.cursor() as cursor:
            for nickname, mark in data["marks"]:
                condition = f"WHERE Nickname='{nickname}' AND Date='{date}' AND Subject='{subject}'"

                await cursor.execute(f"SELECT EXISTS (SELECT 100 FROM marks {condition})")
                if (await cursor.fetchone())[0]:
                    if mark != 0:
                        await cursor.execute(f"""UPDATE marks 
                                                SET Value={mark}, Theme='{theme}', Weight={weight} 
                                                {condition}
                                                """)
                    else:
                        await cursor.execute(f"DELETE FROM marks {condition}")
                elif mark != 0:
                    await cursor.execute("""INSERT INTO marks
                                            VALUES (%s, %s, %s, %s, %s, %s)""",
                                         (nickname, date, weight, mark, theme, subject))


@app.post("/get_marks")
async def get_marks(info: Request):
    data = await info.json()
    week = data["week"]
    nickname = data["nickname"]

    date = datetime.datetime.strptime(week + '-1', "%Y-W%W-%w")
    marks = []

    async with await connect() as connection:
        async with connection.cursor() as cursor:
            for i in range(7):
                await cursor.execute(f"""SELECT value, weight, theme, subject
                                        FROM marks
                                        WHERE Date='{date.strftime('%Y-%m-%d')}' AND Nickname='{nickname}'
                                        """)
                marks.append(await cursor.fetchall())
                date += datetime.timedelta(days=1)

            return marks


@app.post("/get_mark_report")
async def get_mark_report(info: Request):
    pass
    # data = await info.json()
    # nickname = data["nickname"]
    # # report = db_marks.get_data("Value, Subject", f"Nickname='{nickname}'")
    # dictionary = {}
    # for item in db_marks.get_data("Value, Subject", f"Nickname='{nickname}'"):
    #     subject = item[1]
    #     mark = item[0]
    #     if dictionary.get(subject):
    #         dictionary[subject].append(mark)
    #     else:
    #         dictionary[subject] = [mark]
    # print(dictionary)
    # return dictionary


if __name__ == '__main__':
    run("server:app", host="0.0.0.0", port=49147)
