from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class PoseImgBase(BaseModel):
    webtoonId: int
    poseImgUrl: str
    assetName: str
    description: Optional[str] = None
    characterImgUrl: str
    originalPoseImgUrl: str
    originalCharacterImgUrl: str

class PoseImgCreate(PoseImgBase):
    pass


class PoseImg(PoseImgBase):
    id: int
    createdAt: datetime

    class Config:
        orm_mode = True
