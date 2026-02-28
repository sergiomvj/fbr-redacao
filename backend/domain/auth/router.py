from fastapi import APIRouter, Depends
from domain.auth.schemas import UserProfile
from domain.auth.service import get_current_user_profile

router = APIRouter()

@router.get("/me", response_model=UserProfile)
async def get_my_profile(
    user: UserProfile = Depends(get_current_user_profile)
):
    """
    Returns the current authenticated user's profile information.
    """
    return user
