---
description: Seed the Render-hosted PostgreSQL database with categories, questions, and sample data
---

# Seed Render Database

## Purpose
Populate the Render-hosted PostgreSQL database with seed data (categories, sample questions, demo users).

## When to invoke
- After a fresh deployment or database reset.
- When the Render DB is missing categories, tags, or sample data.
- After a migration that clears or restructures data.

## Important: Free-tier limitation
Render free-tier PostgreSQL does **not** allow external connections. You cannot run management commands against the Render DB from your local machine. SSH into free-tier services is also unavailable.

The only way to run commands on the Render DB is via the **container startup** (the Dockerfile CMD).

## Methods

### Method 1: Temporary Dockerfile CMD (primary method for free tier)
Temporarily add the seed command to the backend Dockerfile CMD, push, deploy, then remove it.

1. Edit `backend/Dockerfile` — add `seed_data` to the CMD chain:
   ```dockerfile
   CMD ["sh", "-c", "poetry run python manage.py migrate --noinput && poetry run python manage.py initadmin && poetry run python manage.py seed_data && poetry run gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3"]
   ```

2. Commit and push:
   ```bash
   git add backend/Dockerfile && git commit -m "Temporarily add seed_data to startup" && git push origin main
   ```

3. Wait for deploy to go live (monitor via `deploy-to-render` skill).

4. **Remove** the seed command from CMD and push again:
   ```dockerfile
   CMD ["sh", "-c", "poetry run python manage.py migrate --noinput && poetry run python manage.py initadmin && poetry run gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3"]
   ```

5. Commit: `git commit -am "Remove temporary seed_data from startup" && git push origin main`

The `seed_data` command uses `get_or_create`, so it's safe to run multiple times — it won't duplicate data.

### Method 2: Local command (only if on paid Render plan with external DB access)
If the Render Postgres plan supports external connections:

```bash
cd backend
source <(grep -v '^#' ../.env | grep -v '^\s*$' | sed 's/^/export /')
poetry run python manage.py seed_data
```

Use `--clear` to wipe existing data before seeding:
```bash
poetry run python manage.py seed_data --clear
```

## What seed_data creates
- **89 categories**: Hierarchical tree (Offerings → Specializations → Topics)
- **Demo users**: `demo` / `demo1234` and `helper` / `helper1234`
- **10 sample questions**: Across various categories
- **Sample answers**: For select questions

## Verification
After seeding, verify via an authenticated request. The API requires authentication:

```bash
# Get CSRF token and login
COOKIE_JAR=$(mktemp)
curl -s -c "$COOKIE_JAR" -b "$COOKIE_JAR" https://dih-answers-backend.onrender.com/auth/csrf > /dev/null
CSRF=$(grep csrftoken "$COOKIE_JAR" | awk '{print $NF}')
curl -s -c "$COOKIE_JAR" -b "$COOKIE_JAR" \
  -H "Content-Type: application/json" -H "X-CSRFToken: $CSRF" \
  -X POST https://dih-answers-backend.onrender.com/auth/login \
  -d '{"username":"admin","password":"admin"}'

# Check data
curl -s -b "$COOKIE_JAR" https://dih-answers-backend.onrender.com/categories | python3 -c "import json,sys; d=json.load(sys.stdin); print(f'{len(d)} categories')"
curl -s -b "$COOKIE_JAR" https://dih-answers-backend.onrender.com/questions | python3 -c "import json,sys; d=json.load(sys.stdin); print(f'{len(d)} questions')"
rm -f "$COOKIE_JAR"
```

## Notes
- The `seed_data` command uses `get_or_create`, so it's idempotent — safe to run on every deploy without duplicating data.
- On free-tier Render, external DB connections and SSH are unavailable. Use the Dockerfile CMD method.
- If on a paid Render plan, you can run seed_data locally or via `render ssh`.
