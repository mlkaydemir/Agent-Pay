import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processAgentMessage } from "@/lib/agent-engine";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.message || "";

    if (!message.trim()) {
      return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
    }

    const wallet = await prisma.wallet.findFirst();
    if (!wallet) {
      return NextResponse.json({ error: "No active wallet found" }, { status: 404 });
    }

    const response = await processAgentMessage({
      message,
      walletId: wallet.id,
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("POST /api/agent/chat error:", error);
    return NextResponse.json({ error: error.message || "Failed to process chat message" }, { status: 500 });
  }
}
