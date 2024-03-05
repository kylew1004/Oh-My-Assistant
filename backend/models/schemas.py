from typing import List, Union, Optional
from pydantic import BaseModel
from datetime import datetime


class ItemBase(BaseModel):
    title: str
    description: Union[str, None] = None


class ItemCreate(ItemBase):
    pass


class Image(BaseModel):
    id: int
    image_path: str
    
    class Config:
        orm_mode = True


class Item(ItemBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    password: str
    nickname: str


class User(UserBase):
    id: int
    is_active: bool
    #items: List[Item] = []

    class Config:
        orm_mode = True

 

class WebtoonBase(BaseModel):
    webtoon_name: str
    user_id: int
    #created_at: datetime = datetime.now().strftime("%Y-%m-%d:%H:%M:%S")
    webtoon_created_at: datetime

class WebtoonCreate(WebtoonBase):
    pass

class Webtoon(WebtoonBase):
    webtoon_id: int

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