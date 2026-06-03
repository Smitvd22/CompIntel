import { z } from "zod";

// ---- Compensation Filters ----
export const compensationFilterSchema = z.object({
  companyId: z.union([z.string(), z.array(z.string())]).optional(),
  roleId: z.union([z.string(), z.array(z.string())]).optional(),
  levelId: z.union([z.string(), z.array(z.string())]).optional(),
  locationId: z.union([z.string(), z.array(z.string())]).optional(),
  minTC: z.coerce.number().min(0).optional(),
  maxTC: z.coerce.number().min(0).optional(),
  sortBy: z.enum(["baseSalary", "bonus", "stock", "totalCompensation", "createdAt"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});

export type CompensationFilter = z.infer<typeof compensationFilterSchema>;

// ---- Compensation Entry Creation ----
export const createCompensationSchema = z.object({
  companyId: z.string().min(1, "Company is required"),
  roleId: z.string().min(1, "Role is required"),
  levelId: z.string().min(1, "Level is required"),
  locationId: z.string().min(1, "Location is required"),
  baseSalary: z.number().min(0, "Base salary must be positive"),
  bonus: z.number().min(0).optional().default(0),
  stock: z.number().min(0).optional().default(0),
  yearsOfExp: z.number().min(0).max(50).optional(),
});

export type CreateCompensation = z.infer<typeof createCompensationSchema>;

// ---- Auth Schemas ----
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

// ---- Comparison Schema ----
export const compareSchema = z.object({
  entryIds: z.array(z.string()).min(2, "Select at least 2 entries").max(3, "Maximum 3 entries"),
});

// ---- Simulator Schema ----
export const simulatorSchema = z.object({
  companyId: z.string().min(1, "Company is required"),
  levelId: z.string().min(1, "Level is required"),
  locationId: z.string().min(1, "Location is required"),
  roleId: z.string().optional(),
});

export type SimulatorInput = z.infer<typeof simulatorSchema>;

// ---- Saved Comparison Schema ----
export const saveComparisonSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  entryIds: z.array(z.string()).min(2).max(3),
});

// ---- Saved Company Schema ----
export const saveCompanySchema = z.object({
  companyId: z.string().min(1, "Company ID is required"),
});
