from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class PoseImgBase(BaseModel):
    webtoonName: str
    originalImageUrl: str
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
