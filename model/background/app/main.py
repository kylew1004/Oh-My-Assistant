from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from contextlib import asynccontextmanager
from loguru import logger

from config import config
from model import load_pipeline, patch_pipeline
from api import router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 모델 로드
    logger.info(f"Loading model\n{vars(config)}")
    load_pipeline(model_id=config.pipeline_name)

    yield 
    
    logger.info(f"Close server...")
        
    
app = FastAPI(lifespan=lifespan)
app.include_router(router)

@app.get("/")
def main():
    content = """
    <body>
        <form action="/api/model/background" enctype="multipart/form-data" method="post">
        생성하기
            <input name="content_image" type="file">
            <br>
            학습한 모델 경로
            <input name="model_path" type="text" value="" style="width:500px">
            <input type="submit">
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
    