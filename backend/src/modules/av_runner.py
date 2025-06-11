"""Background helper that repeatedly runs the student's antivirus script."""

import os
import sys
import threading
import time
import subprocess

# Path to the student's antivirus script
# הצמד נתיב יחסי לנתיב מוחלט של קובץ האנטי־וירוס של התלמיד
STUDENT_AV_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "tmp", "student_antivirus.py")
)

_running = False


def _loop(interval: float = 2.0):
    """Background loop that executes the student's antivirus periodically."""
    while _running:
        if os.path.exists(STUDENT_AV_PATH):  # בדיקה שהקובץ קיים לפני ההרצה
            # הפעלת קובץ האנטי־וירוס בעזרת פרשן פייתון במצב שקט
            subprocess.run(
                [sys.executable, STUDENT_AV_PATH],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
        time.sleep(interval)  # המתן לפני הרצה חוזרת


def start(interval: float = 2.0):
    """Start the antivirus background thread if not already running."""
    global _running
    if _running:
        return
    _running = True
    # יצירת תזמון ברקע שיריץ את האנטי־וירוס כל כמה שניות
    thread = threading.Thread(target=_loop, args=(interval,), daemon=True)
    thread.start()


def stop():
    """Stop the antivirus background thread."""
    global _running
    _running = False
