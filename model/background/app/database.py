import datetime
from pydantic import Field, BaseModel 
from config import config
from PIL import Image

_id = 1
def increase_id():
    global _id 
    _id += 1
    return _id 

class GenerationResult(BaseModel):
    result: str
    id: int = Field(default_factory=increase_id)
    created_at: str = Field(default_factory=datetime.datetime.now)
    