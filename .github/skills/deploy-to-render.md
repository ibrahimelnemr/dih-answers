---
description: Deploy the dih-answers backend and frontend to Render
---

# Deploy to Render

## Architecture

- **Backend**: Django web service on Render (Docker runtime, rootDir `backend/`)
- **Frontend**: React SPA on Render (Docker runtime, rootDir `frontend/`)
- **Database**: Render-managed PostgreSQL (free tier, Oregon region)
- All three are in the same Render project ("DIH Answers") and share one environment.
- Auto-deploy from `main` branch is enabled on both services.

## Render Service IDs

Look up service IDs from the Render API or CLI:

```bash
render workspace set   # pick the team workspace
render services list --output json
```

## Render CLI Setup

The Render CLI must have a workspace set before any commands work:

```bash
render workspace set <workspace-id> --confirm
```

If you don't know the workspace ID, query the API:

```bash
curl -s -H "Authorization: Bearer $RENDER_API_KEY" "https://api.render.com/v1/owners"
```

The API key lives in `~/.render/cli.yaml` after running `render login`.

## Environment Variables

### Backend env vars (set on the backend web service)

| Key | Description |
|---|---|
| `DB_NAME` | Render Postgres database name |
| `DB_USER` | Render Postgres username |
| `DB_PASSWORD` | Render Postgres password |
| `DB_HOST` | **Internal** Render Postgres hostname (use internal address, not external, since backend and DB are in the same Render project) |
| `DB_PORT` | `5432` |
| `SECRET_KEY` | Django secret key (unique, random, not the dev default) |
| `DEBUG` | `False` |
| `ALLOWED_HOSTS` | Comma-separated: include the `.onrender.com` backend hostname |
| `CORS_ALLOWED_ORIGINS` | The full `https://` frontend URL on Render |
| `CSRF_TRUSTED_ORIGINS` | Same as CORS_ALLOWED_ORIGINS |
| `DJANGO_SUPERUSER_USERNAME` | Initial admin username |
| `DJANGO_SUPERUSER_EMAIL` | Initial admin email |
| `DJANGO_SUPERUSER_PASSWORD` | Initial admin password |

### Frontend env vars (set on the frontend web service)

| Key | Description |
|---|---|
| `BACKEND_URL` | Full backend URL, e.g. `https://<backend-name>.onrender.com` |

### Setting env vars via API

```bash
curl -X PUT "https://api.render.com/v1/services/<SERVICE_ID>/env-vars" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '[{"key": "KEY_NAME", "value": "value"}, ...]'
```

## How the Dockerfiles Work

### Backend (`backend/Dockerfile`)

- Python 3.12-slim with Poetry
- Installs deps, runs `collectstatic`
- CMD runs: `migrate --noinput` → `initadmin` → `gunicorn` (all inline, no entrypoint script)
- WhiteNoise serves static files in production
- When `DEBUG=False`, secure cookies and `SECURE_PROXY_SSL_HEADER` are enabled automatically

### Frontend (`frontend/Dockerfile`)

- Multi-stage: Node 20 + pnpm builds the React app, nginx:alpine serves it
- `nginx.conf` is a **template** with `${BACKEND_URL}` and `${BACKEND_HOST}` placeholders
- `docker-entrypoint.sh` runs `envsubst` at container start to substitute those vars into the actual nginx config
- Nginx proxies all API routes (`/auth/`, `/questions`, `/answers`, `/tags`, `/categories`, `/health`, `/api/`, `/static/`) to the backend
- SPA fallback: all other routes serve `index.html`

## Deployment Steps

### Automatic (preferred)

Push to `main` → both services auto-deploy.

```bash
git push origin main
```

### Manual trigger via API

```bash
curl -X POST "https://api.render.com/v1/services/<SERVICE_ID>/deploys" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"clearCache": "do_not_clear"}'
```

### Monitoring deploys

```bash
curl -s "https://api.render.com/v1/services/<SERVICE_ID>/deploys?limit=1" \
  -H "Authorization: Bearer $RENDER_API_KEY"
```

Status progresses: `created` → `build_in_progress` → `update_in_progress` → `live` (or `deactivated` on failure).

## Verification

After deploy, confirm:

```bash
# Backend health
curl https://<backend>.onrender.com/health
# Expected: {"status":"ok"}

# Frontend serves SPA
curl -s -o /dev/null -w "%{http_code}" https://<frontend>.onrender.com/
# Expected: 200

# Frontend proxies API through to backend
curl https://<frontend>.onrender.com/health
# Expected: {"status":"ok"}
```

## Gotchas

- **Free-tier cold starts**: First request after idle may take 30-60 seconds. Use `--connect-timeout 30 --max-time 60` when curling.
- **Internal vs external DB host**: Use the **internal** hostname (`dpg-xxx-a`) for the `DB_HOST` env var on Render services (same project). Use the external hostname (`dpg-xxx-a.oregon-postgres.render.com`) only for local development or external access.
- **nginx variable escaping**: The frontend `nginx.conf` uses `${BACKEND_URL}` for envsubst but also has native nginx variables like `$uri`, `$host`, `$remote_addr`. The entrypoint script only substitutes the two explicit vars to avoid clobbering nginx vars.
- **Poetry lock must be committed**: Render builds from the repo; if `poetry.lock` is out of date with `pyproject.toml`, the build will fail.
- **No docker-compose on Render**: Each service builds independently from its own `Dockerfile` within its `rootDir`. There is no `docker-compose.yml` in the repo.
- **The `.env` file is gitignored**: It contains real credentials for the Render database. The `.env.example` shows the template without secrets.
