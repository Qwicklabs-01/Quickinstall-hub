import os
import subprocess

def execute_silent_install(filepath: str, args: list[str]) -> bool:
    """
    Executes the installer silently using the provided arguments.
    Returns True if the installation succeeded (exit code 0), False otherwise.
    """
    print(f"[*] Starting silent installation of {os.path.basename(filepath)}")
    
    try:
        command = [filepath] + args
        process = subprocess.Popen(
            command,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        process.wait()
        
        if process.returncode == 0:
            print(f"[+] Installation completed successfully.")
            return True
        else:
            print(f"[!] Installation finished with exit code {process.returncode}.")
            return False
            
    except Exception as e:
        print(f"[ERROR] Failed to execute installer: {e}")
        return False

def install_app_via_winget(winget_id: str, name: str) -> bool:
    """
    Installs an application using Windows Package Manager (winget) silently.
    """
    print(f"[*] Installing {name} ({winget_id}) via Windows Package Manager...")
    try:
        cmd = [
            "winget", "install",
            "--id", winget_id,
            "-e",
            "--silent",
            "--accept-source-agreements",
            "--accept-package-agreements"
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode == 0:
            print(f"[✓] {name} installed successfully.")
            return True
        else:
            print(f"[!] {name} installer exited with code {res.returncode}.")
            # Common winget success / already-installed return codes
            return res.returncode in (0, 2316632107, -1978335189)
    except Exception as e:
        print(f"[!] Winget execution failed: {e}")
        return False
