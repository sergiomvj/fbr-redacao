import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function middleware(request: NextRequest) {
    // This file acts as a universal proxy from Next.js Client -> FastAPI Backend
    // It automatically attaches the X-User-Id header if the user has a valid Iron Session

    // Extract the path after /api/proxy/
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/proxy/', '/');
    const backendUrl = `${BACKEND_URL}/api/v1${path}${url.search}`;

    // Explicitly ignore /auth routes here as they have their own specific route handlers
    if (path.startsWith('/auth/')) {
        return NextResponse.next();
    }

    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    if (!session.isLoggedIn || !session.user_id) {
        return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    try {
        const fetchOptions: RequestInit = {
            method: request.method,
            headers: {
                "Content-Type": request.headers.get("Content-Type") || "application/json",
                "X-User-Id": session.user_id, // Vital for FastAPI security dependency
                "Authorization": `Bearer ${process.env.INTERNAL_API_KEY}` // Optional if backend requires Service Key
            },
        };

        if (request.method !== 'GET' && request.method !== 'HEAD') {
            const body = await request.text();
            if (body) fetchOptions.body = body;
        }

        const backendResponse = await fetch(backendUrl, fetchOptions);

        const data = await backendResponse.text();

        return new NextResponse(data, {
            status: backendResponse.status,
            headers: {
                "Content-Type": backendResponse.headers.get("Content-Type") || "application/json"
            }
        });
    } catch (error) {
        console.error("Proxy Forwarding Error:", error);
        return NextResponse.json({ error: "Erro interno no proxy." }, { status: 500 });
    }
}

export const GET = middleware;
export const POST = middleware;
export const PUT = middleware;
export const PATCH = middleware;
export const DELETE = middleware;
