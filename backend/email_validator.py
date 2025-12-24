"""
Email validation and spam detection.
"""

import re
from typing import Tuple

# Common disposable email domains
DISPOSABLE_DOMAINS = {
    "temp-mail.org", "guerrillamail.com", "10minutemail.com",
    "throwaway.email", "mailinator.com", "maildrop.cc",
    "trashmail.com", "tempmail.com", "yopmail.com",
    "fakeinbox.com", "dispostable.com", "sharklasers.com",
    "getnada.com", "temp-mail.io", "mohmal.com",
    "mintemail.com", "mytemp.email", "guerrillamailblock.com"
}

# Email regex pattern
EMAIL_PATTERN = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'


def is_valid_email_format(email: str) -> bool:
    """
    Check if email has valid format.

    Args:
        email: Email address to validate

    Returns:
        True if valid format, False otherwise
    """
    if not email or len(email) > 254:
        return False

    return bool(re.match(EMAIL_PATTERN, email))


def is_disposable_email(email: str) -> bool:
    """
    Check if email is from a disposable email service.

    Args:
        email: Email address to check

    Returns:
        True if disposable, False otherwise
    """
    if not email or '@' not in email:
        return False

    domain = email.split('@')[1].lower()
    return domain in DISPOSABLE_DOMAINS


def validate_email(email: str) -> Tuple[bool, str]:
    """
    Validate email address.

    Args:
        email: Email address to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    # Normalize email
    email = email.strip().lower()

    # Check format
    if not is_valid_email_format(email):
        return False, "Invalid email format. Please enter a valid email address."

    # Check for disposable email
    if is_disposable_email(email):
        return False, "Disposable email addresses are not allowed. Please use a permanent email."

    # Check length
    if len(email) < 5:
        return False, "Email address is too short."

    # Check for suspicious patterns
    if email.count('@') > 1:
        return False, "Invalid email format."

    # Check for common typos in popular domains
    common_domains = {
        'gmail.com': ['gmai.com', 'gmial.com', 'gmail.co'],
        'yahoo.com': ['yahooo.com', 'yaho.com', 'yahoo.co'],
        'outlook.com': ['outlok.com', 'outloo.com'],
        'hotmail.com': ['hotmai.com', 'hotmal.com']
    }

    domain = email.split('@')[1]
    for correct_domain, typos in common_domains.items():
        if domain in typos:
            return False, f"Did you mean @{correct_domain}?"

    return True, "Valid email"


def sanitize_email(email: str) -> str:
    """
    Sanitize email address.

    Args:
        email: Email address to sanitize

    Returns:
        Sanitized email address
    """
    return email.strip().lower()
