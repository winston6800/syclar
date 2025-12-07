import { NextRequest, NextResponse } from "next/server";

// In-memory storage for demo (in production, use Redis/DB)
let stories: Array<{
  id: number;
  content: string;
  date: string;
  createdAt: string;
}> = [];

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      stories: stories.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Story content is required" },
        { status: 400 }
      );
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { success: false, error: "Story exceeds 2000 characters" },
        { status: 400 }
      );
    }

    const newStory = {
      id: Date.now(),
      content: content.trim(),
      date: new Date().toISOString(),
      createdAt: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    };

    stories.push(newStory);

    return NextResponse.json({
      success: true,
      story: newStory,
      message: "Story saved successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to save story" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Story ID is required" },
        { status: 400 }
      );
    }

    stories = stories.filter((s) => s.id !== id);

    return NextResponse.json({
      success: true,
      message: "Story deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete story" },
      { status: 500 }
    );
  }
}
