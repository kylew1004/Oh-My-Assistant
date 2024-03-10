from pydantic import BaseModel 
from PIL import Image


class GenerationResponse(BaseModel):
    result: str