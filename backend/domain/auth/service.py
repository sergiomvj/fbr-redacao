from fastapi import Depends
import uuid
from core.database import get_supabase_service_auth
from core.security import get_current_user_id
from core.exceptions import ResourceNotFoundError, DatabaseOperationError
from domain.auth.schemas import UserProfile
import logging

logger = logging.getLogger(__name__)

async def get_current_user_profile(user_id: uuid.UUID = Depends(get_current_user_id)) -> UserProfile:
    """
    Dependency that loads the active UserProfile straight from the DB.
    Ensures that the operator or user exists and is not soft-deleted.
    """
    client = get_supabase_service_auth()
    
    try:
        response = client.table("users").select("id, email, role, plan, region_id").eq("auth_id", str(user_id)).is_("deleted_at", "null").single().execute()
        
        if not response.data:
            raise ResourceNotFoundError(detail="Usuário não encontrado ou desativado no sistema")
            
        data = response.data
        return UserProfile(
            user_id=uuid.UUID(data["id"]),
            email=data["email"],
            role=data["role"],
            plan=data["plan"],
            region_id=uuid.UUID(data["region_id"]) if data.get("region_id") else None
        )
            
    except ResourceNotFoundError:
        raise
    except Exception as e:
        logger.error(f"Error fetching user profile for {user_id}: {str(e)}")
        raise DatabaseOperationError(detail="Erro ao carregar perfil do usuário")

def require_operator(user: UserProfile = Depends(get_current_user_profile)) -> UserProfile:
    """Dependency to restrict route access strictly to Operators."""
    from core.exceptions import PermissionDeniedError
    if user.role != "operator":
        raise PermissionDeniedError(detail="Acesso restrito apenas a operadores")
    return user
