from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class ContentImgBase(BaseModel):
    webtoonName: str
    originalImageUrl: str
    assetName: str
    description: Optional[str] = None

class ContentImgCreate(ContentImgBase):
    pass

class ContentImg(ContentImgBase):
    originalImageId: int
    createdAt: datetime

    class Config:
        orm_mode = True