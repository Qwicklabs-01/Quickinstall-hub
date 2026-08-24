import json
import base64
from typing import Any, Dict
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.hazmat.primitives import serialization
from app.config import settings
import os

class ManifestSigner:
    def __init__(self):
        self.private_key = None
        self.public_key = None
        self._load_or_generate_keys()

    def _load_or_generate_keys(self):
        # In a real app, keys should be loaded from secure storage.
        # For this MVP, we generate on the fly if they don't exist.
        os.makedirs(os.path.dirname(settings.SIGNING_PRIVATE_KEY_PATH), exist_ok=True)
        
        if os.path.exists(settings.SIGNING_PRIVATE_KEY_PATH):
            with open(settings.SIGNING_PRIVATE_KEY_PATH, "rb") as f:
                self.private_key = serialization.load_pem_private_key(
                    f.read(),
                    password=None
                )
            with open(settings.SIGNING_PUBLIC_KEY_PATH, "rb") as f:
                self.public_key = serialization.load_pem_public_key(
                    f.read()
                )
        else:
            self.private_key = ed25519.Ed25519PrivateKey.generate()
            self.public_key = self.private_key.public_key()
            
            with open(settings.SIGNING_PRIVATE_KEY_PATH, "wb") as f:
                f.write(self.private_key.private_bytes(
                    encoding=serialization.Encoding.PEM,
                    format=serialization.PrivateFormat.PKCS8,
                    encryption_algorithm=serialization.NoEncryption()
                ))
            with open(settings.SIGNING_PUBLIC_KEY_PATH, "wb") as f:
                f.write(self.public_key.public_bytes(
                    encoding=serialization.Encoding.PEM,
                    format=serialization.PublicFormat.SubjectPublicKeyInfo
                ))

    def sign_payload(self, payload: Dict[str, Any]) -> str:
        # Sort keys to ensure deterministic JSON serialization
        payload_bytes = json.dumps(payload, separators=(',', ':'), sort_keys=True).encode('utf-8')
        signature = self.private_key.sign(payload_bytes)
        return base64.b64encode(signature).decode('utf-8')

signer = ManifestSigner()
