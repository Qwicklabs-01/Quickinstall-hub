from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Any
from datetime import datetime

class CategoryBase(BaseModel):
    name: str
    slug: str
    icon: Optional[str] = None

class Category(CategoryBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class ApplicationBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = None
    latest_version: Optional[str] = None
    verified: bool = False
    featured: bool = False

class Application(ApplicationBase):
    id: int
    category: Optional[Category] = None
    publisher_name: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class InstallerRequest(BaseModel):
    apps: List[str]

class InstallerResponse(BaseModel):
    installer_id: str
    expires_at: datetime
    download_url: str

class ManifestResponse(BaseModel):
    manifest_version: int
    payload: Any
    signature: str
