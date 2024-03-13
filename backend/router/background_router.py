from fastapi import APIRouter, Depends, HTTPException
from schemas import user_schemas
from util.user_util import pwd_context
from datetime import timedelta
from sqlalchemy.orm import Session
from models.database import get_db
from auth.token import Settings
from fastapi.security import OAuth2PasswordRequestForm
from util import user_util
from fastapi import status
from models import models, database
from auth import token
from auth.oauth import get_current_user
from util import background_util


api_background = APIRouter(prefix="/api/background")

@api_background.get('/asset/{webtoon_name}')
def get_background_asset_list(webtoon_name: str, db: Session = Depends(get_db), 
                        current_user: user_schemas.User = Depends(get_current_user)):
    return background_util.get_background_asset_list(webtoon_name, db, current_user['userId'])

@api_background.get('/asset/{webtoon_name}/{asset_name}')
def get_background_asset(webtoon_name: str, asset_name: str, db: Session = Depends(get_db), 
                    current_user: user_schemas.User = Depends(get_current_user)):
    return background_util.get_background_asset(webtoon_name, asset_name, db, current_user['userId'])