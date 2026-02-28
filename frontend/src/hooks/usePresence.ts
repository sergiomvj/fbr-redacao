"use client";

import { useState, useEffect } from 'react';

// Placeholder hook for WebSocket presence
export function usePresence(roomId: string) {
    const [activeUsers, setActiveUsers] = useState<string[]>([]);

    useEffect(() => {
        // In a real implementation, this would connect to the FastAPI WebSocket
        // and join the specific 'roomId' (e.g., 'mural-producao')

        // Mock data
        setActiveUsers(['Operador Local', 'Editor Chefe']);

        return () => {
            // Disconnect logic
        };
    }, [roomId]);

    return { activeUsers };
}
