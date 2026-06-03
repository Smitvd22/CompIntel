import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { saveComparisonSchema } from "@/lib/validations";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const savedComparisons = await prisma.savedComparison.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: savedComparisons });
  } catch (error) {
    console.error("Saved comparisons GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved comparisons" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = saveComparisonSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, entryIds } = validation.data;

    const comparison = await prisma.savedComparison.create({
      data: {
        userId: session.user.id,
        title,
        entryIds,
      },
    });

    return NextResponse.json(comparison, { status: 201 });
  } catch (error) {
    console.error("Save comparison error:", error);
    return NextResponse.json(
      { error: "Failed to save comparison" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Comparison ID is required" },
        { status: 400 }
      );
    }

    await prisma.savedComparison.delete({
      where: { id, userId: session.user.id },
    });

    return NextResponse.json({ message: "Comparison removed" });
  } catch (error) {
    console.error("Delete comparison error:", error);
    return NextResponse.json(
      { error: "Failed to remove comparison" },
      { status: 500 }
    );
  }
}
