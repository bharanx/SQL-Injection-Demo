"""
==============================================================================
VULNERABLE SERVICE MODULE — EDUCATIONAL DEMONSTRATION ONLY
==============================================================================
Demonstrates unsafe query construction using Python string interpolation.
Operates strictly on the local SQLite dummy database.
==============================================================================
"""

import sqlite3
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from database import get_raw_sqlite_connection


def login_vulnerable(username: str, password: str) -> dict:
    """
    Intentionally unsafe login query using direct string formatting.
    """
    conn = get_raw_sqlite_connection()
    cursor = conn.cursor()

    # Unsafe query construction
    query_str = f"SELECT id, username, email, role FROM users WHERE username = '{username}' AND password = '{password}'"

    try:
        cursor.execute(query_str)
        rows = cursor.fetchall()

        matched_users = [dict(row) for row in rows]
        is_success = len(matched_users) > 0
        user_found = matched_users[0] if is_success else None

        is_injection = ("'" in username or "OR" in username.upper() or "--" in username or "1=1" in username)

        if is_success and is_injection:
            msg = "LOGIN SUCCESSFUL VIA SQL INJECTION! Unsafe string concatenation merged input into SQL logic."
            exp = (
                "VULNERABILITY EXPLOITED: The input altered the SQL query structure. "
                "Because single quotes and comment markers (' --) were concatenated directly into the query string, "
                "the database parser treated user input as active SQL clauses, bypassing password checks."
            )
        elif is_success:
            msg = "Login successful with valid credentials."
            exp = "Login succeeded, but this function is unsafe because string concatenation is used for query building."
        else:
            msg = "Login failed: No matching user found by evaluated SQL logic."
            exp = "The query executed, but no database records satisfied the evaluated SQL condition."

        return {
            "technique": "Vulnerable SQL (String Concatenation)",
            "security": "unsafe",
            "security_badge": "UNSAFE ❌",
            "success": is_success,
            "input_received": {"username": username, "password": "********"},
            "query_executed": query_str,
            "query_type": "string_concatenation",
            "parameters": None,
            "rows_matched": len(matched_users),
            "user_found": user_found,
            "users": matched_users,
            "message": msg,
            "explanation": exp
        }

    except sqlite3.OperationalError as err:
        return {
            "technique": "Vulnerable SQL (String Concatenation)",
            "security": "unsafe",
            "security_badge": "UNSAFE ❌",
            "success": False,
            "input_received": {"username": username, "password": "********"},
            "query_executed": query_str,
            "query_type": "string_concatenation",
            "parameters": None,
            "rows_matched": 0,
            "user_found": None,
            "users": [],
            "message": f"SQL Syntax Error: {str(err)}",
            "explanation": "Malicious input broke the SQL query syntax, causing SQLite to throw an OperationalError."
        }
    finally:
        conn.close()


def search_users_vulnerable(term: str) -> dict:
    """
    Intentionally unsafe search query using direct string formatting.
    """
    conn = get_raw_sqlite_connection()
    cursor = conn.cursor()

    query_str = f"SELECT id, username, email, role FROM users WHERE username LIKE '%{term}%' OR role LIKE '%{term}%'"

    try:
        cursor.execute(query_str)
        rows = cursor.fetchall()
        matched_users = [dict(row) for row in rows]

        is_injection = ("'" in term or "OR" in term.upper() or "--" in term or "UNION" in term.upper())

        return {
            "technique": "Vulnerable Search (String Concatenation)",
            "security": "unsafe",
            "security_badge": "UNSAFE ❌",
            "success": True,
            "term": term,
            "query_executed": query_str,
            "rows_matched": len(matched_users),
            "users": matched_users,
            "message": f"Found {len(matched_users)} user(s) matching search evaluation.",
            "explanation": (
                "Unsafe string concatenation in search query allowed input single quotes to alter query filtering logic."
                if is_injection else "Search executed using unsafe string formatting."
            )
        }
    except sqlite3.OperationalError as err:
        return {
            "technique": "Vulnerable Search (String Concatenation)",
            "security": "unsafe",
            "security_badge": "UNSAFE ❌",
            "success": False,
            "term": term,
            "query_executed": query_str,
            "rows_matched": 0,
            "users": [],
            "message": f"SQL Syntax Error: {str(err)}",
            "explanation": "Input broke search SQL syntax structure."
        }
    finally:
        conn.close()
