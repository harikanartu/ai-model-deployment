
import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from google import genai
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI(
    title="AI Model Deployment API",
    description="A text generation service powered by Gemini",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ai-model-deployment-frontend.vercel.app",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None


class GenerateRequest(BaseModel):
    prompt: str = Field(min_length=1, max_length=4000)


@app.get("/")
def home():
    return {"message": "AI Model Deployment API is running!"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/generate")
def generate(request: GenerateRequest):
    if client is None:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY is not configured.",
        )

    try:
        result = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=request.prompt,
        )
        return {
            "prompt": request.prompt,
            "response": result.text or "",
        }
    except Exception as e:
        print(f"Gemini API error: {type(e).__name__}: {e}")
        raise HTTPException(
            status_code=502,
            detail=f"AI provider error: {type(e).__name__}: {e}",
        )