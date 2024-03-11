from pydantic import BaseModel


class ModelBase(BaseModel):
    webtoonName: str
    model_path: str

class ModelCreate(ModelBase):
    pass

class Model(ModelBase):
    model_id: int

    class Config:
        orm_mode = True