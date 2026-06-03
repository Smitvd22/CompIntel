import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Calculator,
  GitCompareArrows,
  Layers,
  Search,
  Shield,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Search,
    title: "Salary Explorer",
    description:
      "Search and filter compensation data across 15+ companies, 10 roles, 6 levels, and 6 cities. Find exactly what you're looking for.",
  },
  {
    icon: Building2,
    title: "Company Insights",
    description:
      "Deep-dive into company compensation with distribution charts, level progressions, and role-based breakdowns.",
  },
  {
    icon: GitCompareArrows,
    title: "Compare Offers",
    description:
      "Compare up to 3 compensation packages side-by-side. See base, bonus, stock, and total comp with highlighted winners.",
  },
  {
    icon: Calculator,
    title: "Comp Simulator",
    description:
      "Estimate your expected compensation for any company, level, and location combination using real data points.",
  },
  {
    icon: Layers,
    title: "Levels, Not Titles",
    description:
      "Normalize across companies using levels. An L4 at Google vs L4 at Amazon — see the real difference in pay.",
  },
  {
    icon: Shield,
    title: "Data Quality",
    description:
      "Company normalization, duplicate detection, and missing value handling ensure the data you see is reliable.",
  },
];

const stats = [
  { label: "Companies", value: "15+" },
  { label: "Data Points", value: "400+" },
  { label: "Roles", value: "10" },
  { label: "Cities", value: "6" },
];

export default function LandingPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>India&apos;s Compensation Intelligence Platform</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Know your worth.
              <br />
              <span className="text-primary">Negotiate with data.</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Explore real compensation data across India&apos;s top tech companies.
              Compare offers, simulate packages, and understand how levels
              impact your total compensation.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/salaries">
                <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-base px-8 h-12">
                  Explore Salaries
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/simulator">
                <Button variant="outline" size="lg" className="gap-2 text-base px-8 h-12">
                  <Calculator className="h-4 w-4" />
                  Try Simulator
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-20 mx-auto max-w-2xl">
            <div className="grid grid-cols-4 gap-4 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Philosophy */}
      <section className="border-y border-border/50 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 p-3 mb-4">
              <Layers className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Levels matter more than job titles
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              A &ldquo;Senior Software Engineer&rdquo; at one company might be an L3 while at another it&apos;s
              an L5. CompIntel normalizes compensation data by levels so you can make
              fair, apples-to-apples comparisons across companies.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need for
              <br />
              <span className="text-primary">compensation intelligence</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Tools and data to help you understand, compare, and negotiate your compensation.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5 transition-colors group-hover:bg-primary/15">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/50 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to understand your compensation?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Create a free account to save companies, comparisons, and build your personalized
              compensation dashboard.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 px-8 h-12">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/companies">
                <Button variant="outline" size="lg" className="gap-2 px-8 h-12">
                  <Building2 className="h-4 w-4" />
                  Browse Companies
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
