# Example Antivirus Scripts

These standalone Python scripts demonstrate simple antivirus behaviors for the practice tasks. They are **not** integrated with the main project and can be run separately.

- `av_infection.py` – scans the sample `backend/tmp/TestInfected` directory for injected code and blocks the threat if found.
- `av_encrypt.py` – checks files inside `backend/target` for the ransomware signature and blocks encryption attempts.
- `av_decrypt.py` – decrypts files in `backend/target` that were previously encrypted with the provided key.

Each script writes detection to `/tmp/detection_result.txt` and calls `modules.tools.kill_process` to terminate the malicious process (which also creates `/tmp/block_ransom` for compatibility).
