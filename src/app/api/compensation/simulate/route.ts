import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { simulatorSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = simulatorSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { companyId, levelId, locationId, roleId } = validation.data;

    // Build where clause
    const where: Record<string, string> = { companyId, levelId, locationId };
    if (roleId) where.roleId = roleId;

    // Fetch matching entries
    const entries = await prisma.compensationEntry.findMany({ where });

    if (entries.length === 0) {
      // Try broader search without location constraint
      const broaderEntries = await prisma.compensationEntry.findMany({
        where: { companyId, levelId },
      });

      if (broaderEntries.length === 0) {
        return NextResponse.json(
          { error: "No compensation data found for this combination. Try different parameters." },
          { status: 404 }
        );
      }

      return computeSimulation(broaderEntries, "low");
    }

    const confidence = entries.length >= 5 ? "high" : entries.length >= 3 ? "medium" : "low";
    return computeSimulation(entries, confidence);
  } catch (error) {
    console.error("Simulator API error:", error);
    return NextResponse.json(
      { error: "Failed to simulate compensation" },
      { status: 500 }
    );
  }
}

function computeSimulation(
  entries: Array<{ baseSalary: number; bonus: number; stock: number }>,
  confidence: "high" | "medium" | "low"
) {
  const bases = entries.map((e) => e.baseSalary).sort((a, b) => a - b);
  const bonuses = entries.map((e) => e.bonus).sort((a, b) => a - b);
  const stocks = entries.map((e) => e.stock).sort((a, b) => a - b);
  const tcs = entries.map((e) => e.baseSalary + e.bonus + e.stock).sort((a, b) => a - b);

  const median = (arr: number[]) => {
    const mid = Math.floor(arr.length / 2);
    return arr.length % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
  };

  const percentile = (arr: number[], p: number) => {
    const idx = Math.ceil((p / 100) * arr.length) - 1;
    return arr[Math.max(0, idx)];
  };

  const avg = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);

  return NextResponse.json({
    estimatedBase: avg(bases),
    estimatedBonus: avg(bonuses),
    estimatedStock: avg(stocks),
    estimatedTC: avg(tcs),
    dataPoints: entries.length,
    confidence,
    percentile: {
      p25: percentile(tcs, 25),
      p50: median(tcs),
      p75: percentile(tcs, 75),
    },
    breakdown: {
      base: avg(bases),
      bonus: avg(bonuses),
      stock: avg(stocks),
    },
  });
}
