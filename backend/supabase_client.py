"""
Supabase client for user tracking and rate limiting.
"""

import os
from datetime import datetime, date
from typing import Optional, Dict, Any
from pathlib import Path
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from .env.backend
env_path = Path(__file__).parent.parent / ".env.backend"
load_dotenv(env_path)

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Rate limits
DAILY_QUERY_LIMIT = 20
MONTHLY_QUERY_LIMIT = 100
IP_DAILY_LIMIT = 50


class SupabaseManager:
    """Manages Supabase connection and user operations."""

    def __init__(self):
        """Initialize Supabase client."""
        if not SUPABASE_URL or not SUPABASE_KEY:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment variables")

        if SUPABASE_URL == "your_supabase_url_here":
            raise ValueError("Please update SUPABASE_URL in .env.backend with your actual Supabase URL")

        self.client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    async def get_or_create_user(self, email: str, ip_address: str) -> Dict[str, Any]:
        """
        Get existing user or create new one.

        Args:
            email: User email address
            ip_address: User IP address

        Returns:
            User data dictionary
        """
        # Try to get existing user
        response = self.client.table("legal_aid_users").select("*").eq("email", email).execute()

        if response.data and len(response.data) > 0:
            user = response.data[0]

            # Update IP address if changed
            if user.get("ip_address") != ip_address:
                self.client.table("legal_aid_users").update({
                    "ip_address": ip_address,
                    "updated_at": datetime.now().isoformat()
                }).eq("email", email).execute()
                user["ip_address"] = ip_address

            # Reset daily count if new day
            if user.get("last_query_date") and user["last_query_date"] != str(date.today()):
                self.client.table("legal_aid_users").update({
                    "query_count_today": 0,
                    "last_query_date": str(date.today()),
                    "updated_at": datetime.now().isoformat()
                }).eq("email", email).execute()
                user["query_count_today"] = 0
                user["last_query_date"] = str(date.today())

            # Reset monthly count if new month
            current_month = datetime.now().strftime("%Y-%m")
            if user.get("last_query_month") and user["last_query_month"] != current_month:
                self.client.table("legal_aid_users").update({
                    "query_count_month": 0,
                    "last_query_month": current_month,
                    "updated_at": datetime.now().isoformat()
                }).eq("email", email).execute()
                user["query_count_month"] = 0
                user["last_query_month"] = current_month

            return user
        else:
            # Create new user
            new_user = {
                "email": email,
                "ip_address": ip_address,
                "query_count_today": 0,
                "query_count_month": 0,
                "last_query_date": str(date.today()),
                "last_query_month": datetime.now().strftime("%Y-%m"),
                "is_blocked": False
            }

            response = self.client.table("legal_aid_users").insert(new_user).execute()
            return response.data[0] if response.data else new_user

    async def check_rate_limit(self, email: str, ip_address: str) -> tuple[bool, str, Dict[str, Any]]:
        """
        Check if user has exceeded rate limits.

        Args:
            email: User email address
            ip_address: User IP address

        Returns:
            Tuple of (allowed, reason, user_data)
        """
        user = await self.get_or_create_user(email, ip_address)

        # Check if user is blocked
        if user.get("is_blocked"):
            reason = user.get("block_reason", "Account blocked for abuse")
            return False, reason, user

        # Check daily limit
        if user.get("query_count_today", 0) >= DAILY_QUERY_LIMIT:
            return False, f"Daily limit of {DAILY_QUERY_LIMIT} queries exceeded. Try again tomorrow.", user

        # Check monthly limit
        if user.get("query_count_month", 0) >= MONTHLY_QUERY_LIMIT:
            return False, f"Monthly limit of {MONTHLY_QUERY_LIMIT} queries exceeded. Try again next month.", user

        return True, "OK", user

    async def increment_usage(self, email: str) -> None:
        """
        Increment user's query count.

        Args:
            email: User email address
        """
        # Increment both daily and monthly counts
        self.client.rpc("increment_user_usage", {"user_email": email}).execute()

        # Fallback: manual increment if RPC doesn't exist
        try:
            user = self.client.table("legal_aid_users").select("*").eq("email", email).execute()
            if user.data:
                current_user = user.data[0]
                self.client.table("legal_aid_users").update({
                    "query_count_today": current_user.get("query_count_today", 0) + 1,
                    "query_count_month": current_user.get("query_count_month", 0) + 1,
                    "last_query_date": str(date.today()),
                    "updated_at": datetime.now().isoformat()
                }).eq("email", email).execute()
        except Exception as e:
            print(f"Error incrementing usage: {e}")

    async def block_user(self, email: str, reason: str) -> None:
        """
        Block a user for abuse.

        Args:
            email: User email address
            reason: Reason for blocking
        """
        self.client.table("legal_aid_users").update({
            "is_blocked": True,
            "block_reason": reason,
            "updated_at": datetime.now().isoformat()
        }).eq("email", email).execute()

    async def get_user_stats(self, email: str) -> Optional[Dict[str, Any]]:
        """
        Get user statistics.

        Args:
            email: User email address

        Returns:
            User statistics dictionary or None
        """
        response = self.client.table("legal_aid_users").select("*").eq("email", email).execute()
        return response.data[0] if response.data else None


# Create global instance (will be initialized in API)
supabase_manager: Optional[SupabaseManager] = None


def get_supabase_manager() -> SupabaseManager:
    """Get or create Supabase manager instance."""
    global supabase_manager
    if supabase_manager is None:
        supabase_manager = SupabaseManager()
    return supabase_manager
