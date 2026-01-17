---
description: Start every session by loading project context and memory
---

# Start Session Workflow

Run this at the beginning of EVERY session to ensure AI has full project context.

// turbo-all

## Steps

1. Read the project memory file to understand current state:
   - Read `.agent/MEMORY.md`

2. Read the project architecture:
   - Read `ARCHITECTURE.md`

3. Check current tasks and progress:
   - Read `.agent/TASKS.md`

4. Review recent changes:
   - Read `CHANGELOG.md` (last 50 lines)

5. Acknowledge context loaded and ask what to work on next.

---

## After Session Ends

Before ending any session, ALWAYS:

1. Update `.agent/MEMORY.md` with decisions made and progress
2. Update `.agent/TASKS.md` with completed/new tasks
3. Update `CHANGELOG.md` with any changes made
