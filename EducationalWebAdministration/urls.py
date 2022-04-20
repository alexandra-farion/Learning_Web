from django.urls import path, include

SITE_PACKAGE = "EducationalTest"

urlpatterns = [
    path('', include(SITE_PACKAGE + ".urls")),
]
