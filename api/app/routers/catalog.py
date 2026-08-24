from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models.catalog import Application, Category

router = APIRouter()

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    """Returns all categories and their basic info."""
    categories = db.query(Category).order_by(Category.name).all()
    return [{"id": c.id, "slug": c.slug, "name": c.name} for c in categories]

@router.get("/categories/{slug}")
def get_category_by_slug(slug: str, db: Session = Depends(get_db)):
    """Returns a specific category and all its active applications."""
    category = db.query(Category).filter(Category.slug == slug).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
        
    apps = db.query(Application).filter(Application.category_id == category.id, Application.status == "active").all()
    
    return {
        "id": category.id,
        "name": category.name,
        "slug": category.slug,
        "apps": [{"slug": a.slug, "name": a.name, "description": a.description} for a in apps]
    }

@router.get("/apps")
def get_all_apps(db: Session = Depends(get_db)):
    """Returns all active applications organized by category (for the homepage)."""
    categories = db.query(Category).order_by(Category.name).all()
    results = []
    
    for cat in categories:
        apps = db.query(Application).filter(Application.category_id == cat.id, Application.status == "active").all()
        if apps:
            results.append({
                "name": cat.name,
                "slug": cat.slug,
                "apps": [{"slug": a.slug, "name": a.name} for a in apps]
            })
            
    return results

@router.get("/search")
def search_apps(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    """Full-text search for applications by name or description."""
    apps = db.query(Application).filter(
        Application.status == "active",
        or_(
            Application.name.ilike(f"%{q}%"),
            Application.description.ilike(f"%{q}%")
        )
    ).all()
    
    return [{"slug": a.slug, "name": a.name, "description": a.description, "category": a.category.name if a.category else "Uncategorized"} for a in apps]
