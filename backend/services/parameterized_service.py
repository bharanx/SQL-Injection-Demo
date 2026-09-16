"""
==============================================================================
PARAMETERIZED SERVICE MODULE — PREPARED STATEMENTS
==============================================================================
Executes queries safely using SQLite positional parameter binding (?).
==============================================================================
"""

import sqlite3
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from database import get_raw_sqlite_connection


def login_parameterized(username: str, password: str) -> dict:
    """
    Secure login query using SQLite parameter placeholders (?).
    """
    conn = get_raw_sqlite_connection()
    cursor = conn.cursor()

    safe_template = "SELECT id, username, email, role FROM users WHERE username = ? AND password = ?"
    params = (username, password)

    try:
        cursor.execute(safe_template, params)
        rows = cursor.fetchall()

        matched_users = [dict(row) for row in rows]
        is_success = len(matched_users) > 0
        user_found = matched_users[0] if is_success else None

        is_injection = ("'" in username or "OR" in username.upper() or "--" in username or "1=1" in username)

        if is_injection:
            msg = "SQL INJECTION PREVENTED! Malicious payload treated strictly as literal data."
            exp = (
                "PROTECTED: Prepared statements separate SQL command compilation from data binding. "
                f"SQLite searched for a user whose literal username equals '{username}', returning 0 rows."
            )
        elif is_success:
            msg = "Login successful with valid credentials using parameterized query."
            exp = "Query executed safely using parameter placeholders."
        else:
            msg = "Login failed: Invalid username or password."
            exp = "Database searched safely using parameter placeholders and returned 0 matching records."

        return {
            "technique": "Parameterized Query (Prepared Statement)",
            "security": "protected",
            "security_badge": "PROTECTED ✅",
            "success": is_success,
            "input_received": {"username": username, "password": "********"},
            "query_executed": safe_template,
            "query_type": "parameterized",
            "parameters": [username, "********"],
            "rows_matched": len(matched_users),
            "user_found": user_found,
            "users": matched_users,
            "message": msg,
            "explanation": exp
        }
    except Exception as err:
        return {
            "technique": "Parameterized Query",
            "security": "error",
            "security_badge": "ERROR ❌",
            "success": False,
            "input_received": {"username": username, "password": "********"},
            "query_executed": safe_template,
            "query_type": "parameterized",
            "parameters": [username, "********"],
            "rows_matched": 0,
            "user_found": None,
            "users": [],
            "message": f"Database Error: {str(err)}",
            "explanation": "An unexpected error occurred."
        }
    finally:
        conn.close()


def search_users_parameterized(term: str) -> dict:
    """
    Secure search query using SQLite parameter placeholders (?).
    """
    conn = get_raw_sqlite_connection()
    cursor = conn.cursor()

    safe_template = "SELECT id, username, email, role FROM users WHERE username LIKE ? OR role LIKE ?"
    pattern = f"%{term}%"
    params = (pattern, pattern)

    try:
        cursor.execute(safe_template, params)
        rows = cursor.fetchall()
        matched_users = [dict(row) for row in rows]

        return {
            "technique": "Parameterized Search",
            "security": "protected",
            "security_badge": "PROTECTED ✅",
            "success": True,
            "term": term,
            "query_executed": safe_template,
            "query_type": "parameterized",
            "parameters": [pattern, pattern],
            "rows_matched": len(matched_users),
            "users": matched_users,
            "message": f"Found {len(matched_users)} user(s) safely using parameter binding.",
            "explanation": "Search parameters were bound safely as literal data strings."
        }
    finally:
        conn.close()
