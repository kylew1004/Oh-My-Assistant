from sqlalchemy.orm import Session
from models import models, schemas
from fastapi import HTTPException
import requests
import os


def pose_inference(characterImage, poseImage):
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


# def post_pose_image(source_file, target_file, db: Session):
#     source_file_name = source_file.filename
#     source_file_content = source_file.file.read()
#     source_file_content_type = source_file.content_type
    
#     target_file_name = target_file.filename
#     target_file_content = target_file.file.read()
#     target_file_content_type = target_file.content_type
    
#     files = {'file_source': (source_file_name, source_file_content, source_file_content_type),
#              'file_target': (target_file_name, target_file_content, target_file_content_type)}
#     response = requests.post(f"{os.environ['POSE_MODEL_SERVER']}/translate-pose/", files=files)
#     pose_image_path = response.json()["result"]
#     print(pose_image_path)
#     db_image = models.Image(image_path=pose_image_path)
#     db.add(db_image)
#     db.commit()
#     db.refresh(db_image)

    
#     return db_image