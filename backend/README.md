# SQL Injection Prevention Lab — Backend

FastAPI Python backend for the SQL Injection Prevention cybersecurity educational lab.

## Features & Endpoints

- `GET /`: Health check & lab metadata
- `GET /users`: List public test user records (password omitted)
- `POST /login/vulnerable`: Educational demonstration of unsafe string concatenation
- `POST /login/parameterized`: Secure parameter binding (`?` placeholders)
- `POST /login/orm`: Secure SQLAlchemy ORM query abstraction
- `POST /validate-input`: Input validation rules check (Pydantic / Regex)

## Installation & Setup

1. Create a Python virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- Windows:
  ```cmd
  venv\Scripts\activate
  ```
- macOS / Linux:
  ```bash
  source venv/bin/activate
  ```

3. Install requirements:
```bash
pip install -r requirements.txt
```

4. Run the Uvicorn server:
```bash
python -m uvicorn main:app --reload
```

5. Access interactive OpenAPI documentation at:
- `http://127.0.0.1:8000/docs`
