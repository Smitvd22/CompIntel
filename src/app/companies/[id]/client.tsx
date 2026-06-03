"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatCard } from "@/components/ui/stat-card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Building2,
  DollarSign,
  Globe,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";
import { formatCurrency, formatCompactCurrency } from "@/lib/utils";
import type { CompanyDetail } from "@/types";

const CHART_COLORS = [
  "oklch(0.637 0.196 265)",  // primary/indigo
  "oklch(0.72 0.17 162)",    // emerald
  "oklch(0.75 0.15 55)",     // amber
  "oklch(0.68 0.19 330)",    // pink
  "oklch(0.70 0.15 30)",     // orange
];

export function CompanyDetailClient() {
  const params = useParams();
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/companies/${params.id}`)
        .then((res) => res.json())
        .then(setCompany)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <Skeleton className="h-40 rounded-xl" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">Company not found</h2>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Company Header */}
      <div className="mb-8">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg shrink-0">
            {company.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="secondary">{company.industry}</Badge>
              {company.headquarters && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Globe className="h-3 w-3" /> {company.headquarters}
                </span>
              )}
              {company.employeeCount && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Users className="h-3 w-3" /> {company.employeeCount}
                </span>
              )}
              {company.founded && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Founded {company.founded}
                </span>
              )}
            </div>
            <p className="mt-3 text-muted-foreground max-w-3xl">{company.description}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Average TC"
          value={formatCompactCurrency(company.avgTotalComp)}
          icon={TrendingUp}
        />
        <StatCard
          title="Average Base"
          value={formatCompactCurrency(company.avgBaseSalary)}
          icon={DollarSign}
        />
        <StatCard
          title="Highest TC"
          value={formatCompactCurrency(company.highestTC)}
          icon={TrendingUp}
        />
        <StatCard
          title="Data Points"
          value={String(company.entryCount)}
          icon={Users}
        />
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Level Progression Chart */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold">TC by Level</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={company.levelDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.008 285)" />
                <XAxis dataKey="level" tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }} />
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
                  formatter={(value: any) => [formatCurrency(Number(value)), "Avg TC"]}
                />
                <Bar dataKey="avgTC" fill="oklch(0.637 0.196 265)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Compensation Breakdown Pie */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Compensation Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={company.compensationBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="amount"
                  nameKey="category"
                >
                  {company.compensationBreakdown.map((_, index) => (
                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.17 0.005 285)",
                    border: "1px solid oklch(0.28 0.008 285)",
                    borderRadius: "8px",
                    color: "oklch(0.97 0 0)",
                  }}
                  formatter={(value: any) => [`${value}%`]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-2">
              {company.compensationBreakdown.map((item, idx) => (
                <div key={item.category} className="flex items-center gap-2 text-sm">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: CHART_COLORS[idx] }}
                  />
                  <span className="text-muted-foreground">{item.category}</span>
                  <span className="font-medium">{item.amount}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Distribution */}
      {company.roleDistribution.length > 0 && (
        <Card className="border-border/50 mb-8">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Average TC by Role</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={company.roleDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.008 285)" />
                <XAxis
                  type="number"
                  tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                  tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`}
                />
                <YAxis
                  dataKey="role"
                  type="category"
                  width={160}
                  tick={{ fill: "oklch(0.65 0 0)", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.17 0.005 285)",
                    border: "1px solid oklch(0.28 0.008 285)",
                    borderRadius: "8px",
                    color: "oklch(0.97 0 0)",
                  }}
                  formatter={(value: any) => [formatCurrency(Number(value)), "Avg TC"]}
                />
                <Bar dataKey="avgTC" fill="oklch(0.72 0.17 162)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Salary Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Compensation Entries ({company.compensationEntries.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="text-xs uppercase tracking-wider">Role</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Level</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Location</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-right">Base</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-right">Bonus</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-right">Stock</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-right">Total Comp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {company.compensationEntries.slice(0, 20).map((entry) => (
                  <TableRow key={entry.id} className="border-border/30">
                    <TableCell className="text-sm">{entry.role.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono text-xs">{entry.level.name}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{entry.location.city}</TableCell>
                    <TableCell className="text-right text-sm tabular-nums">{formatCurrency(entry.baseSalary)}</TableCell>
                    <TableCell className="text-right text-sm tabular-nums text-muted-foreground">{formatCurrency(entry.bonus)}</TableCell>
                    <TableCell className="text-right text-sm tabular-nums text-muted-foreground">{formatCurrency(entry.stock)}</TableCell>
                    <TableCell className="text-right text-sm tabular-nums font-semibold text-primary">
                      {formatCurrency(entry.totalCompensation)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
