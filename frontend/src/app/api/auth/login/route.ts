import { NextRequest, NextResponse } from "next/server";
import { sealData } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.email || !body.password) {
            return NextResponse.json({ error: "E-mail e senha são obrigatórios." }, { status: 400 });
        }

        // 1. Authenticate with Supabase
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: body.email,
            password: body.password,
        });

        if (authError || !authData.user) {
            return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
        }

        // 2. Fetch role and plan from the public 'users' table (since auth is approved)
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role, plan')
            .eq('auth_id', authData.user.id)
            .single();

        if (userError || !userData) {
            // Unlink/signOut the session to prevent orphaned state
            await supabase.auth.signOut();
            return NextResponse.json({ error: "Perfil não encontrado no sistema corporativo." }, { status: 403 });
        }

        // 3. Seal Session Data via Iron-Session 
        // Following PRD Rule: "Frontend NUNCA se comunica diretamente com o backend — todo request passa pelo proxy"
        const sessionData: SessionData = {
            user_id: authData.user.id,
            role: userData.role,
            isLoggedIn: true
        };

        const encryptedSession = await sealData(sessionData, sessionOptions);

        const response = NextResponse.json({ success: true, message: "Login realizado com sucesso." });

        // 4. Set the HTTP-Only cookie with the Iron Session format
        response.cookies.set(sessionOptions.cookieName, encryptedSession, sessionOptions.cookieOptions);

        return response;

    } catch (err) {
        console.error("Login Proxy Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
