# Project Architecture

This document gives a brief overview of the repository to help students
and reviewers quickly understand how the pieces fit together.

## Backend (`backend/src`)
- **api.py** – Flask application exposing REST endpoints for the
  simulations and the student IDE. Each route is documented with a
  docstring in the source file.
- **modules/** – Collection of helper modules used by the backend:
  - `encrypt.py` and `decrypt.py` handle the ransomware encryption flow.
  - `infector.py` simulates a simple file infector for the infection task.
  - `sim_flow.py` orchestrates running simulations and logging results.
  - `av_runner.py` periodically executes the student's antivirus code.
  - `utils.py`, `tools/` and others contain small utility functions.
- **summary/** – Logs and statistics produced by simulations.

## Frontend (`frontend/src`)
- React application that communicates with the backend. The main
  components are under `components/` and the pages under `pages/`.
  Components contain inline comments describing their functionality.

## Running Tests
Use `pytest` from the repository root to run the backend unit tests.
