# python native
import os 
import json
import shutil
import random
import datetime

# external library
import numpy as np 
from PIL import Image
from loguru import logger

# torch
import torch 

# diffusion
from lora_diffusion import tune_lora_scale, patch_pipe
from diffusers import StableDiffusionImg2ImgPipeline, StableDiffusionUpscalePipeline, AutoencoderKL

from config import train_config

dr_pipe = None
pipe = None 
vae = None 
    
    
def set_seed(seed):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False

def load_vae(vae_id):
    global vae
    if not vae_id: return 
    vae = AutoencoderKL.from_pretrained(
        vae_id, 
        torch_dtype=torch.float16).to("cuda")
    
    return vae

def load_pipeline(model_id):
    global pipe
    if vae:
        pipe = StableDiffusionImg2ImgPipeline.from_pretrained(
            model_id, 
            vae = vae,
            safety_checker=None, 
            torch_dtype=torch.float16).to("cuda")
    else:
        pipe = StableDiffusionImg2ImgPipeline.from_pretrained(
            model_id, 
            safety_checker=None, 
            torch_dtype=torch.float16).to("cuda")
        
    return pipe

def load_sr_pipeline(model_id):
    global sr_pipe
    sr_pipe = StableDiffusionUpscalePipeline.from_pretrained(
        model_id, 
        revision="fp16",
        use_safetensors=False,
        torch_dtype=torch.float16).to("cuda")
        
    return sr_pipe

def patch_pipeline(model_path: str):
    global pipe
    try:
        patch_pipe(
            pipe,
            os.path.join(model_path, "final_lora.safetensors"),
            patch_text=True,
            patch_ti=True,
            patch_unet=True,
        )
    except:
        logger.error(f"There's no trained model.")
        return False
    return True

def get_pipe():
    return pipe
def get_sr_pipe():
    return sr_pipe
    
def train() -> None:
    # os.path.append("/home/kcw/webtoon-background-generator/lora")
    os.system(f"""lora_pti \
        --pretrained_model_name_or_path={train_config.pipeline_name}  \
        --instance_data_dir={os.path.join(train_config.data_dir, train_config.model_name)} \
        --output_dir={os.path.join(train_config.model_dir, train_config.model_name+"_r"+str(train_config.rank))} \
        --train_text_encoder \
        --resolution={train_config.resolution} \
        --train_batch_size=1 \
        --gradient_accumulation_steps=4 \
        --scale_lr \
        --learning_rate_unet={train_config.lr_unet} \
        --learning_rate_text={train_config.lr_text} \
        --learning_rate_ti={train_config.lr_ti} \
        --color_jitter \
        --lr_scheduler="linear" \
        --lr_warmup_steps=0 \
        --placeholder_tokens="<s1>|<s2>" \
        --use_template="style"\
        --save_steps=500 \
        --max_train_steps_ti={train_config.step_ti} \
        --max_train_steps_tuning={train_config.step_tuning} \
        --perform_inversion=True \
        --clip_ti_decay \
        --weight_decay_ti=0.000 \
        --weight_decay_lora=0.001\
        --continue_inversion \
        --continue_inversion_lr=1e-4 \
        --device="cuda:0" \
        --lora_rank={train_config.rank} \
        --seed={train_config.seed}""")

def generate(pipe, content_image, 
             seed=42, prompt=None, 
             alpha_unet=0.4, alpha_text=0.8,
             guidance_scale=7.5) -> Image:
    
    init_image = Image.open(content_image)
    w, h = init_image.size
    
    init_image = init_image.convert("RGB").resize((512, 512))
    tune_lora_scale(pipe.unet, alpha_unet)
    tune_lora_scale(pipe.text_encoder, alpha_text)
    
    torch.manual_seed(seed) # 동일 조건 동일 결과 보장
    
    generated_images = []
    for _ in range(3): 
        if prompt:
            generated_images.append(
                pipe(prompt=f"{prompt}, style of <s1><s2>", 
                    image=init_image, strength=0.55, guidance_scale=guidance_scale
                    ).images[0].resize((w, h))
                # sr_pipe(
                #     prompt="",
                #     image=pipe(prompt=f"{prompt}, style of <s1><s2>", 
                #         image=init_image, strength=0.55, guidance_scale=guidance_scale
                #         ).images[0].resize((128,128))
                # ).images[0]
            )
        else:
            generated_images.append(
                pipe(prompt="style of <s1><s2>", 
                    image=init_image, strength=0.55, guidance_scale=guidance_scale
                    ).images[0].resize((w, h))
                # sr_pipe(
                #     prompt="",
                #     image=pipe(prompt="style of <s1><s2>", 
                #         image=init_image, strength=0.55, guidance_scale=guidance_scale
                #         ).images[0].resize((128,128))
                # ).images[0]
            )
    for _ in range(3): 
        if prompt:
            generated_images.append(
                pipe(prompt=f"{prompt}, style of <s1><s2>", 
                        image=init_image, strength=0.45, guidance_scale=guidance_scale
                        ).images[0].resize((w, h))
                # sr_pipe(
                #     prompt="",
                #     image=pipe(prompt=f"{prompt}, style of <s1><s2>", 
                #         image=init_image, strength=0.45, guidance_scale=guidance_scale
                #         ).images[0].resize((128,128))
                # ).images[0]
            )
        else:
            generated_images.append(
                pipe(prompt="style of <s1><s2>", 
                        image=init_image, strength=0.45, guidance_scale=guidance_scale
                        ).images[0].resize((w, h))
                # sr_pipe(
                #     prompt="",
                #     image=pipe(prompt="style of <s1><s2>", 
                #         image=init_image, strength=0.45, guidance_scale=guidance_scale
                #         ).images[0].resize((128,128))
                # ).images[0]
            )
        
    return generated_images 

    
def main():
    pass 
    # get data
    
    # model
    
    # train
    
    # save model
    
    
