import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { ids } = await request.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No dish IDs provided" }, { status: 400 });
    }
    await prisma.dish.updateMany({
      where: { id: { in: ids } },
      data: { requestCount: { increment: 1 } },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to log request" }, { status: 500 });
  }
}
