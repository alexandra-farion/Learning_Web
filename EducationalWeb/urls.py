from django.urls import path

from .post_requests import enter
from .views import sign, diary

urlpatterns = [
    path('', sign),
    path('enter', enter),
    path('diary', diary),
]
