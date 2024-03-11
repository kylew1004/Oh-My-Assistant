from fastapi import APIRouter, Depends, HTTPException, status
from models import schemas
from sqlalchemy.orm import Session
from models.database import get_db
from auth.oauth import get_current_user
from util import webtoon_util


api_webtoon = APIRouter(prefix="/api/webtoon")

# @api_webtoon.post('/create', response_model=schemas.Webtoon, status_code=200)
# def create_webtoon(webtoon: schemas.WebtoonCreate, db: Session = Depends(get_db)):
#     db_webtoon = crud.get_webtoon_by_webtoon_name(db, webtoon_name=webtoon.webtoon_name)
#     if db_webtoon:
#         raise HTTPException(status_code=400, detail="Bad Request: Webtoon already registered")
#     return crud.create_webtoon(db=db, webtoon=webtoon)


@api_webtoon.post('/create')
def create_webtoon(request: schemas.WebtoonCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    db_webtoon = webtoon_util.get_webtoon_by_webtoon_name_and_userId(db, webtoon_name=request.webtoonName, user_id=current_user['userId'])
    if db_webtoon:
        raise HTTPException(status_code=400, detail="Bad Request: Webtoon already registered")
    return webtoon_util.create_webtoon(db, webtoon=request, user=current_user)

@api_webtoon.get('/list')
def read_webtoon_list(db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    webtoons = webtoon_util.get_webtoon_list_by_user_id(db, current_user['userId'])
    formatted_webtoons = []
    for webtoon in webtoons:
        formatted_webtoons.append({
            "webtoonName":webtoon.webtoonName,
            "userId":webtoon.userId,
            "createdAt":webtoon.createdAt
        })
    return {"webtoonList":formatted_webtoons}

@api_webtoon.delete('/delete/{webtoon_name}')
def delete_webtoon(request: schemas.WebtoonCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    db_webtoon = webtoon_util.get_webtoon_by_webtoon_name_and_userId(db, webtoon_name=request.webtoonName, user_id=current_user['userId'])
    if db_webtoon:
        db.delete(db_webtoon)
        db.commit()
        return {"message": "Webtoon deleted successfully"}
    else:
        raise HTTPException(status_code=400, detail="Bad Request: Webtoon not found")