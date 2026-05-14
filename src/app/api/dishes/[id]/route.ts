import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, description, category, cuisine, rating, photoPath, notes } = await request.json();

    if (!name || !category) {
      return NextResponse.json({ error: "Name and category are required" }, { status: 400 });
    }

    const dish = await prisma.dish.update({
      where: { id: Number(id) },
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

    return NextResponse.json(dish);
  } catch {
    return NextResponse.json({ error: "Failed to update dish" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.dish.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete dish" }, { status: 500 });
  }
}
