from fastapi import APIRouter, Depends, HTTPException
from schemas import user_schemas
from util.user_util import pwd_context
from datetime import timedelta
from sqlalchemy.orm import Session
from models.database import get_db
from auth.token import Settings
from fastapi.security import OAuth2PasswordRequestForm
from util import user_util
from fastapi import status
from models import models, database
from auth import token
from auth.oauth import get_current_user


settings = Settings()


api_user = APIRouter(prefix="/api/user")
ACCESS_TOKEN_EXPIRE_MINUTES = 60*24

@api_user.get('/me')
def read_user_me(current_user: user_schemas.User = Depends(get_current_user)):
    return current_user

@api_user.post('/email-check')
def check_email(request: user_schemas.UserBase , db: Session = Depends(get_db)):
    user = user_util.get_user_by_email(db, userEmail=request.userEmail)
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return request

@api_user.post('/login')
def login(request: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(
            models.User.userEmail == request.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Invalid Credentials")
    if not pwd_context.verify(request.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Incorrect password") 
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = token.create_access_token(data=user_schemas.TokenData(userEmail=user.userEmail, userId=user.id, userNickname=user.userNickname).dict(),expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "Bearer"}


@api_user.post("/create", response_model=user_schemas.Token, status_code=200)
def create_user(user: user_schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = user_util.get_user_by_email(db, userEmail=user.userEmail)
    if db_user:
        raise HTTPException(status_code=400, detail="Bad Request: Email already registered")
    user = user_util.create_user(db=db, user=user)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = token.create_access_token(data={"userEmail": user.userEmail},expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}