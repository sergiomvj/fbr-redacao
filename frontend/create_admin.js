const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Carrega as variáveis do .env.local do frontend
dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Nota: Para criar usuários confirmados sem e-mail, precisa da SERVICE_ROLE_KEY.
// Se ela não estiver no .env.local, vou pedir para o usuário conferir.

if (!supabaseUrl) {
    console.error("ERRO: SUPABASE_URL não encontrada no .env.local");
    process.exit(1);
}

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
    console.error("ERRO: SUPABASE_SERVICE_ROLE_KEY não encontrada no .env.local");
    console.log("DICA: Copie a SERVICE_ROLE_KEY do painel do Supabase para o seu .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function createAdmin(email, password) {
    console.log(`Tentando criar usuário: ${email}...`);

    try {
        // 1. Cria o usuário no Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true
        });

        if (authError) {
            console.error("Erro ao criar usuário no Auth:", authError.message);
            return;
        }

        const userId = authData.user.id;
        console.log(`Usuário criado no Auth com ID: ${userId}`);

        // 2. Insere na tabela 'users'
        const { data: userData, error: userError } = await supabase
            .from('users')
            .upsert({
                auth_id: userId,
                email: email,
                role: 'operator',
                full_name: 'Administrador Inicial'
            })
            .select();

        if (userError) {
            console.error("Erro ao inserir na tabela 'users':", userError.message);
        } else {
            console.log("Perfil criado/atualizado na tabela 'users'.");
        }

        console.log("\nSUCESSO! Você já pode logar com:");
        print(`E-mail: ${email}`);
        print(`Senha: ${password}`);

    } catch (err) {
        console.error("Erro inesperado:", err.message);
    }
}

function print(msg) { console.log(msg); }

const args = process.argv.slice(2);
const email = args[0] || "admin@facebrasil.com";
const password = args[1] || "password123";

createAdmin(email, password);
