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
- Mark the task as complete.

## Rules
- Never skip E2E testing for user-facing changes.
- Do not modify tests solely to make them pass — fix the underlying code.
- Always stop dev servers after testing is complete (clean up background processes).
- If Playwright is not yet installed in the project, install it as a dev dependency before running tests.
- Keep tests focused and readable. One test per behavior, not monolithic test files.
