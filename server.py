from fastapi import FastAPI
from fastapi.responses import FileResponse
from uvicorn import run

from scripts.data_base import DataBase

app = FastAPI()
db = DataBase("peoples", False, ("Surname", "text PRIMARY KEY"), ("Password", "text"),
              ("School", "text"), ("Class", "text"), ("Character", "text"))


@app.get("/{surname}/{password}/{school}")
async def enter(surname: str, password: str, school: str):
    if db.contains_data("Surname='" + surname + "' AND Password='" +
                        password + "' AND School='" + school.replace('"', "") + "'"):
        return db.get_data("Character", "Surname='" + surname + "'")
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


@app.on_event("startup")
async def run_server():
    db.connect()


@app.on_event("shutdown")
def stop_server():
    db.disconnect()


if __name__ == '__main__':
    run("server:app", host="0.0.0.0", port=49147)
