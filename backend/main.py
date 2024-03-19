from fastapi import FastAPI
from models import models
from models.database import engine
from fastapi.middleware.cors import CORSMiddleware

from router import user_router
from router import webtoon_router
from router import background_router
from router import pose_router
from router import background_router


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://223.130.131.6.tiangolo.com",
    "https://223.130.131.6.tiangolo.com",
    "http://223.130.131.6",
    "http://223.130.131.6:8000",
    "http://223.130.131.6:3000",
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