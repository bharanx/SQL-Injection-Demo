"""
==============================================================================
EDUCATIONAL VULNERABLE EXAMPLE — FOR LOCAL ACADEMIC DEMONSTRATION ONLY
==============================================================================

WARNING / DISCLAIMER:
This module contains intentionally vulnerable code pattern using Python string 
interpolation (f-strings / format / concatenation) to build raw SQL queries.

WHY THIS CODE IS UNSAFE:
When user input is directly concatenated into a SQL string:
  1. The database parser cannot distinguish between application developer code 
     and user-supplied input.
  2. Input containing single quotes (e.g. `' OR '1'='1`) breaks out of the intended 
     string literal context.
  3. The user input is parsed as active SQL commands/clauses rather than literal data values.

THIS DEMONSTRATION:
- Runs strictly locally on an isolated dummy SQLite database.
- Does not contain destructive SQL statements.
- Serves as a clear visual counter-example for live classroom demonstrations.
==============================================================================
"""

import sqlite3
from database import get_raw_sqlite_connection


def execute_vulnerable_login(username: str, password: str) -> dict:
    """
    Demonstrates unsafe SQL query construction using direct string concatenation.
    
    UNSAFE PATTERN:
      query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
      
    If input username is: admin' --
    Resulting SQL: SELECT * FROM users WHERE username = 'admin' --' AND password = '...'
    The '--' comment sequence truncates the password check, granting unauthorized access!
    """
    conn = get_raw_sqlite_connection()
    cursor = conn.cursor()

    # Vulnerable SQL query construction via Python string formatting
    vulnerable_query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"

    try:
        # executing raw un-parameterized query against SQLite
        # executescript or executescript-like multiple statements handling
        # standard executescript or cursor.execute
        cursor.execute(vulnerable_query)
        rows = cursor.fetchall()
        
        user_data = None
        records_found = len(rows)

        if records_found > 0:
            first_row = rows[0]
            user_data = {
                "id": first_row["id"],
                "username": first_row["username"],
                "email": first_row["email"],
                "role": first_row["role"]
            }

        is_injection = ("'" in username or "OR" in username.upper() or "--" in username or "1=1" in username or "1'='1" in username)

        if user_data and is_injection:
            msg = "LOGIN SUCCESSFUL VIA SQL INJECTION! Unsafe string concatenation allowed input to manipulate query logic."
            exp = (
                "VULNERABILITY DEMONSTRATED: The input altered the SQL query structure. "
                "Because single quotes and boolean logic (' OR '1'='1) were concatenated directly into the query string, "
                "the database parser treated the input as SQL commands instead of literal text values."
            )
        elif user_data:
            msg = "Login successful with valid credentials (using vulnerable query function)."
            exp = "Although login succeeded for valid input, this function remains HIGHLY VULNERABLE because string concatenation is used."
        else:
            msg = "Login failed: No user found matching the evaluated SQL logic."
            exp = "The query executed, but no database rows matched the injected/evaluated condition."

        return {
            "technique": "Unsafe String Concatenation (Vulnerable)",
            "status": "vulnerable",
            "security_badge": "UNSAFE ❌",
            "success": user_data is not None,
            "input_received": {"username": username, "password": password},
            "query_executed": vulnerable_query,
            "parameters": None,
            "validation_passed": True,
            "validation_errors": [],
            "user_found": user_data,
            "records_returned_count": records_found,
            "message": msg,
            "explanation": exp
        }

    except sqlite3.OperationalError as err:
        return {
            "technique": "Unsafe String Concatenation (Vulnerable)",
            "status": "vulnerable",
            "security_badge": "UNSAFE ❌",
            "success": False,
            "input_received": {"username": username, "password": password},
            "query_executed": vulnerable_query,
            "parameters": None,
            "validation_passed": True,
            "validation_errors": [],
            "user_found": None,
            "records_returned_count": 0,
            "message": f"SQL Syntax Error Triggered: {str(err)}",
            "explanation": (
                "Malicious input broke the SQL syntax structure, causing SQLite to throw a syntax error. "
                "This occurs because user input was parsed as raw SQL command structure."
            )
        }
    finally:
        conn.close()
