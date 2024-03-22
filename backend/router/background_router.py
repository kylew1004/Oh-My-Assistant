from fastapi import APIRouter, Depends, Form, UploadFile, File
from schemas import user_schemas
from util.user_util import pwd_context
from auth.oauth import get_current_user
from sqlalchemy.orm import Session
from models import models, database
from models.database import get_db
from typing import List
from util import background_util
from auth import token
from auth.oauth import get_current_user
from datetime import timedelta
from auth.token import Settings
from fastapi.security import OAuth2PasswordRequestForm
from util import user_util

api_background = APIRouter(prefix="/api/background")

@api_background.post('/train/{webtoon_name}')
def background_train(webtoon_name:str, images: List[UploadFile] = File(...),  db: Session = Depends(get_db), 
                     current_user: user_schemas.User = Depends(get_current_user)):
    return background_util.background_train(webtoon_name, db, current_user['userId'], images)


@api_background.post('/img2img/{webtoon_name}')
def background_inference(webtoon_name: str, image: UploadFile, db: Session = Depends(get_db),
                         current_user: user_schemas.User = Depends(get_current_user), prompt: str = Form(...)):
    return background_util.background_img2img(webtoon_name, image, db, current_user['userId'],prompt)


@api_background.post('/txt2img/{webtoon_name}')
def background_txt2img(webtoon_name: str, prompt: str, db: Session = Depends(get_db),
                         current_user: user_schemas.User = Depends(get_current_user)):
    return background_util.background_txt2img(webtoon_name, prompt, db, current_user['userId'])



@api_background.post('/save/{webtoonName}')
def background_save(webtoonName: str, assetName: str, description: str, original_image: UploadFile = None, 
                    generated_images: List[UploadFile] = File(...), db: Session = Depends(get_db),
                    current_user: user_schemas.User = Depends(get_current_user)):
    return background_util.background_save(webtoonName, assetName, description, db, current_user['userId'], 
                                           original_image, generated_images)


@api_background.get('/asset/{webtoon_name}')
def get_background_asset_list(webtoon_name: str, db: Session = Depends(get_db), 
                        current_user: user_schemas.User = Depends(get_current_user)):
    return background_util.get_background_asset_list(webtoon_name, db, current_user['userId'])


@api_background.get('/asset/{webtoon_name}/{asset_name}')
def get_background_asset(webtoon_name: str, asset_name: str, db: Session = Depends(get_db), 
                    current_user: user_schemas.User = Depends(get_current_user)):
    return background_util.get_background_asset(webtoon_name, asset_name, db, current_user['userId'])


@api_background.delete('/asset/delete/{webtoon_name}/{asset_name}')
def delete_background_asset(webtoon_name: str, asset_name: str, db: Session = Depends(get_db), 
                      current_user: user_schemas.User = Depends(get_current_user)):
    return background_util.delete_content_asset(webtoon_name, asset_name, db, current_user['userId'])