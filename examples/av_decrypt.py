#!/usr/bin/env python3
"""Example script for decrypting files encrypted by the simulation."""
import os
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", "target"))
SIGNATURE = b"BME1"
KEY = bytes.fromhex("3031323334353637383961626364656630313233343536373839616263646566")
CHUNK_SIZE = 10 * 1024


def decrypt_file(path: str):
    with open(path, "rb") as f:
        data = f.read()
    if not data.startswith(SIGNATURE):
        return False

    iv = data[4:20]
    enc_header = data[20:20 + ((CHUNK_SIZE + AES.block_size - 1) // AES.block_size) * AES.block_size]
    tail = data[20 + len(enc_header):]

    cipher = AES.new(KEY, AES.MODE_CBC, iv)
    header = unpad(cipher.decrypt(enc_header), AES.block_size)

    with open(path, "wb") as f:
        f.write(header + tail)
    print(f"Decrypted {path}")
    return True


def decrypt_all():
    for root, _, files in os.walk(DATA_DIR):
        for name in files:
            decrypt_file(os.path.join(root, name))


if __name__ == "__main__":
    decrypt_all()
