from sqlalchemy.orm import Session
import os
import boto3
import uuid
from fastapi import UploadFile, File, HTTPException, Form, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
import requests
from datetime import datetime
from models import models
from sqlalchemy.orm import Session, load_only
import aiohttp
import asyncio

s3 = boto3.client(
    's3',
    aws_access_key_id=os.environ.get("AWS_S3_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("AWS_S3_SECRET_ACCESS_KEY"),
    region_name=os.environ.get("AWS_S3_REGION")
)

async def send_request(url, files):
    data = aiohttp.FormData()
    timeout = aiohttp.ClientTimeout(total=1200)

    for file in files:
        data.add_field('style_images', file[1][1], filename=file[1][0], content_type=file[1][2])

    async with aiohttp.ClientSession(timeout=timeout) as session:
        async with session.post(url, data=data) as response:
            return await response.json()


async def background_train(webtoon_name: str, db: Session, userId: int, images: List[UploadFile] = File(...)):
    if db.query(models.User).filter(models.User.id == userId).first() is None:
        raise HTTPException(status_code=404, detail="User not found")
    files = []
    for file in images:
        file_content = file.file.read()
        files.append(('style_images', (file.filename, file_content, file.content_type)))

    dreamstyler_url =f"{os.environ.get('DREAMSTYLER_MODEL_SERVER')}/api/model/background/train"   
    lora_url = f"{os.environ.get('LORA_MODEL_SERVER')}/api/model/background/train"
    tasks = [
        send_request(lora_url, files),
        send_request(dreamstyler_url, files)
    ]

    responses = await asyncio.gather(*tasks)
    result_lora = responses[0]['result']
    result_dreamstyler = responses[1]['result']
    model_path_lora = responses[0]['model_path']
    model_path_dreamstyler = responses[1]['model_path']

    if not result_lora or not result_dreamstyler:
        raise HTTPException(status_code=500, detail="Failed to train style model")
    
    webtoon_id = db.query(models.Webtoon).join(models.User).filter(models.User.id == userId, 
                                                models.Webtoon.webtoonName == webtoon_name).first().id
    db_model_lora = models.Model(webtoonId=webtoon_id, modelPath=model_path_lora, modelType="LORA")
    db_model_dreamstyler = models.Model(webtoonId=webtoon_id, modelPath=model_path_dreamstyler, modelType="DREAMSTYLER")

    if db_model_lora is None or db_model_dreamstyler is None:
        raise HTTPException(status_code=500, detail="Failed to save model path")
    else:
        try:
            db.add(db_model_lora)
            db.add(db_model_dreamstyler)
            db.commit()
            db.refresh(db_model_lora)
            db.refresh(db_model_dreamstyler)
            return {"result": "model has been trained successfully"}
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail="Internal Server Error")

def background_img2img(webtoon_name: str, model_type: str, file: UploadFile, db: Session, userId: int, prompt: str):
    if db.query(models.User).filter(models.User.id == userId).first() is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    file_name = file.filename
    file_content = file.file.read()
    file_content_type = file.content_type
    webtoon_id = db.query(models.Webtoon).filter(models.Webtoon.userId == userId, 
                                                models.Webtoon.webtoonName == webtoon_name).first().id
    if webtoon_id is None:
        raise HTTPException(status_code=404, detail="Webtoon not found")
    
    model_path = db.query(models.Model).filter(models.Model.webtoonId == webtoon_id, models.Model.modelType == model_type).order_by(models.Model.id.desc()).first().modelPath
    if model_path is None:
        raise HTTPException(status_code=404, detail="Model not found")
    files = {'content_image': (file_name, file_content, file_content_type), 'prompt': (None, prompt)}
    if model_type == "LORA":
        response = requests.post(f"{os.environ.get('LORA_MODEL_SERVER')}/api/model/background/img2img/{model_path}", files=files)
    elif model_type == "DREAMSTYLER":
        response = requests.post(f"{os.environ.get('DREAMSTYLER_MODEL_SERVER')}/api/model/background/img2img/{model_path}", files=files)
    else:
        raise HTTPException(status_code=400, detail="Bad Request: Model Type not found")
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to inference style model")
    else:
        return response.json()
    

def background_txt2img(webtoon_name: str, model_type: str, prompt: str, db: Session, userId: int):
    if db.query(models.User).filter(models.User.id == userId).first() is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    webtoon_id = db.query(models.Webtoon).filter(models.Webtoon.userId == userId, 
                                                models.Webtoon.webtoonName == webtoon_name).first().id
    if webtoon_id is None:
        raise HTTPException(status_code=404, detail="Webtoon not found")
    
    model_path = db.query(models.Model).filter(models.Model.webtoonId == webtoon_id, models.Model.modelType == model_type).order_by(models.Model.id.desc()).first().modelPath
    if model_path is None:
        raise HTTPException(status_code=404, detail="Model not found")
    
    data = {"prompt": prompt}
    if model_type == "LORA":
        response = requests.post(f"{os.environ.get('LORA_MODEL_SERVER')}/api/model/background/txt2img/{model_path}", data=data)
    elif model_type == "DREAMSTYLER":
        response = requests.post(f"{os.environ.get('DREAMSTYLER_MODEL_SERVER')}/api/model/background/txt2img/{model_path}", data=data)
    else:
        raise HTTPException(status_code=400, detail="Bad Request: Model Type not found")
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
    if original_image is not None:
        original_image_name = f"{uuid.uuid4()}__{original_image.filename}"
        s3.upload_fileobj(original_image.file, Bucket=os.environ.get("AWS_S3_BUCKET"), Key=f"original/{original_image_name}")
        original_image_path = f"https://{os.environ.get('AWS_S3_BUCKET')}.s3.{os.environ.get('AWS_S3_REGION')}.amazonaws.com/original/{original_image_name}"
        db_content = models.ContentImg(webtoonId=webtoonId, createdAt=datetime.now().strftime("%Y-%m-%d %H:%M:%S"), 
                                    originalImageUrl=original_image_path, assetName=assetName, 
                                    description=description)
    else:
        db_content = models.ContentImg(webtoonId=webtoonId, createdAt=datetime.now().strftime("%Y-%m-%d %H:%M:%S"), 
                                    assetName=assetName, description=description)
    try:
        db.add(db_content)
        db.commit()
        db.refresh(db_content)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
    original_image_id = db.query(models.ContentImg).filter(models.ContentImg.webtoonId == webtoonId, models.ContentImg.assetName == assetName).first().originalImageId
    for image in generated_images:
        image_name = f"{uuid.uuid4()}__{image.filename}"
        s3.upload_fileobj(image.file, Bucket=os.environ.get("AWS_S3_BUCKET"), Key=f"background/{image_name}")
        image_path = f"https://{os.environ.get('AWS_S3_BUCKET')}.s3.{os.environ.get('AWS_S3_REGION')}.amazonaws.com/background/{image_name}"
        db_background = models.BackgroundImg(originalImageId=original_image_id, backgroundImgUrl=image_path)
        try:
            db.add(db_background)
            db.commit()
            db.refresh(db_background)
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail="Internal Server Error")

    return {"result": "Background images have been saved successfully"}
    

def get_background_asset_list(webtoon_name: str, db: Session, user_id: int):
    db_content = db.query(models.ContentImg)\
                .join(models.Webtoon, models.ContentImg.webtoonId == models.Webtoon.id)\
                .filter(models.Webtoon.webtoonName == webtoon_name,
                        models.Webtoon.userId == user_id)\
                .all()
    if db_content:
        result = []
        for db_contents in db_content:
            db_background = db.query(models.BackgroundImg)\
                .filter(models.BackgroundImg.originalImageId == db_contents.originalImageId)\
                .first()
            if db_background:
                result.append({
                    "createdAt": db_contents.createdAt,
                    "assetName": db_contents.assetName,
                    "backgroundImgUrl": db_background.backgroundImgUrl,
                    "description": db_contents.description
                })
            else:
                raise HTTPException(status_code=400, detail="Bad Request: BackgroundImg not found")
        return result
    else:
        raise HTTPException(status_code=400, detail="Bad Request: Webtoon not found")


def get_background_asset(webtoon_name: str, asset_name: str, db: Session, user_id: int):
    db_background = db.query(models.ContentImg).join(models.Webtoon, models.ContentImg.webtoonId == models.Webtoon.id)\
                        .filter(models.Webtoon.webtoonName == webtoon_name,
                        models.ContentImg.assetName == asset_name, 
                        models.Webtoon.userId == user_id).first()
    if db_background:
        result = []
        backgroundImageUrls = db.query(models.BackgroundImg).filter(models.BackgroundImg.originalImageId == db_background.originalImageId).all()
        backgroundImageUrls = [url.backgroundImgUrl for url in backgroundImageUrls]
        result.append({
            "createdAt": db_background.createdAt,
            "assetName": db_background.assetName,
            "originalImageUrl": db_background.originalImageUrl,
            "description": db_background.description,
            "backgroundImageUrls": backgroundImageUrls
            })
        return result
    else:
        raise HTTPException(status_code=400, detail="Bad Request: Asset not found")


def delete_content_asset(webtoon_name: str, asset_name: str, db: Session, user_id: int):
    db_content_img = db.query(models.ContentImg).join(models.Webtoon, models.ContentImg.webtoonId == models.Webtoon.id)\
                .filter(models.Webtoon.webtoonName == webtoon_name,
                        models.ContentImg.assetName == asset_name, 
                        models.Webtoon.userId == user_id).all()
    if db_content_img:
        for db_content_imgs in db_content_img:
            delete_background_asset(webtoon_name, asset_name, db, db_content_imgs.originalImageId)
            try:
                db.delete(db_content_imgs)
                db.commit()
            except Exception as e:
                db.rollback()
                raise HTTPException(status_code=500, detail="Internal Server Error")
        return {"detail": "Asset deleted successfully"}
    else:
        raise HTTPException(status_code=400, detail="Bad Request: ContentImg Asset not found")
    

def delete_background_asset(webtoon_name: str, asset_name: str, db: Session, original_image_id: int):
    db_background_img = db.query(models.BackgroundImg).join(models.ContentImg, models.BackgroundImg.originalImageId == models.ContentImg.originalImageId)\
                .join(models.Webtoon, models.ContentImg.webtoonId == models.Webtoon.id)\
                .filter(models.Webtoon.webtoonName == webtoon_name,
                        models.ContentImg.assetName == asset_name, 
                        ).all()
    if db_background_img:
        for db_background_imgs in db_background_img:
            try:
                db.delete(db_background_imgs)
                db.commit()
            except Exception as e:
                db.rollback()
                raise HTTPException(status_code=500, detail="Internal Server Error")
        return {"detail": "Asset deleted successfully"}
    else:
        raise HTTPException(status_code=400, detail="Bad Request: BackgroundImg Asset not found")