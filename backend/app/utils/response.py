from app.core.responses import APIResponse


def success_response(data=None, message: str = "OK", meta: dict | None = None) -> APIResponse:
    return APIResponse(success=True, message=message, data=data, meta=meta)
