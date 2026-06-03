"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Building2, Search, TrendingUp, Users } from "lucide-react";
import { formatCompactCurrency } from "@/lib/utils";
import type { CompanyWithStats } from "@/types";

export function CompaniesClient() {
  const [companies, setCompanies] = useState<CompanyWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/companies")
      .then((res) => res.json())
      .then((result) => setCompanies(result.data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
        <p className="mt-2 text-muted-foreground">
          Explore compensation insights across {companies.length} top companies.
        </p>
      </div>

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search companies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-10"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((company) => (
            <Link key={company.id} href={`/companies/${company.id}`}>
              <Card className="h-full border-border/50 bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm mb-3">
                        {company.name.slice(0, 2).toUpperCase()}
                      </div>
                      <h3 className="text-lg font-semibold">{company.name}</h3>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {company.industry}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {company.description}
                  </p>

                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/30">
                    <div>
                      <p className="text-xs text-muted-foreground">Avg TC</p>
                      <p className="text-sm font-semibold text-primary">
                        {formatCompactCurrency(company.avgTotalComp)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Max TC</p>
                      <p className="text-sm font-semibold">
                        {formatCompactCurrency(company.highestTC)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Entries</p>
                      <p className="text-sm font-semibold">{company.entryCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
