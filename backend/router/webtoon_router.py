from fastapi import APIRouter, Depends
from schemas import webtoon_schemas, user_schemas
from sqlalchemy.orm import Session
from models.database import get_db
from auth.oauth import get_current_user
from util import webtoon_util


api_webtoon = APIRouter(prefix="/api/webtoon")

@api_webtoon.post('/create')
def create_webtoon(request: webtoon_schemas.WebtoonCreate, db: Session = Depends(get_db), current_user: user_schemas.User = Depends(get_current_user)):
    return webtoon_util.create_webtoon(db, request, current_user)

@api_webtoon.get('/list')
def read_webtoon_list(db: Session = Depends(get_db), current_user: user_schemas.User = Depends(get_current_user)):
    return webtoon_util.read_webtoon_list(db, current_user['userId'])

@api_webtoon.delete('/delete/{webtoon_name}')
def delete_webtoon(request: webtoon_schemas.WebtoonCreate, db: Session = Depends(get_db), current_user: user_schemas.User = Depends(get_current_user)):
    return webtoon_util.delete_webtoon(db, request.webtoonName, current_user['userId'])
    
@api_webtoon.get('/check-train/{webtoon_name}')
def check_train(webtoon_name: str, db: Session = Depends(get_db)):
    return webtoon_util.check_train(db, webtoon_name)