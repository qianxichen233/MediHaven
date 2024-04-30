import socket
from Crypto.PublicKey import RSA
from Crypto.Signature import PKCS1_v1_5
from Crypto.Hash import SHA256
import base64
import json

import subprocess

def check_username(username):
    base64_characters = set("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=")

    for char in username:
        if char not in base64_characters:
            return False

    return True

def check_password(password):
    return all(c in "0123456789abcdefABCDEF" for c in password)

with open("public_key.der", "rb") as key_file:
    public_key = RSA.import_key(key_file.read())

try:
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    server_address = ('0.0.0.0', 12345)
    server_socket.bind(server_address)

    server_socket.listen(1)

    while True:
        client_socket, client_address = server_socket.accept()
        print("connection established")

        received_message = b""
        while True:
            data = client_socket.recv(1024)
            if not data:
                break
            received_message += data

        # Split the message and signature
        message, signature_base64 = received_message.split(b"\n")
        signature = base64.b64decode(signature_base64)

        dic = json.loads(message.decode('utf-8'))
        username = dic["username"]
        password = dic["password"]

        print(f"{username}: {password}")

        if(not check_username(username)):
            print("invalid username")
            # client_socket.sendall(b"invalid username")
            client_socket.close()
            continue

        if(not check_password(password)):
            print("invalid password")
            # client_socket.sendall(b"invalid password")
            client_socket.close()
            continue

        username = username.rstrip('=')

        print(f"{username}: {password}")

        hash_obj = SHA256.new(data=message)
        verifier = PKCS1_v1_5.new(public_key)
        if verifier.verify(hash_obj, signature):
            command = ["docker", "exec", "-it", "ejabberd", "bin/ejabberdctl", "register", username, "localhost", password]

            result = subprocess.run(command)
            if result.returncode == 0:
                print("Register successfully.")
                # client_socket.sendall(b"success")
            # print("verify success")
        else:
            print("Client: Signature verification failed. Message may have been tampered with.")
        
        # client_socket.sendall(b"failed")
        client_socket.close()
finally:
    server_socket.close()
