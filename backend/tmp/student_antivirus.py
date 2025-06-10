#!/usr/bin/env python3
import psutil
import time
import os
import signal

DETECTION_FILE = "/tmp/detection_result.txt"
BLOCK_FILE = "/tmp/block_ransom"
TRIGGER_NAME = "TestInfected"  # תוכל לשנות ל־trigger_ransom.py אם רלוונטי

def detect_and_block():
    time.sleep(0.5)  # תן זמן לסימולציה לרוץ

    for proc in psutil.process_iter(['pid', 'cmdline']):
        try:
            cmdline = proc.info.get("cmdline", [])
            if not cmdline:
                continue

            # בדיקה אם יש מחרוזת "TestInfected" ב־cmdline
            if any(TRIGGER_NAME in arg for arg in cmdline):
                pid = proc.pid

                # כתיבת זיהוי
                with open(DETECTION_FILE, "w") as f:
                    f.write(f"זוהה תהליך נגוע: {' '.join(cmdline)}\n")

                # נסה לחסום את התהליך
                try:
                    proc.terminate()
                    proc.wait(timeout=2)
                except psutil.TimeoutExpired:
                    proc.kill()

                # כתיבת חסימה
                with open(BLOCK_FILE, "w") as f:
                    f.write("BLOCKED")

                print(f"✅ זוהה תהליך נגוע (PID {pid}) ונחסם.")
                return

        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue

    print("🟡 לא זוהה תהליך נגוע")

if __name__ == "__main__":
    detect_and_block()
