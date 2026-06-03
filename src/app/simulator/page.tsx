import { Metadata } from "next";
import { SimulatorClient } from "./client";

export const metadata: Metadata = {
  title: "Compensation Simulator",
  description: "Estimate your expected compensation at any company, level, and location using real data-driven insights.",
};

export default function SimulatorPage() {
  return <SimulatorClient />;
}
