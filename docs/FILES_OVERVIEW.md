# File Overview

This document briefly describes the main files in the project so students can easily locate functionality during reviews or exams.

## Backend (Python)

| Path | Purpose |
| --- | --- |
| `backend/src/api.py` | Flask API routes and endpoints |
| `backend/src/main.py` | Entry point launching the Flask server |
| `backend/src/modules/av_runner.py` | Background thread running student antivirus |
| `backend/src/modules/constants.py` | Common paths used across modules |
| `backend/src/modules/decrypt.py` | Decrypt helper matching encrypt.py |
| `backend/src/modules/encrypt.py` | Ransomware-style encryption helper |
| `backend/src/modules/infector.py` | Infection simulation that injects code |
| `backend/src/modules/sim_flow.py` | Orchestrates simulations and logging |
| `backend/src/modules/utils.py` | Generic utilities and logging helpers |
| `backend/src/modules/tools/__init__.py` | Helper functions for student antiviruses |
| `backend/src/modules/simulation/trigger_ransom.py` | Creates a demo ransomware project |

## Frontend (React)

| `frontend/src/App.js` | Top-level router for the React app |
| `frontend/src/index.js` | Bootstraps React into the DOM |
| `frontend/src/components/IDE.jsx` | Browser-based code editor for antivirus scripts |
| `frontend/src/components/Layout.jsx` | Wrapper layout with navigation sidebar |
| `frontend/src/components/MatrixBackground.jsx` | Animated matrix background iframe |
| `frontend/src/components/Quiz.jsx` | Multiple choice quiz component |
| `frontend/src/components/TheoryStage.jsx` | Display theory content sections |
| `frontend/src/components/Timeline.jsx` | Timeline list for log messages |
| `frontend/src/components/ui/button.js` | Styled button element |
| `frontend/src/components/ui/card.js` | Card container utilities |
| `frontend/src/pages/Home.js` | Landing page with quick links |
| `frontend/src/pages/Practice.js` | Interactive practice environment |
| `frontend/src/pages/Simulation.js` | Menu page for launching simulations |
| `frontend/src/pages/SimulationEncrypt.js` | Demonstrates encryption behavior |
| `frontend/src/pages/SimulationInfection.js` | Demonstrates file infection flow |
| `frontend/src/pages/SimulationRansom.js` | Demonstrates ransom note behavior |
| `frontend/src/pages/Summary.js` | Shows progress stats and logs |
| `frontend/src/pages/Target_Files_Panel.js` | Editor for sample target files |
| `frontend/src/pages/Theory.js` | Introductory theory landing page |
| `frontend/src/pages/TheoryPage.jsx` | Wrapper page for each theory section |
| `frontend/src/pages/Tools.js` | Utility page for generating keys |
| `frontend/src/pages/UserGuide.jsx` | Step-by-step user instructions |
