from pydantic import BaseModel
from datetime import datetime


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
        