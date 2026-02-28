import { NextRequest, NextResponse } from "next/server";
import { sealData } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // In a real environment, this makes an HTTP call to the Python FastAPI backend
        // `POST /auth/login` and receives the true `user_id` and `role`

        // Mock backend response for MVP/scaffolding
        if (body.email && body.password) {
            const mockSessionData: SessionData = {
                user_id: "mock_uuid_12345",
                role: "operator",
                isLoggedIn: true
            };

            const encryptedSession = await sealData(mockSessionData, sessionOptions);

            const response = NextResponse.json({ success: true, message: "Login realizado com sucesso." });

            response.cookies.set(sessionOptions.cookieName, encryptedSession, sessionOptions.cookieOptions);

            return response;
        }

        return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
    } catch (err) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
