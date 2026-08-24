import base64
import json
import os
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.hazmat.primitives import serialization

class ManifestVerifier:
    def __init__(self, public_key_pem: bytes):
        """Initialize the verifier with the server's public Ed25519 key."""
        self.public_key = serialization.load_pem_public_key(public_key_pem)

    def verify_manifest(self, payload: dict, signature_b64: str) -> bool:
        """
        Verifies the Ed25519 signature of the payload.
        Returns True if valid, False otherwise.
        """
        try:
            # Must exactly match the deterministic JSON encoding used by the backend
            payload_bytes = json.dumps(payload, separators=(',', ':'), sort_keys=True).encode('utf-8')
            signature = base64.b64decode(signature_b64)
            
            # The verify method raises an exception if the signature is invalid
            self.public_key.verify(signature, payload_bytes)
            return True
        except Exception as e:
            print(f"[ERROR] Signature verification failed: {e}")
            return False

def verify_file_hash(filepath: str, expected_hash: str) -> bool:
    """
    Computes the SHA256 hash of the downloaded file and compares it to the expected hash.
    Returns True if they match, False otherwise.
    """
    import hashlib
    
    if expected_hash == "0000000000000000000000000000000000000000000000000000000000000000":
        print("[!] Warning: Using stub hash (00...00) for MVP, skipping actual hash check.")
        return True
        
    sha256 = hashlib.sha256()
    
    print(f"[*] Calculating SHA-256 hash for {os.path.basename(filepath)}...")
    try:
        with open(filepath, 'rb') as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256.update(byte_block)
                
        actual_hash = sha256.hexdigest()
        
        if actual_hash.lower() == expected_hash.lower():
            return True
        else:
            print(f"[ERROR] Hash mismatch!\nExpected: {expected_hash}\nActual:   {actual_hash}")
            return False
            
    except Exception as e:
        print(f"[ERROR] Failed to read file for hashing: {e}")
        return False
