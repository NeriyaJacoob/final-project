import os
from datetime import datetime
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP

LOG_PATH = os.path.join(os.path.dirname(__file__), "summary", "log.txt")

def log_action(message: str):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)
    with open(LOG_PATH, "a", encoding="utf-8") as f:
        f.write(f"[{timestamp}] {message}\n")

def log_summary(message: str, level: str):
    """
    רושם לוג מסווג לקובץ הסיכום.
    :param level: אחד מתוך 'success', 'fail', 'system'
    """
    ICONS = {
        "success": "🟢",
        "fail": "🔴",
        "system": "⚠️"
    }
    prefix = ICONS.get(level, "")
    os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)
    with open(LOG_PATH, "a", encoding="utf-8") as f:
        f.write(f"[{level.upper()}] {prefix} {message}\n")



def decrypt_key_rsa(
    enc_key_path: str = "encrypted_key.bin",
    private_key_path: str = os.path.join("keys", "private.pem")
) -> bytes:
    with open(private_key_path, "rb") as f:
        priv_key = RSA.import_key(f.read())
    cipher = PKCS1_OAEP.new(priv_key)

    with open(enc_key_path, "rb") as f:
        enc_key = f.read()

    key = cipher.decrypt(enc_key)
    log_action(f"AES key decrypted from {enc_key_path}")
    return key
