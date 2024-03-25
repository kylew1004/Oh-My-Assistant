from typing import List 

from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import JSONResponse

from schemas import GenerationRequest, GenerationResponse, TrainResponse   # 통신에 활용하는 자료 형태를 정의합니다.
from database import GenerationResult, TrainResult
from model import get_img2img_pipe, get_txt2img_pipe, img2img_generate, txt2img_generate, patch_pipeline
from config import config, train_config
from env import env

from PIL import Image
from lora_diffusion.cli_lora_pti import train, state_running_process
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
    if len(state_running_process) > 0:
        return TrainResponse(
            result = "training server is busy!"
        )

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
        request_object_content = style_image.file.read()
        file_name = style_image.filename
        style_image = Image.open(io.BytesIO(request_object_content)).convert("RGB").resize((512, 512))
        style_image.save(os.path.join(train_config.data_dir, model_name, f"{file_name}"))

    # train
    output_dir = os.path.join(train_config.model_dir, model_name+"_r"+str(train_config.rank))
    train(
        pretrained_model_name_or_path=train_config.pipeline_name,
        instance_data_dir=os.path.join(train_config.data_dir, model_name),
        output_dir=output_dir,
        train_text_encoder = True,
        resolution=train_config.resolution,
        train_batch_size=1,
        gradient_accumulation_steps=4,
        scale_lr = True,
        learning_rate_unet=train_config.lr_unet,
        learning_rate_text=train_config.lr_text,
        learning_rate_ti=train_config.lr_ti,
        color_jitter = True,
        lr_scheduler="linear",
        lr_warmup_steps=0,
        placeholder_tokens="<s1>|<s2>",
        use_template="style",
        save_steps=500,
        max_train_steps_ti=train_config.step_ti,
        max_train_steps_tuning=train_config.step_tuning,
        perform_inversion=True,
        clip_ti_decay = True,
        weight_decay_ti=0.000,
        weight_decay_lora=0.00,
        continue_inversion = True,
        continue_inversion_lr=1e-4,
        device="cuda:0",
        lora_rank=train_config.rank,
        seed=train_config.seed
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
    
    # load pipeline
    img2img_pipe = get_img2img_pipe()

    # patch img2img pipeline
    result = patch_pipeline(pipe=img2img_pipe, model_path=f"./models/{model_id}")
    print("img2img pipeline:", model_id, result)
    if not result:
        generated_result = GenerationResult(result = "Error: There is no trained model.")
        return GenerationResponse(
            result = generated_result.result
        )
    
    # load content image
    request_object_content = content_image.file.read()
    content = io.BytesIO(request_object_content)

    # generate
    generated_images = img2img_generate(img2img_pipe, content, alpha_unet=0.3, alpha_text=0.3)
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
    
    # load pipeline
    txt2img_pipe = get_txt2img_pipe()
        
    # patch txt2img pipeline
    result = patch_pipeline(pipe=txt2img_pipe, model_path=f"./models/{model_id}")
    print("txt2img pipeline:", model_id, result)
    if not result:
        generated_result = GenerationResult(result = "Error: There is no trained model.")
        return GenerationResponse(
            result = generated_result.result
        )

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