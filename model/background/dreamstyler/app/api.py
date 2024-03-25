from typing import List 

from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import JSONResponse

from schemas import GenerationRequest, GenerationResponse, TrainResponse   # 통신에 활용하는 자료 형태를 정의합니다.
from database import GenerationResult, TrainResult
from model import get_img2img_pipe, get_txt2img_pipe, img2img_generate, txt2img_generate, train, load_img2img_pipeline, load_txt2img_pipeline
from config import config, train_config
from env import env

from PIL import Image

import shutil
import io
import os 
import uuid 
import boto3
import base64

router = APIRouter()
s3 = boto3.client(
        's3',
        aws_access_key_id=env.access_key_id,
        aws_secret_access_key=env.access_key,
        region_name=env.region
    )

@router.post("/api/model/background/train")
def background_train(style_images: List[UploadFile] = File(...)) -> None:
    # check training server is busy, 사전에 cli_lora_pti.py를 수정해야 합니다.
    
    # 모델 돌리는 중에 다른 모델을 돌리지 못하게 하는 코드 구현
    
    # set unique model name
    model_name = f"{uuid.uuid4()}"
    print(f"start training... model_name: {model_name}")

    # clear dir
    try:
        shutil.rmtree(os.path.join(train_config.data_dir, model_name), ignore_errors=True)
    except:
        pass
    
    # make dir
    os.makedirs(os.path.join(train_config.data_dir, model_name), exist_ok=True)
    
    # load & save style image
    for i, style_image in enumerate(style_images):
        # 첫번째 이미지만 훈련사용
        if i==1:
            break
        
        request_object_content = style_image.file.read()
        file_name = style_image.filename
        style_image = Image.open(io.BytesIO(request_object_content)).convert("RGB").resize((512, 512))
        style_image.save(os.path.join(train_config.data_dir, model_name, f"{file_name}"))

    # train
    output_dir = os.path.join(train_config.model_dir, model_name+"_r"+str(train_config.rank))
   
    train(
         {
        "train_image_path": os.path.join(train_config.data_dir, model_name, f"{file_name}"),
        "context_prompt":"A painting in the style of {}",
        "pretrained_model_name_or_path":train_config.pipeline_name,
        "output_dir": output_dir,
        "placeholder_token":"<sks03>",
        "initializer_token":"painting",
        "learnable_property":"style",
        "revision":None,
        "tokenizer_name":None,
        "num_stages":6,
        "save_steps":100,
        "save_as_full_pipeline":False,
        "num_vectors":1,
        "seed":None,
        "resolution":512,
        "center_crop":False,
        "train_batch_size":4,
        "num_train_epochs":100,
        "max_train_steps":500,
        "gradient_accumulation_steps":1,
        "gradient_checkpointing":False,
        "learning_rate":1e-4,
        "scale_lr":False,
        "lr_scheduler":"constant",
        "lr_warmup_steps":500,
        "lr_num_cycles":1,
        "dataloader_num_workers":1,
        "adam_beta1":0.9,
        "adam_beta2":0.999,
        "adam_weight_decay":1e-2,
        "adam_epsilon":1e-08,
        "logging_dir":"logs",
        "mixed_precision":"no",
        "allow_tf32":False,
        "report_to":"tensorboard",
        "validation_prompt":None,
        "num_validation_images":5,
        "validation_steps":100,
        "local_rank":-1,
        "checkpointing_steps":100,
        "checkpoints_total_limit":None,
        "resume_from_checkpoint":None,
        "enable_xformers_memory_efficient_attention":False,
        "no_safe_serialization":False
    }
    )
    
    # convert to response format
    generated_result = TrainResult(result = output_dir.split('/')[-1])
    
    # if we don't use train images, run this code.
    # shutil.rmtree(os.path.join(train_config.data_dir, model_name), ignore_errors=True) 
    
    return TrainResponse(
        result = generated_result.result
    )

@router.post("/api/model/background/img2img/{model_id}")
def background_img2img(model_id: str = str(...), content_image: UploadFile = File(...)):
    # make dir
    os.makedirs(f'results/{model_id}', exist_ok=True)
    
    load_img2img_pipeline(config.pipeline_name, embedding_path=f"./models/{model_id}")
    
    # load pipeline
    img2img_pipe = get_img2img_pipe()
    
    # load content image
    request_object_content = content_image.file.read()
    content = io.BytesIO(request_object_content)

    # generate
    generated_images = img2img_generate(img2img_pipe, content, placeholder_token="<sks03>", num_stages=6)
    generated_image_bytes = []

    # save
    for i, img in enumerate(generated_images):        
        # convert image to bytes
        buf = io.BytesIO()
        img.save(buf, format="jpeg")
        generated_image_bytes.append(buf.getvalue())
        
        # Local Save
        background_file_name = f"{uuid.uuid4()}__result{i}.jpg"
        img.save(f"results/{model_id}/{background_file_name}")
    
    base64_images = [base64.b64encode(img).decode('utf-8') for img in generated_image_bytes]
    
    # return StreamingResponse
    return JSONResponse(content={"images": base64_images})

@router.post("/api/model/background/txt2img/{model_id}")
def background_txt2img(model_id: str = str(...), prompt: str = Form(...)):
    print(prompt)

    # make dir
    os.makedirs(f'results/{model_id}', exist_ok=True)
    
    load_txt2img_pipeline(config.pipeline_name, embedding_path=f"./models/{model_id}")
    
    # load pipeline
    txt2img_pipe = get_txt2img_pipe()

    # generate
    generated_images = txt2img_generate(txt2img_pipe, prompt=prompt)
    generated_image_bytes = []

    # save
    for i, img in enumerate(generated_images):        
        # convert image to bytes
        buf = io.BytesIO()
        img.save(buf, format="jpeg")
        generated_image_bytes.append(buf.getvalue())
        
        # Local Save
        background_file_name = f"{uuid.uuid4()}__result{i}.jpg"
        img.save(f"results/{model_id}/{background_file_name}")
    
    base64_images = [base64.b64encode(img).decode('utf-8') for img in generated_image_bytes]
    
    # return StreamingResponse
    return JSONResponse(content={"images": base64_images})