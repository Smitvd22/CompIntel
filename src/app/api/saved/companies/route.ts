import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { saveCompanySchema } from "@/lib/validations";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const savedCompanies = await prisma.savedCompany.findMany({
      where: { userId: session.user.id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            industry: true,
            logoUrl: true,
            normalizedName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: savedCompanies });
  } catch (error) {
    console.error("Saved companies GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved companies" },
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
    const validation = saveCompanySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { companyId } = validation.data;

    // Check for duplicate
    const existing = await prisma.savedCompany.findUnique({
      where: {
        userId_companyId: { userId: session.user.id, companyId },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Company already saved" },
        { status: 409 }
      );
    }

    const saved = await prisma.savedCompany.create({
      data: { userId: session.user.id, companyId },
      include: {
        company: {
          select: { id: true, name: true, industry: true, logoUrl: true },
        },
      },
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("Save company error:", error);
    return NextResponse.json(
      { error: "Failed to save company" },
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
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    await prisma.savedCompany.delete({
      where: {
        userId_companyId: { userId: session.user.id, companyId },
      },
    });

    return NextResponse.json({ message: "Company removed from saved" });
  } catch (error) {
    console.error("Delete saved company error:", error);
    return NextResponse.json(
      { error: "Failed to remove saved company" },
      { status: 500 }
    );
  }
}
