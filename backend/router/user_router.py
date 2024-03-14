from fastapi import APIRouter, Depends
from schemas import user_schemas
from sqlalchemy.orm import Session
from models.database import get_db
from auth.token import Settings
from fastapi.security import OAuth2PasswordRequestForm
from util import user_util
from models import database
from auth.oauth import get_current_user


settings = Settings()


api_user = APIRouter(prefix="/api/user")
ACCESS_TOKEN_EXPIRE_MINUTES = 60*24

@api_user.get('/me')
def read_user_me(current_user: user_schemas.User = Depends(get_current_user)):
    return user_util.get_user(current_user)

@api_user.post('/email-check')
def check_email(request: user_schemas.UserBase , db: Session = Depends(get_db)):
    return user_util.get_user_by_email(db, userEmail=request.userEmail)

@api_user.post('/login')
def login(request: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    return user_util.login(request, db)


@api_user.post("/create", response_model=user_schemas.Token, status_code=200)
def create_user(user: user_schemas.UserCreate, db: Session = Depends(get_db)):
    return user_util.create_user(db, user)