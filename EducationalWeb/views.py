from django.http import HttpResponse


async def hello(request):
    return HttpResponse("Hello, world!")
