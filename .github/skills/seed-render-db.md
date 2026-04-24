---
description: Seed the Render-hosted PostgreSQL database with categories, questions, and sample data
---

# Seed Render Database

## Purpose
Populate the Render-hosted PostgreSQL database with seed data (categories, sample questions, demo users) using either the Django management command or a SQL dump.

## When to invoke
- After a fresh deployment or database reset.
- When the Render DB is missing categories, tags, or sample data.
- After a migration that clears or restructures data.

## Methods

### Method 1: Django management command (preferred)
Run the `seed_data` command against the Render DB by pointing Django at the Render credentials via the `.env` file.

```bash
cd backend

# Ensure .env in the project root has the Render DB credentials active (not the local ones)
# The settings.py reads DB_* env vars automatically

# Source the env vars
source <(grep -v '^#' ../.env | grep -v '^\s*$' | sed 's/^/export /')

# Run the seed command
poetry run python manage.py seed_data
```

Use `--clear` to wipe existing data before seeding:
```bash
poetry run python manage.py seed_data --clear
```

This creates:
- **Categories**: Hierarchical tree (Offerings → Specializations → Topics)
- **Demo users**: `demo` / `demo1234` and `helper` / `helper1234`
- **Sample questions**: 10 questions across various categories
- **Sample answers**: Answers for select questions

### Method 2: SQL dump restore
If a `seed.sql` file exists in `backend/`, restore it directly to the Render DB.

```bash
# From the project root
source <(grep -E '^DB_(NAME|USER|PASSWORD|HOST|PORT)=' .env | sed 's/^/export /')

PGPASSWORD="$DB_PASSWORD" psql \
  -h "$DB_HOST" \
  -U "$DB_USER" \
  -p "$DB_PORT" \
  -d "$DB_NAME" \
  -f backend/seed.sql
```

**Note**: The SQL dump may contain hashed passwords tied to a specific `SECRET_KEY`. If the key has changed, use Method 1 instead (it creates fresh password hashes).

### Method 3: Create a new SQL dump from current DB
After seeding via Method 1, capture the state as a SQL dump for future use:

```bash
source <(grep -E '^DB_(NAME|USER|PASSWORD|HOST|PORT)=' .env | sed 's/^/export /')

PGPASSWORD="$DB_PASSWORD" pg_dump \
  -h "$DB_HOST" \
  -U "$DB_USER" \
  -p "$DB_PORT" \
  -d "$DB_NAME" \
  --data-only \
  --no-owner \
  --no-privileges \
  > backend/seed.sql
```

## Verification
After seeding, verify the data is present:

```bash
curl -s https://dih-answers-backend.onrender.com/categories/tree | python3 -m json.tool | head -30
curl -s https://dih-answers-backend.onrender.com/questions | python3 -c "import json,sys; d=json.load(sys.stdin); print(f'{len(d)} questions')"
curl -s https://dih-answers-backend.onrender.com/tags | python3 -c "import json,sys; d=json.load(sys.stdin); print(f'{len(d)} tags')"
```

## Notes
- Always run the `backup-render-db` skill **before** running `seed_data --clear` to preserve existing data.
- The `.env` file must have the **external** Render DB hostname for local commands (not the internal one used by Render services).
