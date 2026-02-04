import { NextRequest, NextResponse } from "next/server";
import { addParticipant } from "@/lib/redis";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, selectedSlots } = body;

    if (!name || !selectedSlots || !Array.isArray(selectedSlots)) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const participant = {
      name: name.trim(),
      selectedSlots,
      timestamp: new Date().toISOString(),
    };

    const poll = await addParticipant(id, participant);

    if (!poll) {
      return NextResponse.json(
        { error: "Poll not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(poll);
  } catch (error) {
    console.error("Error adding participant:", error);
    return NextResponse.json(
      { error: "Failed to add participant" },
      { status: 500 }
    );
  }
}
