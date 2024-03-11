from datetime import datetime, timedelta
from fastapi import HTTPException, status
from jose import jwt, JWTError
from pydantic import BaseSettings


class Settings(BaseSettings):
    SECRETE_KEY: str
    class Config:
        env_file = ".env"


settings = Settings()

#토큰 생성
def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=60*24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRETE_KEY, algorithm="HS256")
    return encoded_jwt


#토큰 검증
def verify_access_token(token: str):
    try:
        data = jwt.decode(token, settings.SECRETE_KEY, algorithms=["HS256"])
        expires = data.get("exp")
        if expires is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, 
                                detail="No access token supplied")
        if datetime.utcnow() > datetime.utcfromtimestamp(expires):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                                detail="Token is expired")
        return data
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token")