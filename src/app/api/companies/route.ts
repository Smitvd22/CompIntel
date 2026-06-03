import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { compensationEntries: true },
        },
      },
    });

    // Calculate average TC for each company
    const companiesWithStats = await Promise.all(
      companies.map(async (company: any) => {
        const stats = await prisma.compensationEntry.aggregate({
          where: { companyId: company.id },
          _avg: { baseSalary: true, bonus: true, stock: true },
          _max: { baseSalary: true },
          _count: true,
        });

        const avgBase = stats._avg.baseSalary || 0;
        const avgBonus = stats._avg.bonus || 0;
        const avgStock = stats._avg.stock || 0;

        // Find highest TC
        const entries = await prisma.compensationEntry.findMany({
          where: { companyId: company.id },
          select: { baseSalary: true, bonus: true, stock: true },
        });

        const highestTC = entries.length > 0
          ? Math.max(...entries.map((e: any) => e.baseSalary + e.bonus + e.stock))
          : 0;

        return {
          id: company.id,
          name: company.name,
          normalizedName: company.normalizedName,
          industry: company.industry,
          description: company.description,
          logoUrl: company.logoUrl,
          website: company.website,
          founded: company.founded,
          headquarters: company.headquarters,
          employeeCount: company.employeeCount,
          avgBaseSalary: Math.round(avgBase),
          avgTotalComp: Math.round(avgBase + avgBonus + avgStock),
          highestTC: Math.round(highestTC),
          entryCount: stats._count,
        };
      })
    );

    return NextResponse.json({ data: companiesWithStats });
  } catch (error) {
    console.error("Companies API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}
