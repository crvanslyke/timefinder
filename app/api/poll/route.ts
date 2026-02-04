import { NextRequest, NextResponse } from "next/server";
import { createPoll } from "@/lib/redis";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, duration, timeSlots } = body;

    if (!title || !timeSlots || !Array.isArray(timeSlots) || timeSlots.length === 0) {
      return NextResponse.json(
        { error: "Invalid poll data" },
        { status: 400 }
      );
    }

    const poll = await createPoll({
      title,
      description,
      duration: duration || 60, // Default to 60 minutes if not provided
      timeSlots,
    });

    return NextResponse.json(poll);
  } catch (error) {
    console.error("Error creating poll:", error);
    return NextResponse.json(
      { error: "Failed to create poll" },
      { status: 500 }
    );
  }
}
