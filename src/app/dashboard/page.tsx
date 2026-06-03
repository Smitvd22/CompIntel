import { Metadata } from "next";
import { DashboardClient } from "./client";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personalized CompIntel dashboard with saved companies, comparisons, and recent activity.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
