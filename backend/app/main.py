from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import simit
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_STR}/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "Bienvenido a la API de consulta por placas en el SIMIT",
        "version": settings.VERSION,
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


app.include_router(simit.router, prefix=f"{settings.API_STR}")
