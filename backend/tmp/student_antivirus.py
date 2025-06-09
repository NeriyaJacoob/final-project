#!/usr/bin/env python3
import os
import psutil
import signal

DETECTION_FILE = "/tmp/detection_result.txt"
COUNTER_FILE = "/tmp/block_counter.txt"

TRIGGER_WORDS = ["trigger_ransom.py", "TestInfected"]
blocked_any = False

def log_detection(cmdline):
    with open(DETECTION_FILE, "w") as f:
        f.write(" ".join(cmdline))

def increment_counter():
    count = 0
    if os.path.exists(COUNTER_FILE):
        try:
            with open(COUNTER_FILE, "r") as f:
                count = int(f.read().strip())
        except:
            pass
    with open(COUNTER_FILE, "w") as f:
        f.write(str(count + 1))

for proc in psutil.process_iter(['pid', 'cmdline']):
    try:
        cmdline = proc.info['cmdline']
        if not cmdline:
            continue

        joined = " ".join(cmdline)

        if any(marker in joined for marker in TRIGGER_WORDS):
            log_detection(cmdline)

            try:
                proc.terminate()
                proc.wait(timeout=1)
            except psutil.TimeoutExpired:
                proc.kill()

            blocked_any = True
            print(f"✅ תהליך זדוני (PID {proc.pid}) זוהה ונחסם: {joined}")
            break  # רק חסימה אחת
    except (psutil.NoSuchProcess, psutil.AccessDenied):
        continue

if not blocked_any:
    increment_counter()
    print("🟡 לא זוהה תהליך חשוד")
