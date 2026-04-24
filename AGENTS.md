# AGENTS.md

## Purpose
This is a Django + React project.
Prioritize clean, maintainable code and practical software engineering best practices.
Avoid overengineering. Prefer simple, explicit solutions.

## Working style (important)
- Think before acting:
  - Inspect relevant files first.
  - Make a short plan before editing.
  - Prefer the smallest safe change that solves the problem.
- Do not do broad refactors unless explicitly asked.
- Do not introduce new dependencies unless clearly necessary.
- If something is unclear, inspect existing code/tests/docs before guessing.

## Architecture rules (Django + React)
- Keep backend and frontend responsibilities separate.
- Django handles:
  - data models
  - business logic
  - APIs/auth/permissions
  - server-side validation
- React handles:
  - UI rendering
  - local UI state
  - client interactions
- Do not move business rules into React if they belong in Django.
- Do not duplicate validation logic unnecessarily across frontend/backend (frontend can provide UX validation, backend remains source of truth).

## Backend (Django / Python)
- Follow PEP 8 and favor readability.
- Keep views thin; move business logic into services/helpers when it improves clarity.
- Keep models focused on domain behavior and data integrity.
- Use serializers/forms/validators for validation instead of ad hoc checks.
- Avoid large “utils.py” dumping grounds; group code by domain/responsibility.
- Use clear names; avoid vague abbreviations.
- Handle errors intentionally; do not swallow exceptions silently.
- Add type hints in new/changed Python code where practical.
- Add docstrings for public modules/classes/functions when useful.

## Frontend (React)
- Use function components (not class components) for new code.
- Keep components small and focused.
- Prefer composition over deeply nested monolithic components.
- Keep state as local as possible; lift only when needed.
- Derive state instead of duplicating it when possible.
- Keep API/data-fetching code separated from presentational UI when practical.
- Use clear prop names and avoid prop drilling when a simpler pattern exists.
- Do not introduce complex state libraries unless the task clearly requires it.

## API contracts
- When changing backend responses, check and update affected React usage.
- When changing frontend payloads, verify Django serializers/views accept them.
- Keep API fields stable unless the task explicitly allows breaking changes.
- Prefer explicit response shapes and consistent error handling.

## Project consistency
- Follow existing project patterns before introducing new ones.
- Match naming conventions, file layout, and style already used in this repo.
- Avoid mixing unrelated changes in one task.
- Preserve backward compatibility unless told otherwise.

## Testing
- Add or update tests for behavior changes.
- For Django changes:
  - run relevant backend tests first
  - test edge cases and validation
- For React changes:
  - test the affected component behavior and user-facing states
- Do not modify tests just to force passing if behavior is wrong.

## Performance and complexity
- Avoid premature optimization.
- Prefer straightforward code over clever abstractions.
- Introduce abstraction only after repetition is clear and meaningful.
- Do not build generic frameworks/helpers unless there is a real repeated need.

## Security and reliability
- Treat all client input as untrusted.
- Enforce permissions/auth checks on the Django side.
- Avoid exposing secrets/tokens in frontend code.
- Validate and sanitize inputs appropriately.
- Be careful with migrations and data-destructive changes.

## Output expectations
When finishing a task:
- Summarize what changed.
- Mention assumptions.
- Mention tests run (or why not run).
- Briefly note risks or follow-up items if relevant.