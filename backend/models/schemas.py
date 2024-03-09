from typing import List, Union, Optional
from pydantic import BaseModel, Field
from datetime import datetime


class Image(BaseModel):
    id: int
    image_path: str
    
    class Config:
        orm_mode = True

class EmailPasswordRequestForm(BaseModel):
    userEmail: str
    userPassword: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    userEmail: str
    userId: int
    userNickname: str

class UserBase(BaseModel):
    userEmail: str


class UserCreate(UserBase):
    userPw: str
    userNickname: str

class User(UserBase):
    id: int

    class Config:
        orm_mode = True


class WebtoonBase(BaseModel):
    pass


class WebtoonCreate(WebtoonBase):
    webtoonName: str

class Webtoon(WebtoonBase):
    id: int
    createdAt: datetime
    userId: int

    class Config:
        orm_mode = True 
        

class ContentImgBase(BaseModel):
    webtoon_id: int
    original_image_url: str
    asset_name: str
    description: Optional[str] = None

class ContentImgCreate(ContentImgBase):
    pass

class ContentImg(ContentImgBase):
    original_image_id: int
    created_at: datetime

    class Config:
        orm_mode = True


class PoseImgBase(BaseModel):
    webtoon_id: int
    pose_image_url: str
    asset_name: str
    description: Optional[str] = None

class PoseImgCreate(PoseImgBase):
    pass


class PoseImg(PoseImgBase):
    pose_image_id: int
    created_at: datetime

    class Config:
        orm_mode = True

class BackgroundImgBase(BaseModel):
    webtoon_id: int
    background_image_url: str

class BackgroundImgCreate(BackgroundImgBase):
    pass

class BackgroundImg(BackgroundImgBase):
    background_image_id: int

    class Config:
        orm_mode = True


class ModelBase(BaseModel):
    webtoon_id: int
    model_path: str

class ModelCreate(ModelBase):
    pass

class Model(ModelBase):
    model_id: int

    class Config:
        orm_mode = True