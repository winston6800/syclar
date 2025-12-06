# Founder Focus Voice Coach - Technical Specification

## Overview
A voice-first AI coach that helps founders focus on 2 things max and get maximum velocity. Provides support tools (goblin tools, therapy, self-help) to help them execute.

---

## Core Concept

**Simple premise:**
1. Founder picks 2 things max to focus on
2. System helps them get maximum velocity on those 2 things
3. Provides support tools when they're stuck or need help

**Why 2 things?**
- Forces prioritization
- Prevents context switching
- Enables deep focus
- Actually achievable

---

## User Flow

### Onboarding
1. **Welcome** (voice)
2. **Ask:** "What are the 2 most important things you need to focus on right now?"
3. **Extract and confirm:**
   - Thing 1: [specific, actionable]
   - Thing 2: [specific, actionable]
4. **Set timeframe:** "How long are you committing to focus on these?"
5. **Done** - these become the focus

### Daily/Regular Check-ins

**Opening:**
- "How's it going with [Thing 1] and [Thing 2]?"
- Quick status check on both

**If making progress:**
- Celebrate
- "What's blocking you? What do you need?"
- Offer support tools if needed

**If stuck/not making progress:**
- "What's getting in the way?"
- Identify blocker
- Offer relevant support tool:
  - **Goblin tools** → Task breakdown, time estimates
  - **Therapy** → Process emotions, mental blocks
  - **Self-help** → Motivation, reframing, advice

**Closing:**
- Quick recap of progress
- Remind them of the 2 things
- Set next check-in

### Support Tools

#### 1. Goblin Tools
**When to offer:**
- User says task is overwhelming
- User doesn't know where to start
- User needs to break down a big task
- User needs time estimates

**What it does:**
- Breaks down big tasks into smaller steps
- Estimates time for each step
- Creates actionable checklist
- Prioritizes steps

**Voice interaction:**
- "I can help break this down. Tell me what you're trying to do."
- User describes task
- AI breaks it down step-by-step
- "Here's how to tackle this: [step 1], [step 2], etc."

#### 2. Therapy Mode
**When to offer:**
- User expresses frustration, anxiety, doubt
- User mentions imposter syndrome
- User is emotionally blocked
- User needs to process something

**What it does:**
- Listens without judgment
- Asks probing questions
- Helps process emotions
- Identifies mental blocks
- Reframes negative thoughts
- Provides emotional support

**Voice interaction:**
- "It sounds like you're feeling [emotion]. Want to talk through it?"
- Conversational therapy session
- Focus on unblocking, not just venting
- End with actionable next step

#### 3. Self-Help / Motivational
**When to offer:**
- User lacks motivation
- User needs a push
- User is procrastinating
- User needs perspective

**What it does:**
- Provides motivational content
- Reframes challenges
- Shares relevant advice
- Gives perspective
- Pushes toward action

**Voice interaction:**
- "I hear you're struggling with [thing]. Here's a different way to think about it..."
- Short, actionable advice
- Motivational but not cheesy
- Always ties back to the 2 things

---

## Data Model

### User Profile
```
{
  userId: string
  currentFocus: {
    thing1: FocusItem
    thing2: FocusItem
    startedAt: timestamp
    targetDate?: timestamp
  }
  voicePreferences: {
    voiceId: string
    speed: number
  }
}
```

### FocusItem
```
{
  id: string
  description: string
  status: "active" | "completed" | "paused"
  progress: number // 0-100
  lastWorkedOn: timestamp
  blockers: Blocker[]
  supportToolsUsed: string[] // ["goblin", "therapy", "self-help"]
}
```

### Session
```
{
  sessionId: string
  userId: string
  type: "check-in" | "goblin" | "therapy" | "self-help"
  timestamp: timestamp
  focusItemId?: string
  transcript: string
  outcome: string
  nextAction?: string
}
```

### Blocker
```
{
  id: string
  focusItemId: string
  description: string
  type: "overwhelmed" | "emotional" | "motivation" | "technical" | "other"
  resolved: boolean
  supportToolUsed?: string
  resolvedAt?: timestamp
}
```

---

## Voice Interface Logic

### Focus Detection
**Always check:**
- Are they working on Thing 1 or Thing 2?
- If they mention something else → "That's not one of your 2 things. Should we change focus?"
- If they want to add a 3rd thing → "You already have 2 things. Which one should we pause?"

### Support Tool Selection Logic

**Decision tree:**

1. **User says task is big/overwhelming/doesn't know where to start**
   → Offer Goblin Tools

2. **User expresses emotion (frustrated, anxious, stuck, doubt)**
   → Offer Therapy Mode

3. **User lacks motivation/procrastinating/needs push**
   → Offer Self-Help

4. **User is making progress**
   → Celebrate, ask what they need, offer tools proactively

5. **User is stuck but unclear why**
   → Ask probing questions to identify blocker, then offer appropriate tool

### Velocity Tracking

**Simple metrics:**
- Time spent on Thing 1 vs Thing 2
- Progress made (self-reported or inferred)
- Blockers encountered
- Support tools used
- Completion status

**Show user:**
- "You've spent 8 hours on Thing 1 this week, 3 hours on Thing 2"
- "Thing 1 is 60% done, Thing 2 is 20% done"
- "You've hit 3 blockers on Thing 1, used therapy twice"

---

## Technical Architecture

### Components

1. **Voice Interface**
   - STT (Speech-to-Text)
   - TTS (Text-to-Speech)
   - Real-time conversation

2. **Focus Manager**
   - Stores 2 focus items
   - Tracks progress
   - Enforces "2 max" rule

3. **Support Tool Router**
   - Detects when to offer which tool
   - Routes to appropriate handler

4. **Goblin Tools Handler**
   - Task breakdown logic
   - Time estimation
   - Step prioritization

5. **Therapy Handler**
   - Emotional processing
   - Reframing logic
   - Supportive conversation

6. **Self-Help Handler**
   - Motivational content
   - Advice library
   - Reframing challenges

7. **LLM Core**
   - Natural conversation
   - Context management
   - Tool orchestration

### Simple Flow

```
User speaks → Transcribe → 
  Check: Are they on Thing 1 or Thing 2? →
  Check: Do they need support? →
  Route to appropriate tool →
  Generate response →
  Speak response
```

---

## Prompt Engineering

### System Prompt

```
You are a voice coach for founders. Your job is simple:

1. Keep them focused on 2 things max
2. Help them get maximum velocity on those 2 things
3. Offer support tools when they need help

Their current focus:
- Thing 1: [description]
- Thing 2: [description]

Support tools available:
1. **Goblin Tools** - Break down overwhelming tasks, estimate time, create checklists
2. **Therapy** - Process emotions, mental blocks, provide emotional support
3. **Self-Help** - Motivation, reframing, actionable advice

Rules:
- Never let them add a 3rd thing without pausing one
- Always tie conversations back to Thing 1 or Thing 2
- Offer support tools proactively when they're stuck
- Keep responses short for voice (2-3 sentences typically)
- Be direct, supportive, action-oriented

Current session context:
[Previous messages]
```

### Goblin Tools Prompt

```
User needs help breaking down a task. They're working on [Thing 1 or Thing 2].

Task: [user's description]

Break this down into:
1. Specific, actionable steps
2. Time estimate for each step
3. Priority order
4. Dependencies

Format for voice:
- "Here's how to tackle this:"
- List steps clearly
- "This should take about [time] total"
- "Start with [first step]"
```

### Therapy Prompt

```
User is expressing [emotion] about [Thing 1 or Thing 2].

Help them:
1. Process the emotion
2. Identify the real blocker
3. Reframe if needed
4. Get to actionable next step

Be:
- Supportive, not judgmental
- Probing but gentle
- Focused on unblocking
- End with concrete action

Keep it conversational, not clinical.
```

### Self-Help Prompt

```
User needs motivation/advice for [Thing 1 or Thing 2].

They're struggling with: [issue]

Provide:
1. Reframing or perspective
2. Short, actionable advice
3. Motivation (but not cheesy)
4. Tie back to their focus

Keep it:
- Short (2-3 sentences)
- Actionable
- Relevant to founders
- Direct
```

---

## MVP Features

### Phase 1: Core
- [ ] Voice interface (STT + TTS)
- [ ] Set 2 focus items
- [ ] Basic check-ins
- [ ] Simple progress tracking

### Phase 2: Support Tools
- [ ] Goblin Tools (task breakdown)
- [ ] Therapy mode (basic emotional support)
- [ ] Self-help mode (motivational advice)

### Phase 3: Polish
- [ ] Better velocity tracking
- [ ] Blocker detection
- [ ] Progress visualization
- [ ] Reminders/check-ins

---

## Success Metrics

### Focus
- % of time spent on Thing 1 + Thing 2 (vs other things)
- How often they try to add a 3rd thing
- How long they stick with the 2 things

### Velocity
- Progress on Thing 1 and Thing 2
- Time to completion
- Blockers resolved
- Support tools effectiveness

### Engagement
- Daily active users
- Sessions per week
- Average session length
- Return rate

---

## Key Principles

1. **Simplicity** - 2 things max, that's it
2. **Velocity** - Everything is about moving faster on those 2 things
3. **Support** - When stuck, offer tools, don't just chat
4. **Voice-first** - Natural conversation, not forms or apps
5. **Action-oriented** - Every conversation ends with a next step

---

## Strategy Timeline Feature

### Logic
- AI estimates total weeks for pillar based on milestones (1-4 weeks per milestone)
- Auto-calculates completion date: today + estimated weeks
- Distributes milestones across weeks (sequential, accounts for dependencies)
- Updates ETA dynamically as milestones complete
- Shows velocity: ahead/on-track/behind schedule

### Data Model
```
Pillar {
  estimatedWeeks: number
  estimatedCompletion: Date
  milestoneSchedule: { week: number, milestoneId: string }[]
}
Stone {
  estimatedWeeks: number
  scheduledWeek: number
}
```

### UI
- Vertical pillar timeline: foundation (goal) → milestones (blocks) → completion (top)
- Shows ETA prominently: "🎯 Jan 7, 2026 (5 weeks)"
- Progress indicators: completed (green), current (blue), future (gray)
- Velocity status: ahead/on-track/behind with time saved/over

## Open Questions

1. **How to track progress?** Self-reported? Inferred from conversation? Manual?
2. **How often to check in?** Daily? On-demand? Scheduled?
3. **Can they change the 2 things?** Yes, but how often? What's the rule?
4. **What if they complete one?** Do they pick a new one? Or just focus on the remaining one?
5. **Support tool depth?** How sophisticated should each tool be?
6. **Integration?** Connect to task managers? Calendars? Or standalone?

