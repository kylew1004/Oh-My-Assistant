from fastapi import APIRouter, Depends, HTTPException, status, UploadFile
from models import schemas
from sqlalchemy.orm import Session
from models.database import get_db
from auth.oauth import get_current_user
from util import pose_util


api_pose = APIRouter(prefix="/api/pose")


@api_pose.post('/inference')
def pose_inference(poseImage: UploadFile, characterImage: UploadFile):
    return pose_util.pose_inference(characterImage, poseImage)
