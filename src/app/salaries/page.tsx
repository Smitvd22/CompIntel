import { Metadata } from "next";
import { SalaryExplorerClient } from "./client";

export const metadata: Metadata = {
  title: "Salary Explorer",
  description: "Search and filter compensation data across top tech companies in India. Filter by company, role, level, location, and salary range.",
};

export default function SalariesPage() {
  return <SalaryExplorerClient />;
}
