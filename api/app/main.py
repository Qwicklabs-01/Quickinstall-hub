from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routers import installers, manifests, admin, catalog

@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(installers.router, prefix=settings.API_V1_STR)
app.include_router(manifests.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=f"{settings.API_V1_STR}/admin")
app.include_router(catalog.router, prefix=f"{settings.API_V1_STR}/catalog", tags=["catalog"])
