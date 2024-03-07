from sqlalchemy.orm import Session

import shutil
from . import models, schemas
import os
import boto3
import uuid
from fastapi import UploadFile


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(email=user.email, hashed_password=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_items(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Item).offset(skip).limit(limit).all()


def create_user_item(db: Session, item: schemas.ItemCreate, user_id: int):
    db_item = models.Item(**item.dict(), owner_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


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