from fastapi import APIRouter, Depends, UploadFile
from models import schemas
from sqlalchemy.orm import Session
from models.database import get_db
from auth.oauth import get_current_user
from util import pose_util


api_pose = APIRouter(prefix="/api/pose")


@api_pose.post('/inference')
def pose_inference(poseImage: UploadFile, characterImage: UploadFile):
    return pose_util.pose_inference(characterImage, poseImage)


@api_pose.post('/save')
def pose_save(originalCharacterImg: UploadFile, originalPoseImg: UploadFile, characterImage: UploadFile, poseImage: UploadFile, 
              webtoonName: str, assetName: str, description: str, db: Session = Depends(get_db), 
              current_user: schemas.User = Depends(get_current_user)):
    return pose_util.pose_save(originalCharacterImg, originalPoseImg, characterImage, poseImage,
                               webtoonName, assetName, description, db, current_user['userId'])


@api_pose.get('/asset/{webtoon_name}')
def get_pose_asset_list(webtoon_name: str, db: Session = Depends(get_db), 
                        current_user: schemas.User = Depends(get_current_user)):
    return pose_util.get_pose_asset_list(webtoon_name, db, current_user['userId'])


@api_pose.get('/asset/{webtoon_name}/{asset_name}')
def get_pose_asset(webtoon_name: str, asset_name: str, db: Session = Depends(get_db), 
                   current_user: schemas.User = Depends(get_current_user)):
    return pose_util.get_pose_asset(webtoon_name, asset_name, db, current_user['userId'])


@api_pose.delete('/asset/{webtoon_name}/{asset_name}')
def delete_pose_asset(webtoon_name: str, asset_name: str, db: Session = Depends(get_db), 
                      current_user: schemas.User = Depends(get_current_user)):
    return pose_util.delete_pose_asset(webtoon_name, asset_name, db, current_user['userId'])