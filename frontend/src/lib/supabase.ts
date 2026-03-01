/**
 * Supabase client — SERVER SIDE ONLY.
 *
 * Regra de segurança FBR:
 * - O frontend NUNCA se comunica diretamente com o Supabase.
 * - Todo request passa pelo proxy autenticado em /api/proxy/[...path].
 * - Este client usa variáveis SEM prefixo NEXT_PUBLIC_ para não vazar ao browser.
 *
 * Use este arquivo apenas em Server Components, Route Handlers e Middleware.
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        "SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórios nas variáveis de ambiente do servidor."
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
