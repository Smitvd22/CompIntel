"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { GitCompareArrows, Plus, Trash2, Trophy } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, formatCompactCurrency } from "@/lib/utils";
import type { CompensationEntryWithRelations, FilterOptions, PaginatedResponse, ComparisonEntry } from "@/types";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const COLORS = ["oklch(0.637 0.196 265)", "oklch(0.72 0.17 162)", "oklch(0.75 0.15 55)"];

export function CompareClient() {
  const { data: session } = useSession();
  const [filters, setFilters] = useState<FilterOptions | null>(null);
  const [entries, setEntries] = useState<CompensationEntryWithRelations[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [comparison, setComparison] = useState<{
    entries: ComparisonEntry[];
    highlights: Record<string, number>;
  } | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  // Filter state for adding entries
  const [addFilter, setAddFilter] = useState({ companyId: "", levelId: "" });
  const [availableEntries, setAvailableEntries] = useState<CompensationEntryWithRelations[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    fetch("/api/filters").then((r) => r.json()).then(setFilters).catch(console.error);
  }, []);

  // Fetch entries when filter changes
  useEffect(() => {
    if (addFilter.companyId || addFilter.levelId) {
      const params = new URLSearchParams();
      if (addFilter.companyId) params.set("companyId", addFilter.companyId);
      if (addFilter.levelId) params.set("levelId", addFilter.levelId);
      params.set("limit", "50");
      params.set("sortBy", "totalCompensation");
      params.set("sortOrder", "desc");

      fetch(`/api/compensation?${params}`)
        .then((r) => r.json())
        .then((result: PaginatedResponse<CompensationEntryWithRelations>) => setAvailableEntries(result.data))
        .catch(console.error);
    }
  }, [addFilter]);

  async function runComparison() {
    if (selectedIds.length < 2) {
      toast.error("Select at least 2 entries to compare");
      return;
    }
    setIsComparing(true);
    try {
      const res = await fetch("/api/compensation/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryIds: selectedIds }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
        return;
      }
      setComparison(data);
    } catch {
      toast.error("Failed to compare entries");
    } finally {
      setIsComparing(false);
    }
  }

  function addEntry(entry: CompensationEntryWithRelations) {
    if (selectedIds.length >= 3) {
      toast.error("Maximum 3 entries for comparison");
      return;
    }
    if (selectedIds.includes(entry.id)) {
      toast.error("Entry already selected");
      return;
    }
    setSelectedIds((prev) => [...prev, entry.id]);
    setEntries((prev) => [...prev, entry]);
    setShowAdd(false);
    setComparison(null);
  }

  function removeEntry(id: string) {
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setComparison(null);
  }

  async function saveComparison() {
    if (!session?.user) {
      toast.error("Please login to save comparisons");
      return;
    }
    try {
      const res = await fetch("/api/saved/comparisons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: entries.map((e) => e.company.name).join(" vs "),
          entryIds: selectedIds,
        }),
      });
      if (res.ok) {
        toast.success("Comparison saved!");
      } else {
        toast.error("Failed to save comparison");
      }
    } catch {
      toast.error("Failed to save comparison");
    }
  }

  const chartData = comparison?.entries.map((e) => ({
    name: `${e.company}\n${e.level}`,
    Base: e.baseSalary,
    Bonus: e.bonus,
    Stock: e.stock,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Compare Compensation</h1>
        <p className="mt-2 text-muted-foreground">
          Select 2–3 compensation entries to compare side-by-side.
        </p>
      </div>

      {/* Selected entries */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {entries.map((entry, idx) => (
          <Card key={entry.id} className="border-border/50 relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
              onClick={() => removeEntry(entry.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: COLORS[idx] }}
                />
                <span className="font-semibold">{entry.company.name}</span>
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">{entry.role.title}</p>
                <p>
                  <Badge variant="secondary" className="text-xs font-mono">{entry.level.name}</Badge>
                  <span className="ml-2 text-muted-foreground">{entry.location.city}</span>
                </p>
                <p className="text-primary font-semibold mt-2">
                  TC: {formatCurrency(entry.totalCompensation)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        {entries.length < 3 && (
          <Card
            className="border-dashed border-border/50 cursor-pointer hover:border-primary/30 transition-colors"
            onClick={() => setShowAdd(true)}
          >
            <CardContent className="p-5 flex flex-col items-center justify-center h-full min-h-[140px]">
              <Plus className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Add entry to compare</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add entry panel */}
      {showAdd && filters && (
        <Card className="border-border/50 mb-6">
          <CardHeader>
            <CardTitle className="text-base">Select an entry</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 mb-4">
              <Select
                value={addFilter.companyId || ""}
                onValueChange={(v) => setAddFilter((p) => ({ ...p, companyId: v as string }))}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {filters.companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={addFilter.levelId || ""}
                onValueChange={(v) => setAddFilter((p) => ({ ...p, levelId: v as string }))}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {filters.levels.map((l) => (
                    <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {availableEntries.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableEntries.slice(0, 10).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/30 hover:border-primary/30 cursor-pointer transition-colors"
                    onClick={() => addEntry(entry)}
                  >
                    <div className="text-sm">
                      <span className="font-medium">{entry.company.name}</span>
                      <span className="text-muted-foreground"> · {entry.role.title} · </span>
                      <Badge variant="secondary" className="text-xs font-mono">{entry.level.name}</Badge>
                      <span className="text-muted-foreground"> · {entry.location.city}</span>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {formatCompactCurrency(entry.totalCompensation)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Select a company or level to see entries</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Compare button */}
      {selectedIds.length >= 2 && !comparison && (
        <div className="flex gap-3 mb-8">
          <Button onClick={runComparison} disabled={isComparing} className="gap-2 bg-primary hover:bg-primary/90">
            <GitCompareArrows className="h-4 w-4" />
            Compare {selectedIds.length} Entries
          </Button>
        </div>
      )}

      {/* Comparison Results */}
      {comparison && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Comparison Results</h2>
            <Button variant="outline" size="sm" onClick={saveComparison}>
              Save Comparison
            </Button>
          </div>

          {/* Comparison Table */}
          <Card className="border-border/50 overflow-hidden">
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground">Metric</th>
                    {comparison.entries.map((e, idx) => (
                      <th key={e.id} className="text-right p-4">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[idx] }} />
                          <span className="text-sm font-semibold">{e.company}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{e.level} · {e.location}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Base Salary", key: "baseSalary" as const, highlight: comparison.highlights.highestBase },
                    { label: "Bonus", key: "bonus" as const, highlight: comparison.highlights.highestBonus },
                    { label: "Stock/RSUs", key: "stock" as const, highlight: comparison.highlights.highestStock },
                    { label: "Total Compensation", key: "totalCompensation" as const, highlight: comparison.highlights.highestTC },
                  ].map((metric) => (
                    <tr key={metric.label} className="border-b border-border/30">
                      <td className="p-4 text-sm font-medium">{metric.label}</td>
                      {comparison.entries.map((e) => {
                        const val = e[metric.key];
                        const isHighest = val === metric.highlight && val > 0;
                        return (
                          <td key={e.id} className="p-4 text-right">
                            <span
                              className={`text-sm tabular-nums font-medium ${
                                isHighest ? "text-emerald-400" : ""
                              } ${metric.key === "totalCompensation" ? "font-semibold text-base" : ""}`}
                            >
                              {formatCurrency(val)}
                              {isHighest && <Trophy className="inline ml-1.5 h-3.5 w-3.5 text-emerald-400" />}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Stacked Bar Chart */}
          {chartData && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Compensation Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.008 285)" />
                    <XAxis dataKey="name" tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }} />
                    <YAxis
                      tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                      tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "oklch(0.17 0.005 285)",
                        border: "1px solid oklch(0.28 0.008 285)",
                        borderRadius: "8px",
                        color: "oklch(0.97 0 0)",
                      }}
                      formatter={(value: any) => formatCurrency(Number(value))}
                    />
                    <Legend />
                    <Bar dataKey="Base" stackId="a" fill={COLORS[0]} />
                    <Bar dataKey="Bonus" stackId="a" fill={COLORS[1]} />
                    <Bar dataKey="Stock" stackId="a" fill={COLORS[2]} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {selectedIds.length === 0 && !showAdd && (
        <EmptyState
          icon={GitCompareArrows}
          title="Start comparing"
          description="Click the card above to add compensation entries and compare them side-by-side."
        />
      )}
    </div>
  );
}
