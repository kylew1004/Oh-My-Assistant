import datetime
from pydantic import Field, BaseModel 
from PIL import Image


class GenerationResult(BaseModel):
    result: str
    created_at: str = Field(default_factory=datetime.datetime.now)
    