from typing import Optional
from rest_framework.views import exception_handler
from rest_framework.response import Response


def custom_exception_handler(exc, context) -> Optional[Response]:
    response = exception_handler(exc, context)
    if response is not None:
        message = "Validation error."
        data = {}
        if isinstance(response.data, dict) and "detail" in response.data:
            message = str(response.data["detail"])
        elif isinstance(response.data, dict):
            data = response.data
        elif isinstance(response.data, list):
            data = {"errors": response.data}

        response.data = {
            "success": False,
            "message": message,
            "data": data,
        }
    return response