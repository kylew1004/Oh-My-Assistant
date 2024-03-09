from fastapi import APIRouter, Depends, HTTPException, status
from models import crud, models, schemas
from models.crud import pwd_context
from datetime import timedelta, datetime
from sqlalchemy.orm import Session
from models.database import get_db
from typing import List
from jose import jwt
from auth.oauth import get_current_user


api_webtoon = APIRouter(prefix="/api/webtoon")

# @api_webtoon.post('/create', response_model=schemas.Webtoon, status_code=200)
# def create_webtoon(webtoon: schemas.WebtoonCreate, db: Session = Depends(get_db)):
#     db_webtoon = crud.get_webtoon_by_webtoon_name(db, webtoon_name=webtoon.webtoon_name)
#     if db_webtoon:
#         raise HTTPException(status_code=400, detail="Bad Request: Webtoon already registered")
#     return crud.create_webtoon(db=db, webtoon=webtoon)


@api_webtoon.post('/create')
def create_webtoon(request: schemas.WebtoonCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    db_webtoon = crud.get_webtoon_by_webtoon_name(db, webtoon_name=request.webtoonName)
    if db_webtoon:
        raise HTTPException(status_code=400, detail="Bad Request: Webtoon already registered")
    return crud.create_webtoon(db, webtoon=request, user=current_user)

@api_webtoon.get('/list')
def read_webtoon_list(db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    return crud.get_webtoon_list_by_user_id(db, current_user['userId'])