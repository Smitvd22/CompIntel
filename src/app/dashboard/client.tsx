"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
  BarChart3,
  Bookmark,
  Building2,
  GitCompareArrows,
  Search,
  Trash2,
  Calculator,
} from "lucide-react";
import { toast } from "sonner";

export function DashboardClient() {
  const { data: session } = useSession();
  const [savedCompanies, setSavedCompanies] = useState<Array<{
    id: string;
    company: { id: string; name: string; industry: string };
    createdAt: string;
  }>>([]);
  const [savedComparisons, setSavedComparisons] = useState<Array<{
    id: string;
    title: string;
    entryIds: string[];
    createdAt: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [companiesRes, comparisonsRes] = await Promise.all([
          fetch("/api/saved/companies"),
          fetch("/api/saved/comparisons"),
        ]);
        const companiesData = await companiesRes.json();
        const comparisonsData = await comparisonsRes.json();
        setSavedCompanies(companiesData.data || []);
        setSavedComparisons(comparisonsData.data || []);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  async function removeSavedCompany(companyId: string) {
    try {
      await fetch(`/api/saved/companies?companyId=${companyId}`, { method: "DELETE" });
      setSavedCompanies((prev) => prev.filter((sc) => sc.company.id !== companyId));
      toast.success("Company removed");
    } catch {
      toast.error("Failed to remove company");
    }
  }

  async function removeSavedComparison(id: string) {
    try {
      await fetch(`/api/saved/comparisons?id=${id}`, { method: "DELETE" });
      setSavedComparisons((prev) => prev.filter((sc) => sc.id !== id));
      toast.success("Comparison removed");
    } catch {
      toast.error("Failed to remove comparison");
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {session?.user?.name || "User"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your personalized compensation intelligence dashboard.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link href="/salaries">
          <Card className="border-border/50 hover:border-primary/30 transition-colors cursor-pointer h-full">
            <CardContent className="p-5 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Explore Salaries</p>
                <p className="text-xs text-muted-foreground">Search & filter</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/companies">
          <Card className="border-border/50 hover:border-primary/30 transition-colors cursor-pointer h-full">
            <CardContent className="p-5 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Companies</p>
                <p className="text-xs text-muted-foreground">View insights</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/compare">
          <Card className="border-border/50 hover:border-primary/30 transition-colors cursor-pointer h-full">
            <CardContent className="p-5 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <GitCompareArrows className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Compare</p>
                <p className="text-xs text-muted-foreground">Side by side</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/simulator">
          <Card className="border-border/50 hover:border-primary/30 transition-colors cursor-pointer h-full">
            <CardContent className="p-5 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Simulator</p>
                <p className="text-xs text-muted-foreground">Estimate comp</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Saved Companies */}
        <Card className="border-border/50">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-primary" />
              Saved Companies
            </CardTitle>
            <Badge variant="secondary">{savedCompanies.length}</Badge>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14" />)}
              </div>
            ) : savedCompanies.length === 0 ? (
              <EmptyState
                icon={Building2}
                title="No saved companies"
                description="Save companies from the Companies page to see them here."
                action={
                  <Link href="/companies">
                    <Button variant="outline" size="sm">Browse Companies</Button>
                  </Link>
                }
                className="border-0 p-6"
              />
            ) : (
              <div className="space-y-2">
                {savedCompanies.map((sc) => (
                  <div
                    key={sc.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/30 hover:border-border/50 transition-colors"
                  >
                    <Link href={`/companies/${sc.company.id}`} className="flex items-center gap-3 flex-1">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
                        {sc.company.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{sc.company.name}</p>
                        <p className="text-xs text-muted-foreground">{sc.company.industry}</p>
                      </div>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => removeSavedCompany(sc.company.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Saved Comparisons */}
        <Card className="border-border/50">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <GitCompareArrows className="h-4 w-4 text-primary" />
              Saved Comparisons
            </CardTitle>
            <Badge variant="secondary">{savedComparisons.length}</Badge>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14" />)}
              </div>
            ) : savedComparisons.length === 0 ? (
              <EmptyState
                icon={GitCompareArrows}
                title="No saved comparisons"
                description="Save comparisons from the Compare tool to see them here."
                action={
                  <Link href="/compare">
                    <Button variant="outline" size="sm">Compare Now</Button>
                  </Link>
                }
                className="border-0 p-6"
              />
            ) : (
              <div className="space-y-2">
                {savedComparisons.map((sc) => (
                  <div
                    key={sc.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/30 hover:border-border/50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium">{sc.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {(sc.entryIds as unknown as string[]).length} entries ·{" "}
                        {new Date(sc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => removeSavedComparison(sc.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
