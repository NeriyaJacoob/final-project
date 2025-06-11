"""Simulation orchestration utilities used by the backend API.

This module executes the various malware simulations (encryption,
infection, etc.) and tracks their results. It also coordinates running
the student's antivirus so they can test detection and blocking logic.
"""

import os
import subprocess
import sys
import time
from datetime import datetime

import json
from modules.utils import log_summary
from modules.constants import DETECTION_FILE, BLOCK_FLAG, COUNTER_FILE

MODULE_DIR = os.path.dirname(__file__)
STATS_FILE = os.path.join(MODULE_DIR, "summary", "stats.json")

SIMULATION_SCRIPTS = {
    "infection": os.path.join(MODULE_DIR, "infector.py"),
    "ransom": os.path.join(MODULE_DIR, "simulation", "trigger_ransom.py"),
}

STUDENT_AV_PATH = os.path.abspath(
    os.path.join(MODULE_DIR, "..", "..", "tmp", "student_antivirus.py")
)

def _update_stats(task: str, detected: bool, blocked: bool):
    if os.path.exists(STATS_FILE):
        with open(STATS_FILE, "r", encoding="utf-8") as f:
            stats = json.load(f)
    else:
        stats = {}

    results = stats.get("task_results", {})
    results[task] = {"detected": detected, "blocked": blocked}
    stats["task_results"] = results
    stats["simulations_blocked"] = [t for t, r in results.items() if r.get("blocked")]

    total = len(results)
    if total:
        detected_count = sum(1 for r in results.values() if r.get("detected"))
        stats["detection_accuracy"] = int(detected_count / total * 100)

    with open(STATS_FILE, "w", encoding="utf-8") as f:
        json.dump(stats, f, ensure_ascii=False)

def _run_student_antivirus_once():
    if os.path.exists(STUDENT_AV_PATH):
        subprocess.run(
            [sys.executable, STUDENT_AV_PATH],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=False,
        )

def run_simulation(task: str):
    """Execute a simulation task and return its result details.

    ``task`` should be one of ``encrypt``, ``decrypt``, ``infection`` or
    ``ransom``. The appropriate script is executed and the student's
    antivirus is invoked once so it has a chance to detect the activity.
    The function returns a dictionary describing detection and blocking
    status as well as captured output.
    """
    for path in [DETECTION_FILE, BLOCK_FLAG, COUNTER_FILE]:
        try:
            if os.path.exists(path):
                os.remove(path)
        except:
            pass

    log_summary(f"[SYSTEM] סימולציית {task} הופעלה", "system")
    logs = []
    time_now = lambda: datetime.now().strftime("%H:%M:%S")
    logs.append({"time": time_now(), "msg": f"סימולציית {task} הופעלה"})

    stdout = ""
    stderr = ""
    ret = 0

    if task == "encrypt":
        from modules.encrypt import encrypt_files
        from modules.constants import TARGET_FOLDER
        try:
            # Give student AV a chance to scan before encryption
            _run_student_antivirus_once()
            encrypt_files(TARGET_FOLDER)
        except Exception as e:
            stderr = str(e)
            ret = 1
        # Scan again after encryption to catch the modified files
        _run_student_antivirus_once()
        time.sleep(1.0)
    elif task == "decrypt":
        from modules.decrypt import decrypt_files
        from modules.constants import TARGET_FOLDER
        try:
            decrypt_files(folder=TARGET_FOLDER)
        except Exception as e:
            stderr = str(e)
            ret = 1
        detected = True
        blocked = True
        logs.append({"time": time_now(), "msg": "בוצע פענוח קבצים"})
        _update_stats(task, detected, blocked)
        log_summary(f"[RESULT] סימולציית {task} הושלמה", "success" if ret == 0 else "fail")
        return {
            "detected": detected,
            "blocked": blocked,
            "stdout": stdout,
            "stderr": stderr,
            "returncode": ret,
            "logs": logs,
        }
    else:
        script = SIMULATION_SCRIPTS.get(task)
        if not script:
            raise ValueError(f"Unknown task: {task}")

        # הרצת סקריפט הסימולציה כתהליך נפרד
        proc = subprocess.Popen(
            [sys.executable, script],
            cwd=os.path.dirname(script),  # הפעל מתוך תיקיית הסקריפט
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        _run_student_antivirus_once()
        time.sleep(1.0)  # המתן שהאנטי־וירוס יסיים לרוץ

        if proc.poll() is None:
            stdout, stderr = proc.communicate()
            ret = proc.returncode
        else:
            stdout, stderr = proc.communicate()
            ret = proc.returncode

    # Detection is considered successful if the detection file exists.
    # Its contents are irrelevant, allowing antiviruses to simply
    # create the file without writing any data.
    detected = os.path.exists(DETECTION_FILE)
    if detected:
        logs.append({"time": time_now(), "msg": "אנטי וירוס זיהה תהליך חשוד"})
    else:
        logs.append({"time": time_now(), "msg": "לא זוהה התהליך החשוד"})

    blocked = False
    blocked_by_timeout = ret == -9  # SIGKILL או ערך המציין הריגה ע"י אנטי וירוס

    try:
        # קרא את מונה החסימות הקודם
        with open(COUNTER_FILE, "r") as f:
            counter = int(f.read().strip())
    except:
        counter = 0

    if detected:
        if counter == 0:
            blocked = True
            logs.append({"time": time_now(), "msg": "התהליך הזדוני נחסם"})
        else:
            logs.append({"time": time_now(), "msg": "חסימה נכשלה"})
    else:
        logs.append({"time": time_now(), "msg": "חסימה לא בוצעה"})

    _update_stats(task, detected, blocked)

    if detected and blocked:
        log_summary(f"[RESULT] סימולציית {task} הצליחה (זוהה ונחסם)", "success")
        logs.append({"time": time_now(), "msg": "הסימולציה זוהתה ונחסמה"})
    elif detected and not blocked:
        log_summary(f"[RESULT] סימולציית {task} זוהתה אך לא נחסמה", "fail")
        logs.append({"time": time_now(), "msg": "זוהה אך לא נחסם"})
    else:
        log_summary(f"[RESULT] סימולציית {task} לא זוהתה", "fail")
        logs.append({"time": time_now(), "msg": "לא זוהתה"})

    return {
        "detected": detected,
        "blocked": blocked,
        "stdout": stdout,
        "stderr": stderr,
        "returncode": ret,
        "logs": logs,
    }
