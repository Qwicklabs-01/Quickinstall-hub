from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.catalog import Application, ApplicationVersion, Category
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class AppVersionUpdate(BaseModel):
    version: str
    download_url: str
    sha256: str

class AppUpdate(BaseModel):
    name: str
    official_download_url: str
    latest_version: str
    
@router.get("/apps", response_model=List[dict])
def get_all_apps(db: Session = Depends(get_db)):
    """Fetches all applications with their current default versions."""
    apps = db.query(Application).all()
    results = []
    for app in apps:
        ver = db.query(ApplicationVersion).filter(ApplicationVersion.application_id == app.id).first()
        results.append({
            "id": app.id,
            "slug": app.slug,
            "name": app.name,
            "category": app.category.name if app.category else "Unknown",
            "url": app.official_download_url,
            "version": app.latest_version,
            "sha256": ver.sha256 if ver else "",
        })
    return results

@router.put("/apps/{app_id}")
def update_app(app_id: int, app_data: AppUpdate, db: Session = Depends(get_db)):
    """Updates the core application metadata."""
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="App not found")
        
    app.name = app_data.name
    app.official_download_url = app_data.official_download_url
    app.latest_version = app_data.latest_version
    db.commit()
    
    return {"message": "App updated successfully"}

@router.put("/apps/{app_id}/version")
def update_app_version(app_id: int, version_data: AppVersionUpdate, db: Session = Depends(get_db)):
    """Updates or creates the application version data (including hash)."""
    ver = db.query(ApplicationVersion).filter(ApplicationVersion.application_id == app_id).first()
    
    if not ver:
        ver = ApplicationVersion(application_id=app_id)
        db.add(ver)
        
    ver.version = version_data.version
    ver.download_url = version_data.download_url
    ver.sha256 = version_data.sha256
    
    db.commit()
    return {"message": "App version updated successfully"}
