# Task Documentation

## Purpose
Ensure every task is accompanied by a technical documentation file in the `docs/` directory that captures analysis, progress, issues, and final outcomes.

## When to invoke
- **At task start**: Create the documentation file with initial technical analysis.
- **During the task**: Update the file whenever there are significant changes, blockers, issues encountered, or decisions made.
- **At task completion**: Finalize the document with a summary of what was done, what changed, and any follow-up items.

## File conventions
- **Location**: `docs/` (already exists, gitignored)
- **Naming**: `{Date}_{description}.md` where Date is `MmmDD YYYY` with no separators (e.g. `Apr242026`) and description is a short snake_case slug.
  - Example: `Apr242026_postgres_connection.md`
- **If a doc already exists for this task**, update it in place rather than creating a new file.

## Document structure
Use the following template when creating the file:

```markdown
# {Task Title}

**Date**: {Date}
**Status**: {In Progress | Completed | Blocked}

## Objective
Brief description of the task and its goal.

## Technical Analysis
- What needs to change and why.
- Relevant files, models, APIs, or components involved.
- Approach and design decisions.

## Changes Made
- List of files changed and what was modified.
- Key implementation details.

## Issues & Decisions
- Problems encountered during implementation.
- Decisions made and their rationale.
- Workarounds applied.

## Testing
- How the changes were tested.
- Test results and any remaining gaps.

## Follow-up
- Open items or risks.
- Suggested improvements for later.
```

## Rules
- Always create the doc file **before** starting implementation work.
- Update the doc with real details — do not leave placeholder text.
- When updating mid-task, add entries under **Issues & Decisions** or **Changes Made** as appropriate.
- On completion, set **Status** to `Completed` and fill in all sections with actual outcomes.
- Keep the document concise and technical. This is for developer reference, not end-user docs.
