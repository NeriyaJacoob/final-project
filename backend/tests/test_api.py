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
