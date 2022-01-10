# http://localhost:49147/
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.responses import FileResponse
from fastapi.templating import Jinja2Templates
from uvicorn import run

app = FastAPI()
templates = Jinja2Templates(directory="templates")


def get_html(html: str, request: Request):
    return templates.TemplateResponse(html, {"request": request})


@app.get("/", response_class=HTMLResponse)
async def sign(request: Request):
    return get_html("sign_in.html", request)


@app.get("/html/{name}", response_class=HTMLResponse)
async def page(request: Request, name: str):
    return get_html(name, request)


@app.get("/img/{name}")
async def get_img(name: str):
    return FileResponse("img/" + name)


def run_server():
    run("server:app", host="0.0.0.0", port=49147)


if __name__ == '__main__':
    run_server()
