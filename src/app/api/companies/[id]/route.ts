import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const company = await prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Get all compensation entries for this company
    const entries = await prisma.compensationEntry.findMany({
      where: { companyId: id },
      include: {
        role: { select: { id: true, title: true } },
        level: { select: { id: true, name: true, rank: true } },
        location: { select: { id: true, city: true, state: true, country: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const enrichedEntries = entries.map((e: any) => ({
      ...e,
      totalCompensation: e.baseSalary + e.bonus + e.stock,
      company: { id: company.id, name: company.name, industry: company.industry, logoUrl: company.logoUrl },
    }));

    // Aggregate stats
    const tcs = enrichedEntries.map((e: any) => e.totalCompensation);
    const avgTC = tcs.length > 0 ? Math.round(tcs.reduce((a: number, b: number) => a + b, 0) / tcs.length) : 0;
    const avgBase = entries.length > 0
      ? Math.round(entries.reduce((a: number, e: any) => a + e.baseSalary, 0) / entries.length)
      : 0;
    const highestTC = tcs.length > 0 ? Math.max(...tcs) : 0;

    // Level distribution
    const levelMap = new Map<string, { total: number; count: number }>();
    enrichedEntries.forEach((e: any) => {
      const key = e.level.name;
      const existing = levelMap.get(key) || { total: 0, count: 0 };
      levelMap.set(key, {
        total: existing.total + e.totalCompensation,
        count: existing.count + 1,
      });
    });
    const levelDistribution = Array.from(levelMap.entries())
      .map(([level, data]) => ({
        level,
        avgTC: Math.round(data.total / data.count),
        count: data.count,
      }))
      .sort((a, b) => a.level.localeCompare(b.level));

    // Role distribution
    const roleMap = new Map<string, { total: number; count: number }>();
    enrichedEntries.forEach((e: any) => {
      const key = e.role.title;
      const existing = roleMap.get(key) || { total: 0, count: 0 };
      roleMap.set(key, {
        total: existing.total + e.totalCompensation,
        count: existing.count + 1,
      });
    });
    const roleDistribution = Array.from(roleMap.entries())
      .map(([role, data]) => ({
        role,
        avgTC: Math.round(data.total / data.count),
        count: data.count,
      }))
      .sort((a, b) => b.avgTC - a.avgTC);

    // Compensation breakdown
    const totalBase = entries.reduce((a: number, e: any) => a + e.baseSalary, 0);
    const totalBonus = entries.reduce((a: number, e: any) => a + e.bonus, 0);
    const totalStock = entries.reduce((a: number, e: any) => a + e.stock, 0);
    const grandTotal = totalBase + totalBonus + totalStock;

    const compensationBreakdown = [
      { category: "Base Salary", amount: grandTotal > 0 ? Math.round((totalBase / grandTotal) * 100) : 0 },
      { category: "Bonus", amount: grandTotal > 0 ? Math.round((totalBonus / grandTotal) * 100) : 0 },
      { category: "Stock/RSUs", amount: grandTotal > 0 ? Math.round((totalStock / grandTotal) * 100) : 0 },
    ];

    return NextResponse.json({
      ...company,
      avgBaseSalary: avgBase,
      avgTotalComp: avgTC,
      highestTC,
      entryCount: entries.length,
      compensationEntries: enrichedEntries,
      levelDistribution,
      roleDistribution,
      compensationBreakdown,
    });
  } catch (error) {
    console.error("Company detail API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch company details" },
      { status: 500 }
    );
  }
}
