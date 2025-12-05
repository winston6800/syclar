## What the Voice Coach Is

- **Audience**: Founders and company builders.
- **Core constraint**: You can only focus on **2 pillars** at a time.
- **Core loop**: AI suggests **one reasonable daily goal** based on your highest-priority pillar, starts a timer, and your only job is to get it done ASAP.
- **Interface**: **Voice-first** – you talk, it responds, sets goals, and manages focus for you.

## How Goals Work

- **Single active goal**:
  - Generated from the priority pillar.
  - Reasonable in scope and time (e.g., 30–120 minutes).
  - Timer starts when you accept; you’re pushed to “get it out of the way” quickly.
- **Goal branching** (child nodes):
  - Each goal can have **child nodes** that represent the key elements you need to achieve it (like a lightweight flowchart).
  - Within each child node you can create a **short list of concrete actions** to “activate” that node.
  - This is basically Goblin-Tools-style breakdown attached to a single, central goal.

## Focus Mode & History

- **Concurrent history**:
  - Tracks what you’ve worked on over time (goals, child nodes, and completed items).
  - Lets you see your “moves” and progress across days/weeks.
- **Focus Mode / Mission Control**:
  - Shows:
    - The **current goal** and its most relevant child nodes.
    - A **timer** for the current focus session.
    - **Time since you last worked on this goal/task**.
  - Feels like a **mission control** view for “ground zero” tasks that actually move the pillar forward.

## Metrics & Add-ons

- **Focus metrics**:
  - Time since you last worked on a task.
  - Percentage of time spent in **Focus Mode** vs. everything else.
- **Allowances & app usage**:
  - Optional **allowance for apps** (e.g., time or “spend” you’re allowed to use on low-value activities).
- **Goodwill / debt system**:
  - Tracks how much **intense, honest focus time** you’ve put into the app.
  - May include a **self-rating** of focus and cross-checking against other app usage (if integrated).
  - Can conceptually model **“focus debt” vs. “credit”** over time.
- **Achievements**:
  - Earn **rare achievements** (e.g., “only X% of people have this”) for streaks, deep focus sessions, aggressive execution on goals, etc.

## Strategy & Operations (MVP logic)
- One page where you set/edit your 2 pillars and give each a short “win definition”.
- System marks one pillar as **priority** and maintains 1–3 active tracks per pillar (simple text list, no complex tree yet).
- From these tracks it derives a small pool of “possible next moves” that daily goals can be picked from.
- Goodwill score increments when you complete goals tied to a pillar; decrements when you abandon goals mid-way.

## Tactical (MVP logic)
- Simple todo-style page showing **one active goal** at the top, with 1–3 optional sub-tasks under it.
- Includes a start/pause timer for the active goal and a button to mark it “Done” (which boosts goodwill).
- Below, a short history list of today’s completed goals with timestamps.
- If there is no active goal, page prompts: “Get next goal” and pulls from the Strategy/Operations pool.
- Minimal distraction tracking: if browser extension reports time on leisure sites during an active goal, goodwill is reduced and a small warning banner appears.