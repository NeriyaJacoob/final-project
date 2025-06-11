import os
import sys
import json

# Add backend/src to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src')))

from api import app
from modules.constants import DETECTION_FILE, BLOCK_FLAG


def clear_flags():
    for path in (DETECTION_FILE, BLOCK_FLAG):
        if os.path.exists(path):
            os.remove(path)


def test_infection_route_runs():
    clear_flags()
    client = app.test_client()
    resp = client.post('/infection')
    assert resp.status_code == 200
    data = resp.get_json()
    assert data['status'] == '✅ הדבקה הופעלה'


def test_test_ransom_reports_blocked_when_flag_set():
    clear_flags()
    # Simulate antivirus detection
    with open(DETECTION_FILE, 'w') as f:
        f.write('detected')
    with open(BLOCK_FLAG, 'w') as f:
        f.write('BLOCKED')

    client = app.test_client()
    resp = client.post('/test-ransom')
    assert resp.status_code == 200
    data = resp.get_json()
    assert data['status'] == 'blocked'
    assert os.path.exists(DETECTION_FILE)
    assert os.path.exists(BLOCK_FLAG)


def test_simulate_decrypt_updates_stats(tmp_path):
    clear_flags()
    client = app.test_client()
    resp = client.post('/simulate', json={'task': 'decrypt'})
    assert resp.status_code == 200
    data = resp.get_json()
    assert data['returncode'] == 0

    stats_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src', 'modules', 'summary', 'stats.json'))
    with open(stats_path, 'r', encoding='utf-8') as f:
        stats = json.load(f)

    assert stats['task_results']['decrypt']['detected'] is True
    assert stats['task_results']['decrypt']['blocked'] is True


def test_simulate_encrypt_changes_sample_file():
    clear_flags()
    client = app.test_client()

    sample_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'target', 'sample.txt'))
    with open(sample_path, 'rb') as f:
        original = f.read()

    try:
        resp = client.post('/simulate', json={'task': 'encrypt'})
        assert resp.status_code == 200

        with open(sample_path, 'rb') as f:
            assert f.read() != original
    finally:
        from modules.decrypt import decrypt_files
        decrypt_files(os.path.dirname(sample_path))
        with open(sample_path, 'wb') as f:
            f.write(original)
