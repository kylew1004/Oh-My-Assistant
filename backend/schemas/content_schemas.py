from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class ContentImgBase(BaseModel):
    webtoonName: str
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