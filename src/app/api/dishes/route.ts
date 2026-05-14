import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const dishes = await prisma.dish.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(dishes);
  } catch {
    return NextResponse.json({ error: "Failed to fetch dishes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, category, cuisine, rating, photoPath, notes } = body;

    if (!name || !category) {
      return NextResponse.json({ error: "Name and category are required" }, { status: 400 });
    }

    const dish = await prisma.dish.create({
      data: {
        name,
        description: description || null,
        category,
        cuisine: cuisine || null,
        rating: Number(rating) || 3,
        photoPath: photoPath || null,
        notes: notes || null,
      },
    });

    return NextResponse.json(dish, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create dish" }, { status: 500 });
  }
}
