import logging

import orjson
from django.http import HttpRequest
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

logger = logging.getLogger("django")


def sign(request: HttpRequest):
    return render(request, "sign_in.html", {})


@csrf_exempt
def enter(request: HttpRequest):
    data: dict = orjson.loads(request.body)
    nickname: str = data["nickname"]
    password: str = data["password"]
    school: str = data["school"]

    return render(request, "sign_in.html", {})
