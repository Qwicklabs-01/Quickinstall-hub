from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    icon = Column(String(50))
    
    applications = relationship("Application", back_populates="category")

class Publisher(Base):
    __tablename__ = "publishers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), unique=True, nullable=False)
    official_domain = Column(String(200))
    
    applications = relationship("Application", back_populates="publisher_obj")

class Application(Base):
    __tablename__ = "applications"
    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    icon = Column(String(255))
    
    category_id = Column(Integer, ForeignKey("categories.id"))
    publisher_id = Column(Integer, ForeignKey("publishers.id"))
    
    official_download_url = Column(String(500))
    homepage_url = Column(String(500))
    license = Column(String(100))
    
    supported_architectures = Column(JSON) # e.g. ["x64", "arm64"]
    latest_version = Column(String(50))
    
    status = Column(String(50), default="active")
    verified = Column(Boolean, default=False)
    featured = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    category = relationship("Category", back_populates="applications")
    publisher_obj = relationship("Publisher", back_populates="applications")
    versions = relationship("ApplicationVersion", back_populates="application")

class ApplicationVersion(Base):
    __tablename__ = "application_versions"
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"))
    version = Column(String(50), nullable=False)
    architecture = Column(String(20))
    download_url = Column(String(500))
    sha256 = Column(String(64))
    installer_type = Column(String(50)) # exe, msi
    silent_args = Column(JSON)
    status = Column(String(50)) # PENDING, VERIFIED, REJECTED
    
    application = relationship("Application", back_populates="versions")

class InstallerProfile(Base):
    __tablename__ = "installer_profiles"
    id = Column(Integer, primary_key=True, index=True)
    installer_id = Column(String(50), unique=True, nullable=False, index=True) # e.g. QI-8F4K2M9X
    selected_apps = Column(JSON) # list of app slugs
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True))

class Manifest(Base):
    __tablename__ = "manifests"
    id = Column(Integer, primary_key=True, index=True)
    version = Column(Integer, unique=True, index=True)
    payload = Column(JSON)
    signature = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
