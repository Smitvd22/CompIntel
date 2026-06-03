import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compensationFilterSchema } from "@/lib/validations";
import { buildPaginationParams } from "@/lib/utils";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);

    // Parse multi-select params
    const parseMulti = (key: string) => {
      const val = searchParams[key];
      if (!val) return undefined;
      return val.includes(",") ? val.split(",") : val;
    };

    const validation = compensationFilterSchema.safeParse({
      ...searchParams,
      companyId: parseMulti("companyId"),
      roleId: parseMulti("roleId"),
      levelId: parseMulti("levelId"),
      locationId: parseMulti("locationId"),
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid filter parameters", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const filters = validation.data;
    const { skip, take } = buildPaginationParams(filters.page, filters.limit);

    // Build where clause
    const where: Prisma.CompensationEntryWhereInput = {};

    if (filters.companyId) {
      where.companyId = Array.isArray(filters.companyId)
        ? { in: filters.companyId }
        : filters.companyId;
    }
    if (filters.roleId) {
      where.roleId = Array.isArray(filters.roleId)
        ? { in: filters.roleId }
        : filters.roleId;
    }
    if (filters.levelId) {
      where.levelId = Array.isArray(filters.levelId)
        ? { in: filters.levelId }
        : filters.levelId;
    }
    if (filters.locationId) {
      where.locationId = Array.isArray(filters.locationId)
        ? { in: filters.locationId }
        : filters.locationId;
    }

    // Get total count for pagination
    const total = await prisma.compensationEntry.count({ where });

    // Build order clause
    let orderBy: Prisma.CompensationEntryOrderByWithRelationInput = {};
    if (filters.sortBy === "totalCompensation") {
      // TC is computed, so we'll sort by baseSalary as approximation for DB-level sort
      // and re-sort in-memory
      orderBy = { baseSalary: filters.sortOrder };
    } else {
      orderBy = { [filters.sortBy]: filters.sortOrder };
    }

    // Fetch entries
    const entries = await prisma.compensationEntry.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        company: { select: { id: true, name: true, industry: true, logoUrl: true } },
        role: { select: { id: true, title: true } },
        level: { select: { id: true, name: true, rank: true } },
        location: { select: { id: true, city: true, state: true, country: true } },
      },
    });

    // Add computed totalCompensation
    const enrichedEntries = entries.map((entry: any) => ({
      ...entry,
      totalCompensation: entry.baseSalary + entry.bonus + entry.stock,
    }));

    // If sorting by TC, re-sort
    if (filters.sortBy === "totalCompensation") {
      enrichedEntries.sort((a: any, b: any) =>
        filters.sortOrder === "desc"
          ? b.totalCompensation - a.totalCompensation
          : a.totalCompensation - b.totalCompensation
      );
    }

    // Apply TC range filter (post-query since TC is computed)
    let filteredEntries = enrichedEntries;
    if (filters.minTC !== undefined || filters.maxTC !== undefined) {
      filteredEntries = enrichedEntries.filter((e: any) => {
        if (filters.minTC !== undefined && e.totalCompensation < filters.minTC) return false;
        if (filters.maxTC !== undefined && e.totalCompensation > filters.maxTC) return false;
        return true;
      });
    }

    return NextResponse.json({
      data: filteredEntries,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    });
  } catch (error) {
    console.error("Compensation API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch compensation data" },
      { status: 500 }
    );
  }
}
