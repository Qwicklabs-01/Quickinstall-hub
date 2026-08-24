import sys
import os
from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.models.catalog import Category, Publisher, Application, ApplicationVersion
from app.config import settings

def seed_database():
    print("[*] Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # 1. Create Publishers
        pub_default = Publisher(name="Various", official_domain="example.com")
        db.add(pub_default)
        db.commit()
        db.refresh(pub_default)

        # 2. Extract Categories from the frontend list
        categories_data = [
            {"name": "Web Browsers", "apps": ["Chrome", "Firefox", "Edge", "Brave", "Vivaldi", "Opera", "Opera GX", "Tor Browser", "Arc", "Thorium"]},
            {"name": "Messaging", "apps": ["Zoom", "Discord", "Teams", "Slack", "Telegram", "Signal", "WhatsApp", "Skype", "Element", "Guilded"]},
            {"name": "Media", "apps": ["VLC", "Spotify", "iTunes", "OBS Studio", "DaVinci Resolve", "HandBrake", "AIMP", "Audacity", "MPC-HC", "K-Lite Codecs"]},
            {"name": "Developer Tools", "apps": ["VS Code", "Cursor", "Visual Studio 2022", "JetBrains Toolbox", "Docker Desktop", "GitHub Desktop", "Git", "Postman", "Windows Terminal", "Wireshark", "PuTTY", "Notepad++"]},
            {"name": "Runtimes", "apps": ["Java (JRE) 8", "Java (JDK) 21", ".NET Desktop Runtime 8.0", ".NET Desktop Runtime 6.0", "Python 3.12", "Node.js 22 Current", "Node.js 20 LTS"]},
            {"name": "Adobe Creative Cloud", "apps": ["Photoshop", "Illustrator", "Premiere Pro", "After Effects", "Lightroom", "InDesign", "Acrobat Pro"]},
            {"name": "Imaging & Design", "apps": ["Blender", "Figma", "Affinity Photo 2", "Affinity Designer 2", "Krita", "GIMP", "Paint.NET", "Inkscape", "ShareX", "Lightshot", "Capture One Pro", "CorelDRAW Graphics Suite"]},
            {"name": "Documents & Notes", "apps": ["Microsoft 365", "Adobe Acrobat Reader", "Foxit PDF Reader", "LibreOffice", "Notion", "Obsidian", "Evernote", "PDF Reader Pro"]},
            {"name": "Download Managers", "apps": ["4K Video Downloader Plus", "Any Video Downloader Pro", "Free YouTube Download", "Downie", "PullTube"]},
            {"name": "Audio & Music", "apps": ["Apple Logic Pro X", "FL Studio", "Ableton Live"]},
            {"name": "Operating Systems", "apps": ["Windows 11 Professional", "Windows Server 2025", "Windows Server 2022", "Ubuntu Desktop"]},
            {"name": "Windows Utilities", "apps": ["PowerToys", "Sysinternals Suite", "Rufus", "HWiNFO", "MSI Afterburner", "CrystalDiskInfo", "Revo Uninstaller", "WizTree", "Everything"]},
            {"name": "Mac Essentials", "apps": ["Alfred", "Raycast", "Homebrew", "iTerm2", "CleanMyMac X", "Magnet", "Rectangle"]},
            {"name": "Gaming", "apps": ["Steam", "Epic Games Launcher", "GOG Galaxy", "EA App", "Ubisoft Connect", "Riot Client"]},
            {"name": "Security & Passwords", "apps": ["Malwarebytes", "Bitdefender", "1Password", "Bitwarden", "KeePassXC"]},
            {"name": "Online Storage", "apps": ["Google Drive", "OneDrive", "Dropbox", "Nextcloud"]},
            {"name": "Compression", "apps": ["7-Zip", "WinRAR", "PeaZip", "Bandizip"]},
            {"name": "File Sharing", "apps": ["qBittorrent", "Transmission", "FileZilla", "WinSCP"]}
        ]

        print("[*] Seeding Categories and Applications...")
        for cat_idx, cat_data in enumerate(categories_data):
            # Check if category exists
            cat_slug = cat_data["name"].lower().replace(" ", "-").replace("&", "and")
            db_cat = db.query(Category).filter(Category.slug == cat_slug).first()
            if not db_cat:
                db_cat = Category(
                    name=cat_data["name"],
                    slug=cat_slug
                )
                db.add(db_cat)
                db.commit()
                db.refresh(db_cat)

            for app_name in cat_data["apps"]:
                app_slug = app_name.lower().replace(" ", "-").replace(".", "-").replace("(", "").replace(")", "")
                
                # Check if app exists
                db_app = db.query(Application).filter(Application.slug == app_slug).first()
                if not db_app:
                    db_app = Application(
                        name=app_name,
                        slug=app_slug,
                        description=f"{app_name} installation package.",
                        category_id=db_cat.id,
                        publisher_id=pub_default.id,
                        status="active",
                        latest_version="1.0.0",
                        official_download_url=f"https://example.com/downloads/{app_slug}.exe"
                    )
                    db.add(db_app)
                    db.commit()
                    db.refresh(db_app)
                    
                    # Create a default version entry
                    db_ver = ApplicationVersion(
                        application_id=db_app.id,
                        version="1.0.0",
                        download_url=f"https://example.com/downloads/{app_slug}-1.0.0.exe",
                        sha256="0000000000000000000000000000000000000000000000000000000000000000",
                        silent_args=["/S", "/quiet"],
                        status="VERIFIED"
                    )
                    db.add(db_ver)
                    db.commit()

        print("[+] Seeding complete! Database is populated with default software.")
    except Exception as e:
        print(f"[!] Seeding failed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Must be run with PYTHONPATH set to the parent directory or run as `python -m app.seed`
    seed_database()
