## What the Voice Coach Is

- **Audience**: Founders and company builders.
- **Core constraint**: You can only focus on **2 pillars** at a time.
- **Core loop**: AI suggests **one reasonable daily goal** based on your highest-priority pillar's next unplaced stone, starts a timer, and your only job is to get it done ASAP.
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
  - **Allowance system**: Earned currency from productive focus time (0.05 per 5-minute block). Can be spent to protect hero rank from unproductive site visits.
  - **Allowance for unproductive sites**: When visiting unproductive websites, system automatically deducts allowance (0.10 per 5 minutes) instead of hero rank points. If allowance is available, no rank penalty occurs. If allowance is depleted, hero rank points are deducted as normal. This creates a "permission to indulge" system where earned productivity can be spent on low-value activities.
  - **Hero rank system**: Rank format `[Class] class Rank #[Number]` (e.g., "C class Rank #391"). Screentime tracker monitors unproductive websites; visiting them deducts points (derank) unless protected by allowance. Rank-ups require progressively more points (e.g., 100→200→400→800). Edge cases: floor at lowest rank (F class Rank #1), ceiling at highest rank (S class Rank #1), points can go negative but rank never below floor, rank-up only when points exceed threshold.
  - **Hero Rank EXP/Progress Bar**: Focus time earns EXP (1 EXP per minute of focus). EXP fills progress bar toward next rank-up. Visual feedback shows progress: `[██████░░░░] 60% to next rank`. Rank-ups are visual milestones based on EXP accumulation.
- **Goodwill / debt system**:
  - Tracks how much **intense, honest focus time** you've put into the app.
  - Goodwill is earned alongside allowance (1 goodwill per 5-minute focus block).
  - Goodwill represents your "productivity credit" and can be used for future features (separate from allowance spending).
  - May include a **self-rating** of focus and cross-checking against other app usage (if integrated).
  - Can conceptually model **"focus debt" vs. "credit"** over time.
- **Data tracking**:
  - Track all cycles completed, focus time, milestones, and user actions.
  - Store aggregated stats (total cycles, avg focus time, completion rates) for comparison.
- **Gamification**:
  - **Cycle tracking**: Display "X more cycles than previous users" and "X% more focused than avg user".
  - **Cyclist trophies**: Suite collection of rare trophies (only X% of users have each). Awarded for cycle milestones, focus streaks, velocity, consistency, etc.

## Strategy & Operations (MVP logic)
- One page where you set/edit your 2 pillars and give each a short "win definition".
- System marks one pillar as **priority** and maintains **stones (milestones)** per pillar - flat visual blocks that build the pillar.
- **AI generates stones**: Button to auto-generate 4-5 milestones based on pillar name + win definition.
- Daily goals come from the **next unplaced stone** of the priority pillar.
- Stones can be marked as "placed" (completed) to track progress visually.

## Tactical (MVP logic)
- Simple todo-style page showing **one active goal** at the top, with optional sub-tasks under it.
- **AI breaks down tasks**: Button to auto-generate 1-2 hour chunks (subtasks) from the active goal.
- Includes a start/pause timer for the active goal and a button to mark it "Done".
- Below, a short history list of today's completed goals with timestamps.
- If there is no active goal, page prompts: "Get next goal" and pulls from the Strategy/Operations pool (next unplaced stone).

## Recent additions

- Stone→Task: click/drag stone creates task; max 1 in-progress.
- Allowance: 0.01/min deducted on unproductive sites.
- Rank points: +1/sec productive; -1/min when unprotected on unproductive sites.