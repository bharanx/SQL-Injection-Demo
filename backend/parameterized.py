"""
==============================================================================
SECURE IMPLEMENTATION 1: PARAMETERIZED QUERIES (PREPARED STATEMENTS)
==============================================================================

CONCEPT & MECHANICS:
Parameterized queries (also known as prepared statements or parameter binding)
are the PRIMARY defense against SQL Injection vulnerabilities.

HOW IT WORKS:
1. Separation of Code and Data:
   The database engine compiles the SQL query template first:
     SELECT * FROM users WHERE username = ? AND password = ?
   
2. Data Value Binding:
   User inputs are sent separately to the database engine and bound strictly 
   as literal data values.

3. Complete Syntax Immunity:
   Even if the input string contains single quotes (`'`), quotes, or SQL commands (`OR 1=1`), 
   the database engine treats the ENTIRE input as a single plain literal string value, 
   never interpreting it as SQL code structure.
==============================================================================
"""

import sqlite3
from database import get_raw_sqlite_connection


def execute_parameterized_login(username: str, password: str) -> dict:
    """
    Executes a secure login query using SQLite parameter placeholders (?).
    
    SAFE PATTERN:
      query = "SELECT * FROM users WHERE username = ? AND password = ?"
      cursor.execute(query, (username, password))
    """
    conn = get_raw_sqlite_connection()
    cursor = conn.cursor()

    # Pre-defined parameterized query string template with ? placeholders
    safe_query_template = "SELECT * FROM users WHERE username = ? AND password = ?"
    bound_parameters = (username, password)

    try:
        # SQLite engine safely binds bound_parameters into the query placeholders
        cursor.execute(safe_query_template, bound_parameters)
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

        is_injection_attempt = ("'" in username or "OR" in username.upper() or "--" in username or "1=1" in username)

        if is_injection_attempt:
            msg = "SQL INJECTION PREVENTED! The malicious input was treated strictly as a literal data string."
            exp = (
                "SECURITY SUCCESS: The input contained SQL control characters (e.g. single quotes or 'OR 1=1'). "
                "Because parameter binding was used, SQLite searched for a user whose literal username string was "
                f"exactly equal to '{username}'. Since no such literal username exists in the database, the query returned 0 records."
            )
        elif user_data:
            msg = "Login successful with valid credentials using parameterized query."
            exp = "The query executed safely with parameter placeholders separating SQL command structure from user input data."
        else:
            msg = "Login failed: Invalid credentials provided."
            exp = "The database searched safely using parameter placeholders and returned 0 matching records."

        return {
            "technique": "Parameterized Query (Prepared Statement)",
            "status": "secure",
            "security_badge": "PROTECTED ✅",
            "success": user_data is not None,
            "input_received": {"username": username, "password": password},
            "query_executed": safe_query_template,
            "parameters": [username, "********"],
            "validation_passed": True,
            "validation_errors": [],
            "user_found": user_data,
            "records_returned_count": records_found,
            "message": msg,
            "explanation": exp
        }

    except Exception as err:
        return {
            "technique": "Parameterized Query (Prepared Statement)",
            "status": "error",
            "security_badge": "PROTECTED ✅",
            "success": False,
            "input_received": {"username": username, "password": password},
            "query_executed": safe_query_template,
            "parameters": [username, "********"],
            "validation_passed": True,
            "validation_errors": [],
            "user_found": None,
            "records_returned_count": 0,
            "message": f"Database Error: {str(err)}",
            "explanation": "An unexpected error occurred during database execution."
        }
    finally:
        conn.close()
