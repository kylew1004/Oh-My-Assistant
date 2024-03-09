from sqlalchemy.orm import Session

import shutil
from . import models, schemas
import os
import boto3
import uuid
from jose import jwt, JWTError
from fastapi import UploadFile
from datetime import datetime
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from auth.token import Settings
from auth.oauth import get_current_user
from models.database import get_db


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
settings = Settings()

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, userEmail: str):
    return db.query(models.User).filter(models.User.userEmail == userEmail).first()

def get_webtoon_by_webtoon_name(db: Session, webtoon_name: str):
    return db.query(models.Webtoon).filter(models.Webtoon.webtoonName == webtoon_name).first()

def get_webtoon_list_by_user_id(db: Session, userId: int):
    return db.query(models.Webtoon).filter(models.Webtoon.userId == userId).all()

def create_webtoon(db: Session, webtoon: schemas.WebtoonCreate, user: schemas.TokenData):
    db_webtoon = models.Webtoon(webtoonName=webtoon.webtoonName,
                                userId=user['userId'],
                                createdAt=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                                )
    db.add(db_webtoon)
    db.commit()
    db.refresh(db_webtoon)
    return db_webtoon


def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(userEmail=user.userEmail, 
                          hashed_password=pwd_context.hash(user.userPw), 
                          userNickname=user.userNickname)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def postImage(file: UploadFile, db: Session):
    s3 = boto3.client(
        's3',
        aws_access_key_id=os.environ.get("AWS_S3_ACCESS_KEY_ID"),
        aws_secret_access_key=os.environ.get("AWS_S3_SECRET_ACCESS_KEY"),
        region_name=os.environ.get("AWS_S3_REGION")
    )
    file_name = f"{uuid.uuid4()}__{file.filename}"

    s3.upload_fileobj(file.file, Bucket=os.environ.get("AWS_S3_BUCKET"), Key=file_name)
    file_path = f"https://{os.environ.get('AWS_S3_BUCKET')}.s3.{os.environ.get('AWS_S3_REGION')}.amazonaws.com/{file_name}"
    

    db_image = models.Image(image_path=file_path)
    db.add(db_image)
    db.commit()
    db.refresh(db_image)

    return db_image


def getImage(db: Session):
    image = db.query(models.Image).order_by(models.Image.id.desc()).first()
    print("asdfasdfasdfa", image)
    return image

def delete_user(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        return None
    db.delete(user)
    db.commit()
    return user
