from django.urls import path

from .views import sign, enter

urlpatterns = [
    path('', sign),
    path('enter', enter),
]
