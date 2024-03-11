from sqlalchemy.orm import Session
from models import models, schemas
from datetime import datetime
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, userEmail: str):
    return db.query(models.User).filter(models.User.userEmail == userEmail).first()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(userEmail=user.userEmail, 
                          hashed_password=pwd_context.hash(user.userPw), 
                          userNickname=user.userNickname)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        return None
    db.delete(user)
    db.commit()
    return user
