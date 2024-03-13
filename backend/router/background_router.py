from fastapi import APIRouter, Depends, UploadFile, File
from schemas import user_schemas
from auth.oauth import get_current_user
from sqlalchemy.orm import Session
from models.database import get_db
from typing import List
from util import background_util

api_background = APIRouter(prefix="/api/background")

@api_background.post('/train/{webtoon_name}')
def background_train(webtoon_name:str, images: List[UploadFile] = File(...),  db: Session = Depends(get_db), 
                     current_user: user_schemas.User = Depends(get_current_user)):
    return background_util.background_train(webtoon_name, db, current_user['userId'], images)


@api_background.post('/inference/{webtoon_name}')
def background_inference(webtoon_name: str, image: UploadFile, db: Session = Depends(get_db),
                         current_user: user_schemas.User = Depends(get_current_user)):
    return background_util.background_inference(webtoon_name, image, db, current_user['userId'])


@api_background.post('/save/{webtoonName}')
def background_save(webtoonName: str, assetName: str, description: str, original_image: UploadFile = File(...), 
                    generated_images: List[UploadFile] = File(...), db: Session = Depends(get_db),
                    current_user: user_schemas.User = Depends(get_current_user)):
    return background_util.background_save(webtoonName, assetName, description, db, current_user['userId'], 
                                           original_image, generated_images)