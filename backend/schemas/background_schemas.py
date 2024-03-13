from pydantic import BaseModel


class BackgroundImgBase(BaseModel):
    originalImageId: int
    backgroundImageUrl: str

class BackgroundImgCreate(BackgroundImgBase):
    pass

class BackgroundImg(BackgroundImgBase):
    backgroundImageId: int

    class Config:
        orm_mode = True
