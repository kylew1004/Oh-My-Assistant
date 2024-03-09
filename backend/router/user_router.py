from fastapi import APIRouter, Depends, HTTPException
from models import crud,schemas
from models.crud import pwd_context
from datetime import timedelta, datetime
from sqlalchemy.orm import Session
from models.database import get_db
from typing import List
from auth.jwt import create_access_token, verify_access_token
#from models.crud import get_current_activate_user
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from models.crud import pwd_context
from auth.jwt import Settings
from models import crud
from fastapi import status
from models import models, database
from auth import jwt

settings = Settings()


api_user = APIRouter(prefix="/api/user")
ACCESS_TOKEN_EXPIRE_MINUTES = 60*24

@api_user.post('/login', response_model=schemas.Token)
def login_for_access_token(from_data: schemas.EmailPasswordRequestForm , db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, userEmail=from_data.userEmail)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    if not pwd_context.verify(from_data.userPassword, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = jwt.create_access_token(data={"sub": user.userEmail},expires_delta=access_token_expires)
    return schemas.Token(access_token=access_token, token_type="bearer")

# @api_user.post('/login')
# def login(request: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
#     user = db.query(models.User).filter(
#             models.User.userEmail == request.username).first()
#     if not user:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
#                             detail=f"Invalid Credentials")
#     if not pwd_context.verify(request.password, user.hashed_password):
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
#                             detail=f"Incorrect password") 
#     access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     access_token = jwt.create_access_token(data={"sub": user.userEmail},expires_delta=access_token_expires)
#     return {"access_token": access_token, "token_type": "Bearer"}


@api_user.post("/create", response_model=schemas.Token, status_code=200)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, userEmail=user.userEmail)
    if db_user:
        raise HTTPException(status_code=400, detail="Bad Request: Email already registered")
    user = crud.create_user(db=db, user=user)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = jwt.create_access_token(data={"sub": user.userEmail},expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


@api_user.get("/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@api_user.get("/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=400, detail="User not found")
    print("this is the user", db_user)
    return db_user

