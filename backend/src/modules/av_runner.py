import os
import sys
import threading
import time
import subprocess

# Path to the student's antivirus script
STUDENT_AV_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "tmp", "student_antivirus.py")
)

_running = False


def _loop(interval: float = 2.0):
    """Background loop that executes the student's antivirus periodically."""
    while _running:
        if os.path.exists(STUDENT_AV_PATH):
            subprocess.run([sys.executable, STUDENT_AV_PATH], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        time.sleep(interval)


def start(interval: float = 2.0):
    """Start the antivirus background thread if not already running."""
    global _running
    if _running:
        return
    _running = True
    thread = threading.Thread(target=_loop, args=(interval,), daemon=True)
    thread.start()


def stop():
    """Stop the antivirus background thread."""
    global _running
    _running = False
