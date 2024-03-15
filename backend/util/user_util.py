from sqlalchemy.orm import Session
from models import models
from schemas import user_schemas
from passlib.context import CryptContext
from fastapi import HTTPException
from datetime import timedelta
from auth import token

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ACCESS_TOKEN_EXPIRE_MINUTES = 60*24

def get_user(user: user_schemas.User):
    if user:
        result = {
            "userEmail": user["userEmail"],
            "userNickname": user["userNickname"]
        }
        return result
    else:
        raise HTTPException(status_code=404, detail="User not found")

def get_user_by_email(db: Session, userEmail: str):
    db_user = db.query(models.User).filter(models.User.userEmail == userEmail).first()
    if db_user:
        raise HTTPException(status_code=404, detail="Email already registered")
    else:
        return {"detail": "Email is available"}

def create_user(db: Session, user: user_schemas.UserCreate):
    if db.query(models.User).filter(models.User.userEmail == user.userEmail).first():
        raise HTTPException(status_code=404, detail="Email already registered")
    db_user = models.User(userEmail=user.userEmail, 
                          hashed_password=pwd_context.hash(user.userPw), 
                          userNickname=user.userNickname)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Failed to create user")
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = token.create_access_token(data=user_schemas.TokenData(userEmail=db_user.userEmail,
                                                                          userId=db_user.id, 
                                                                          userNickname=db_user.userNickname).dict(), 
                                                                          expires_delta=access_token_expires
                                                                          )
    return {"access_token": access_token, "token_type": "bearer"}

def delete_user(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return user

def login(request, db: Session):
    user = db.query(models.User)\
                .filter(models.User.userEmail == request.username)\
                .first()
    if not user:
        raise HTTPException(status_code=404,
                            detail="Invalid Credentials")
    if not pwd_context.verify(request.password, user.hashed_password):
        raise HTTPException(status_code=404,
                            detail="Incorrect password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = token.create_access_token(data=user_schemas.TokenData(userEmail=user.userEmail,
                                                                          userId=user.id, 
                                                                          userNickname=user.userNickname).dict(), 
                                                                          expires_delta=access_token_expires
                                                                          )
    return {"access_token": access_token, "token_type": "Bearer"}