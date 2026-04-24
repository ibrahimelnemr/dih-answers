---
description: Create a local backup of the Render-hosted PostgreSQL database
---

# Backup Render Database

## Purpose
After each task that modifies the database (migrations, seed data, data changes), create a local backup of the Render-hosted PostgreSQL database for disaster recovery.

## When to invoke
- After any task that deploys backend changes to Render.
- After running migrations or seed commands against the Render DB.
- Before performing destructive database operations.

## Backup location
- **Directory**: `backups/` in the project root (gitignored)
- **Naming**: `{YYYY-MM-DD}_{HH-MM}_{description}.json`
  - Example: `2026-04-24_14-56_post-seed.json`

## How to run

### Method 1: Backup script (works on free tier)
The backup script uses the admin SQL console API to dump all tables as JSON. No direct DB connection needed.

```bash
# From the project root
python3 scripts/backup_render_db.py <description>
```

Example:
```bash
python3 scripts/backup_render_db.py post-deploy
python3 scripts/backup_render_db.py pre-migration
```

The script:
- Reads admin credentials from `.env` (DJANGO_SUPERUSER_USERNAME, DJANGO_SUPERUSER_PASSWORD)
- Logs in via the auth API
- Dumps all tables (auth_user, taxonomy_category, taxonomy_tag, qa_question, qa_answer, etc.) via the `/api/sql` endpoint
- Saves a timestamped JSON file to `backups/`

### Method 2: pg_dump (paid Render plan only)
If on a paid plan with external DB access:

```bash
source <(grep -E '^DB_(NAME|USER|PASSWORD|HOST|PORT)=' .env | sed 's/^/export /')
mkdir -p backups
PGPASSWORD="$DB_PASSWORD" pg_dump \
  -h "$DB_HOST" -U "$DB_USER" -p "$DB_PORT" -d "$DB_NAME" \
  --no-owner --no-privileges -F c \
  -f "backups/$(date +%Y-%m-%d_%H-%M)_description.sql"
```

## Notes
- The `backups/` directory is gitignored — backups are local only.
- On free-tier Render Postgres, external connections are not available. Use the script (Method 1).
- The JSON backup contains all table data and can be used to reconstruct the DB state.
