"""
Small, dependency-free helpers shared across the authentication app.
"""

from rest_framework.response import Response


def api_response(success: bool, message: str, data=None, status_code=200):
    """
    Build a consistent JSON envelope for every API response in this app.

    {
        "success": true | false,
        "message": "...",
        "data": {...} | null
    }
    """
    return Response(
        {
            "success": success,
            "message": message,
            "data": data,
        },
        status=status_code,
    )


def format_serializer_errors(errors: dict) -> str:
    """
    Flatten DRF serializer.errors into a single human-readable string,
    e.g. "email: This field is required. | password: Too short."

    Field-level detail is still available in `data` for clients that
    want to render per-field errors; this is just for the top-level
    `message`.
    """
    parts = []
    for field, messages in errors.items():
        if isinstance(messages, (list, tuple)):
            joined = " ".join(str(m) for m in messages)
        else:
            joined = str(messages)
        parts.append(f"{field}: {joined}")
    return " | ".join(parts) if parts else "Invalid data."