from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives.serialization import (
    load_pem_private_key,
    load_pem_public_key,
)
from cryptography.exceptions import InvalidSignature

# Load the private key from the PEM file
with open("./keypair.pem", "rb") as key_file:
    private_key = load_pem_private_key(
        key_file.read(), password=None, backend=default_backend()
    )

# Message to sign
message = b"{email: qc815@nyu.edu}"

# Sign the message
signature = private_key.sign(
    message,
    padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH),
    hashes.SHA256(),
)

print("Signature:", signature.hex())

# Load the public key from the PEM file
with open("./publickey.crt", "rb") as key_file:
    public_key = load_pem_public_key(key_file.read(), backend=default_backend())

# Verify the signature
try:
    public_key.verify(
        signature,
        message,
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH
        ),
        hashes.SHA256(),
    )
    print("Signature verified: Message is authentic.")
except InvalidSignature:
    print("Signature verification failed: Message has been tampered with.")
