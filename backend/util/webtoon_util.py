from sqlalchemy.orm import Session
from models import models
from schemas import webtoon_schemas, user_schemas
from datetime import datetime


def get_webtoon_by_webtoon_name_and_userId(db: Session, webtoon_name: str, user_id: int):
    return db.query(models.Webtoon).filter(models.Webtoon.webtoonName == webtoon_name,
                                           models.Webtoon.userId == user_id
                                           ).first()

def get_webtoon_list_by_user_id(db: Session, userId: int):
    return db.query(models.Webtoon).filter(models.Webtoon.userId == userId).all()

def create_webtoon(db: Session, webtoon: webtoon_schemas.WebtoonCreate, user: user_schemas.TokenData):
    db_webtoon = models.Webtoon(webtoonName=webtoon.webtoonName,
                                userId=user['userId'],
                                createdAt=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                                )
    db.add(db_webtoon)
    db.commit()
    db.refresh(db_webtoon)
    return db_webtoon