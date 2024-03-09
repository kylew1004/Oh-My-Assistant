from fastapi import FastAPI
from fastapi import File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
import fastapi as _fapi
from fastapi.middleware.cors import CORSMiddleware

import schemas as _schemas
import services as _services
import io
from pathlib import Path
import uuid
import shutil


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Stable Diffussers API"}

# Endpoint to test the Front-end and backend
@app.get("/api")
async def root():
    return {"message": "Welcome to the Demo of StableDiffusers with FastAPI"}

@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    file_extension = Path(file.filename).suffix
    new_filename = f"{uuid.uuid4()}{file_extension}"
    file_location = f"uploads/{new_filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"filename": new_filename, "location": file_location}

@app.get("/api/generate/")
async def generate_image(imgPromptCreate: _schemas.ImageCreate = _fapi.Depends()):
    
    image = await _services.generate_image(imgPrompt=imgPromptCreate)

    memory_stream = io.BytesIO()
    image.save(memory_stream, format="PNG")
    memory_stream.seek(0)
    return StreamingResponse(memory_stream, media_type="image/png")

@app.post("/translate-pose")
async def translate_pose(file_source: UploadFile = File(...), file_target: UploadFile = File(...)):
    # save files
    source_path = f"uploads/{file_source.filename}"
    target_path = f"uploads/{file_target.filename}"

    with open(source_path, "wb") as buffer:
        shutil.copyfileobj(file_source.file, buffer)
    with open(target_path, "wb") as buffer:
        shutil.copyfileobj(file_target.file, buffer)

    try:
        image = await _services.generate_image(source=source_path, target=target_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"failed image generation: {str(e)}")

    memory_stream = io.BytesIO()
    image.save(memory_stream, format="PNG")
    memory_stream.seek(0)

    return StreamingResponse(memory_stream, media_type="image/png")