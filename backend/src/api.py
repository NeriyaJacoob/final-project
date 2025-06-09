import sys
import os
import subprocess
import io
import json

from contextlib import redirect_stdout

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
TMP_DIR = os.path.join(BASE_DIR, "..", "tmp")

sys.path.append(BASE_DIR)
from modules.decrypt import decrypt_files
from modules.utils import decrypt_key_rsa, log_summary
from modules.encrypt import encrypt_files
from modules.decrypt import decrypt_files
from modules.sim_flow import run_simulation
from modules.constants import BLOCK_FLAG, DETECTION_FILE
from modules.av_runner import start as start_av

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

app = Flask(__name__)

CORS(app)
start_av()

@app.route("/progress/quiz", methods=["POST"])
def update_quiz_score():
    data = request.get_json()
    score = data.get("score")
    total = data.get("total")

    path = os.path.join("modules", "summary", "stats.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            stats = json.load(f)
    else:
        stats = {}

    stats["quiz_score"] = int((score / total) * 100)

    with open(path, "w", encoding="utf-8") as f:
        json.dump(stats, f)

    return jsonify({ "status": "ok" })

from flask import request, jsonify
import os

from flask import Blueprint

file_api = Blueprint("file_api", __name__)
TMP_BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "tmp"))
TARGET_BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "target"))

ALIAS_DIRS = {
    "/tmp/": TMP_BASE,
    "/target/": TARGET_BASE,
}

# קריאת קובץ
@app.route("/api/file", methods=["GET"])
def read_file():
    path = request.args.get("path", "")
    
    base_dir = None
    relative = None
    for prefix, real_base in ALIAS_DIRS.items():
        if path.startswith(prefix):
            base_dir = real_base
            relative = path[len(prefix):]
            break
    if base_dir is None:
        return jsonify({"error": "Invalid path"}), 400

    real_path = os.path.join(base_dir, relative)

    try:
        with open(real_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        return jsonify({"content": content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# שמירת קובץ
@file_api.route("/api/file", methods=["POST"])
def save_file():
    data = request.get_json()
    path = data.get("path", "")
    content = data.get("content", "")

    base_dir = None
    relative = None
    for prefix, real_base in ALIAS_DIRS.items():
        if path.startswith(prefix):
            base_dir = real_base
            relative = path[len(prefix):]
            break
    if base_dir is None:
        return jsonify({"error": "Invalid path"}), 400

    path = os.path.join(base_dir, relative)

    try:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/target-files", methods=["GET"])
def list_target_files():
    """Return a list of editable target file paths."""
    files = []

    inf_dir = os.path.join(TMP_BASE, "TestInfected")
    for root, _, names in os.walk(inf_dir):
        for name in names:
            rel = os.path.relpath(os.path.join(root, name), TMP_BASE)
            files.append("/tmp/" + rel.replace(os.path.sep, "/"))

    for root, _, names in os.walk(TARGET_BASE):
        for name in names:
            rel = os.path.relpath(os.path.join(root, name), TARGET_BASE)
            files.append("/target/" + rel.replace(os.path.sep, "/"))

    files.extend(["/tmp/block_ransom", "/tmp/detection_result.txt"])

    return jsonify({"files": files})


@app.route("/encrypt", methods=["POST"])
def encrypt_endpoint():
    folder = request.json.get("folder")
    if not folder:
        return jsonify({"error": "Missing folder"}), 400

    encrypt_files(folder)
    return jsonify({"status": "encrypted", "folder": folder})

@app.route("/decrypt", methods=["POST"])
def decrypt_simulation():
    try:
        folder = os.path.expanduser("~/Desktop/TestEncrypt")
        decrypt_files(folder=folder)
        return jsonify({"status": "ok", "message": "🔓 הקבצים פוענחו בהצלחה"})
    except Exception as e:
        return jsonify({"status": "fail", "message": f"שגיאה בפענוח: {str(e)}"})

@app.route("/progress/theory", methods=["POST"])
def update_theory_progress():
    data = request.get_json()
    page = str(data.get("page"))

    path = os.path.join("modules", "summary", "progress.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            progress = json.load(f)
    else:
        progress = { "theory_pages": [] }

    if page not in progress["theory_pages"]:
        progress["theory_pages"].append(page)

    with open(path, "w", encoding="utf-8") as f:
        json.dump(progress, f)

    return jsonify({"status": "ok"})


@app.route("/generate-key", methods=["GET"])
def generate_key():
    import os
    key = os.urandom(32).hex()
    return jsonify({"key": key})


@app.route("/summary/logs", methods=["GET"])
def get_logs():
    log_path = os.path.join("modules", "summary", "log.txt")
    progress_path = os.path.join("modules", "summary", "progress.json")
    stats_path = os.path.join("modules", "summary", "stats.json")

    # טען לוגים
    if os.path.exists(log_path):
        with open(log_path, "r", encoding="utf-8") as f:
            content = f.read()
    else:
        content = "אין פעולות מתועדות עדיין."

    # התחלה חדשה לסטטיסטיקות
    stats = {}

    # טען stats.json אם קיים (כדי לשלוף quiz_score וכו')
    if os.path.exists(stats_path):
        with open(stats_path, "r", encoding="utf-8") as f:
            stats.update(json.load(f))

    # חישוב אחוז התקדמות תיאוריה
    if os.path.exists(progress_path):
        with open(progress_path, "r", encoding="utf-8") as f:
            progress = json.load(f)
        pages_read = len(set(progress.get("theory_pages", [])))
    else:
        pages_read = 0

    total_pages = 10
    theory_percent = int((pages_read / total_pages) * 100)
    stats["theory_progress_percent"] = theory_percent

    return jsonify({ "logs": content, "stats": stats })

@app.route("/test-ransom", methods=["POST"])
def test_ransom():
    """Run the ransomware script and report if an antivirus blocked it."""
    try:
        script = os.path.join(
            os.path.dirname(__file__), "modules", "simulation", "trigger_ransom.py"
        )
        src_path = os.path.join(os.path.dirname(__file__))  # backend/src

        result = subprocess.run(
            ["python3", script],
            cwd=os.path.dirname(script),
            env={**os.environ, "PYTHONPATH": src_path},
            capture_output=True,
            text=True,
        )

        detected = os.path.exists(DETECTION_FILE)
        blocked = os.path.exists(BLOCK_FLAG)

        if blocked:
            status = "blocked"
            message = "❌ הכופר נחסם על ידי אנטי וירוס"
        elif detected:
            status = "fail"
            message = "⚠️ זוהה אך לא נחסם"
        elif result.returncode != 0:
            status = "fail"
            message = "⚠️ שגיאה בהרצה"
        else:
            status = "ok"
            message = "💣 הכופר הורץ בהצלחה"

        return jsonify(
            {
                "status": status,
                "message": message,
                "stdout": result.stdout,
                "stderr": result.stderr,
            }
        )

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/infection", methods=["POST"])
def run_infection():
    try:
        script = os.path.join(BASE_DIR, "modules", "infector.py")
        result = subprocess.run(["python3", script], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        print("[STDOUT]", result.stdout)
        print("[STDERR]", result.stderr)
        return jsonify({"status": "✅ הדבקה הופעלה", "output": result.stdout, "error": result.stderr})
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route("/antivirus/code", methods=["GET"])
def read_student_code():
    path = os.path.abspath(os.path.join(BASE_DIR, "..", "tmp", "student_antivirus.py"))
    default_code = f'''from modules.tools import kill_process

    # דוגמה לשימוש: kill_process(1234)
    print("✅ אנטי וירוס הופעל בהצלחה!")'''
    try:
        if not os.path.exists(path) or os.path.getsize(path) == 0:
            with open(path, "w") as f:
                f.write(default_code)
            return default_code

        with open(path) as f:
            return f.read()
    except Exception as e:
        return f"# שגיאה בטעינת הקובץ: {e}"

@app.route("/run-antivirus", methods=["POST"])
def run_antivirus():
    try:
        log_summary("[INFO] אנטי־וירוס הופעל ע\"י המשתמש", "system")

        code_path = os.path.abspath(os.path.join(BASE_DIR, "..", "tmp", "student_antivirus.py"))
        print("📦 מריץ אנטי־וירוס מתוך:", code_path)

        exec_path = "/tmp/antivirus_exec.py"

        # שלב 1: טען את הקוד של התלמיד
        with open(code_path) as f:
            code = f.read()

        # שלב 2: כתוב לקובץ זמני
        with open(exec_path, "w") as f:
            f.write(code)

        # שלב 3: הרץ עם Python מתוך ה־venv
        # virtualenv located in the repository root
        venv_path = os.path.join(BASE_DIR, "venv", "bin", "python")
        venv_python = venv_path if os.path.exists(venv_path) else sys.executable


        result = subprocess.run(
            [venv_python, exec_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )


        stdout = result.stdout.strip()
        stderr = result.stderr.strip()

        # שלב 4: אם יש שגיאה → כתוב ללוג
        if stderr:
            log_summary(f"שגיאה בהרצת אנטי וירוס:\n{stderr}", "system")

        return jsonify({
            "result": stdout,
            "error": stderr
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/antivirus/clear", methods=["POST"])
def clear_antivirus_block():
    path = BLOCK_FLAG  # מחק רק את סימן החסימה
    try:
        if os.path.exists(path):
            os.remove(path)
            return jsonify({"status": "ok", "message": "האנטי וירוס הוסר"})
        return jsonify({"status": "ok", "message": "לא היה אנטי וירוס פעיל"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/save-antivirus", methods=["POST"])
def save_antivirus():
    code = request.json.get("code", "")
    save_path = os.path.abspath(os.path.join(BASE_DIR, "..", "tmp", "student_antivirus.py"))
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    with open(save_path, "w", encoding="utf-8") as f:
        f.write(code)
    return jsonify({"status": "saved"})


@app.route("/summary/clear", methods=["POST"])
def clear_summary_logs():
    path = os.path.join("modules", "summary", "log.txt")
    try:
        open(path, "w").close()
        return jsonify({"status": "ok"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500




@app.route("/simulate", methods=["POST"])
def simulate():
    data = request.get_json()
    task = data.get("task")
    try:
        result = run_simulation(task)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500






if __name__ == "__main__":
    app.run(port=5000, debug=False)

