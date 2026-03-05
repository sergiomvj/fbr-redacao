import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Carrega as variáveis de ambiente
load_dotenv('backend/.env')

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("ERRO: SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontrados no .env do backend")
    exit(1)

supabase: Client = create_client(url, key)

def create_admin(email, password):
    print(f"Tentando criar usuário: {email}...")
    
    # 1. Cria o usuário no Auth (usando admin API do service_role)
    try:
        user = supabase.auth.admin.create_user({
            "email": email,
            "password": password,
            "email_confirm": True
        })
        
        if not user.user:
            print("Erro ao criar usuário no Auth")
            return

        user_id = user.user.id
        print(f"Usuário criado no Auth com ID: {user_id}")

        # 2. Insere na tabela 'users' (caso o trigger não tenha funcionado ou para garantir)
        # Verificando se já existe para evitar erro de PK
        existing = supabase.table("users").select("*").eq("auth_id", user_id).execute()
        
        if len(existing.data) == 0:
            print("Inserindo dados na tabela 'users'...")
            supabase.table("users").insert({
                "auth_id": user_id,
                "email": email,
                "role": "operator",
                "full_name": "Administrador Inicial"
            }).execute()
            print("Perfil criado na tabela 'users'.")
        else:
            print("Perfil já existia na tabela 'users'.")

        print("\nSUCESSO! Você já pode logar com:")
        print(f"E-mail: {email}")
        print(f"Senha: {password}")

    except Exception as e:
        print(f"Erro inesperado: {str(e)}")

if __name__ == "__main__":
    import sys
    email = "admin@facebrasil.com"
    password = "password123"
    
    if len(sys.argv) > 1:
        email = sys.argv[1]
    if len(sys.argv) > 2:
        password = sys.argv[2]
        
    create_admin(email, password)
