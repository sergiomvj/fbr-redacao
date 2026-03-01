"use client";

import { useState, useEffect } from 'react';

export function usePresence(roomId: string) {
    const [activeUsers, setActiveUsers] = useState<string[]>([]);

    useEffect(() => {
        // Connect to the FastAPI WebSocket endpoint
        // Assuming the backend is running on ws://localhost:8000
        const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://127.0.0.1:8000";
        const ws = new WebSocket(`${wsUrl}/ws/${roomId}`);

        ws.onopen = () => {
            console.log(`Connected to presence room ${roomId}`);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === "presence") {
                    setActiveUsers(data.users);
                }
            } catch (e) {
                console.error("Invalid WS message", e);
            }
        };

        ws.onclose = () => {
            console.log(`Disconnected from presence room ${roomId}`);
        };

        return () => {
            ws.close();
        };
    }, [roomId]);

    return { activeUsers };
}
