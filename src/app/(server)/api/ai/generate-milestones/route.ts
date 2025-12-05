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
        `Validate ${pillarName.toLowerCase()}`,
        `Build MVP for ${pillarName.toLowerCase()}`,
        `Launch ${pillarName.toLowerCase()}`,
        `Get first users for ${pillarName.toLowerCase()}`,
        `Scale ${pillarName.toLowerCase()}`,
      ];
      
      return NextResponse.json({
        success: true,
        milestones: mockMilestones.slice(0, 4), // Return 4 milestones
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
            content: `You are a productivity coach for founders. Generate 4-5 concrete milestones (stones) that build toward a goal. Each milestone should be:
- Specific and actionable
- Sequential (build on each other)
- Achievable in 1-4 weeks
- Clear when complete

Return ONLY a JSON array of milestone strings, nothing else.`,
          },
          {
            role: "user",
            content: `Pillar: ${pillarName}\nWin Definition: ${winDefinition}\n\nGenerate 4-5 milestones (stones) that build this pillar. Return as JSON array.`,
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
    const milestones = content.milestones || content.stones || [];

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

