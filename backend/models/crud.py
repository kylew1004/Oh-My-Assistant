from sqlalchemy.orm import Session

import shutil
from . import models, schemas


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


def postImage(db: Session, image: schemas.Image):
    image_path = f"/images/{image.filename}"
    copied_image_path = "/images/" + "copied_" + f"{image.filename}"
    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
        shutil.copyfile(image_path, copied_image_path)
    db_image = models.Image(image_path=image_path)
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    db_image = models.Image(image_path=copied_image_path)
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image


def getImage(db: Session):
    image = db.query(models.Image).order_by(models.Image.id.desc()).first()
    print("asdfasdfasdfa", image)
    return image