
import os
from pathlib import Path
from datetime import datetime

import torch
import numpy as np
from PIL import Image
import argparse
from omegaconf import OmegaConf
from torchvision import transforms

# pose model
from src.dwpose import DWposeDetector
from diffusers import AutoencoderKL, DDIMScheduler
from src.models.unet_2d_condition import UNet2DConditionModel
from src.models.unet_3d import UNet3DConditionModel
from src.models.pose_guider import PoseGuider
from transformers import CLIPVisionModelWithProjection
from src.pipelines.pipeline_pose2img import Pose2ImagePipeline

# segment model
from segment_anything import sam_model_registry, SamAutomaticMaskGenerator, SamPredictor

# warning
import warnings
warnings.filterwarnings('ignore', category=UserWarning)
warnings.filterwarnings('ignore', category=FutureWarning)

def parse_args():
    parser = argparse.ArgumentParser()
    
    # input image
    parser.add_argument("--source_path", type=str, default='/home/solee/data/webtoon/002.png')
    parser.add_argument("--target_path", type=str, default='/home/solee/data/webtoon/001.png')

    # pretrained models
    parser.add_argument("--pretrained_base_model_path", type=str, default='/dev/pretrained_weights/stable-diffusion-v1-5/')
    parser.add_argument("--pretrained_vae_path", type=str, default='/dev/pretrained_weights/sd-vae-ft-mse')
    parser.add_argument("--pretrained_image_encoder_path", type=str, default='/dev/pretrained_weights/image_encoder')
    parser.add_argument("--pretrained_denoising_unet_path", type=str, default='/dev/pretrained_weights/denoising_unet.pth')
    parser.add_argument("--pretrained_reference_unet_path", type=str, default='/dev/pretrained_weights/reference_unet.pth')
    parser.add_argument("--pretrained_pose_guider_path", type=str, default='/dev/pretrained_weights/pose_guider.pth')
    # parser.add_argument("--pretrained_motion_module_path", type=str, default='/dev/pretrained_weights/motion_module.pth')
    parser.add_argument("--inference_config_path", type=str, default='/home/solee/Moore-AnimateAnyone/configs/inference/inference_v2.yaml')

    # options
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--weight_dtype", type=str, default='fp16')
    parser.add_argument("--steps", type=int, default=30)
    parser.add_argument("--cfg", type=float, default=3.5)

    args = parser.parse_args()

    return args


def main():
    args = parse_args()

    if args.weight_dtype == "fp16":
        weight_dtype = torch.float16
    else:
        weight_dtype = torch.float32


    '''
    check image path 
    '''
    if not os.path.exists(args.source_path):
        raise ValueError(f"Path: {args.source_path} not exists")
    if not os.path.exists(args.target_path):
        raise ValueError(f"Path: {args.target_path} not exists")

    
    '''
    pose estimation(get pose from target image)
    '''
    detector = DWposeDetector()
    detector = detector.to(f"cuda")

    target_img = Image.open(args.target_path).convert('RGB')
    target_pose, _ = detector(target_img)
    target_pose.save('./pose.png')


    '''
    model load
    '''
    vae = AutoencoderKL.from_pretrained(
        args.pretrained_vae_path,
    ).to("cuda", dtype=weight_dtype)

    reference_unet = UNet2DConditionModel.from_pretrained(
        args.pretrained_base_model_path,
        subfolder="unet",
    ).to(dtype=weight_dtype, device="cuda")

    infer_config = OmegaConf.load(args.inference_config_path)
    denoising_unet = UNet3DConditionModel.from_pretrained_2d(
        args.pretrained_base_model_path,
        # args.pretrained_motion_module_path,
        "",
        subfolder="unet",
        unet_additional_kwargs=infer_config.unet_additional_kwargs,
    ).to(dtype=weight_dtype, device="cuda")

    pose_guider = PoseGuider(320, block_out_channels=(16, 32, 96, 256)).to(
        dtype=weight_dtype, device="cuda"
    )

    image_enc = CLIPVisionModelWithProjection.from_pretrained(
        args.pretrained_image_encoder_path
    ).to(dtype=weight_dtype, device="cuda")

    denoising_unet.load_state_dict(
        torch.load(args.pretrained_denoising_unet_path, map_location="cpu"),
        strict=False,
    )
    reference_unet.load_state_dict(
        torch.load(args.pretrained_reference_unet_path, map_location="cpu"),
    )
    pose_guider.load_state_dict(
        torch.load(args.pretrained_pose_guider_path, map_location="cpu"),
    )


    '''
    setting
    '''
    sched_kwargs = OmegaConf.to_container(infer_config.noise_scheduler_kwargs)
    scheduler = DDIMScheduler(**sched_kwargs)

    generator = torch.manual_seed(args.seed)

    source_img = Image.open(args.source_path).convert('RGB')
    width = source_img.width
    height = source_img.height

    pipe = Pose2ImagePipeline(
        vae=vae,
        image_encoder=image_enc,
        reference_unet=reference_unet,
        denoising_unet=denoising_unet,
        pose_guider=pose_guider,
        scheduler=scheduler,
    )
    pipe = pipe.to("cuda", dtype=weight_dtype)

    date_str = datetime.now().strftime("%Y%m%d")
    time_str = datetime.now().strftime("%H%M")
    save_dir_name = f"{time_str}--seed_{args.seed}"
    save_dir = Path(f"output/{date_str}/{save_dir_name}")
    save_dir.mkdir(exist_ok=True, parents=True)

    '''
    transform
    '''
    pose_transform = transforms.Compose(
        [transforms.Resize((height, width)), transforms.ToTensor()]
    )
    target_tensor = pose_transform(target_pose)
    # source_tensor = pose_transform(source_img)

    '''
    pose transfer
    '''
    result = pipe(
        source_img, 
        target_tensor,
        width,
        height,
        args.steps,
        args.cfg,
        generator=generator,
        return_dict=False
    )

    result = result[0, :, 0].permute(1, 2, 0).cpu().numpy() # (3, 512, 512)
    result = Image.fromarray((result * 255).astype(np.uint8))
    result.save('./result.png')


    '''
    SAM(optional)
    '''
    # sam_checkpoint = "/dev/pretrained_weights/sam_vit_h_4b8939.pth"
    # model_type = "vit_h"
    # sam = sam_model_registry[model_type](checkpoint=sam_checkpoint)
    # sam.to(device=f"cuda")

    # mask_generator = SamAutomaticMaskGenerator(sam)
    # masks = mask_generator.generate(np.array(result))
    # selected_mask = sorted(masks, key=lambda d: d['area'], reverse=True)[0]['segmentation']
    # selected_segmentation = np.array(result)
    # selected_segmentation[selected_mask] = 0
    # selected_segmentation = Image.fromarray(selected_segmentation)
    # selected_segmentation.save('./result2.png')




if __name__ == "__main__":
    main()

