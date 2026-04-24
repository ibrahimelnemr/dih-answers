#!/usr/bin/env python3
"""Backup the Render-hosted PostgreSQL database via the admin SQL console API.

Usage:
    python3 scripts/backup_render_db.py [description]

Creates a JSON backup in backups/ with timestamped filename.
The description defaults to 'backup' if not provided.

Requires: the backend to be deployed and accessible, and admin credentials
configured in .env (DJANGO_SUPERUSER_USERNAME, DJANGO_SUPERUSER_PASSWORD).
"""
from __future__ import annotations

import json
import os
import sys
from datetime import datetime
from pathlib import Path
from urllib.parse import urljoin
from http.cookiejar import CookieJar
from urllib.request import Request, build_opener, HTTPCookieProcessor

PROJECT_ROOT = Path(__file__).resolve().parent.parent

# Load .env
env_path = PROJECT_ROOT / ".env"
if env_path.exists():
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, _, value = line.partition("=")
            os.environ.setdefault(key.strip(), value.strip())

BACKEND_URL = os.environ.get(
    "BACKEND_URL", "https://dih-answers-backend.onrender.com"
)
ADMIN_USER = os.environ.get("DJANGO_SUPERUSER_USERNAME", "admin")
ADMIN_PASS = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "admin")
FRONTEND_URL = os.environ.get(
    "FRONTEND_URL", "https://dih-answers-frontend.onrender.com"
)

# Tables to backup in dependency order
TABLES = [
    "auth_group",
    "auth_user",
    "auth_user_groups",
    "auth_user_user_permissions",
    "taxonomy_tag",
    "taxonomy_category",
    "qa_question",
    "qa_question_tags",
    "qa_answer",
    "qa_questionvote",
    "qa_answervote",
    "qa_questioncomment",
    "qa_answercomment",
]


def api_request(
    opener: build_opener,
    url: str,
    data: dict | None = None,
    csrf_token: str = "",
) -> dict | str:
    headers = {
        "Content-Type": "application/json",
        "Referer": FRONTEND_URL + "/",
    }
    if csrf_token:
        headers["X-CSRFToken"] = csrf_token

    body = json.dumps(data).encode() if data else None
    method = "POST" if data else "GET"
    req = Request(url, data=body, headers=headers, method=method)
    resp = opener.open(req, timeout=30)
    return json.loads(resp.read().decode())


def get_csrf(opener: build_opener) -> str:
    url = urljoin(BACKEND_URL, "/auth/csrf")
    api_request(opener, url)
    for cookie in opener.handlers:
        if isinstance(cookie, HTTPCookieProcessor):
            for c in cookie.cookiejar:
                if c.name == "csrftoken":
                    return c.value
    return ""


def main() -> None:
    description = sys.argv[1] if len(sys.argv) > 1 else "backup"
    jar = CookieJar()
    opener = build_opener(HTTPCookieProcessor(jar))

    print(f"Connecting to {BACKEND_URL}...")

    # Get CSRF and login
    csrf = get_csrf(opener)
    login_url = urljoin(BACKEND_URL, "/auth/login")
    result = api_request(
        opener,
        login_url,
        {"username": ADMIN_USER, "password": ADMIN_PASS},
        csrf,
    )
    print(f"Logged in as: {result.get('username', 'unknown')}")

    # Refresh CSRF after login
    csrf = get_csrf(opener)

    # Dump each table
    backup_data: dict[str, dict] = {}
    sql_url = urljoin(BACKEND_URL, "/api/sql")

    for table in TABLES:
        try:
            result = api_request(
                opener, sql_url, {"sql": f"SELECT * FROM {table}"}, csrf
            )
            row_count = result.get("row_count", 0)
            backup_data[table] = {
                "columns": result.get("columns", []),
                "rows": result.get("rows", []),
                "row_count": row_count,
            }
            print(f"  {table}: {row_count} rows")
        except Exception as e:
            print(f"  {table}: ERROR - {e}")
            backup_data[table] = {"columns": [], "rows": [], "row_count": 0, "error": str(e)}

    # Write backup
    backups_dir = PROJECT_ROOT / "backups"
    backups_dir.mkdir(exist_ok=True)
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M")
    filename = f"{timestamp}_{description}.json"
    backup_path = backups_dir / filename

    with open(backup_path, "w") as f:
        json.dump(
            {
                "timestamp": datetime.now().isoformat(),
                "backend_url": BACKEND_URL,
                "tables": backup_data,
            },
            f,
            indent=2,
            default=str,
        )

    total_rows = sum(t["row_count"] for t in backup_data.values())
    size_kb = backup_path.stat().st_size / 1024
    print(f"\nBackup saved: {backup_path}")
    print(f"Total: {len(backup_data)} tables, {total_rows} rows, {size_kb:.1f} KB")


if __name__ == "__main__":
    main()
