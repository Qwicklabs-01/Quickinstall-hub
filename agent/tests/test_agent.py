import pytest
import os
import sys
import json
import hashlib
import base64
from tempfile import NamedTemporaryFile
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.hazmat.primitives import serialization

# Ensure agent directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import crypto

@pytest.fixture
def keypair():
    private_key = ed25519.Ed25519PrivateKey.generate()
    public_key = private_key.public_key()
    
    pub_bytes = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    
    return private_key, pub_bytes

def test_verify_manifest_signature_valid(keypair):
    private_key, pub_bytes = keypair
    
    verifier = crypto.ManifestVerifier(pub_bytes)
    
    manifest_data = {"id": "test", "apps": []}
    manifest_bytes = json.dumps(manifest_data, separators=(',', ':'), sort_keys=True).encode('utf-8')
    signature = private_key.sign(manifest_bytes)
    
    # Should return True
    assert verifier.verify_manifest(manifest_data, base64.b64encode(signature).decode('utf-8')) is True

def test_verify_manifest_signature_invalid(keypair):
    private_key, pub_bytes = keypair
    
    verifier = crypto.ManifestVerifier(pub_bytes)
    
    manifest_data = {"id": "test", "apps": []}
    manifest_bytes = json.dumps(manifest_data, separators=(',', ':'), sort_keys=True).encode('utf-8')
    signature = private_key.sign(manifest_bytes)
    
    # Modify the data
    tampered_data = {"id": "test2", "apps": []}
    
    # Should return False
    assert verifier.verify_manifest(tampered_data, base64.b64encode(signature).decode('utf-8')) is False

def test_verify_file_hash():
    content = b"test content"
    expected_hash = hashlib.sha256(content).hexdigest()
    
    with NamedTemporaryFile(delete=False) as f:
        f.write(content)
        file_path = f.name
        
    try:
        assert crypto.verify_file_hash(file_path, expected_hash) is True
        assert crypto.verify_file_hash(file_path, "invalidhash") is False
    finally:
        os.remove(file_path)
