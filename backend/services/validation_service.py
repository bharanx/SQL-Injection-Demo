"""
==============================================================================
VALIDATION SERVICE MODULE — INPUT RULES CHECKING
==============================================================================
Validates inputs (username, email, search terms) prior to database processing.
==============================================================================
"""

import re


def validate_input_fields(username: str = None, email: str = None, search: str = None) -> dict:
    """
    Validates provided input fields against perimeter character and length rules.
    """
    results = {}
    overall_valid = True
    errors = []

    # Username validation
    if username is not None:
        u_valid = True
        u_errs = []
        if len(username) < 3 or len(username) > 30:
            u_valid = False
            u_errs.append("Username length must be between 3 and 30 characters.")
        if not re.match(r"^[a-zA-Z0-9_]+$", username):
            u_valid = False
            u_errs.append("Username contains disallowed characters. Allowed: a-z, A-Z, 0-9, _")
        results["username"] = {"valid": u_valid, "errors": u_errs}
        if not u_valid:
            overall_valid = False
            errors.extend(u_errs)

    # Email validation
    if email is not None:
        e_valid = True
        e_errs = []
        email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        if not re.match(email_regex, email):
            e_valid = False
            e_errs.append("Invalid email address format.")
        results["email"] = {"valid": e_valid, "errors": e_errs}
        if not e_valid:
            overall_valid = False
            errors.extend(e_errs)

    # Search term validation
    if search is not None:
        s_valid = True
        s_errs = []
        if len(search) > 50:
            s_valid = False
            s_errs.append("Search term cannot exceed 50 characters.")
        if any(char in search for char in ["'", '"', "--", ";"]):
            s_valid = False
            s_errs.append("Search query contains disallowed SQL control characters (', \", --, ;).")
        results["search"] = {"valid": s_valid, "errors": s_errs}
        if not s_valid:
            overall_valid = False
            errors.extend(s_errs)

    if overall_valid:
        msg = "Input validation passed! Input satisfies perimeter rules."
        exp = (
            "DEFENSE IN DEPTH: The input passed perimeter character set and length checks. "
            "It can now be safely handed to a parameterized query or ORM for execution."
        )
    else:
        msg = "Input validation failed. Request rejected before database operation."
        exp = (
            "PERIMETER DEFENSE ENFORCED: Validation blocked disallowed characters or invalid formats "
            "BEFORE reaching the database layer. No database query was executed."
        )

    return {
        "technique": "Pydantic & Regex Input Validation",
        "security": "defense_in_depth" if overall_valid else "rejected",
        "security_badge": "DEFENSE IN DEPTH 🛡️" if overall_valid else "REJECTED ❌",
        "success": overall_valid,
        "validation_passed": overall_valid,
        "field_results": results,
        "errors": errors,
        "message": msg,
        "explanation": exp
    }
