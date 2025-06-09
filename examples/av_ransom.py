#!/usr/bin/env python3
"""Standalone antivirus example for the ransomware simulation."""
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", "src")))

from modules.constants import MALWARE_PID_FILE, DETECTION_FILE
from modules.tools import kill_process


def scan_and_block():
    if os.path.exists(MALWARE_PID_FILE):
        try:
            with open(MALWARE_PID_FILE) as f:
                pid = int(f.read().strip() or "0")
        except Exception:
            pid = None
        with open(DETECTION_FILE, "w") as d:
            d.write("RANSOM")
        kill_process(pid)
        print("Ransomware process terminated.")
    else:
        print("No active ransomware detected.")


if __name__ == "__main__":
    scan_and_block()
