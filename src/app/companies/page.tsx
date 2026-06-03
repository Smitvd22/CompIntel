import { Metadata } from "next";
import { CompaniesClient } from "./client";

export const metadata: Metadata = {
  title: "Companies",
  description: "Explore compensation data across top tech companies in India. See average salaries, total compensation, and company details.",
};

export default function CompaniesPage() {
  return <CompaniesClient />;
}
