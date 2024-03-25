from pydantic import BaseModel


class ModelBase(BaseModel):
    webtoonId: int
    modelPath: str

class ModelCreate(ModelBase):
    pass

class Model(ModelBase):
    id: int

    class Config:
        orm_mode = True