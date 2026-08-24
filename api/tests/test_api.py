import pytest
import os
import sys

# Ensure api directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db
from app.models.catalog import Category, Publisher, Application, ApplicationVersion, InstallerProfile, Manifest

# Use an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    # Setup test data
    db = TestingSessionLocal()
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    cat = Category(name="Test Category", slug="test-category")
    db.add(cat)
    db.flush()
    
    pub = Publisher(name="Test Publisher")
    db.add(pub)
    db.flush()
    
    app1 = Application(
        name="Test App", 
        slug="test-app", 
        category_id=cat.id, 
        publisher_id=pub.id,
        status="active"
    )
    db.add(app1)
    db.flush()
    
    ver = ApplicationVersion(
        application_id=app1.id,
        version="1.0.0",
        download_url="http://example.com/test.exe",
        sha256="0000000000000000000000000000000000000000000000000000000000000000"
    )
    db.add(ver)
    
    db.commit()
    db.close()
    yield

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_get_catalog_categories():
    response = client.get("/api/v1/catalog/categories")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["slug"] == "test-category"

def test_get_catalog_apps():
    response = client.get("/api/v1/catalog/apps")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Test Category"
    assert len(data[0]["apps"]) == 1
    assert data[0]["apps"][0]["slug"] == "test-app"

def test_create_installer():
    response = client.post("/api/v1/installers/", json={"apps": ["test-app"]})
    assert response.status_code == 200
    data = response.json()
    assert "installer_id" in data
    assert "download_url" in data

def test_get_manifest():
    create_res = client.post("/api/v1/installers/", json={"apps": ["test-app"]})
    assert create_res.status_code == 200
    installer_id = create_res.json()["installer_id"]
    
    response = client.get(f"/api/v1/manifests/{installer_id}")
    assert response.status_code == 200
    
    data = response.json()
    assert "payload" in data
    assert data["payload"]["installer_id"] == installer_id
    assert "apps" in data["payload"]
    assert len(data["payload"]["apps"]) == 1
    assert data["payload"]["apps"][0]["id"] == "test-app"
    assert "signature" in data
    assert len(data["signature"]) > 0
