from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        # Maps roomId -> set of WebSockets
        self.rooms: dict[str, set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        if room_id not in self.rooms:
            self.rooms[room_id] = set()
        self.rooms[room_id].add(websocket)
        await self.broadcast_presence(room_id)

    def disconnect(self, websocket: WebSocket, room_id: str):
        if room_id in self.rooms:
            self.rooms[room_id].discard(websocket)
            if not self.rooms[room_id]:
                del self.rooms[room_id]
        import asyncio
        asyncio.create_task(self.broadcast_presence(room_id))

    async def broadcast_presence(self, room_id: str):
        if room_id in self.rooms:
            users_count = len(self.rooms[room_id])
            message = {"type": "presence", "users": [f"User {i+1}" for i in range(users_count)]}
            for connection in list(self.rooms[room_id]):
                try:
                    await connection.send_json(message)
                except Exception:
                    pass

manager = ConnectionManager()

@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await manager.connect(websocket, room_id)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
