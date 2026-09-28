# SQL Injection Interactive Lab

An interactive educational lab demonstrating SQL Injection (SQLi) vulnerabilities with a side-by-side comparison of vulnerable and secured web applications.

## Overview

This demonstration illustrates the mechanics of SQL Injection (SQLi) vulnerabilities and how they can be prevented using modern practices like the SQLAlchemy ORM (Object-Relational Mapping). 

It is designed as a standalone academic module that isolates the insecure code from the secure code, providing developers and students a safe environment to explore and understand database security firsthand.

## Architecture & Security Boundaries

- **Total Isolation**: This demonstration runs on completely separate ports (`8001` for vulnerable, `8002` for prevented) to show real-time side-by-side comparisons.
- **Database Separation**: Uses ephemeral local SQLite databases (`demo.db`) exclusively for the demo. 
- **Stateless/Read-Only**: The backend endpoints only implement a `GET /api/search` method. Operations like DELETE, UPDATE, INSERT, and Authentication have been intentionally omitted to prevent any accidental credential exposure or system compromise.

## Project Structure

```text
├── vulnerable/
│   ├── backend/
│   │   ├── main.py     # Vulnerable FastAPI backend (Port 8001)
│   │   ├── seed.py     # Database init script
│   │   └── demo.db     # Isolated database
│   └── frontend/
│       └── index.html  # Vulnerable UI
│
├── prevented/
│   ├── backend/
│   │   ├── main.py     # Secure FastAPI backend (Port 8002)
│   │   ├── seed.py     # Database init script
│   │   └── demo.db     # Isolated database
│   └── frontend/
│       └── index.html  # Secure UI
│
├── index.html          # Central Comparison Hub
├── testing_cheatsheet.md# Payloads for testing
├── README.md           # Documentation (You are here)
└── CODE-COMPARISON.md  # Detailed code diffs
```

## Getting Started

### Prerequisites

Ensure you have the following installed:
* Python 3.8+
* `pip` (Python package manager)

Install the required dependencies:
```bash
pip install fastapi uvicorn sqlalchemy
```

### 1. Initialize Databases
Navigate to the root directory and run the seed scripts to populate dummy data:
```bash
python vulnerable/backend/seed.py
python prevented/backend/seed.py
```

### 2. Start Servers
You will need to open two separate terminal windows.

**Terminal 1 (Vulnerable Server):**
```bash
cd vulnerable/backend
python -m uvicorn main:app --port 8001
```

**Terminal 2 (Prevented Server):**
```bash
cd prevented/backend
python -m uvicorn main:app --port 8002
```

### 3. Open the Hub
Open `index.html` in your web browser. Click the buttons to launch the interactive demonstrations and test payloads from both applications simultaneously.

## Demonstration Steps

1. **Normal Flow**: 
   - Open the **Vulnerable** version and search for `Rahul`. 
   - *Result*: Notice that it correctly returns exactly one record.
2. **Injection (The Attack)**: 
   - Open the **Vulnerable** version and search for `%' OR '1'='1`. 
   - *Result*: Notice that it returns **all** records in the database, demonstrating a successful SQL injection bypass.
3. **Prevention (The Defense)**: 
   - Open the **Prevented** version and search for `%' OR '1'='1`. 
   - *Result*: Notice that it safely returns `0` results. The ORM successfully parameterizes the query and treats the payload as a literal string (looking for a student named exactly *`%' OR '1'='1`*), completely neutralizing the attack.

## Testing Cheatsheet

For more advanced payloads (like `UNION SELECT` or boolean inferencing), please check the included `testing_cheatsheet.md` file!
