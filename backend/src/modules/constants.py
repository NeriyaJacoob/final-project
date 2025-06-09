import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

DETECTION_FILE = "/tmp/detection_result.txt"
BLOCK_FLAG = "/tmp/block_ransom"

# Optional file to store the PID of a running malicious process so
# student antiviruses can terminate it using tools.kill_process.
MALWARE_PID_FILE = "/tmp/malware_pid"

# Folder with files used by the encryption/decryption simulation
TARGET_FOLDER = os.path.join(BASE_DIR, "target")
