import socket
from Crypto.PublicKey import RSA
from Crypto.Signature import PKCS1_v1_5
from Crypto.Hash import SHA256
import base64
import json

# Load private key from file
with open("private_key.der", "rb") as key_file:
    private_key = RSA.import_key(key_file.read())

def register_xmpp(username, password):
    data = {
        "username": username,
        "password": password
    }

    # Define message to be sent
    message = json.dumps(data).encode('utf-8')

    # Create a signature of the message using the private key
    hash_obj = SHA256.new(message)
    signer = PKCS1_v1_5.new(private_key)
    signature = signer.sign(hash_obj)

    # Encode the signature as base64 for easier transmission
    signature_base64 = base64.b64encode(signature)

    # Prepare the message to send (message + signature)
    message_to_send = message + b"\n" + signature_base64

    # Assume sending the message_to_send to the client...

    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # Connect to the server
    # server_address = ('localhost', 12345)
    server_address = ('172.210.68.64', 12345)
    client_socket.connect(server_address)

    print("Message sent with signature:", message_to_send)

    client_socket.sendall(message_to_send)

    print("done", message_to_send)

    # print(client_socket.recv(1024))
    client_socket.close()
