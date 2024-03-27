from pydantic import Field, BaseModel
from pydantic_settings import BaseSettings

class Config(BaseSettings):
    app_env: str = Field(default="local", env='APP_ENV')
    pipeline_name: str = Field(default="runwayml/stable-diffusion-v1-5", env='PIPELINE_NAME')
    
class TrainConfig(BaseSettings):
    data_dir: str 
    model_dir: str 
    pipeline_name: str = "runwayml/stable-diffusion-v1-5"
    resolution: int = 512
    seed: int = 42
    save_steps: int = 100
    batch_size: int = 4
    max_train_steps: int = 500
    learning_rate: float = 1e-4
    mixed_precision: str = "fp16"

# inference에서 사용합니다. 
config = Config(
)

# 
train_config = TrainConfig(
    data_dir = "./data",
    model_dir = "./models",
)