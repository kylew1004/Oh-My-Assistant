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
from diffusers import StableDiffusionPipeline, StableDiffusionImg2ImgPipeline, EulerAncestralDiscreteScheduler, StableDiffusionUpscalePipeline, AutoencoderKL

from config import train_config

#dreamstyler
import click
import imageio

from diffusers import ControlNetModel, UniPCMultistepScheduler, DPMSolverMultistepScheduler
from transformers import CLIPTextModel, CLIPTokenizer
from controlnet_aux.processor import Processor
import custom_pipelines
#

from argparse import Namespace

from train import train

img2img_pipe = None 
txt2img_pipe = None 
processor = None
state_running_process = {}
    
def set_seed(seed):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False

def load_img2img_pipeline(model_id, controlnet_path="lllyasviel/control_v11f1p_sd15_depth", embedding_path=None, placeholder_token="<sks>", num_stages=6):
    global img2img_pipe, processor
    
    tokenizer = CLIPTokenizer.from_pretrained(model_id, subfolder="tokenizer")
    text_encoder = CLIPTextModel.from_pretrained(model_id, subfolder="text_encoder")
    controlnet = ControlNetModel.from_pretrained(controlnet_path, torch_dtype=torch.float16)

    placeholder_token = [f"{placeholder_token}-T{t}" for t in range(num_stages)]
    num_added_tokens = tokenizer.add_tokens(placeholder_token)
    if num_added_tokens == 0:
        raise ValueError("The tokens are already in the tokenizer")
    placeholder_token_id = tokenizer.convert_tokens_to_ids(placeholder_token)
    text_encoder.resize_token_embeddings(len(tokenizer))
    
    learned_embeds = torch.load(embedding_path)
    token_embeds = text_encoder.get_input_embeddings().weight.data
    for token, token_id in zip(placeholder_token, placeholder_token_id):
        token_embeds[token_id] = learned_embeds[token]

    img2img_pipe = custom_pipelines.StableDiffusionControlNetImg2ImgPipeline.from_pretrained(
        model_id,
        controlnet=controlnet,
        text_encoder=text_encoder.to(torch.float16),
        tokenizer=tokenizer,
        torch_dtype=torch.float16,
        safety_checker=None,
    )
    img2img_pipe.scheduler = UniPCMultistepScheduler.from_config(img2img_pipe.scheduler.config)
    img2img_pipe.enable_model_cpu_offload()
    processor = Processor("depth_midas")
    
    return img2img_pipe

def load_txt2img_pipeline(model_id, embedding_path=None, placeholder_token="<sks>", num_stages=6):
    global txt2img_pipe
    
    tokenizer = CLIPTokenizer.from_pretrained(model_id, subfolder="tokenizer")
    text_encoder = CLIPTextModel.from_pretrained(model_id, subfolder="text_encoder")

    placeholder_token = [f"{placeholder_token}-T{t}" for t in range(num_stages)]
    num_added_tokens = tokenizer.add_tokens(placeholder_token)
    if num_added_tokens == 0:
        raise ValueError("The tokens are already in the tokenizer")
    placeholder_token_id = tokenizer.convert_tokens_to_ids(placeholder_token)
    text_encoder.resize_token_embeddings(len(tokenizer))

    learned_embeds = torch.load(embedding_path)
    token_embeds = text_encoder.get_input_embeddings().weight.data
    for token, token_id in zip(placeholder_token, placeholder_token_id):
        token_embeds[token_id] = learned_embeds[token]

    txt2img_pipe = custom_pipelines.StableDiffusionPipeline.from_pretrained(
        model_id,
        text_encoder=text_encoder,
        tokenizer=tokenizer,
        safety_checker=None,
        weight_dtype=torch.float32,
    )
    txt2img_pipe.scheduler = DPMSolverMultistepScheduler.from_config(txt2img_pipe.scheduler.config)
    txt2img_pipe = txt2img_pipe.to("cuda")
    
    return txt2img_pipe

def get_img2img_pipe():
    return img2img_pipe
def get_txt2img_pipe():
    return txt2img_pipe
def get_processor():
    return processor
    
def train_dreamstyler(opt_dict) -> None:
    global state_running_process
    model_name = opt_dict['output_dir'].split('/')[-1]
    state_running_process[model_name] = True
    opt=Namespace(**opt_dict)
    train(opt)
    del state_running_process[model_name]

def img2img_generate(pipe, content_image, placeholder_token, num_stages,
             seed=42, prompt="A painting", 
             alpha_unet=0.4, alpha_text=0.8,
             guidance_scale=7.5) -> Image:
    
    init_image = Image.open(content_image)
    w, h = init_image.size
    
    init_image = init_image.convert("RGB").resize((512, 512))
    control_image = processor(init_image, to_pil=True)
    torch.manual_seed(seed) # 동일 조건 동일 결과 보장
    
    generated_images = []
    if prompt is None:
        prompt = "a painting"
    prompt = prompt + " in the style of {}"
    pos_prompt = [prompt.format(f"{placeholder_token}-T{t}") for t in range(num_stages)]
    print(pos_prompt)
    
    for i in range(3):
        for _ in range(2):
            generated_images.append(
                pipe(prompt=pos_prompt,
                num_inference_steps=30,
                control_image=control_image,
                cross_attention_kwargs={"num_stages": num_stages},
                        image=init_image, strength=0.7+.10*i, guidance_scale=guidance_scale
                        ).images[0].resize((w, h))
            )
    return generated_images 

def txt2img_generate(pipe,
                     prompt="A painting",
                     seed=42, num_inference_steps=25, guidance_scale=7, embedding_path=None,
                    placeholder_token= "<sks>",
                    num_stages=6,
                    use_sc_guidance=False,
                    sty_gamma=0.5,
                    con_gamma=3.0,
                    neg_gamma=5.0,
                    num_samples=5,
                     ) -> Image:
    
    torch.manual_seed(seed) # 동일 조건 동일 결과 보장
    cross_attention_kwargs = {
        "num_stages": num_stages,
        "use_sc_guidance": use_sc_guidance,
        "sty_gamma": sty_gamma,
        "con_gamma": con_gamma,
        "neg_gamma": neg_gamma,
    }
    neg_prompt = (
        "low resolution, poorly drawn, worst quality, low quality,"
        " normal quality, blurry image, artifact"
    )

    if prompt is None:
        prompt = "a painting"
    prompt = prompt + " in the style of {}"
    pos_prompt = [prompt.format(f"{placeholder_token}-T{t}") for t in range(num_stages)]
    print(prompt)
    generated_images = []
    for _ in range(6): 
        generated_images.append(
           pipe(prompt=pos_prompt, 
                num_inference_steps=num_inference_steps, 
                guidance_scale=guidance_scale,
                negative_prompt=neg_prompt,
                cross_attention_kwargs=cross_attention_kwargs).images[0]
        )
        
    return generated_images 
    
def main():
    pass 
    # get data
    
    # model
    
    # train
    
    # save model
    
    
