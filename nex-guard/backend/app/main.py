from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.db.database import Base, engine
from app.api.auth import router as auth_router
from app.api.profile import router as profile_router
from app.api.devices import router as devices_router
from app.api.alerts import router as alerts_router
from app.websocket.manager import manager

settings = get_settings()
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(devices_router)
app.include_router(alerts_router)


@app.get("/health")
def health():
    return {"status": "ok", "service": settings.app_name}


@app.websocket("/api/v1/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
