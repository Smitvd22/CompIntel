"use client";

import { useEffect, useState, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  X,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { CompensationEntryWithRelations, FilterOptions, PaginatedResponse } from "@/types";

export function SalaryExplorerClient() {
  const [data, setData] = useState<CompensationEntryWithRelations[]>([]);
  const [filters, setFilters] = useState<FilterOptions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [selectedFilters, setSelectedFilters] = useState({
    companyId: "",
    roleId: "",
    levelId: "",
    locationId: "",
    sortBy: "totalCompensation" as string,
    sortOrder: "desc" as string,
  });
  const [showFilters, setShowFilters] = useState(true);

  // Fetch filter options
  useEffect(() => {
    fetch("/api/filters")
      .then((res) => res.json())
      .then(setFilters)
      .catch(console.error);
  }, []);

  // Fetch compensation data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(pagination.page));
      params.set("limit", String(pagination.limit));
      params.set("sortBy", selectedFilters.sortBy);
      params.set("sortOrder", selectedFilters.sortOrder);
      if (selectedFilters.companyId) params.set("companyId", selectedFilters.companyId);
      if (selectedFilters.roleId) params.set("roleId", selectedFilters.roleId);
      if (selectedFilters.levelId) params.set("levelId", selectedFilters.levelId);
      if (selectedFilters.locationId) params.set("locationId", selectedFilters.locationId);

      const res = await fetch(`/api/compensation?${params}`);
      const result: PaginatedResponse<CompensationEntryWithRelations> = await res.json();
      setData(result.data);
      setPagination((prev) => ({
        ...prev,
        total: result.pagination.total,
        totalPages: result.pagination.totalPages,
      }));
    } catch (error) {
      console.error("Failed to fetch compensation data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, selectedFilters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns: ColumnDef<CompensationEntryWithRelations>[] = [
    {
      accessorKey: "company.name",
      header: "Company",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.company.name}</div>
      ),
    },
    {
      accessorKey: "role.title",
      header: "Role",
      cell: ({ row }) => (
        <div className="text-sm">{row.original.role.title}</div>
      ),
    },
    {
      accessorKey: "level.name",
      header: "Level",
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-mono text-xs">
          {row.original.level.name}
        </Badge>
      ),
    },
    {
      accessorKey: "location.city",
      header: "Location",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">{row.original.location.city}</div>
      ),
    },
    {
      accessorKey: "baseSalary",
      header: "Base",
      cell: ({ row }) => (
        <div className="text-sm font-medium tabular-nums">
          {formatCurrency(row.original.baseSalary)}
        </div>
      ),
    },
    {
      accessorKey: "bonus",
      header: "Bonus",
      cell: ({ row }) => (
        <div className="text-sm tabular-nums text-muted-foreground">
          {formatCurrency(row.original.bonus)}
        </div>
      ),
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => (
        <div className="text-sm tabular-nums text-muted-foreground">
          {formatCurrency(row.original.stock)}
        </div>
      ),
    },
    {
      accessorKey: "totalCompensation",
      header: "Total Comp",
      cell: ({ row }) => (
        <div className="text-sm font-semibold tabular-nums text-primary">
          {formatCurrency(row.original.totalCompensation)}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  function clearFilters() {
    setSelectedFilters({
      companyId: "",
      roleId: "",
      levelId: "",
      locationId: "",
      sortBy: "totalCompensation",
      sortOrder: "desc",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  }

  const hasActiveFilters = selectedFilters.companyId || selectedFilters.roleId || selectedFilters.levelId || selectedFilters.locationId;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Salary Explorer</h1>
        <p className="mt-2 text-muted-foreground">
          Browse and filter {pagination.total} compensation entries across top companies.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                !
              </Badge>
            )}
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
              <X className="h-3 w-3" />
              Clear filters
            </Button>
          )}
        </div>

        {showFilters && filters && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 p-4 rounded-xl border border-border/50 bg-card/50">
            <Select
              value={selectedFilters.companyId || "all"}
              onValueChange={(v) => {
                setSelectedFilters((prev) => ({ ...prev, companyId: v === "all" ? "" : v as string }));
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {filters.companies.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedFilters.roleId || "all"}
              onValueChange={(v) => {
                setSelectedFilters((prev) => ({ ...prev, roleId: v === "all" ? "" : v as string }));
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {filters.roles.map((r) => (
                  <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedFilters.levelId || "all"}
              onValueChange={(v) => {
                setSelectedFilters((prev) => ({ ...prev, levelId: v === "all" ? "" : v as string }));
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {filters.levels.map((l) => (
                  <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedFilters.locationId || "all"}
              onValueChange={(v) => {
                setSelectedFilters((prev) => ({ ...prev, locationId: v === "all" ? "" : v as string }));
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {filters.locations.map((l) => (
                  <SelectItem key={l.id} value={l.id}>{l.city}, {l.country}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedFilters.sortBy}
              onValueChange={(v) => setSelectedFilters((prev) => ({ ...prev, sortBy: v as string }))}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="totalCompensation">Total Comp</SelectItem>
                <SelectItem value="baseSalary">Base Salary</SelectItem>
                <SelectItem value="bonus">Bonus</SelectItem>
                <SelectItem value="stock">Stock</SelectItem>
                <SelectItem value="createdAt">Date Added</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedFilters.sortOrder}
              onValueChange={(v) => setSelectedFilters((prev) => ({ ...prev, sortOrder: v as string }))}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Highest First</SelectItem>
                <SelectItem value="asc">Lowest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-border/50 hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-40 text-center text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    No compensation entries found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="border-border/30 hover:bg-muted/30">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(pagination.page - 1) * pagination.limit + 1}–
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
          {pagination.total} entries
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            Page {pagination.page} of {pagination.totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
