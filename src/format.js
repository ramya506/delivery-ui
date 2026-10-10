const inrCompact = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 2,
});

export const inr = (n) => inrCompact.format(n || 0);
export const pct = (n, digits = 1) => `${((n || 0) * 100).toFixed(digits)}%`;
export const num = (n) => new Intl.NumberFormat("en-IN").format(n || 0);
export const hrs = (n) => `${(n || 0).toFixed(1)} h`;

/** Colour for a late-rate: green / amber / red. */
export function riskColor(rate) {
  if (rate < 0.25) return "#2f9e6b";
  if (rate < 0.4) return "#e0a100";
  return "#d64545";
}
