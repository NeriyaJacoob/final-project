import os
import sys

# Ensure tests use the pre-built virtual environment packages
VENV_SITE_PACKAGES = os.path.join(os.path.dirname(__file__), '..', 'venv', 'lib', f'python{sys.version_info.major}.{sys.version_info.minor}', 'site-packages')
if os.path.isdir(VENV_SITE_PACKAGES) and VENV_SITE_PACKAGES not in sys.path:
    sys.path.insert(0, VENV_SITE_PACKAGES)
