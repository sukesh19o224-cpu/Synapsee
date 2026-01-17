---
description: End every session by saving context and progress
---

# End Session Workflow

Run this at the END of every session to preserve context for next time.

## Steps

1. **Update Memory File** (`.agent/MEMORY.md`):
   - Add session date
   - Summarize what was discussed/decided
   - Note any blockers or pending items
   - Update "Current Focus" section

2. **Update Tasks** (`.agent/TASKS.md`):
   - Mark completed tasks with [x]
   - Add any new tasks discovered
   - Update priorities if needed

3. **Update Changelog** (`CHANGELOG.md`):
   - Add entry for any code/file changes made
   - Use format: `## [Date] - Brief Description`

4. **Confirm** all updates are saved and summarize for user.
