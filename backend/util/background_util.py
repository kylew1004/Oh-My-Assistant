from sqlalchemy.orm import Session
import os
import boto3
import uuid
from fastapi import UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List
import requests
from models import models


def train(webtoon_name: str, db: Session, userId: int, images: List[UploadFile] = File(...)):
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
        webtoon_id = db.query(models.Webtoon).filter(models.User.id == userId, 
                                                    models.Webtoon.webtoonName == webtoon_name).first().id
        db_model = models.Model(webtoonId=webtoon_id, modelPath=model_path)
        if db_model is None:
            raise HTTPException(status_code=500, detail="Failed to save model path")
        else:
            db.add(db_model)
            db.commit()
            db.refresh(db_model)
            return {"result": "model has been trained successfully"}


def inference(webtoon_name: str, file: UploadFile, db: Session, userId: int):
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

    data = {'model_path': (None, model_path, 'text/plain')}
    files = {'content_image': (file.filename, file_content, file.content_type)}
    response = requests.post(f"{os.environ.get('BACKGROUND_MODEL_SERVER')}/api/model/background/", data=data, files=files)
    
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to inference style model")
    else:
        return response.json()