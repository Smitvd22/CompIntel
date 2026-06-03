import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [companies, roles, levels, locations] = await Promise.all([
      prisma.company.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
      prisma.role.findMany({
        select: { id: true, title: true },
        orderBy: { title: "asc" },
      }),
      prisma.level.findMany({
        select: { id: true, name: true, rank: true },
        orderBy: { rank: "asc" },
      }),
      prisma.location.findMany({
        select: { id: true, city: true, state: true, country: true },
        orderBy: { city: "asc" },
      }),
    ]);

    return NextResponse.json({ companies, roles, levels, locations });
  } catch (error) {
    console.error("Filters API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch filter options" },
      { status: 500 }
    );
  }
}
