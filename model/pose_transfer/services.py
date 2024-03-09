import schemas as _schemas

from diffusers import StableDiffusionPipeline
import os
from dotenv import load_dotenv

# model
from src.dwpose import DWposeDetector
from diffusers import AutoencoderKL, DDIMScheduler
from src.models.unet_2d_condition import UNet2DConditionModel
from src.models.unet_3d import UNet3DConditionModel
from src.models.pose_guider import PoseGuider
from transformers import CLIPVisionModelWithProjection
from src.pipelines.pipeline_pose2img import Pose2ImagePipeline

# other
import argparse
from omegaconf import OmegaConf
from torchvision import transforms
import torch
import numpy as np
from PIL import Image
from datetime import datetime
from pathlib import Path 


class AnimateAnyone:
    def __init__(self):
        self.args = argparse.Namespace()
        self.parse_args()

        self.weight_dtype = torch.float16 if self.args.weight_dtype == "fp16" else torch.float32
        self.infer_config = OmegaConf.load(self.args.inference_config_path)
        
        self.vae = None
        self.reference_unet = None
        self.denoising_unet = None
        self.pose_guider = None
        self.image_enc = None
        self.load_models()

        sched_kwargs = OmegaConf.to_container(self.infer_config.noise_scheduler_kwargs)
        self.scheduler = DDIMScheduler(**sched_kwargs)

        self.pipe = Pose2ImagePipeline(
        vae=self.vae,
        image_encoder=self.image_enc,
        reference_unet=self.reference_unet,
        denoising_unet=self.denoising_unet,
        pose_guider=self.pose_guider,
        scheduler=self.scheduler,
        )
        self.pipe = self.pipe.to("cuda", dtype=self.weight_dtype)

            
    def parse_args(self):
        self.args.source_path = '/data/ephemeral/data/webtoon/001.png'
        self.args.target_path = '/data/ephemeral/data/webtoon/002.png'

        self.args.pretrained_base_model_path = '/data/ephemeral/Moore-AnimateAnyone/pretrained_weights/stable-diffusion-v1-5/'
        self.args.pretrained_vae_path = '/data/ephemeral/Moore-AnimateAnyone/pretrained_weights/sd-vae-ft-mse'
        self.args.pretrained_image_encoder_path = '/data/ephemeral/Moore-AnimateAnyone/pretrained_weights/image_encoder'
        self.args.pretrained_denoising_unet_path = '/data/ephemeral/Moore-AnimateAnyone/pretrained_weights/denoising_unet.pth'
        self.args.pretrained_reference_unet_path = '/data/ephemeral/Moore-AnimateAnyone/pretrained_weights/reference_unet.pth'
        self.args.pretrained_pose_guider_path = '/data/ephemeral/Moore-AnimateAnyone/pretrained_weights/pose_guider.pth'
        self.args.pretrained_motion_module_path = '/data/ephemeral/Moore-AnimateAnyone/pretrained_weights/motion_module.pth'
        self.args.inference_config_path = '/data/ephemeral/Moore-AnimateAnyone/configs/inference/inference_v2.yaml'

        self.args.seed = 42
        self.args.weight_dtype = 'fp16'
        self.args.steps = 30
        self.args.cfg = 3.5

    def load_models(self):
        '''
        model load
        '''
        self.vae = AutoencoderKL.from_pretrained(
            self.args.pretrained_vae_path,
        ).to("cuda", dtype=self.weight_dtype)

        self.reference_unet = UNet2DConditionModel.from_pretrained(
            self.args.pretrained_base_model_path,
            subfolder="unet",
        ).to(dtype=self.weight_dtype, device="cuda")

        self.denoising_unet = UNet3DConditionModel.from_pretrained_2d(
            self.args.pretrained_base_model_path,
            # args.pretrained_motion_module_path,
            "",
            subfolder="unet",
            unet_additional_kwargs=self.infer_config.unet_additional_kwargs,
        ).to(dtype=self.weight_dtype, device="cuda")

        self.pose_guider = PoseGuider(320, block_out_channels=(16, 32, 96, 256)).to(
            dtype=self.weight_dtype, device="cuda"
        )

        self.image_enc = CLIPVisionModelWithProjection.from_pretrained(
            self.args.pretrained_image_encoder_path
        ).to(dtype=self.weight_dtype, device="cuda")

        self.denoising_unet.load_state_dict(
            torch.load(self.args.pretrained_denoising_unet_path, map_location="cpu"),
            strict=False,
        )
        self.reference_unet.load_state_dict(
            torch.load(self.args.pretrained_reference_unet_path, map_location="cpu"),
        )
        self.pose_guider.load_state_dict(
            torch.load(self.args.pretrained_pose_guider_path, map_location="cpu"),
        )


    @torch.inference_mode()
    def inference_img2img(self, source, target):
        generator = torch.manual_seed(self.args.seed) if self.args.seed is not None else torch.manual_seed(self.args.seed)
        
        # source_img = Image.open(args.source_path).convert('RGB')
        source_img = Image.open(source).convert('RGB')
        width = source_img.width
        height = source_img.height

        '''
        get pose from target image
        '''
        detector = DWposeDetector()
        detector = detector.to(f"cuda")

        # target_img = Image.open(args.target_path).convert('RGB')
        target_img = Image.open(target).convert('RGB')
        target_pose, _ = detector(target_img)
        pose_transform = transforms.Compose(
            [transforms.Resize((height, width)), transforms.ToTensor()]
        )
        target_tensor = pose_transform(target_pose)

        result = self.pipe(
            source_img, 
            target_tensor,
            width,
            height,
            self.args.steps,
            self.args.cfg,
            generator=generator,
            return_dict=False
        )

        result = result[0, :, 0].permute(1, 2, 0).cpu().numpy()
        result = Image.fromarray((result * 255).astype(np.uint8))
        return result, target_pose


model = AnimateAnyone()
async def generate_image(source, target):
    return model.inference_img2img(source, target)
