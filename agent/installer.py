import os
import subprocess

def execute_silent_install(filepath: str, args: list[str]) -> bool:
    """
    Executes the installer silently using the provided arguments.
    Returns True if the installation succeeded (exit code 0), False otherwise.
    """
    print(f"[*] Starting silent installation of {os.path.basename(filepath)}")
    print(f"[*] Arguments: {' '.join(args)}")
    
    try:
        # Build the command. We use list form to avoid shell injection issues.
        command = [filepath] + args
        
        # We redirect stdout and stderr to DEVNULL to keep the main console clean,
        # but in a real product we might log this to a file for troubleshooting.
        process = subprocess.Popen(
            command,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        
        # Wait for the installer to finish
        process.wait()
        
        if process.returncode == 0:
            print(f"[+] Installation completed successfully.")
            return True
        else:
            print(f"[!] Installation failed with exit code {process.returncode}.")
            return False
            
    except Exception as e:
        print(f"[ERROR] Failed to execute installer: {e}")
        return False
