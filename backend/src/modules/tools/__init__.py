"""Utility functions available to student antivirus implementations."""

import os
import signal
from modules.constants import BLOCK_FLAG


def kill_process(pid: int | None = None) -> bool:
    """Terminate the given process ID (if provided) and mark the block flag."""
    if pid is not None:
        try:
            # שליחת אות סיום לתהליך שסופק
            os.kill(pid, signal.SIGTERM)
        except ProcessLookupError:
            return False
        except Exception:
            pass

    # Mark that the ransomware was blocked
    try:
        # יצירת קובץ המציין שהתהליך הזדוני נחסם
        with open(BLOCK_FLAG, "w") as f:
            f.write("BLOCKED")
    except Exception:
        pass

    return True

