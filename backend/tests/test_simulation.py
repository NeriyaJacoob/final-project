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
