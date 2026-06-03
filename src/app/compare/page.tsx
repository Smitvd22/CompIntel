import { Metadata } from "next";
import { CompareClient } from "./client";

export const metadata: Metadata = {
  title: "Compare Compensation",
  description: "Compare up to 3 compensation packages side-by-side. See base, bonus, stock, and total compensation with highlighted winners.",
};

export default function ComparePage() {
  return <CompareClient />;
}
