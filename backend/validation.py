"""
==============================================================================
ADDITIONAL PROTECTION: INPUT VALIDATION (DEFENSE IN DEPTH)
==============================================================================

CONCEPT & ROLE:
Input validation ensures that data entering the application conforms to expected 
formats, character sets, and length boundaries BEFORE reaching the database layer.

RULES ENFORCED IN THIS LAB:
- Username:
  ✓ Minimum length: 3 characters
  ✓ Maximum length: 30 characters
  ✓ Allowed characters: Alphanumeric letters (a-z, A-Z), numbers (0-9), underscore (_)
  ✓ Regex: ^[a-zA-Z0-9_]{3,30}$
  
- Password:
  ✓ Minimum length: 8 characters
  ✓ Maximum length: 50 characters

CRITICAL SECURITY LESSON (DEFENSE IN DEPTH):
1. Input validation stops obviously malformed or malicious inputs at the perimeter.
2. IMPORTANT: Input validation is NOT a replacement for Parameterized Queries or ORMs!
   - Developers might fail to anticipate all injection vectors in complex regex.
   - Legitimate user input can contain single quotes (e.g., names like "O'Connor").
3. Parameterized queries / ORMs must ALWAYS be used as the primary database defense.
==============================================================================
"""

import re
from pydantic import ValidationError
from schemas import ValidatedLoginRequest


def validate_login_input(username: str, password: str) -> dict:
    """
    Validates user credentials against Pydantic rules prior to database execution.
    Returns validation status, list of error messages, and security explanations.
    """
    errors = []

    # Username validation checks
    if len(username) < 3:
        errors.append("Username is too short. Minimum length is 3 characters.")
    elif len(username) > 30:
        errors.append("Username is too long. Maximum length is 30 characters.")
    
    if not re.match(r"^[a-zA-Z0-9_]+$", username):
        errors.append("Username contains unsupported characters. Only letters, numbers, and underscores are allowed.")

    # Password validation checks
    if len(password) < 8:
        errors.append("Password is too short. Minimum length is 8 characters.")
    elif len(password) > 50:
        errors.append("Password is too long. Maximum length is 50 characters.")

    is_valid = len(errors) == 0

    if is_valid:
        msg = "Input validation passed successfully! Input adheres to required character set and length rules."
        exp = (
            "DEFENSE IN DEPTH: The input satisfied perimeter validation. It can now be safely passed to "
            "a parameterized query or ORM for database execution."
        )
    else:
        msg = "Input validation failed. Request rejected before database query."
        exp = (
            "SECURITY BOUNDARY ENFORCED: Input validation caught malformed or disallowed characters "
            "and blocked the request BEFORE reaching the database. No database connection or query was executed."
        )

    return {
        "technique": "Pydantic Input Validation",
        "status": "secure" if is_valid else "validation_failed",
        "security_badge": "DEFENSE IN DEPTH 🛡️",
        "success": is_valid,
        "input_received": {"username": username, "password": password},
        "query_executed": "NO DB QUERY EXECUTED (Validation step runs prior to DB query)",
        "parameters": None,
        "validation_passed": is_valid,
        "validation_errors": errors,
        "user_found": None,
        "records_returned_count": 0,
        "message": msg,
        "explanation": exp
    }
