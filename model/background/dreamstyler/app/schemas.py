from pydantic import BaseModel 
from PIL import Image


class GenerationRequest(BaseModel):
    content: str
    prompt: str = None
    seed: int = 42 
    alpha_unet: float = 0.4
    alpha_text: float = 0.8
    strength: float = 0.55
    guidance_scale: float = 7.5
    
    
class GenerationResponse(BaseModel):
    result: str
class TrainResponse(BaseModel):
    result: bool
    model_path: str