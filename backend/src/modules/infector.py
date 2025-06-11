"""Simulated infection flow for the "infection" scenario."""

import os
import subprocess
import time
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from modules.utils import log_summary
from modules.constants import DETECTION_FILE, BLOCK_FLAG

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
    """Reset the detection marker file used by the simulation."""
    try:
        open(DETECTION_FILE, "w").close()  # איפוס קובץ הזיהוי
    except:
        pass

def was_detected():
    """Return ``True`` if the infection marker file is non-empty."""
    try:
        with open(DETECTION_FILE) as f:  # קריאה מהירה של תוכן קובץ הזיהוי
            return bool(f.read().strip())
    except:
        return False

def infect_file(filepath):
    """Inject the trigger code into a Python or shell file."""
    try:
        with open(filepath, 'r') as f:  # טען את הקובץ המקורי
            content = f.read()

        if INFECTION_MARKER in content:
            return  # כבר הודבק

        if filepath.endswith('.sh') and not content.startswith("#!"):
            content = "#!/bin/bash\n" + content

        with open(filepath, 'w') as f:  # כתוב בחזרה עם קוד ההפעלה
            f.write(INJECTION_CODE + content)

        os.chmod(filepath, 0o755)  # הפוך את הקובץ להרצה
        print(f"[+] Infected: {filepath}")

    except Exception as e:
        print(f"[-] Failed to infect {filepath}: {e}")

def scan_and_infect(directory):
    """Recursively infect files in ``directory`` with the trigger code."""
    for root, _, files in os.walk(directory):
        for filename in files:
            if any(filename.endswith(ext) for ext in TARGET_EXTENSIONS):
                filepath = os.path.join(root, filename)
                infect_file(filepath)

def run_infected_files(directory):
    """Execute all infected files unless blocking flag exists."""
    if os.path.exists(BLOCK_FLAG):
        print("🔒 חסימה הופעלה – לא נריץ קבצים נגועים.")
        return

    for root, _, files in os.walk(directory):
        for filename in files:
            if any(filename.endswith(ext) for ext in TARGET_EXTENSIONS):
                filepath = os.path.join(root, filename)
                print(f"[>] Executing: {filepath}")
                try:
                    if filename.endswith('.sh'):
                        subprocess.run([filepath])  # הרצת סקריפט shell נגוע
                    elif filename.endswith('.py'):
                        subprocess.run(['python3', filepath])  # הרצת קובץ Python נגוע
                except Exception as e:
                    print(f"[!] Failed to execute {filename}: {e}")

def run_student_antivirus():
    """Run the student's antivirus script once."""
    path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "..", "tmp", "student_antivirus.py")
    )
    subprocess.run(["python3", path])  # הרץ את קובץ האנטי־וירוס פעם אחת

if __name__ == "__main__":
    log_summary("[SYSTEM] סימולציית infection הופעלה", "system")

    print("[*] שלב 1: ניקוי קובץ זיהוי")
    clear_detection_log()
        

    if os.path.exists(BLOCK_FLAG):
        os.remove(BLOCK_FLAG)

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
