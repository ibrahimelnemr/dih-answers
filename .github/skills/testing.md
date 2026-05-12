# End-to-End Testing

## Purpose
Validate that changes work correctly by running the full stack (Django backend + React frontend) and performing actual UI-level testing using Playwright. If tests fail, diagnose and fix the code before considering the task complete.

## When to invoke
- After implementation is complete and before marking a task as done.
- When verifying a bug fix or feature works end-to-end.
- When the task-documentation skill notes issues that need verification.

## Setup

### Prerequisites
Ensure the following are available in the project:
- **Backend**: Django dev server (`python manage.py runserver`)
- **Frontend**: Vite dev server (`pnpm dev`)
- **Playwright**: Install if not present (`pnpm add -D @playwright/test && pnpm exec playwright install --with-deps chromium`)

### Starting the stack
1. **Start the backend** (from `backend/`):
   ```bash
   cd backend && poetry run python manage.py runserver 0.0.0.0:8000 &
   ```
   Wait for the server to be ready (check `http://localhost:8000/api/`).

2. **Start the frontend** (from `frontend/`):
   ```bash
   cd frontend && pnpm dev &
   ```
   Wait for Vite to report the dev server URL (typically `http://localhost:5173`).

3. Confirm both servers are responsive before running tests.

## Writing tests
- Place Playwright test files in `frontend/e2e/` with the naming pattern `*.spec.js`.
- Tests should interact with the UI as a real user would: navigate pages, fill forms, click buttons, verify visible content.
- Use Playwright's `expect` assertions to validate outcomes.
- Test against the running dev servers, not mocked data.

### Example test structure
```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature under test', () => {
  test('should do the expected thing', async ({ page }) => {
    await page.goto('http://localhost:5173');
    // Interact with the page
    // Assert outcomes
  });
});
```

## Execution
Run Playwright tests:
```bash
cd frontend && pnpm exec playwright test
```

## On failure
- **Do not mark the task as complete.**
- Read the Playwright error output and screenshots (if configured).
- Diagnose whether the issue is in the frontend, backend, or test itself.
- Fix the code (not the test, unless the test expectation is wrong).
- Re-run the tests.
- Repeat until all tests pass.
- Update the task documentation (via the `task-documentation` skill) with any issues encountered and fixes applied.

## On success
- Note the passing tests in the task documentation.
- Stop the dev servers.
- Push commits to `main` branch.
- Wait for Render auto-deploy to complete.
- Verify both backend and frontend are live using the deployed-testing procedure below.
- Mark the task as complete.

## Deployed testing procedure (Render free tier)
The free-tier backend sleeps after inactivity. The frontend does NOT ping the backend automatically — instead it shows a link for the user to wake it up. Follow these steps:

1. **Open the frontend** at `https://dih-answers-frontend.onrender.com/`.
2. If the backend is asleep, the login page will show a "Check Backend Health" link pointing to `https://dih-answers-backend.onrender.com/health`.
3. **Open the health endpoint** in a new browser tab. Wait until you see `{"status":"ok"}` (may take 30–60 seconds on first cold start).
4. **Go back to the frontend** tab and click "Retry connection" (or reload the page).
5. The login form should now appear. Sign in with `admin`/`admin` and verify features work.
6. Confirm the home page loads with categories and leaderboard.

When using browser tools in Copilot:
```
1. open_browser_page → https://dih-answers-backend.onrender.com/health
2. Wait / reload until the page shows {"status":"ok"}
3. open_browser_page → https://dih-answers-frontend.onrender.com/
4. The login form should be visible. Fill in admin/admin and sign in.
5. Verify the home page, questions, and other features.
```

## Rules
- Never skip E2E testing for user-facing changes.
- Do not modify tests solely to make them pass — fix the underlying code.
- Always stop dev servers after testing is complete (clean up background processes).
- If Playwright is not yet installed in the project, install it as a dev dependency before running tests.
- Keep tests focused and readable. One test per behavior, not monolithic test files.

## Render Deployment Testing

After pushing to `main`, always verify the deployed application:

1. **Wait for deploy**: Render auto-deploys from `main`. Check deploy status by polling the JS bundle hash:
   ```bash
   curl --max-time 30 -s https://dih-answers-frontend.onrender.com/ | grep -o 'src="/assets/[^"]*\.js"'
   ```
   When the hash changes from the previous value, the new build is live.
2. **Health checks**:
   ```bash
   curl --max-time 60 https://dih-answers-backend.onrender.com/health
   curl --max-time 60 https://dih-answers-frontend.onrender.com/health
   ```
   Both should return `{"status":"ok"}`. First request may take 30-60s due to free-tier cold starts.
3. **Browser verification (VS Code built-in browser — preferred)**:
   Use the `open_browser_page` tool to open `https://dih-answers-frontend.onrender.com/` directly. Then use `type_in_page` and `click_element` to sign in with `admin`/`admin`. Use `read_page` to inspect the DOM state and `run_playwright_code` to execute JS in the page (e.g. checking network requests via `performance.getEntriesByType('resource')`). This is the **primary** testing method.
4. **curl-based API testing (secondary)**:
   ```bash
   # Get CSRF token
   curl --max-time 30 -s -c /tmp/cookies.txt https://dih-answers-backend.onrender.com/auth/csrf
   # Login
   curl --max-time 30 -s -c /tmp/cookies.txt -b /tmp/cookies.txt -X POST \
     -H "Content-Type: application/json" \
     -H "X-CSRFToken: <token>" -H "Cookie: csrftoken=<token>" \
     -d '{"username":"admin","password":"admin"}' \
     https://dih-answers-backend.onrender.com/auth/login
   # Fetch data
   curl --max-time 30 -s -b /tmp/cookies.txt https://dih-answers-backend.onrender.com/questions
   ```
5. **Key architecture note**: The frontend uses relative URLs for API calls (empty `BACKEND_URL`). Nginx on the frontend container proxies API routes to the backend. This ensures session cookies (which are `SameSite=Lax`) work correctly since all requests stay same-origin.
6. **Never** set `BACKEND_URL` in `frontend/src/data/Data.ts` to a cross-origin URL in production — it breaks session authentication.
7. **Rate limiting**: Render free tier may return 429 (Too Many Requests) if polled too frequently. The frontend health-check treats any non-5xx response as "backend alive" to avoid triggering an infinite polling loop.
