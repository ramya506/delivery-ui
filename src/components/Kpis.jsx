import { inr, num, pct, hrs } from "../format";

export default function Kpis({ summary: s }) {
  const items = [
    { label: "Orders", value: num(s.orders) },
    { label: "Late deliveries", value: pct(s.lateRate), tone: s.lateRate > 0.3 ? "bad" : "" },
    { label: "First-attempt success", value: pct(s.firstAttemptRate) },
    { label: "Avg delay (all orders)", value: hrs(s.avgDelayHours) },
    { label: "Revenue at risk", value: inr(s.revenueAtRisk), tone: "bad", note: `of ${inr(s.orderValue)} order value` },
    { label: "Re-attempt cost", value: inr(s.reattemptCost), note: "extra delivery attempts" },
  ];
  return (
    <div className="kpis">
      {items.map((k) => (
        <div className="kpi card" key={k.label}>
          <span className="kpi-label">{k.label}</span>
          <span className={`kpi-value ${k.tone || ""}`}>{k.value}</span>
          {k.note && <span className="kpi-note">{k.note}</span>}
        </div>
      ))}
    </div>
  );
}
