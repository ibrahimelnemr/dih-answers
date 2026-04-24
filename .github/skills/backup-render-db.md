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
- **Naming**: `{YYYY-MM-DD}_{HH-MM}_{description}.sql`
  - Example: `2026-04-24_11-30_post-seed.sql`

## How to run

### Important: Free-tier limitation
Render free-tier PostgreSQL does **not** allow external connections. The `pg_dump` commands below only work if on a paid plan with external access enabled. On the free tier, backups are not possible from your local machine.

For free-tier, the best alternative is to include a dump step in the Dockerfile CMD temporarily (similar to the seed approach), piping output to stdout, then capturing it from Render service logs.

### Prerequisites (paid plan only)
- The `.env` file must have the **external** Render DB hostname (ending in `.oregon-postgres.render.com`).
- `pg_dump` must be available locally (install via `brew install postgresql` if needed).

### Backup command
Read the DB credentials from `.env` and run `pg_dump`:

```bash
# From the project root
source <(grep -E '^DB_(NAME|USER|PASSWORD|HOST|PORT)=' .env | sed 's/^/export /')

mkdir -p backups

PGPASSWORD="$DB_PASSWORD" pg_dump \
  -h "$DB_HOST" \
  -U "$DB_USER" \
  -p "$DB_PORT" \
  -d "$DB_NAME" \
  --no-owner \
  --no-privileges \
  -F c \
  -f "backups/$(date +%Y-%m-%d_%H-%M)_description.sql"
```

Replace `description` in the filename with a short slug describing the state (e.g. `post-seed`, `pre-migration`, `post-deploy`).

### Verify the backup
```bash
pg_restore --list backups/<filename>.sql | head -20
```

## Restore (if needed)
```bash
source <(grep -E '^DB_(NAME|USER|PASSWORD|HOST|PORT)=' .env | sed 's/^/export /')

PGPASSWORD="$DB_PASSWORD" pg_restore \
  -h "$DB_HOST" \
  -U "$DB_USER" \
  -p "$DB_PORT" \
  -d "$DB_NAME" \
  --no-owner \
  --no-privileges \
  --clean \
  --if-exists \
  backups/<filename>.sql
```

## Notes
- Use `-F c` (custom format) for efficient, restorable backups.
- The `backups/` directory is gitignored — backups are local only.
- On free-tier Render Postgres, there are no automatic backups, so these local backups are the safety net.
