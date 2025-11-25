# AUX (Auxiliary Session) Rules

## Purpose
AUX sessions are dedicated analysis and planning sessions that produce structured outputs. They are used for strategic reviews, architecture decisions, and planning activities.

## Session Types

### strategic-review
Deep analysis of project state, risks, and opportunities.
- Output: `outcome.md` with findings, recommendations, and action items
- Inputs: PROJECT.md, POR.md, source files, metrics

### architecture-decision
Technical design decisions with rationale.
- Output: `decision.md` with context, options, decision, and consequences

### planning
Sprint or phase planning sessions.
- Output: `plan.md` with goals, tasks, and timeline

## Directory Structure
```
.cccc/work/aux_sessions/
└── {session-type}-{sequence}/
    ├── notes.txt       # Input notes/prompts for the session
    └── outcome.md      # Session output
```

## Guidelines
1. Always read PROJECT.md and POR.md for context
2. Reference source files by path:line_number
3. Be concise but thorough
4. Include actionable recommendations
5. Track risks and blockers explicitly
