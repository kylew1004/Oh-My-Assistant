from fastapi import FastAPI
from models import models
from models.database import engine
from fastapi.middleware.cors import CORSMiddleware

from router import user_router
from router import webtoon_router
from router import background_router
from router import pose_router
from router import background_router
import os


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://"+os.environ.get('HOSTNAME')+".tiangolo.com",
    "https://"+os.environ.get('HOSTNAME')+".tiangolo.com",
    "http://"+os.environ.get('HOSTNAME'),
    "http://"+os.environ.get('HOSTNAME')+":8000",
    "http://"+os.environ.get('HOSTNAME')+":3000",
    
    "http://"+os.environ.get('SERVER_IP')+".tiangolo.com",
    "https://"+os.environ.get('SERVER_IP')+".tiangolo.com",
    "http://"+os.environ.get('SERVER_IP'),
    "http://"+os.environ.get('SERVER_IP')+":3000",
    "http://"+os.environ.get('SERVER_IP')+":8000",
    
    "http://"+os.environ.get('DOMAIN_NAME')+".tiangolo.com",
    "https://"+os.environ.get('DOMAIN_NAME')+".tiangolo.com",
    "http://"+os.environ.get('DOMAIN_NAME'),
    "http://"+os.environ.get('DOMAIN_NAME')+":3000",
    "http://"+os.environ.get('DOMAIN_NAME')+":8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router.api_user)
app.include_router(webtoon_router.api_webtoon)
app.include_router(pose_router.api_pose)
app.include_router(background_router.api_background)