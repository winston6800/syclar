import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { pillarName, winDefinition } = await request.json();

    if (!pillarName || !winDefinition) {
      return NextResponse.json(
        { success: false, message: "Pillar name and win definition required" },
        { status: 400 }
      );
    }

    // For now, use a simple mock response
    // In production, replace with actual OpenAI API call
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      // Mock response for development
      const mockMilestones = [
        { name: `Validate ${pillarName.toLowerCase()}`, estimatedWeeks: 1 },
        { name: `Build MVP for ${pillarName.toLowerCase()}`, estimatedWeeks: 3 },
        { name: `Launch ${pillarName.toLowerCase()}`, estimatedWeeks: 1 },
        { name: `Get first users for ${pillarName.toLowerCase()}`, estimatedWeeks: 2 },
      ];
      
      return NextResponse.json({
        success: true,
        milestones: mockMilestones,
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
            content: `You are a productivity coach for founders in 2025. Generate 4-5 concrete milestones that build toward a goal. Each milestone should be:
- Specific and actionable
- Sequential (build on each other)
- Achievable in 1-4 weeks
- Clear when complete
- Account for modern AI tools (GitHub Copilot, Cursor, no-code platforms)

Return JSON object with "milestones" array. Each milestone is {name: string, estimatedWeeks: number}.
Estimated weeks should be realistic for 2025 (1-4 weeks per milestone).`,
          },
          {
            role: "user",
            content: `Pillar: ${pillarName}\nWin Definition: ${winDefinition}\n\nGenerate 4-5 milestones with time estimates. Return as JSON: {"milestones": [{"name": "...", "estimatedWeeks": 2}, ...]}`,
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
    let milestones = content.milestones || content.stones || [];
    
    // Ensure milestones have estimatedWeeks
    if (Array.isArray(milestones)) {
      milestones = milestones.map((m: any) => {
        if (typeof m === 'string') {
          return { name: m, estimatedWeeks: 2 }; // Default 2 weeks
        }
        return { name: m.name || m, estimatedWeeks: m.estimatedWeeks || 2 };
      });
    }

    return NextResponse.json({
      success: true,
      milestones: Array.isArray(milestones) ? milestones : [],
    });
  } catch (error) {
    console.error("Generate milestones error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate milestones" },
      { status: 500 }
    );
  }
}

