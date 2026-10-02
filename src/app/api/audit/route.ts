import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const action = searchParams.get("action");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (action && action !== "ALL") {
      where.action = action;
    }
    if (search) {
      where.OR = [
        { action: { contains: search } },
        { toolName: { contains: search } },
        { inputData: { contains: search } },
        { outputData: { contains: search } },
        { hash: { contains: search } },
      ];
    }

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take: limit,
      include: {
        agent: true,
        transaction: true,
      },
    });

    return NextResponse.json({ logs });
  } catch (error: any) {
    console.error("GET /api/audit error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch audit logs" }, { status: 500 });
  }
}
