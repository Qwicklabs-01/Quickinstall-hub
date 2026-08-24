from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.catalog import InstallerProfile, Application
from app.schemas.catalog import InstallerRequest, InstallerResponse
from datetime import datetime, timedelta, timezone
import uuid

router = APIRouter(prefix="/installers", tags=["installers"])

@router.post("/", response_model=InstallerResponse)
def create_installer(request: InstallerRequest, db: Session = Depends(get_db)):
    if not request.apps:
        raise HTTPException(status_code=400, detail="No applications selected")
        
    # Verify all requested apps exist
    existing_apps = db.query(Application).filter(Application.slug.in_(request.apps)).all()
    existing_slugs = {app.slug for app in existing_apps}
    
    invalid_slugs = set(request.apps) - existing_slugs
    if invalid_slugs:
        # In a real app we might just ignore invalid slugs, but for safety we reject
        raise HTTPException(status_code=400, detail=f"Invalid application slugs: {invalid_slugs}")
        
    # Generate unique ID (e.g. QI-8F4K2M9X)
    installer_id = f"QI-{str(uuid.uuid4())[:8].upper()}"
    expires_at = datetime.now(timezone.utc) + timedelta(days=7) # Profiles expire in 7 days
    
    profile = InstallerProfile(
        installer_id=installer_id,
        selected_apps=list(existing_slugs),
        expires_at=expires_at
    )
    
    db.add(profile)
    db.commit()
    db.refresh(profile)
    
    return InstallerResponse(
        installer_id=profile.installer_id,
        expires_at=profile.expires_at,
        download_url=f"/api/v1/installers/{profile.installer_id}/download"
    )

from fastapi.responses import StreamingResponse
import io
import zipfile
import os

@router.get("/{installer_id}/download")
def download_installer(installer_id: str, db: Session = Depends(get_db)):
    # Verify installer exists
    profile = db.query(InstallerProfile).filter(InstallerProfile.installer_id == installer_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Installer profile not found")
        
    exe_path = os.path.join(os.path.dirname(__file__), "../../../agent/dist/QuickInstall.exe")
    
    # Create in-memory zip
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "a", zipfile.ZIP_DEFLATED, False) as zip_file:
        # Add the executable if it exists
        if os.path.exists(exe_path):
            zip_file.write(exe_path, "QuickInstall.exe")
        else:
            # If not built yet, we can write a dummy text file to warn the user
            zip_file.writestr("README.txt", "The QuickInstall.exe agent has not been built yet on the server. Please run agent/build.ps1")
            
        # Add the batch script that runs it
        bat_content = f"@echo off\r\necho Starting QuickInstall Hub...\r\nQuickInstall.exe {installer_id}\r\npause\r\n"
        zip_file.writestr(f"Install-{installer_id}.bat", bat_content)
        
    zip_buffer.seek(0)
    
    return StreamingResponse(
        zip_buffer,
        media_type="application/x-zip-compressed",
        headers={"Content-Disposition": f"attachment; filename=QuickInstall-{installer_id}.zip"}
    )
