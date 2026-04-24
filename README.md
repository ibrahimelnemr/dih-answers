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
