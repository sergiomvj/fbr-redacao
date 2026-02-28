import { unsealData, sealData } from "iron-session";

export const sessionOptions = {
    password: process.env.SESSION_SECRET as string,
    cookieName: "fbr_redacao_session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax" as const,
    },
};

export interface SessionData {
    user_id: string;
    role: string;
    isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
    user_id: "",
    role: "",
    isLoggedIn: false,
};

export async function decryptSession(cookieStr: string): Promise<SessionData> {
    try {
        const unsealed = await unsealData<SessionData>(cookieStr, sessionOptions);
        return unsealed;
    } catch (error) {
        return defaultSession;
    }
}
