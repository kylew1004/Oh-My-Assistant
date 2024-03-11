from pydantic import BaseModel


class BackgroundImgBase(BaseModel):
    webtoonName: str
    background_image_url: str

class BackgroundImgCreate(BackgroundImgBase):
    pass

class BackgroundImg(BackgroundImgBase):
    background_image_id: int

    class Config:
        orm_mode = True
