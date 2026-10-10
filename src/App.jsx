import { useEffect, useState } from "react";
import { api, API } from "./api";
import { inr, num, pct, hrs, riskColor } from "./format";
import Filters from "./components/Filters";
import Kpis from "./components/Kpis";
import RiskMap from "./components/RiskMap";
import TrendChart from "./components/TrendChart";
import Leaderboard from "./components/Leaderboard";
import Factors from "./components/Factors";
import Insights from "./components/Insights";

export default function App() {
  const [meta, setMeta] = useState(null);
  const [filters, setFilters] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1) load filter options once
  useEffect(() => {
    api("/api/filters")
      .then((m) => {
        setMeta(m);
        setFilters({ from: m.minDate, to: m.maxDate, partner: "", district: "" });
      })
      .catch(setError);
  }, []);

  // 2) reload every widget whenever a filter changes
  useEffect(() => {
    if (!filters) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([
      api("/api/summary", filters),
      api("/api/pincodes/risk", filters),
      api("/api/trend", filters),
      api("/api/partners/leaderboard", filters),
      api("/api/hubs/leaderboard", filters),
      api("/api/factors", filters),
    ])
      .then(([summary, pins, trend, partners, hubs, factors]) => {
        if (cancelled) return;
        setData({ summary, pins, trend, partners, hubs, factors });
        setError(null);
      })
      .catch((e) => !cancelled && setError(e))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [filters]);

  return (
    <div className="page">
      <header className="top">
        <div>
          <h1>Delivery Intelligence</h1>
          <p className="sub">Last-mile delay hotspots, partner performance and revenue at risk</p>
        </div>
        {loading && <span className="pill">Updating...</span>}
      </header>

      {error && (
        <div className="error">
          Cannot load data from <code>{API}</code> ({String(error.message || error)}). Is the backend running? On
          Cloud Run the first request after idle can take a few seconds - try again.
        </div>
      )}

      {meta && filters && <Filters meta={meta} filters={filters} onChange={setFilters} />}

      {data && (
        <>
          <Kpis summary={data.summary} />
          <Insights pins={data.pins} partners={data.partners} factors={data.factors} />

          <div className="grid two">
            <section className="card">
              <h2>Delay hotspots</h2>
              <p className="hint">Circle size = revenue at risk, colour = late deliveries</p>
              <RiskMap pins={data.pins} />
            </section>
            <section className="card">
              <h2>Late deliveries vs rain and festivals</h2>
              <p className="hint">Rolling 7-day late rate. Blue = heavy-rain share, amber bands = festival days</p>
              <TrendChart trend={data.trend} />
            </section>
          </div>

          <div className="grid three">
            <Leaderboard title="Partner leaderboard" rows={data.partners} />
            <Leaderboard title="Hub leaderboard" rows={data.hubs} />
            <section className="card">
              <h2>What drives delays</h2>
              <Factors factors={data.factors} />
            </section>
          </div>

          <section className="card">
            <h2>Pin code risk</h2>
            <PinTable pins={data.pins} />
          </section>
        </>
      )}
    </div>
  );
}

function PinTable({ pins }) {
  return (
    <div className="tablewrap">
      <table>
        <thead>
          <tr>
            <th>Pin code</th>
            <th>Town</th>
            <th>District</th>
            <th className="r">Orders</th>
            <th className="r">Delay probability</th>
            <th className="r">First attempt</th>
            <th className="r">Avg delay</th>
            <th className="r">Revenue at risk</th>
          </tr>
        </thead>
        <tbody>
          {pins.map((p) => (
            <tr key={p.pincode}>
              <td>{p.pincode}</td>
              <td>{p.town}</td>
              <td>{p.district}</td>
              <td className="r">{num(p.orders)}</td>
              <td className="r" style={{ color: riskColor(p.delayProbability), fontWeight: 600 }}>
                {pct(p.delayProbability)}
              </td>
              <td className="r">{pct(p.firstAttemptRate)}</td>
              <td className="r">{hrs(p.avgDelayHours)}</td>
              <td className="r">{inr(p.revenueAtRisk)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
