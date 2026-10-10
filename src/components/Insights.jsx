import { inr, pct } from "../format";

/** Turns the numbers into plain-language recommendations. */
export default function Insights({ pins, partners, factors }) {
  const items = [];

  const worstPin = pins[0];
  if (worstPin && worstPin.delayProbability > 0.3) {
    items.push({
      title: `Fix ${worstPin.town} (${worstPin.pincode})`,
      body: `${pct(worstPin.delayProbability)} of orders are late, putting ${inr(
        worstPin.revenueAtRisk
      )} at risk. Consider a micro-hub or a second daily route for this area.`,
    });
  }

  const byLabel = Object.fromEntries(factors.map((f) => [f.label, f]));
  const rain = byLabel["Heavy Rain"];
  const clear = byLabel["Clear"];
  if (rain && clear) {
    items.push({
      title: "Plan for monsoon",
      body: `Heavy rain lifts late deliveries from ${pct(clear.lateRate)} to ${pct(
        rain.lateRate
      )}. Pre-position stock and add buffer days on flood-prone routes from June to November.`,
    });
  }

  const fest = byLabel["Festival days"];
  const normal = byLabel["Normal days"];
  if (fest && normal && fest.lateRate > normal.lateRate) {
    items.push({
      title: "Staff up for festivals",
      body: `Festival days run ${pct(fest.lateRate)} late vs ${pct(
        normal.lateRate
      )} normally. Add seasonal riders around Sankranti and Diwali.`,
    });
  }

  if (partners.length > 1) {
    const best = partners[0];
    const worst = partners[partners.length - 1];
    items.push({
      title: `Review ${worst.label}`,
      body: `${worst.label} is ${pct(worst.lateRate)} late against ${pct(best.lateRate)} for ${
        best.label
      }. Shift volume on the worst routes to the better partner.`,
    });
  }

  if (!items.length) return null;
  return (
    <section className="insights">
      {items.map((i) => (
        <div className="insight card" key={i.title}>
          <strong>{i.title}</strong>
          <p>{i.body}</p>
        </div>
      ))}
    </section>
  );
}
