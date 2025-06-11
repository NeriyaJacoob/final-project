"""Common file paths used across simulation modules."""

import os
import tempfile

# Base directory of the backend package
BASE_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..")
)  # תיקיית בסיס הפרויקט

TMP_DIR = tempfile.gettempdir()  # ספריית temp של מערכת ההפעלה
DETECTION_FILE = os.path.join(TMP_DIR, "detection_result.txt")  # תוצר זיהוי
BLOCK_FLAG = os.path.join(TMP_DIR, "block_ransom")  # סימון חסימה

# Counter file used by the simulation framework to check whether
# the student's antivirus blocked the malicious process. If the
# counter remains zero after a simulation run it is interpreted as
# a successful block.
COUNTER_FILE = os.path.join(TMP_DIR, "block_counter.txt")  # מונה חסימות

# Optional file to store the PID of a running malicious process so
# student antiviruses can terminate it using tools.kill_process.
MALWARE_PID_FILE = os.path.join(TMP_DIR, "malware_pid")  # PID תהליך זדוני

# Folder with files used by the encryption/decryption simulation
TARGET_FOLDER = os.path.join(BASE_DIR, "target")  # קבצים שהסימולציה תעבד
