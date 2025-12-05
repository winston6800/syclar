# Testing Guide - Founder Focus Voice Coach

## Quick Start Testing (MVP)

### Option 1: Manual Testing with Mock Voice
**Fastest way to test logic without building full voice stack**

1. **Create a simple CLI/text interface**
   - Type instead of speak
   - Simulates voice conversation
   - Tests all the logic

2. **Test the core flow:**
   ```
   > What are your 2 things?
   User: "Ship the new feature and hire a designer"
   
   > Got it. Thing 1: Ship the new feature. Thing 2: Hire a designer.
   > How's it going with Thing 1?
   
   User: "I'm stuck, it's too overwhelming"
   
   > Sounds like you need help breaking this down. Let me use Goblin Tools...
   > Here's how to tackle shipping the new feature:
   > 1. [breakdown]
   ```

3. **Test support tool routing:**
   - Say "I'm overwhelmed" → Should trigger Goblin Tools
   - Say "I'm frustrated/anxious" → Should trigger Therapy
   - Say "I need motivation" → Should trigger Self-Help

4. **Test 2-thing enforcement:**
   - Try to add a 3rd thing → Should block it
   - Try to work on something else → Should redirect to Thing 1 or 2

### Option 2: Browser-Based Voice Testing
**Test actual voice without full backend**

1. **Use Web Speech API (free, browser-based)**
   - `speechRecognition` for STT (Chrome/Edge)
   - `speechSynthesis` for TTS (all browsers)
   - No API keys needed for testing

2. **Simple HTML page:**
   ```html
   <button onclick="startListening()">Start</button>
   <div id="transcript"></div>
   <div id="response"></div>
   ```

3. **Test locally:**
   - Open in Chrome
   - Click start
   - Speak your 2 things
   - See transcription
   - Get text response
   - Hear TTS response

### Option 3: Full Stack Testing
**Test with real APIs (costs money but most realistic)**

1. **Set up services:**
   - OpenAI Whisper API (STT) - $0.006/min
   - OpenAI TTS API - $15 per 1M characters
   - OpenAI GPT-4 (conversation) - $30 per 1M tokens
   - Or use cheaper alternatives (see below)

2. **Build minimal Next.js API route:**
   - `/api/voice` endpoint
   - Receives audio
   - Transcribes → Processes → Responds → Speaks

3. **Test end-to-end:**
   - Record audio in browser
   - Send to API
   - Get audio response back
   - Play response

---

## Step-by-Step Testing Plan

### Phase 1: Logic Testing (No Voice)

**Goal:** Verify the core logic works

**What to test:**
1. ✅ Can set 2 things
2. ✅ Can't add 3rd thing without pausing one
3. ✅ Support tool routing works (goblin/therapy/self-help)
4. ✅ Progress tracking works
5. ✅ Check-ins work

**How to test:**
```typescript
// Create a simple test file
// test-logic.ts

const user = {
  thing1: "Ship feature",
  thing2: "Hire designer"
}

// Test 1: Try to add 3rd thing
const response = handleUserInput("I also want to do marketing")
// Should return: "You already have 2 things. Which one should we pause?"

// Test 2: Trigger Goblin Tools
const response2 = handleUserInput("I'm overwhelmed with shipping the feature")
// Should route to Goblin Tools handler

// Test 3: Trigger Therapy
const response3 = handleUserInput("I'm feeling anxious about hiring")
// Should route to Therapy handler
```

**Run:** `bun test-logic.ts` or `node test-logic.ts`

### Phase 2: Voice Interface Testing

**Goal:** Verify voice input/output works

**Option A: Web Speech API (Free)**
```typescript
// test-voice-browser.ts
// Run in browser console or create HTML page

const recognition = new webkitSpeechRecognition();
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  console.log("You said:", transcript);
  // Process transcript, get response
  speak(response);
};

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

recognition.start();
```

**Option B: OpenAI APIs (Paid but better)**
```typescript
// test-voice-api.ts
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Test STT
const transcription = await openai.audio.transcriptions.create({
  file: audioFile,
  model: "whisper-1"
});

// Test TTS
const audio = await openai.audio.speech.create({
  model: "tts-1",
  voice: "alloy",
  input: "Hello, what are your 2 things?"
});
```

**Test checklist:**
- [ ] Can capture audio from microphone
- [ ] Transcription is accurate
- [ ] Response is generated correctly
- [ ] TTS plays response
- [ ] Can interrupt (stop TTS when user speaks)

### Phase 3: End-to-End Testing

**Goal:** Test full conversation flow

**Test scenarios:**

1. **Onboarding flow:**
   - Start conversation
   - Set 2 things
   - Confirm understanding

2. **Daily check-in:**
   - Ask about Thing 1
   - Ask about Thing 2
   - Track progress

3. **Support tool triggers:**
   - Say "overwhelmed" → Goblin Tools
   - Say "anxious" → Therapy
   - Say "unmotivated" → Self-Help

4. **Enforcement:**
   - Try to add 3rd thing → Blocked
   - Work on other thing → Redirected

**How to test:**
- Create a test script that simulates conversations
- Or manually test through voice interface
- Record what works/doesn't work

---

## Recommended Testing Stack

### For MVP Testing (Free/Low Cost)

1. **Voice Input:**
   - Web Speech API (free, Chrome/Edge only)
   - Or: Record audio file, upload manually

2. **Voice Output:**
   - Web Speech Synthesis (free, all browsers)
   - Or: Play pre-recorded audio files

3. **LLM:**
   - OpenAI GPT-3.5 Turbo (cheap: $1.50 per 1M tokens)
   - Or: Local model (free but slower)

4. **Storage:**
   - LocalStorage (browser) for testing
   - Or: Simple JSON file

### For Production Testing (Better Quality)

1. **STT:**
   - OpenAI Whisper API ($0.006/min)
   - Or: Deepgram ($0.0043/min, lower latency)

2. **TTS:**
   - OpenAI TTS ($15 per 1M chars)
   - Or: ElevenLabs (more natural, $5 per 1M chars)

3. **LLM:**
   - GPT-4 Turbo (better quality)
   - Or: Claude (good for long context)

4. **Database:**
   - PostgreSQL (structured data)
   - Or: Supabase (free tier)

---

## Quick Test Script

Here's a minimal test you can run right now:

### 1. Create test file: `test-simple.ts`

```typescript
// Simple logic test - no voice needed
const userFocus = {
  thing1: null,
  thing2: null
};

function handleInput(input: string) {
  // Test: Set 2 things
  if (input.includes("thing 1") || input.includes("first thing")) {
    const thing = extractThing(input);
    userFocus.thing1 = thing;
    return `Got it. Thing 1: ${thing}`;
  }
  
  if (input.includes("thing 2") || input.includes("second thing")) {
    const thing = extractThing(input);
    if (userFocus.thing1 && userFocus.thing2) {
      return "You already have 2 things. Which one should we pause?";
    }
    userFocus.thing2 = thing;
    return `Got it. Thing 2: ${thing}`;
  }
  
  // Test: Support tool routing
  if (input.includes("overwhelmed") || input.includes("don't know where to start")) {
    return "Let me break this down for you... [Goblin Tools]";
  }
  
  if (input.includes("anxious") || input.includes("frustrated") || input.includes("stuck")) {
    return "It sounds like you're feeling blocked. Let's talk through it... [Therapy]";
  }
  
  if (input.includes("motivation") || input.includes("unmotivated")) {
    return "Here's a different way to think about it... [Self-Help]";
  }
  
  return "How can I help you with Thing 1 or Thing 2?";
}

function extractThing(input: string): string {
  // Simple extraction - improve later
  return input.replace(/thing [12]/i, "").trim();
}

// Test it
console.log(handleInput("Thing 1 is ship the feature"));
console.log(handleInput("Thing 2 is hire a designer"));
console.log(handleInput("I'm overwhelmed with Thing 1"));
console.log(handleInput("I want to add marketing as Thing 3"));
```

### 2. Run it:
```bash
bun test-simple.ts
# or
tsx test-simple.ts
```

---

## Testing Checklist

### Core Logic
- [ ] Can set Thing 1
- [ ] Can set Thing 2
- [ ] Can't set Thing 3 without pausing
- [ ] Can pause/replace a thing
- [ ] Progress tracking works

### Support Tools
- [ ] "Overwhelmed" → Goblin Tools
- [ ] "Anxious/frustrated" → Therapy
- [ ] "Unmotivated" → Self-Help
- [ ] Tools actually help (test output quality)

### Voice Interface
- [ ] Can capture audio
- [ ] Transcription is accurate enough
- [ ] Response is generated
- [ ] TTS plays response
- [ ] Can interrupt AI

### Edge Cases
- [ ] What if user says nothing?
- [ ] What if transcription is wrong?
- [ ] What if user wants to change things mid-conversation?
- [ ] What if both things are completed?

---

## Recommended Testing Order

1. **Week 1: Logic only** (text-based, no voice)
   - Test all the core logic
   - Make sure routing works
   - Verify 2-thing enforcement

2. **Week 2: Add voice** (Web Speech API)
   - Test STT accuracy
   - Test TTS quality
   - Test full conversation

3. **Week 3: Polish** (Better APIs if needed)
   - Upgrade to better STT/TTS if Web Speech isn't good enough
   - Test with real users
   - Iterate based on feedback

---

## Cost Estimates for Testing

### Free Option (Web Speech API)
- **Cost:** $0
- **Quality:** Good enough for MVP
- **Limitations:** Chrome/Edge only, not as accurate as paid APIs

### Low-Cost Option (OpenAI)
- **STT:** ~$0.01 per 5-minute conversation
- **TTS:** ~$0.01 per conversation
- **LLM:** ~$0.01-0.05 per conversation (GPT-3.5)
- **Total:** ~$0.03-0.07 per test conversation

### For 100 test conversations: ~$3-7

---

## Next Steps

1. **Start with logic test** (no voice, just text)
2. **Add Web Speech API** (free voice testing)
3. **Test with yourself** (be your own first user)
4. **Get 2-3 founders to test** (real feedback)
5. **Iterate based on what works**

Want me to create the actual test files for you to run?

