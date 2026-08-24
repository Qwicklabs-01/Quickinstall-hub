import sys
import os
import json
import argparse
import requests
from crypto import ManifestVerifier
from installer import execute_silent_install, install_app_via_winget
from downloader import DownloadManager
from crypto import verify_file_hash

# Handle PyInstaller's temporary directory for bundled assets
if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'):
    base_path = sys._MEIPASS
    PUBLIC_KEY_PATH = os.path.join(base_path, 'keys', 'public.key')
else:
    base_path = os.path.join(os.path.dirname(__file__), '..', 'api')
    PUBLIC_KEY_PATH = os.path.join(base_path, 'keys', 'public.key')

def extract_embedded_payload():
    """
    Reads the executable itself to find any appended JSON payload.
    Format: ###QI_PAYLOAD_START###{...json...}###QI_PAYLOAD_END###
    """
    try:
        exe_path = sys.executable if getattr(sys, 'frozen', False) else __file__
        with open(exe_path, "rb") as f:
            content = f.read()

        start_tag = b"###QI_PAYLOAD_START###"
        end_tag = b"###QI_PAYLOAD_END###"

        start_idx = content.rfind(start_tag)
        end_idx = content.rfind(end_tag)

        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            raw_json = content[start_idx + len(start_tag):end_idx].decode("utf-8")
            return json.loads(raw_json)
    except Exception as e:
        print(f"[*] Note: No embedded package payload detected ({e})")
    return None

def run_installation_flow(apps):
    print(f"\n==========================================================")
    print(f"       QuickInstall Hub - Windows App Suite Installer     ")
    print(f"==========================================================")
    print(f"\n[*] Found {len(apps)} applications to install:\n")
    for a in apps:
        print(f"  • {a.get('name', a.get('slug', 'App'))}")
    print("\n----------------------------------------------------------")

    success_count = 0
    dl_manager = DownloadManager()

    for idx, app in enumerate(apps, 1):
        name = app.get("name", app.get("slug", f"App #{idx}"))
        winget_id = app.get("wingetId") or app.get("winget_id")
        url = app.get("url")

        print(f"\n[{idx}/{len(apps)}] Processing: {name}")

        # If direct download URL and sha256 is present and not mock, download it
        if url and not url.startswith("https://example.com"):
            filepath = dl_manager.download_app(app)
            if filepath:
                expected_hash = app.get("sha256", "")
                if expected_hash and not verify_file_hash(filepath, expected_hash):
                    print(f"[!] Hash mismatch for {name}. Falling back...")
                else:
                    args = app.get("args", ["/S"])
                    if execute_silent_install(filepath, args):
                        success_count += 1
                        continue

        # Otherwise, install via Winget
        if winget_id:
            if install_app_via_winget(winget_id, name):
                success_count += 1
        else:
            print(f"[!] No valid installer source for {name}.")

    print(f"\n==========================================================")
    print(f"  [✓] Installation Finished! ({success_count}/{len(apps)} completed)")
    print(f"==========================================================\n")

def main():
    embedded_payload = extract_embedded_payload()

    if embedded_payload and "apps" in embedded_payload:
        print("[*] Embedded package detected.")
        run_installation_flow(embedded_payload["apps"])
        input("\nPress Enter to exit...")
        return

    # Check CLI arguments
    if len(sys.argv) > 1:
        manifest_id = sys.argv[1]
        print(f"[*] Fetching installer manifest: {manifest_id}")
        api_base_url = os.environ.get("QUICKINSTALL_API_URL", "http://localhost:8000")
        url = f"{api_base_url}/api/v1/manifests/{manifest_id}"

        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            manifest = response.json()
            apps = manifest.get("payload", {}).get("apps", [])
            run_installation_flow(apps)
        except Exception as e:
            print(f"[!] Error: {e}")
        input("\nPress Enter to exit...")
        return

    print("==========================================================")
    print("                 QuickInstall Hub Desktop                 ")
    print("==========================================================")
    print("Usage:")
    print("  1. Download customized QuickInstall.exe from the website")
    print("  2. Or run: QuickInstall.exe <manifest_id>")
    print("==========================================================")
    input("\nPress Enter to exit...")

if __name__ == "__main__":
    main()
