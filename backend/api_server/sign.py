from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives.serialization import (
    load_pem_private_key,
    load_pem_public_key,
)
from cryptography.exceptions import InvalidSignature
import base64

# Load the private key from the PEM file
with open("./keypair.pem", "rb") as key_file:
    private_key = load_pem_private_key(
        key_file.read(), password=None, backend=default_backend()
    )

# Message to sign
message = b"qc815@nyu.edu"

# Sign the message
signature = private_key.sign(
    message,
    padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH),
    hashes.SHA256(),
)

to_verify = bytes.fromhex(
    "626ADC383E4CEF1233F3720B15072D0A96D06E10D38E6A3693BCB894E1AB662F4BB7CE7121008D155FCA361554B169A838CECA3D6FF0DFB9EB1635CB2713FF30F744AD2C61C7E542946A414C3F4F0C301E78DF06435ED06D98A2353BF40C862DCDA998172C041AFB2DD7E95ED359B88444E8405F9FEA2995F001E498C145B9273F42533157A80CFCFC5C56AEAD1DE8874367A847AF6946C2C9F80BD20FC9E2E34CD9EE569EF6B948CDBF121B42341EDB41E37F8F939585F6358CB109492109A955734433BAEBA7FF505851717F43261CD388CD9D46040C0A0FB036FFBE05E8BD98500369573CA35EB11E8F1DF209E4234151B2B83CEB6CEB42F90B9C9ED558CE"
)

for byte in to_verify:
    print(byte, end=" ")
print("")

# print("Signature:", base64.b64encode(bytes.fromhex(signature.hex())).decode("utf-8"))

# Load the public key from the PEM file
with open("./publickey.crt", "rb") as key_file:
    public_key = load_pem_public_key(key_file.read(), backend=default_backend())

# Verify the signature
try:
    public_key.verify(
        to_verify,
        message,
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH
        ),
        hashes.SHA256(),
    )
    print("Signature verified: Message is authentic.")
except InvalidSignature:
    print("Signature verification failed: Message has been tampered with.")
