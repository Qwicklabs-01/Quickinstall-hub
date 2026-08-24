import os
import requests
from urllib.parse import urlparse
from tqdm import tqdm

class DownloadManager:
    def __init__(self):
        # We'll use the user's temp directory
        self.download_dir = os.path.join(os.environ.get('TEMP', '/tmp'), 'QuickInstallHub')
        os.makedirs(self.download_dir, exist_ok=True)
        
    def download_app(self, app_info: dict) -> str | None:
        """
        Downloads the app to the temp directory with a progress bar.
        Returns the absolute path to the downloaded file, or None if it failed.
        """
        url = app_info.get("url")
        name = app_info.get("name", "Unknown App")
        
        if not url:
            print(f"[!] No download URL provided for {name}")
            return None
            
        # Parse the filename from the URL, fallback to something generic
        parsed = urlparse(url)
        filename = os.path.basename(parsed.path)
        if not filename:
            filename = f"{app_info.get('id', 'app')}.exe"
            
        filepath = os.path.join(self.download_dir, filename)
        
        # Stream the download and show a progress bar
        print(f"[*] Downloading {name}...")
        try:
            response = requests.get(url, stream=True)
            response.raise_for_status()
            
            total_size_in_bytes = int(response.headers.get('content-length', 0))
            block_size = 1024 * 1024 # 1 Megabyte
            
            with tqdm(total=total_size_in_bytes, unit='iB', unit_scale=True, desc=name) as progress_bar:
                with open(filepath, 'wb') as file:
                    for data in response.iter_content(block_size):
                        progress_bar.update(len(data))
                        file.write(data)
                        
            # If the server doesn't provide a content-length, we check if file exists
            if total_size_in_bytes != 0 and progress_bar.n != total_size_in_bytes:
                print(f"[!] Warning: Downloaded size does not match expected size for {name}")
                
            return filepath
            
        except Exception as e:
            print(f"[!] Error downloading {name}: {e}")
            return None
