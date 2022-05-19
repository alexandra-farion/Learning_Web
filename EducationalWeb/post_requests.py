import orjson
from django.http import HttpRequest, JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from EducationalWeb.models import Students, Peoples, Teachers
from .shortcuts import get_template


@csrf_exempt
def enter(request: HttpRequest):
    people_data: dict = orjson.loads(request.body)
    nickname: str = people_data["nickname"]
    password: str = people_data["password"]
    school: str = people_data["school"]
    character: str = "student"

    if get_object_or_404(Peoples, nickname=nickname, password=password, school=school).is_student:
        student = Students.objects.get(nickname=nickname)
        people_data |= {"class": student.clazz, "grouping": student.grouping}
    else:
        teacher = Teachers.objects.get(nickname=nickname)
        character = teacher.character
        people_data["fixed_classes"] = teacher.fixed_classes

    people_data["character"] = [character, get_template(character + "_main.html")]

    return JsonResponse(people_data)
