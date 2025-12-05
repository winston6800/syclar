import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { task, estimatedHours } = await request.json();

    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task description required" },
        { status: 400 }
      );
    }

    // For now, use a simple mock response
    // In production, replace with actual OpenAI API call
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      // Mock response for development - break into 1-2 hour chunks
      const mockSubtasks = [
        "Research and gather requirements",
        "Set up initial structure",
        "Implement core functionality",
        "Test and refine",
      ];
      
      return NextResponse.json({
        success: true,
        subtasks: mockSubtasks.map((label, i) => ({
          label,
          estimatedMinutes: 60 + (i * 15), // 60, 75, 90, 105 minutes
        })),
      });
    }

    // Real OpenAI API call
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a productivity coach. Break down tasks into 1-2 hour chunks. Each subtask should be:
- Specific and actionable
- 60-120 minutes to complete
- Clear what "done" looks like
- Sequential (can be done in order)

Return ONLY a JSON object with a "subtasks" array. Each subtask has "label" (string) and "estimatedMinutes" (number 60-120).`,
          },
          {
            role: "user",
            content: `Task: ${task}\n${estimatedHours ? `Estimated total time: ${estimatedHours} hours` : ""}\n\nBreak this into 1-2 hour chunks. Return as JSON.`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error("OpenAI API error");
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);
    const subtasks = content.subtasks || [];

    return NextResponse.json({
      success: true,
      subtasks: Array.isArray(subtasks) ? subtasks : [],
    });
  } catch (error) {
    console.error("Breakdown task error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to break down task" },
      { status: 500 }
    );
  }
}

