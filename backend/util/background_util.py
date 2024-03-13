from sqlalchemy.orm import Session
from models import models
from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import load_only
import requests
import os
import boto3
import uuid
from datetime import datetime

def get_background_asset_list(webtoon_name: str, db: Session, user_id: int):
    db_background = db.query(models.ContentImg)\
                .join(models.Webtoon, models.ContentImg.webtoonId == models.Webtoon.id)\
                .filter(models.Webtoon.webtoonName == webtoon_name,
                        models.Webtoon.userId == user_id)\
                .all()
    if db_background:
        return db_background
    else:
        raise HTTPException(status_code=400, detail="Bad Request: Webtoon not found")
    
def get_background_asset(webtoon_name: str, asset_name: str, db: Session, user_id: int):
    db_background = db.query(models.BackgroundImg).join(models.ContentImg, models.BackgroundImg.originalImageId == models.ContentImg.originalImageId)\
                .join(models.Webtoon, models.ContentImg.webtoonId == models.Webtoon.id)\
                .filter(models.Webtoon.webtoonName == webtoon_name,
                        models.ContentImg.assetName == asset_name, 
                        models.Webtoon.userId == user_id).all()
    if db_background:
        return db_background
    else:
        raise HTTPException(status_code=400, detail="Bad Request: Asset not found")
    
def delete_background_asset(webtoon_name: str, asset_name: str, db: Session, user_id: int):
    db_content_img = db.query(models.ContentImg).join(models.Webtoon, models.ContentImg.webtoonId == models.Webtoon.id)\
                .filter(models.Webtoon.webtoonName == webtoon_name,
                        models.ContentImg.assetName == asset_name, 
                        models.Webtoon.userId == user_id).first()
    db_background = get_background_asset(webtoon_name, asset_name, db, user_id)
    if db_content_img and db_background:
        for db_backgrounds in db_background:
            db.delete(db_backgrounds)
        db.delete(db_content_img)
        db.commit()
        return {"detail": "Asset deleted successfully"}
    else:
        raise HTTPException(status_code=400, detail="Bad Request: Asset not found")
    # if db_background:
    #     db.delete(db_background)
    #     db.commit()
    #     return {"detail": "Asset deleted successfully"}
    # else:
    #     raise HTTPException(status_code=400, detail="Bad Request: Asset not found")