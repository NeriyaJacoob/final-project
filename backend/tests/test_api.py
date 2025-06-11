import os
import sys
import json

# Add backend/src to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src')))

from api import app


def test_generate_key():
    client = app.test_client()
    response = client.get('/generate-key')
    assert response.status_code == 200
    data = response.get_json()
    assert 'key' in data
    key = data['key']
    assert isinstance(key, str)
    assert len(key) == 64
    assert all(c in '0123456789abcdef' for c in key.lower())


def test_list_target_files():
    client = app.test_client()
    resp = client.get('/api/target-files')
    assert resp.status_code == 200
    data = resp.get_json()
    assert 'files' in data
    assert isinstance(data['files'], list)
    assert len(data['files']) > 0


def test_save_file_updates_contents():
    client = app.test_client()

    sample_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'target', 'sample.txt'))

    with open(sample_path, 'r', encoding='utf-8') as f:
        original = f.read()

    try:
        resp = client.post('/api/file', json={'path': '/target/sample.txt', 'content': 'modified'})
        assert resp.status_code == 200
        assert resp.get_json()['status'] == 'success'

        with open(sample_path, 'r', encoding='utf-8') as f:
            assert f.read() == 'modified'
    finally:
        with open(sample_path, 'w', encoding='utf-8') as f:
            f.write(original)

