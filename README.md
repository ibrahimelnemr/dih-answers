# dih-champions

Internal Django + React project for DIH Champions.

## Project structure

- `backend/` Django + DRF API
- `frontend/` React app (Vite)
- `Docs/` PRD and implementation planning docs

## Phase 0 status

- Backend scaffolded with auth endpoints:
  - `GET /auth/csrf`
  - `POST /auth/login`
  - `POST /auth/logout`
  - `GET /auth/me`
  - `GET /health`
- Frontend scaffolded with:
  - login page
  - protected routing
  - authenticated app shell
  - smoke route at `/smoke`
- Baseline backend auth tests added.

## Local setup

### Database (PostgreSQL via Docker)

Run PostgreSQL in a Docker container with a named volume so data persists across restarts:

```bash
docker run --name dih-answers \
  -e POSTGRES_DB=dih-answers \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -v dih-answers-data:/var/lib/postgresql/data \
  postgres:16
```

This runs in the foreground — use `Ctrl+C` to stop. To restart later:

```bash
docker start -a dih-answers
```

If you need to recreate the container (data is kept in the `dih-answers-data` volume):

```bash
docker rm dih-answers
# then re-run the docker run command above
```

### Backend
```bash
cd backend
poetry install
poetry run python manage.py migrate
poetry run python manage.py createsuperuser
poetry run python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:8000`.
