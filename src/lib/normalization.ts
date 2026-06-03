/**
 * Company name normalization and duplicate detection utilities
 */

const COMPANY_ALIASES: Record<string, string> = {
  "google llc": "Google",
  "google inc": "Google",
  "alphabet": "Google",
  "alphabet inc": "Google",
  "amazon.com": "Amazon",
  "amazon inc": "Amazon",
  "amazon.com inc": "Amazon",
  "microsoft corporation": "Microsoft",
  "microsoft corp": "Microsoft",
  "meta platforms": "Meta",
  "meta platforms inc": "Meta",
  "facebook": "Meta",
  "facebook inc": "Meta",
  "uber technologies": "Uber",
  "uber technologies inc": "Uber",
  "atlassian corporation": "Atlassian",
  "atlassian corp": "Atlassian",
  "salesforce inc": "Salesforce",
  "salesforce.com": "Salesforce",
  "adobe inc": "Adobe",
  "adobe systems": "Adobe",
  "apple inc": "Apple",
  "flipkart internet": "Flipkart",
  "flipkart private limited": "Flipkart",
  "infosys limited": "Infosys",
  "infosys ltd": "Infosys",
  "tata consultancy services": "TCS",
  "tata consultancy services limited": "TCS",
  "wipro limited": "Wipro",
  "wipro ltd": "Wipro",
  "paytm": "Paytm",
  "one97 communications": "Paytm",
  "razorpay software": "Razorpay",
  "razorpay software private limited": "Razorpay",
};

export function normalizeCompanyName(name: string): string {
  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();

  // Check aliases first
  if (COMPANY_ALIASES[lower]) {
    return COMPANY_ALIASES[lower];
  }

  // Remove common suffixes
  const cleaned = lower
    .replace(/\s*(inc\.?|llc\.?|ltd\.?|limited|corporation|corp\.?|co\.?|pvt\.?|private)\s*$/gi, "")
    .trim();

  if (COMPANY_ALIASES[cleaned]) {
    return COMPANY_ALIASES[cleaned];
  }

  // Title case the cleaned name
  return cleaned
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function generateNormalizedKey(name: string): string {
  return normalizeCompanyName(name).toLowerCase().replace(/\s+/g, "-");
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  reason?: string;
}

export function checkDuplicateEntry(
  existing: Array<{
    companyId: string;
    roleId: string;
    levelId: string;
    locationId: string;
    baseSalary: number;
  }>,
  newEntry: {
    companyId: string;
    roleId: string;
    levelId: string;
    locationId: string;
    baseSalary: number;
  }
): DuplicateCheckResult {
  const duplicate = existing.find(
    (e) =>
      e.companyId === newEntry.companyId &&
      e.roleId === newEntry.roleId &&
      e.levelId === newEntry.levelId &&
      e.locationId === newEntry.locationId &&
      Math.abs(e.baseSalary - newEntry.baseSalary) < 1000
  );

  if (duplicate) {
    return {
      isDuplicate: true,
      reason:
        "A compensation entry with the same company, role, level, location, and similar base salary already exists.",
    };
  }

  return { isDuplicate: false };
}

export function sanitizeMissingValues(entry: {
  baseSalary: number;
  bonus?: number | null;
  stock?: number | null;
}) {
  return {
    baseSalary: entry.baseSalary,
    bonus: entry.bonus ?? 0,
    stock: entry.stock ?? 0,
  };
}
