import logging

from django.http import HttpRequest
from django.shortcuts import render

logger = logging.getLogger("django")


def sign(request: HttpRequest):
    return render(request, "sign_in.html")


def diary(request: HttpRequest):
    return render(request, "main_diary.html")
