from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from auth.token import verify_access_token
from models import schemas

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/user/login")


def get_current_user(data: str = Depends(oauth2_scheme)):
    user = verify_access_token(data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

def get_current_active_user(current_user: schemas.User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user