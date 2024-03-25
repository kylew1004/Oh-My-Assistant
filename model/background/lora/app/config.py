from pydantic import Field, BaseModel
from pydantic_settings import BaseSettings

class Config(BaseSettings):
    app_env: str = Field(default="local", env='APP_ENV')
    pipeline_name: str = Field(default="runwayml/stable-diffusion-v1-5", env='PIPELINE_NAME')
    sr_pipeline_name: str = Field(default="stabilityai/stable-diffusion-x4-upscaler", env='SUPER_RESOLUTION_NAME')
    vae_name: str = Field(default="", env='VAE_NAME')
    
class TrainConfig(BaseSettings):
    data_dir: str 
    model_dir: str 
    pipeline_name: str = "runwayml/stable-diffusion-v1-5"
    rank: int = 16
    resolution: int = 512
    lr_unet: float = 1e-4
    lr_text: float = 1e-5
    lr_ti: float = 5e-4
    step_ti: int = 500
    step_tuning: int = 500
    seed: int = 42
    

# inference에서 사용합니다. 
config = Config(
    # vae_name = "stabilityai/sd-vae-ft-mse",
)

# 
train_config = TrainConfig(
    data_dir = "./data",
    model_dir = "./models",
)