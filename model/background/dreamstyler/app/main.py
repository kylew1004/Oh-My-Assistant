from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from contextlib import asynccontextmanager
from loguru import logger

from config import config
from model import load_img2img_pipeline, load_txt2img_pipeline
from api import router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 모델 로드
    logger.info(f"Loading img2img model: {config.pipeline_name}")
    load_img2img_pipeline(model_id=config.pipeline_name)
    logger.info(f"Loading txt2img model: {config.pipeline_name}")
    load_txt2img_pipeline(model_id=config.pipeline_name)
    # logger.info(f"Loading super-resolution-model: {config.sr_pipeline_name}")
    # load_sr_pipeline(model_id=config.sr_pipeline_name)

    yield 
    
    logger.info(f"Close server...")
        
    
app = FastAPI(lifespan=lifespan)
app.include_router(router)

@app.get("/")
def main():
    content = """
    <body>
        학습한 모델 경로
        <input name="model_id" id="modelId" type="text" value="1f531eeb-fb77-468c-b07f-e65d400e62f6_r16" style="width:300px">
        <form id="img2imgForm" action="/api/model/background/img2img" enctype="multipart/form-data" method="post">
        <hr>
            Img2Img 생성하기
            <input name="content_image" type="file">
            <br>
            <input type="submit" onclick="javascript:img2imgForm.action += ('/' +modelId.value)">
        </form>
        <hr>
        <form id="txt2imgForm" action="/api/model/background/txt2img" enctype="multipart/form-data" method="post">
            Txt2Img 생성하기
            <input name="prompt" type="text" placeholder="Describe the scene with a list of words." style="width:500px">
            <br>
            <input type="submit" onclick="javascript:txt2imgForm.action += ('/' +modelId.value)">
        </form>
        <hr>
        <form action="/api/model/background/train" enctype="multipart/form-data" method="post">
            학습하기
            <input name="style_images" type="file" multiple>
            <input type="submit">
        </form>
    </body>
    """
    return HTMLResponse(content=content)


if __name__ == '__main__':
    import uvicorn
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
    