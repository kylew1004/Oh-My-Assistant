from sqlalchemy.orm import Session
import os
import boto3
import uuid
from fastapi import UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List
import requests
from datetime import datetime
from models import models
from sqlalchemy.orm import Session, load_only


s3 = boto3.client(
    's3',
    aws_access_key_id=os.environ.get("AWS_S3_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("AWS_S3_SECRET_ACCESS_KEY"),
    region_name=os.environ.get("AWS_S3_REGION")
)


def background_train(webtoon_name: str, db: Session, userId: int, images: List[UploadFile] = File(...)):
    if db.query(models.User).filter(models.User.id == userId).first() is None:
        raise HTTPException(status_code=404, detail="User not found")

    files = []
    for file in images:
        file_content = file.file.read()
        files.append(('style_images', (file.filename, file_content, file.content_type)))

    response = requests.post(f"{os.environ.get('BACKGROUND_MODEL_SERVER')}/api/model/background/train", files=files)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to train style model")
    else:
        model_path = response.json()['result']
        webtoon_id = db.query(models.Webtoon).join(models.User).filter(models.User.id == userId, 
                                                    models.Webtoon.webtoonName == webtoon_name).first().id
        db_model = models.Model(webtoonId=webtoon_id, modelPath=model_path)
        if db_model is None:
            raise HTTPException(status_code=500, detail="Failed to save model path")
        else:
            db.add(db_model)
            db.commit()
            db.refresh(db_model)
            return {"result": "model has been trained successfully"}


def background_inference(webtoon_name: str, file: UploadFile, db: Session, userId: int):
    if db.query(models.User).filter(models.User.id == userId).first() is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    file_name = file.filename
    file_content = file.file.read()
    file_content_type = file.content_type
    webtoon_id = db.query(models.Webtoon).filter(models.Webtoon.userId == userId, 
                                                models.Webtoon.webtoonName == webtoon_name).first().id
    if webtoon_id is None:
        raise HTTPException(status_code=404, detail="Webtoon not found")
    
    model_path = db.query(models.Model).filter(models.Model.webtoonId == webtoon_id).first().modelPath
    if model_path is None:
        raise HTTPException(status_code=404, detail="Model not found")
    files = {'content_image': (file_name, file_content, file_content_type)}
    response = requests.post(f"{os.environ.get('BACKGROUND_MODEL_SERVER')}/api/model/background/inference/{model_path}", files=files)
    
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to inference style model")
    else:
        return response.json()


def background_save(webtoonName: str, assetName: str, description: str, db: Session, user_id: int,
                    original_image: UploadFile = File(...), generated_images: List[UploadFile] = File(...)):
    
    if db.query(models.ContentImg).join(models.Webtoon, models.ContentImg.webtoonId == models.Webtoon.id)\
        .filter(models.Webtoon.webtoonName == webtoonName, models.ContentImg.assetName == assetName,
                models.Webtoon.userId == user_id).first():

        raise HTTPException(status_code=400, detail="Bad Request: Asset already exists")
    
    webtoonId = db.query(models.Webtoon).filter(models.Webtoon.webtoonName == webtoonName,
                                                models.Webtoon.userId == user_id).first().id
    
    if webtoonId is None:
        raise HTTPException(status_code=404, detail="Webtoon not found")

    original_image_name = f"{uuid.uuid4()}__{original_image.filename}"
    s3.upload_fileobj(original_image.file, Bucket=os.environ.get("AWS_S3_BUCKET"), Key=f"original/{original_image_name}")
    original_image_path = f"https://{os.environ.get('AWS_S3_BUCKET')}.s3.{os.environ.get('AWS_S3_REGION')}.amazonaws.com/original/{original_image_name}"
    
    db_content = models.ContentImg(webtoonId=webtoonId, createdAt=datetime.now().strftime("%Y-%m-%d %H:%M:%S"), 
                                   originalImageUrl=original_image_path, assetName=assetName, 
                                   description=description)
    db.add(db_content)
    db.commit()
    db.refresh(db_content)
    
    original_image_id = db.query(models.ContentImg).filter(models.ContentImg.assetName == assetName).first().originalImageId
    
    for image in generated_images:
        image_name = f"{uuid.uuid4()}__{image.filename}"
        s3.upload_fileobj(image.file, Bucket=os.environ.get("AWS_S3_BUCKET"), Key=f"background/{image_name}")
        image_path = f"https://{os.environ.get('AWS_S3_BUCKET')}.s3.{os.environ.get('AWS_S3_REGION')}.amazonaws.com/background/{image_name}"
        db_background = models.BackgroundImg(originalImageId=original_image_id, backgroundImgUrl=image_path)
        db.add(db_background)
        db.commit()
        db.refresh(db_background)
    
    return {"result": "Background images have been saved successfully"}


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
                        models.Webtoon.userId == user_id).first()
    if db_background:
        result = {"assetName": asset_name, "backgroundImageUrl": db_background.backgroundImgUrl}
        return result
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