export interface CompensationEntryWithRelations {
  id: string;
  companyId: string;
  roleId: string;
  levelId: string;
  locationId: string;
  baseSalary: number;
  bonus: number;
  stock: number;
  yearsOfExp: number | null;
  verified: boolean;
  createdAt: string;
  totalCompensation: number;
  company: {
    id: string;
    name: string;
    industry: string;
    logoUrl: string | null;
  };
  role: {
    id: string;
    title: string;
  };
  level: {
    id: string;
    name: string;
    rank: number;
  };
  location: {
    id: string;
    city: string;
    state: string | null;
    country: string;
  };
}

export interface CompanyWithStats {
  id: string;
  name: string;
  normalizedName: string;
  industry: string;
  description: string;
  logoUrl: string | null;
  website: string | null;
  founded: number | null;
  headquarters: string | null;
  employeeCount: string | null;
  avgBaseSalary: number;
  avgTotalComp: number;
  highestTC: number;
  entryCount: number;
}

export interface CompanyDetail extends CompanyWithStats {
  compensationEntries: CompensationEntryWithRelations[];
  levelDistribution: { level: string; avgTC: number; count: number }[];
  roleDistribution: { role: string; avgTC: number; count: number }[];
  compensationBreakdown: { category: string; amount: number }[];
}

export interface FilterOptions {
  companies: { id: string; name: string }[];
  roles: { id: string; title: string }[];
  levels: { id: string; name: string; rank: number }[];
  locations: { id: string; city: string; state: string | null; country: string }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SimulatorResult {
  estimatedBase: number;
  estimatedBonus: number;
  estimatedStock: number;
  estimatedTC: number;
  dataPoints: number;
  confidence: "high" | "medium" | "low";
  percentile: {
    p25: number;
    p50: number;
    p75: number;
  };
}

export interface ComparisonEntry {
  id: string;
  company: string;
  role: string;
  level: string;
  location: string;
  baseSalary: number;
  bonus: number;
  stock: number;
  totalCompensation: number;
}

export interface DashboardData {
  savedCompanies: Array<{
    id: string;
    company: {
      id: string;
      name: string;
      industry: string;
      logoUrl: string | null;
    };
    createdAt: string;
  }>;
  savedComparisons: Array<{
    id: string;
    title: string;
    entryIds: string[];
    createdAt: string;
  }>;
}

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}
