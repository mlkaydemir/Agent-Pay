import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: any = {};
    if (category && category !== "All") {
      where.category = { contains: category };
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { cpu: { contains: search } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: { merchant: true },
      orderBy: { score: "desc" },
    });

    const parsed = products.map((p) => ({
      ...p,
      specs: p.specs ? JSON.parse(p.specs) : {},
    }));

    return NextResponse.json({ products: parsed });
  } catch (error: any) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch products" }, { status: 500 });
  }
}
