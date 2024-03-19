from sqlalchemy.orm import Session
from models import models
from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import load_only
import requests
import os
import boto3
import uuid
from datetime import datetime


s3 = boto3.client(
    's3',
    aws_access_key_id=os.environ.get("AWS_S3_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("AWS_S3_SECRET_ACCESS_KEY"),
    region_name=os.environ.get("AWS_S3_REGION")
)


def pose_inference(characterImage: UploadFile, poseImage: UploadFile):
    character_file_name = characterImage.filename
    character_file_content = characterImage.file.read()
    character_file_content_type = characterImage.content_type
    
    pose_file_name = poseImage.filename
    pose_file_content = poseImage.file.read()
    pose_file_content_type = poseImage.content_type
    
    files = {'file_source': (character_file_name, character_file_content, character_file_content_type),
             'file_target': (pose_file_name, pose_file_content, pose_file_content_type)}
    response = requests.post(f"{os.environ['POSE_MODEL_SERVER']}/translate-pose/", files=files)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Bad Request: Pose Inference failed")
    else:
        return response.json()


def pose_save(originalCharacterImg: UploadFile, originalPoseImg: UploadFile, 
              characterImage: UploadFile, poseImage: UploadFile, 
              webtoonName: str, assetName: str, description: str, db: Session,
              user_id: int):
    
    if db.query(models.PoseImg).join(models.Webtoon, models.PoseImg.webtoonId == models.Webtoon.id)\
        .filter(models.Webtoon.webtoonName == webtoonName, models.PoseImg.assetName == assetName, 
                models.Webtoon.userId == user_id).first():
        raise HTTPException(status_code=400, detail="Bad Request: Asset already exists")
    
    originalCharacterImgName = f"{uuid.uuid4()}__{originalCharacterImg.filename}"
    originalPoseImgName = f"{uuid.uuid4()}__{originalPoseImg.filename}"
    characterImageName = f"{uuid.uuid4()}__{characterImage.filename}"
    poseImageName = f"{uuid.uuid4()}__{poseImage.filename}"
    
    s3.upload_fileobj(originalCharacterImg.file, Bucket=os.environ.get("AWS_S3_BUCKET"), Key=f"original/{originalCharacterImgName}")
    s3.upload_fileobj(originalPoseImg.file, Bucket=os.environ.get("AWS_S3_BUCKET"), Key=f"original/{originalPoseImgName}")
    s3.upload_fileobj(characterImage.file, Bucket=os.environ.get("AWS_S3_BUCKET"), Key=f"pose/{characterImageName}")
    s3.upload_fileobj(poseImage.file, Bucket=os.environ.get("AWS_S3_BUCKET"), Key=f"pose/{poseImageName}")
    
    originalCharacterImgPath = f"https://{os.environ.get('AWS_S3_BUCKET')}.s3.{os.environ.get('AWS_S3_REGION')}.amazonaws.com/original/{originalCharacterImgName}"
    originalPoseImgPath = f"https://{os.environ.get('AWS_S3_BUCKET')}.s3.{os.environ.get('AWS_S3_REGION')}.amazonaws.com/original/{originalPoseImgName}"
    characterImagePath = f"https://{os.environ.get('AWS_S3_BUCKET')}.s3.{os.environ.get('AWS_S3_REGION')}.amazonaws.com/pose/{characterImageName}"
    poseImagePath = f"https://{os.environ.get('AWS_S3_BUCKET')}.s3.{os.environ.get('AWS_S3_REGION')}.amazonaws.com/pose/{poseImageName}"
    
    webtoonId = db.query(models.Webtoon).filter(models.Webtoon.webtoonName == webtoonName, 
                                                models.Webtoon.userId == user_id).first().id
    
    db_pose = models.PoseImg(webtoonId=webtoonId, originalCharacterImgUrl=originalCharacterImgPath, originalPoseImgUrl=originalPoseImgPath, 
                             characterImgUrl=characterImagePath, poseImgUrl=poseImagePath,
                             createdAt=datetime.now().strftime("%Y-%m-%d %H:%M:%S"), assetName=assetName, description=description)
    try:
        db.add(db_pose)
        db.commit()
        db.refresh(db_pose)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal Server Error")
    return {"result": "Pose asset saved successfully"}


def get_pose_asset_list(webtoon_name: str, db: Session, user_id: int):
    db_pose = db.query(models.PoseImg.assetName, models.PoseImg.characterImgUrl)\
                .join(models.Webtoon, models.PoseImg.webtoonId == models.Webtoon.id)\
                .filter(models.Webtoon.webtoonName == webtoon_name,
                        models.Webtoon.userId == user_id)\
                .all()
    if db_pose:
        return db_pose
    else:
        raise HTTPException(status_code=400, detail="Bad Request: Asset not found")


def get_pose_asset(webtoon_name: str, asset_name: str, db: Session, user_id: int):
    db_pose = db.query(models.PoseImg).join(models.Webtoon, models.PoseImg.webtoonId == models.Webtoon.id)\
                .filter(models.Webtoon.webtoonName == webtoon_name,
                        models.PoseImg.assetName == asset_name, 
                        models.Webtoon.userId == user_id).first()
    if db_pose:
        result = {
            "originalCharacterImgUrl": db_pose.originalCharacterImgUrl,
            "originalPoseImgUrl": db_pose.originalPoseImgUrl,
            "characterImgUrl": db_pose.characterImgUrl,
            "poseImgUrl": db_pose.poseImgUrl,
            "createdAt": db_pose.createdAt,
            "assetName": db_pose.assetName,
            "description": db_pose.description
        }
        return result
    else:
        raise HTTPException(status_code=400, detail="Bad Request: Asset not found")


def delete_pose_asset(webtoon_name: str, asset_name: str, db: Session, user_id: int):
    db_pose = db.query(models.PoseImg).join(models.Webtoon, models.PoseImg.webtoonId == models.Webtoon.id)\
                .filter(models.Webtoon.webtoonName == webtoon_name,
                        models.PoseImg.assetName == asset_name, 
                        models.Webtoon.userId == user_id).first()
    if db_pose:
        try:
            db.delete(db_pose)
            db.commit()
            return {"detail": "Asset deleted successfully"}
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail="Internal Server Error")
    else:
        raise HTTPException(status_code=400, detail="Bad Request: Asset not found")