#!/bin/bash

set -e

# Create Python virtual environment and install backend dependencies
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

deactivate

# Install frontend dependencies
cd frontend
npm install
cd ..

echo "Environment setup complete"
