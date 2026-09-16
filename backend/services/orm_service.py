"""
==============================================================================
ORM SERVICE MODULE — SQLALCHEMY ORM ABSTRACTION
==============================================================================
Executes login and search queries using SQLAlchemy ORM expressions.
==============================================================================
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from sqlalchemy.orm import Session
from sqlalchemy import or_
from models import User


def login_orm(db: Session, username: str, password: str) -> dict:
    """
    Secure login query using SQLAlchemy ORM filter expressions.
    """
    orm_expr = "db.query(User).filter(User.username == username, User.password == password).first()"
    gen_sql = "SELECT users.id, users.username, users.email, users.role FROM users WHERE users.username = ? AND users.password = ?"

    try:
        user = db.query(User).filter(
            User.username == username,
            User.password == password
        ).first()

        user_found = user.to_dict() if user else None
        is_success = user_found is not None

        is_injection = ("'" in username or "OR" in username.upper() or "--" in username or "1=1" in username)

        if is_injection:
            msg = "SQL INJECTION PREVENTED BY ORM! SQLAlchemy automatically bound user input as a safe data parameter."
            exp = (
                "PROTECTED BY ORM: SQLAlchemy mapped `User.username == username` to bound SQL placeholders. "
                "The input was evaluated strictly as a literal username string value."
            )
        elif is_success:
            msg = "Login successful with valid credentials using SQLAlchemy ORM."
            exp = "The ORM safely constructed and executed a parameterized database operation."
        else:
            msg = "Login failed: No matching user found by ORM."
            exp = "The ORM executed a safe parameterized query, but 0 records matched."

        return {
            "technique": "SQLAlchemy ORM Framework",
            "security": "protected",
            "security_badge": "PROTECTED ✅",
            "success": is_success,
            "input_received": {"username": username, "password": "********"},
            "query_executed": f"{orm_expr}\n--> Generates SQL: {gen_sql}",
            "query_type": "orm",
            "parameters": {"username": username, "password": "********"},
            "rows_matched": 1 if is_success else 0,
            "user_found": user_found,
            "users": [user_found] if user_found else [],
            "message": msg,
            "explanation": exp
        }
    except Exception as err:
        return {
            "technique": "SQLAlchemy ORM Framework",
            "security": "error",
            "security_badge": "ERROR ❌",
            "success": False,
            "input_received": {"username": username, "password": "********"},
            "query_executed": orm_expr,
            "query_type": "orm",
            "parameters": None,
            "rows_matched": 0,
            "user_found": None,
            "users": [],
            "message": f"ORM Error: {str(err)}",
            "explanation": "An error occurred during ORM query evaluation."
        }


def search_users_orm(db: Session, term: str) -> dict:
    """
    Secure search query using SQLAlchemy ORM filter expressions.
    """
    orm_expr = f"db.query(User).filter(or_(User.username.like('%{term}%'), User.role.like('%{term}%'))).all()"
    gen_sql = "SELECT users.id, users.username, users.email, users.role FROM users WHERE users.username LIKE ? OR users.role LIKE ?"

    try:
        pattern = f"%{term}%"
        users = db.query(User).filter(
            or_(User.username.like(pattern), User.role.like(pattern))
        ).all()

        matched_users = [u.to_dict() for u in users]

        return {
            "technique": "SQLAlchemy ORM Search",
            "security": "protected",
            "security_badge": "PROTECTED ✅",
            "success": True,
            "term": term,
            "query_executed": f"{orm_expr}\n--> Generates SQL: {gen_sql}",
            "query_type": "orm",
            "parameters": {"pattern": pattern},
            "rows_matched": len(matched_users),
            "users": matched_users,
            "message": f"Found {len(matched_users)} user(s) safely using SQLAlchemy ORM.",
            "explanation": "SQLAlchemy converted ORM filter criteria into safe parameter-bound SQL LIKE conditions."
        }
    except Exception as err:
        return {
            "technique": "SQLAlchemy ORM Search",
            "security": "error",
            "security_badge": "ERROR ❌",
            "success": False,
            "term": term,
            "query_executed": orm_expr,
            "query_type": "orm",
            "parameters": None,
            "rows_matched": 0,
            "users": [],
            "message": f"ORM Error: {str(err)}",
            "explanation": "An error occurred during ORM search."
        }
