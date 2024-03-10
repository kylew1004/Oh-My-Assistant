from typing import List 

from fastapi import APIRouter, File, UploadFile
from fastapi.responses import FileResponse
from schemas import GenerationRequest, GenerationResponse   # 통신에 활용하는 자료 형태를 정의합니다.
from database import GenerationResult
from model import get_pipe, generate, patch_pipeline, train
from config import config, train_config
from env import env

from PIL import Image
import shutil
import io
import os 
import urllib.request 
import uuid 
import boto3


router = APIRouter()
s3 = boto3.client(
        's3',
        aws_access_key_id=env.access_key_id,
        aws_secret_access_key=env.access_key,
        region_name=env.region
    )

@router.post("/api/model/background/train")
def background_train(style_images: List[UploadFile] = File(...)) -> None:
    # clear dir
    shutil.rmtree(os.path.join(train_config.data_dir, train_config.model_name))
    
    # make dir
    os.makedirs(os.path.join(train_config.data_dir, train_config.model_name), exist_ok=True)
    
    # load & save style image
    for i, style_image in enumerate(style_images):
        request_object_content = style_image.file.read()
        style_image = Image.open(io.BytesIO(request_object_content)).convert("RGB").resize((512, 512))
        style_image.save(os.path.join(train_config.data_dir, train_config.model_name, f"{i}.jpg"))

    # train
    train()


@router.post("/api/model/background/")
def background_inference(content_image: UploadFile = File(...)) -> GenerationResponse:
    # make dir
    os.makedirs('results', exist_ok=True)
    
    # patch pipeline
    result = patch_pipeline(model_path=config.model_path)
    if not result:
        generated_result = GenerationResult(result = "Error: There is no trained model.")
        return GenerationResponse(
            result = generated_result.result
        )

    # load pipeline
    pipe = get_pipe()
    
    # load content image
    request_object_content = content_image.file.read()
    content = io.BytesIO(request_object_content)

    # generate
    generated_images = generate(pipe, content)

    # save(upload image to AWS S3)
    background_file_paths = []
    for i, img in enumerate(generated_images):        
        background_file_name = f"{uuid.uuid4()}__result{i}.jpg"

        # 이미지를 BytesIO 객체에 저장
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='jpeg')
        img_byte_arr.seek(0)

        s3.upload_fileobj(img_byte_arr, Bucket=env.bucket, Key=f"background/{background_file_name}")
        background_file_path = f"https://{env.bucket}.s3.{env.region}.amazonaws.com/background/{background_file_name}"
        background_file_paths.append(background_file_path)
        
    # convert to response format
    generated_result = GenerationResult(result = " ".join(background_file_paths))
    
    return GenerationResponse(
        result = generated_result.result
    )
    
    # return FileResponse(path="./results/result.jpg", filename="result.jpg")