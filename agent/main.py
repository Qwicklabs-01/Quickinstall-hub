import sys
import argparse
import requests
from crypto import ManifestVerifier
import os

# Handle PyInstaller's temporary directory for bundled assets
if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'):
    base_path = sys._MEIPASS
    PUBLIC_KEY_PATH = os.path.join(base_path, 'keys', 'public.key')
else:
    base_path = os.path.join(os.path.dirname(__file__), '..', 'api')
    PUBLIC_KEY_PATH = os.path.join(base_path, 'keys', 'public.key')

def main():
    parser = argparse.ArgumentParser(description="QuickInstall Hub Desktop Agent")
    parser.add_argument("manifest_id", help="The ID of the installer manifest to fetch and execute")
    args = parser.parse_args()
    
    print(f"[*] Starting QuickInstall Agent for manifest: {args.manifest_id}")
    
    # 1. Fetch manifest from backend
    api_base_url = os.environ.get("QUICKINSTALL_API_URL", "http://localhost:8000")
    url = f"{api_base_url}/api/v1/manifests/{args.manifest_id}"
    print(f"[*] Fetching manifest from {url}...")
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        manifest = response.json()
    except Exception as e:
        print(f"[!] Failed to fetch manifest: {e}")
        sys.exit(1)
        
    print("[*] Manifest fetched successfully.")
    
    # 2. Verify Cryptographic Signature
    if not os.path.exists(PUBLIC_KEY_PATH):
        print(f"[!] Critical Error: Public key not found at {PUBLIC_KEY_PATH}")
        sys.exit(1)
        
    with open(PUBLIC_KEY_PATH, "rb") as f:
        public_key_pem = f.read()
        
    verifier = ManifestVerifier(public_key_pem)
    
    payload = manifest.get("payload")
    signature = manifest.get("signature")
    
    if not payload or not signature:
        print("[!] Invalid manifest format (missing payload or signature)")
        sys.exit(1)
        
    print("[*] Verifying Ed25519 signature...")
    if not verifier.verify_manifest(payload, signature):
        print("[!] SECURITY WARNING: Manifest signature verification failed! The payload may have been tampered with.")
        sys.exit(1)
        
    print("[+] Signature verified! Payload is authentic.")
    
    # 3. Process the payload
    apps = payload.get("apps", [])
    print(f"[*] Found {len(apps)} applications to install:")
    
    from downloader import DownloadManager
    from crypto import verify_file_hash
    from installer import execute_silent_install
    
    dl_manager = DownloadManager()
    downloaded_files = []
    
    for app in apps:
        print(f"\n[*] Preparing {app['name']} (v{app['version']})")
        
        # 1. Download
        filepath = dl_manager.download_app(app)
        if not filepath:
            print(f"[!] Skipping {app['name']} due to download failure.")
            continue
            
        # 2. Verify Hash
        expected_hash = app.get("sha256", "0000000000000000000000000000000000000000000000000000000000000000")
        if not verify_file_hash(filepath, expected_hash):
            print(f"[!] Skipping {app['name']} due to hash mismatch. File may be corrupted!")
            continue
            
        downloaded_files.append({
            "app": app,
            "path": filepath
        })
            
    print(f"\n[+] Successfully downloaded and verified {len(downloaded_files)}/{len(apps)} applications.")
    
    # 4. Execute Silent Installers
    print("\n[*] Starting Installation Phase...")
    success_count = 0
    for item in downloaded_files:
        app = item["app"]
        filepath = item["path"]
        args = app.get("args", ["/S"])
        
        if execute_silent_install(filepath, args):
            success_count += 1
            
    print(f"\n[===========================================]")
    print(f"[*] QuickInstall Complete! Successfully installed {success_count}/{len(downloaded_files)} apps.")
    print(f"[===========================================]\n")

if __name__ == "__main__":
    main()
