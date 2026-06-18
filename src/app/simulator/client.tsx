"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Cell,
} from "recharts";
import { Calculator, Gauge, Info, Sparkles, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { formatCurrency, formatCompactCurrency } from "@/lib/utils";
import type { FilterOptions, SimulatorResult } from "@/types";
import { toast } from "sonner";

const COLORS = ["oklch(0.637 0.196 265)", "oklch(0.72 0.17 162)", "oklch(0.75 0.15 55)"];

export function SimulatorClient() {
  const [filters, setFilters] = useState<FilterOptions | null>(null);
  const [form, setForm] = useState({
    companyId: "",
    levelId: "",
    locationId: "",
    roleId: "",
  });
  const [result, setResult] = useState<SimulatorResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    fetch("/api/filters").then((r) => r.json()).then(setFilters).catch(console.error);
  }, []);

  async function simulate() {
    if (!form.companyId || !form.levelId || !form.locationId) {
      toast.error("Please select company, level, and location");
      return;
    }

    setIsSimulating(true);
    try {
      const res = await fetch("/api/compensation/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Simulation failed");
        return;
      }
      setResult(data);
    } catch {
      toast.error("Failed to run simulation");
    } finally {
      setIsSimulating(false);
    }
  }

  const breakdownData = result
    ? [
        { name: "Base Salary", value: result.estimatedBase },
        { name: "Bonus", value: result.estimatedBonus },
        { name: "Equity/RSUs", value: result.estimatedStock },
      ]
    : [];

  const percentileData = result
    ? [
        { name: "25th", value: result.percentile.p25 },
        { name: "50th (Median)", value: result.percentile.p50 },
        { name: "75th", value: result.percentile.p75 },
      ]
    : [];

  const confidenceColor =
    result?.confidence === "high"
      ? "text-emerald-400"
      : result?.confidence === "medium"
        ? "text-amber-400"
        : "text-red-400";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Compensation Simulator</h1>
        <p className="mt-2 text-muted-foreground">
          Estimate your expected compensation using data from real entries.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <Card className="border-border/50 sticky top-24">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Calculator className="h-4 w-4 text-primary" />
                Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filters && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company *</label>
                    <Select
                      value={form.companyId}
                      onValueChange={(v) => setForm((p) => ({ ...p, companyId: v as string }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company">
                          {filters.companies.find((c) => c.id === form.companyId)?.name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {filters.companies.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Level *</label>
                    <Select
                      value={form.levelId}
                      onValueChange={(v) => setForm((p) => ({ ...p, levelId: v as string }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level">
                          {filters.levels.find((l) => l.id === form.levelId)?.name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {filters.levels.map((l) => (
                          <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location *</label>
                    <Select
                      value={form.locationId}
                      onValueChange={(v) => setForm((p) => ({ ...p, locationId: v as string }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location">
                          {filters.locations.find((l) => l.id === form.locationId)?.city}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {filters.locations.map((l) => (
                          <SelectItem key={l.id} value={l.id}>{l.city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role (optional)</label>
                    <Select
                      value={form.roleId || "any"}
                      onValueChange={(v) => setForm((p) => ({ ...p, roleId: v === "any" ? "" : v as string }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any role">
                          {form.roleId && form.roleId !== "any" ? filters.roles.find((r) => r.id === form.roleId)?.title : "Any role"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Role</SelectItem>
                        {filters.roles.map((r) => (
                          <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={simulate}
                    disabled={isSimulating}
                    className="w-full gap-2 bg-primary hover:bg-primary/90 mt-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    {isSimulating ? "Simulating..." : "Simulate"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {result ? (
            <div className="space-y-6">
              {/* Confidence & Data Points */}
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="gap-1.5">
                  <Gauge className="h-3 w-3" />
                  <span className={confidenceColor}>
                    {result.confidence.charAt(0).toUpperCase() + result.confidence.slice(1)} confidence
                  </span>
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Based on {result.dataPoints} data point{result.dataPoints !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  title="Estimated TC"
                  value={formatCompactCurrency(result.estimatedTC)}
                  icon={TrendingUp}
                  className="border-primary/30"
                />
                <StatCard
                  title="Base Salary"
                  value={formatCompactCurrency(result.estimatedBase)}
                />
                <StatCard
                  title="Bonus"
                  value={formatCompactCurrency(result.estimatedBonus)}
                />
                <StatCard
                  title="Equity/RSUs"
                  value={formatCompactCurrency(result.estimatedStock)}
                />
              </div>

              {/* Breakdown Chart */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Compensation Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={breakdownData}>
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
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {breakdownData.map((_, index) => (
                          <Cell key={index} fill={COLORS[index]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Percentile Distribution */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">TC Percentile Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {percentileData.map((p, idx) => (
                      <div key={p.name} className="text-center p-4 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground mb-1">{p.name} percentile</p>
                        <p className="text-lg font-semibold">{formatCompactCurrency(p.value)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {result.confidence === "low" && (
                <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
                  <Info className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-400">Limited data</p>
                    <p className="text-sm text-muted-foreground">
                      This estimate is based on limited data points. The actual compensation may vary significantly.
                      Try a different location or remove the role filter for more data points.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div className="rounded-full bg-primary/10 p-6 mb-6">
                <Calculator className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Simulate Your Compensation</h2>
              <p className="text-muted-foreground max-w-md">
                Select a company, level, and location to see estimated compensation
                based on real data from our database.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
