from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .views import APIrequests


@csrf_exempt
def staticBaseCategories(request):
    if request.method == "GET":
        return APIrequests.GET("base_categories")
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


@csrf_exempt
def staticSubCategories(request):
    if request.method == "GET":
        return APIrequests.GET("sub_categories")
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


@csrf_exempt
def staticGenders(request):
    if request.method == "GET":
        return APIrequests.GET("genders")
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


@csrf_exempt
def staticSizes(request):
    if request.method == "GET":
        return APIrequests.GET("sizes")
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


@csrf_exempt
def staticClotheColors(request):
    if request.method == "GET":
        return APIrequests.GET("clothe_colors")
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


@csrf_exempt
def staticClotheStates(request):
    if request.method == "GET":
        return APIrequests.GET("clothe_states")
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


@csrf_exempt
def staticPaymentMethods(request):
    if request.method == "GET":
        return APIrequests.GET("payment_methods")
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)
