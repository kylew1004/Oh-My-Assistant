from typing import List 

from fastapi import APIRouter, File, UploadFile
from fastapi.responses import FileResponse
from schemas import GenerationRequest, GenerationResponse   # 통신에 활용하는 자료 형태를 정의합니다.
from database import GenerationResult
from model import get_pipe, generate, patch_pipeline, train
from config import config, train_config

from PIL import Image
import io
import os 
import urllib.request 

router = APIRouter()

@router.post("/api/model/background/train")
def background_train(style_images: List[UploadFile] = File(...)) -> None:
    # make dir
    os.makedirs(os.path.join(train_config.data_dir, train_config.model_name), exist_ok=True)
    # os.makedirs(train_config.model_dir, exist_ok=True)
    
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
            id = generated_result.id,
            result = generated_result.result
        )

    # load pipeline
    pipe = get_pipe()
    
    # load content image
    request_object_content = content_image.file.read()
    print(type(request_object_content))
    content = io.BytesIO(request_object_content)

    # generate
    generated_images = generate(pipe, content)

    # save(upload image to AWS S3)
    file_names = []
    for i, img in enumerate(generated_images):
        file_name = f"results/result{i}.jpg" 
        img.save(file_name)
        file_names.append(file_name)
    
    # convert to response format
    generated_result = GenerationResult(result = ",".join(file_names))
    
    return GenerationResponse(
        id = generated_result.id,
        result = generated_result.result
    )
    
    # return FileResponse(path="./results/result.jpg", filename="result.jpg")