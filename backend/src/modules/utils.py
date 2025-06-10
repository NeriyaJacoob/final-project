"""Utility helpers for logging and RSA key handling."""

import os
from datetime import datetime
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP

# קובץ הלוג הכללי של הסימולציות
LOG_PATH = os.path.join(os.path.dirname(__file__), "summary", "log.txt")

def log_action(message: str):
    """Append a timestamped entry to the general log file."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # חותמת זמן נוכחית
    os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)  # ודא שהתיקייה קיימת
    with open(LOG_PATH, "a", encoding="utf-8") as f:  # כתיבה מצורפת לקובץ
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
    prefix = ICONS.get(level, "")  # הוסף אייקון בהתאם לרמת ההודעה
    os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)
    with open(LOG_PATH, "a", encoding="utf-8") as f:
        f.write(f"[{level.upper()}] {prefix} {message}\n")



def decrypt_key_rsa(
    enc_key_path: str = "encrypted_key.bin",
    private_key_path: str = os.path.join("keys", "private.pem")
) -> bytes:
    """Decrypt an AES key that was encrypted using the paired RSA public key."""
    with open(private_key_path, "rb") as f:  # טעינת מפתח RSA פרטי
        priv_key = RSA.import_key(f.read())
    cipher = PKCS1_OAEP.new(priv_key)  # יצירת אובייקט פענוח RSA

    with open(enc_key_path, "rb") as f:  # קרא את המפתח המוצפן
        enc_key = f.read()

    key = cipher.decrypt(enc_key)  # שחזור מפתח ה-AES המקורי
    log_action(f"AES key decrypted from {enc_key_path}")
    return key
