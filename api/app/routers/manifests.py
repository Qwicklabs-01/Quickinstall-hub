from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.catalog import InstallerProfile, Application, ApplicationVersion, Manifest
from app.schemas.catalog import ManifestResponse
from app.security.signer import signer
from datetime import datetime, timezone
import json

router = APIRouter(prefix="/manifests", tags=["manifests"])

@router.get("/{installer_id}", response_model=ManifestResponse)
def get_installer_manifest(installer_id: str, db: Session = Depends(get_db)):
    profile = db.query(InstallerProfile).filter(InstallerProfile.installer_id == installer_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Installer profile not found")
        
    if profile.expires_at:
        now_utc = datetime.now(timezone.utc)
        expires_at = profile.expires_at if profile.expires_at.tzinfo else profile.expires_at.replace(tzinfo=timezone.utc)
        if expires_at < now_utc:
            raise HTTPException(status_code=410, detail="Installer profile has expired")

    # Fetch app metadata for the selected apps
    apps = db.query(Application).filter(Application.slug.in_(profile.selected_apps)).all()
    
    # Construct the installation payload
    # In a real app we'd join with ApplicationVersion to get the exact hashes and URLs.
    # For MVP, we'll mock the version data if it doesn't exist.
    payload_apps = []
    for app in apps:
        latest_ver = db.query(ApplicationVersion).filter(
            ApplicationVersion.application_id == app.id,
            ApplicationVersion.version == app.latest_version
        ).first()
        
        payload_apps.append({
            "id": app.slug,
            "name": app.name,
            "version": app.latest_version or "1.0.0",
            "url": latest_ver.download_url if latest_ver else app.official_download_url or f"https://example.com/downloads/{app.slug}.exe",
            "sha256": latest_ver.sha256 if latest_ver else "0000000000000000000000000000000000000000000000000000000000000000",
            "args": latest_ver.silent_args if latest_ver else ["/S"]
        })

    payload = {
        "installer_id": profile.installer_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "apps": payload_apps
    }
    
    # Sign the deterministic JSON payload
    signature = signer.sign_payload(payload)
    
    return ManifestResponse(
        manifest_version=1,
        payload=payload,
        signature=signature
    )
