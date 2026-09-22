import type { PriceDetail } from "@/types/content";

function asAmount(value: string): number {
  if (value.includes("–")) return 0;
  const factors = value.split("×").map((part) => Number(part.replace(/[^0-9]/g, ""))).filter(Number.isFinite);
  if (factors.length === 0) return 0;
  return factors.reduce((total, factor) => total * factor, 1);
}

export function calculateTrainingCost(details: PriceDetail[] | undefined, fallback: string): number {
  if (!details?.length) return asAmount(fallback);
  return details
    .filter((detail) => !/pótóra/i.test(detail.label))
    .reduce((total, detail) => total + asAmount(/elmélet/i.test(detail.label) ? "40 000 Ft" : detail.value), 0);
}

export function formatForints(amount: number): string {
  return `${new Intl.NumberFormat("hu-HU").format(amount)} Ft`;
}

export function displayedDetailValue(detail: PriceDetail): string {
  return /elmélet/i.test(detail.label) && detail.value !== "–" ? "40 000 Ft" : detail.value;
}
