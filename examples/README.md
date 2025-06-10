# Example Antivirus Scripts

These standalone Python scripts demonstrate simple antivirus behaviors for the practice tasks. They are **not** integrated with the main project and can be run separately.

- `av_infection.py` – scans the sample `backend/tmp/TestInfected` directory for injected code and blocks the threat if found.
- `av_encrypt.py` – checks files inside `backend/target` for the ransomware signature and blocks encryption attempts.
- `av_decrypt.py` – decrypts files in `backend/target` that were previously encrypted with the provided key.
- `av_ransom.py` – monitors `MALWARE_PID_FILE` and kills the running ransomware process if present.

Each script writes detection to the file defined by `DETECTION_FILE` in `modules.constants` and calls `modules.tools.kill_process` to terminate the malicious process (which also creates `BLOCK_FLAG` for compatibility).

`DETECTION_FILE` and the other constants use the operating system's temporary
directory so the paths will vary between platforms.
