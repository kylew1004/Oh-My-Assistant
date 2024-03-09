from fastapi import APIRouter, Depends, HTTPException
from models import crud,schemas
from models.crud import pwd_context
from datetime import timedelta, datetime
from sqlalchemy.orm import Session
from models.database import get_db
from typing import List
from auth.token import create_access_token, verify_access_token, Settings
#from models.crud import get_current_activate_user
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from models import crud
from fastapi import status
from models import models, database
from auth import token
from auth.oauth import get_current_user

settings = Settings()


api_user = APIRouter(prefix="/api/user")
ACCESS_TOKEN_EXPIRE_MINUTES = 60*24

@api_user.get('/me')
def read_user_me(current_user: schemas.User = Depends(get_current_user)):
    return current_user

@api_user.post('/email-check')
def check_email(request: schemas.UserBase , db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, userEmail=request.userEmail)
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return request

# @api_user.post('/login', response_model=schemas.Token)
# def login_for_access_token(from_data: schemas.EmailPasswordRequestForm , db: Session = Depends(get_db)):
#     user = crud.get_user_by_email(db, userEmail=from_data.userEmail)
#     if not user:
#         raise HTTPException(status_code=400, detail="Incorrect username or password")
#     if not pwd_context.verify(from_data.userPassword, user.hashed_password):
#         raise HTTPException(status_code=400, detail="Incorrect username or password")
#     access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     access_token = jwt.create_access_token(data={"sub": user.userEmail},expires_delta=access_token_expires)
#     return schemas.Token(access_token=access_token, token_type="bearer")

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
    access_token = token.create_access_token(data=schemas.TokenData(userEmail=user.userEmail, userId=user.id, userNickname=user.userNickname).dict(),expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "Bearer"}


@api_user.post("/create", response_model=schemas.Token, status_code=200)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, userEmail=user.userEmail)
    if db_user:
        raise HTTPException(status_code=400, detail="Bad Request: Email already registered")
    user = crud.create_user(db=db, user=user)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = token.create_access_token(data={"userEmail": user.userEmail},expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}