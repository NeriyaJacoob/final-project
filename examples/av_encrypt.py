#!/usr/bin/env python3
"""Standalone antivirus example for detecting ransomware encryption."""
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", "src")))

DETECTION_FILE = "/tmp/detection_result.txt"
from modules.tools import kill_process
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", "target"))
SIGNATURE = b"BME1"


def scan_and_block():
    for root, _, files in os.walk(DATA_DIR):
        for name in files:
            path = os.path.join(root, name)
            try:
                with open(path, "rb") as f:
                    if f.read(4) == SIGNATURE:
                        with open(DETECTION_FILE, "w") as d:
                            d.write("ENCRYPTED")
                        kill_process()
                        print(f"Blocked encryption for {path}")
                        return
            except Exception:
                continue
    print("No encrypted files found.")


if __name__ == "__main__":
    scan_and_block()
