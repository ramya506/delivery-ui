import { inr, num, pct, riskColor } from "../format";

/** Rows arrive sorted best (lowest late rate) first. */
export default function Leaderboard({ title, rows }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      <div className="tablewrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th className="r">Orders</th>
              <th className="r">Late</th>
              <th className="r">Revenue at risk</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.label}>
                <td>{i + 1}</td>
                <td>{r.label}</td>
                <td className="r">{num(r.orders)}</td>
                <td className="r" style={{ color: riskColor(r.lateRate), fontWeight: 600 }}>
                  {pct(r.lateRate)}
                </td>
                <td className="r">{inr(r.revenueAtRisk)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="hint">Ranked best to worst by late-delivery rate.</p>
    </section>
  );
}
