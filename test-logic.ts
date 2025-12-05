// Simple logic test for Founder Focus Voice Coach
// Run with: bun test-logic.ts or tsx test-logic.ts

type FocusItem = {
  id: string;
  description: string;
  status: "active" | "completed" | "paused";
};

const userFocus = {
  thing1: null as FocusItem | null,
  thing2: null as FocusItem | null,
};

function extractThing(input: string): string {
  // Simple extraction - remove "thing 1" or "thing 2" and clean up
  return input
    .replace(/thing\s*[12]/i, "")
    .replace(/^(is|are|to)\s+/i, "")
    .trim();
}

function handleInput(input: string): string {
  const lowerInput = input.toLowerCase();

  // Set Thing 1
  if (lowerInput.includes("thing 1") || lowerInput.includes("first thing")) {
    if (userFocus.thing1 && userFocus.thing1.status === "active") {
      return "You already have a Thing 1. Want to replace it?";
    }
    const thing = extractThing(input);
    userFocus.thing1 = {
      id: "1",
      description: thing,
      status: "active",
    };
    return `✓ Got it. Thing 1: ${thing}`;
  }

  // Set Thing 2
  if (lowerInput.includes("thing 2") || lowerInput.includes("second thing")) {
    if (userFocus.thing2 && userFocus.thing2.status === "active") {
      return "You already have a Thing 2. Want to replace it?";
    }
    if (!userFocus.thing1) {
      return "Set Thing 1 first, then we'll set Thing 2.";
    }
    const thing = extractThing(input);
    userFocus.thing2 = {
      id: "2",
      description: thing,
      status: "active",
    };
    return `✓ Got it. Thing 2: ${thing}`;
  }

  // Try to add 3rd thing
  if (lowerInput.includes("thing 3") || lowerInput.includes("third thing") || 
      (lowerInput.includes("also") && userFocus.thing1 && userFocus.thing2)) {
    return "❌ You can only focus on 2 things max. Which one should we pause?";
  }

  // Support tool routing: Goblin Tools (overwhelmed, big task, don't know where to start)
  if (
    lowerInput.includes("overwhelmed") ||
    lowerInput.includes("don't know where to start") ||
    lowerInput.includes("too big") ||
    lowerInput.includes("break down") ||
    lowerInput.includes("how do i")
  ) {
    return "🔧 [Goblin Tools] Let me break this down for you. What specifically are you trying to do?";
  }

  // Support tool routing: Therapy (emotions, stuck, blocked)
  if (
    lowerInput.includes("anxious") ||
    lowerInput.includes("frustrated") ||
    lowerInput.includes("stuck") ||
    lowerInput.includes("blocked") ||
    lowerInput.includes("can't") ||
    lowerInput.includes("imposter") ||
    lowerInput.includes("doubt")
  ) {
    return "💬 [Therapy] It sounds like you're feeling blocked. Let's talk through what's really going on. What's making you feel this way?";
  }

  // Support tool routing: Self-Help (motivation, procrastination)
  if (
    lowerInput.includes("motivation") ||
    lowerInput.includes("unmotivated") ||
    lowerInput.includes("procrastinating") ||
    lowerInput.includes("don't want to") ||
    lowerInput.includes("lazy")
  ) {
    return "💪 [Self-Help] Here's a different way to think about it... [motivational advice]. What's one small step you can take right now?";
  }

  // Check status
  if (lowerInput.includes("how") && (lowerInput.includes("going") || lowerInput.includes("progress"))) {
    if (!userFocus.thing1 && !userFocus.thing2) {
      return "You haven't set your 2 things yet. What are they?";
    }
    let response = "Here's your focus:\n";
    if (userFocus.thing1) {
      response += `• Thing 1: ${userFocus.thing1.description}\n`;
    }
    if (userFocus.thing2) {
      response += `• Thing 2: ${userFocus.thing2.description}`;
    }
    return response;
  }

  // Default response
  if (!userFocus.thing1 || !userFocus.thing2) {
    return "What are your 2 things to focus on?";
  }
  return `How's it going with "${userFocus.thing1.description}" or "${userFocus.thing2.description}"?`;
}

// Test scenarios
console.log("=== TEST 1: Set Thing 1 ===\n");
console.log("Input: 'Thing 1 is ship the new feature'");
console.log("Output:", handleInput("Thing 1 is ship the new feature"));
console.log("\n");

console.log("=== TEST 2: Set Thing 2 ===\n");
console.log("Input: 'Thing 2 is hire a designer'");
console.log("Output:", handleInput("Thing 2 is hire a designer"));
console.log("\n");

console.log("=== TEST 3: Try to add 3rd thing ===\n");
console.log("Input: 'I also want to do marketing'");
console.log("Output:", handleInput("I also want to do marketing"));
console.log("\n");

console.log("=== TEST 4: Trigger Goblin Tools ===\n");
console.log("Input: 'I'm overwhelmed with Thing 1'");
console.log("Output:", handleInput("I'm overwhelmed with Thing 1"));
console.log("\n");

console.log("=== TEST 5: Trigger Therapy ===\n");
console.log("Input: 'I'm feeling anxious about hiring'");
console.log("Output:", handleInput("I'm feeling anxious about hiring"));
console.log("\n");

console.log("=== TEST 6: Trigger Self-Help ===\n");
console.log("Input: 'I'm unmotivated to work on Thing 2'");
console.log("Output:", handleInput("I'm unmotivated to work on Thing 2"));
console.log("\n");

console.log("=== TEST 7: Check status ===\n");
console.log("Input: 'How's it going?'");
console.log("Output:", handleInput("How's it going?"));
console.log("\n");

console.log("=== Current Focus State ===\n");
console.log(JSON.stringify(userFocus, null, 2));

