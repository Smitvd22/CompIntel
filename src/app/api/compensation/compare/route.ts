import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compareSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = compareSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { entryIds } = validation.data;

    const entries = await prisma.compensationEntry.findMany({
      where: { id: { in: entryIds } },
      include: {
        company: { select: { id: true, name: true, industry: true, logoUrl: true } },
        role: { select: { id: true, title: true } },
        level: { select: { id: true, name: true, rank: true } },
        location: { select: { id: true, city: true, state: true, country: true } },
      },
    });

    if (entries.length < 2) {
      return NextResponse.json(
        { error: "Could not find enough valid entries to compare" },
        { status: 404 }
      );
    }

    const comparisonEntries = entries.map((entry: any) => ({
      id: entry.id,
      company: entry.company.name,
      companyId: entry.company.id,
      role: entry.role.title,
      level: entry.level.name,
      location: `${entry.location.city}, ${entry.location.country}`,
      baseSalary: entry.baseSalary,
      bonus: entry.bonus,
      stock: entry.stock,
      totalCompensation: entry.baseSalary + entry.bonus + entry.stock,
    }));

    // Find highest values for highlighting
    const highlights = {
      highestBase: Math.max(...comparisonEntries.map((e: any) => e.baseSalary)),
      highestBonus: Math.max(...comparisonEntries.map((e: any) => e.bonus)),
      highestStock: Math.max(...comparisonEntries.map((e: any) => e.stock)),
      highestTC: Math.max(...comparisonEntries.map((e: any) => e.totalCompensation)),
    };

    return NextResponse.json({ entries: comparisonEntries, highlights });
  } catch (error) {
    console.error("Comparison API error:", error);
    return NextResponse.json(
      { error: "Failed to compare compensation entries" },
      { status: 500 }
    );
  }
}
