from typing import Any, Optional
from rest_framework.response import Response


def api_response(success: bool, message: str, data: Optional[Any] = None, status_code: int = 200) -> Response:
    return Response(
        {
            "success": success,
            "message": message,
            "data": data if data is not None else {},
        },
        status=status_code,
    )