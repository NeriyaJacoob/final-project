#!/bin/bash

gnome-terminal -- bash -c "cd backend && python3 -m venv venv && source venv/bin/activate && cd src && python3 api.py; exec bash"

gnome-terminal -- bash -c "cd frontend && npm install && npm start; exec bash"
