import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { pct } from "../format";

/** Group consecutive festival days into [start, end] ranges. */
function festivalRanges(trend) {
  const ranges = [];
  let start = null;
  trend.forEach((t, i) => {
    if (t.festival && start === null) start = t.date;
    const next = trend[i + 1];
    if (t.festival && (!next || !next.festival)) {
      ranges.push([start, t.date]);
      start = null;
    }
  });
  return ranges;
}

export default function TrendChart({ trend }) {
  if (!trend.length) return <p className="hint">No data for this selection.</p>;
  const ranges = festivalRanges(trend);

  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height={340}>
        <ComposedChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e3e6ea" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            minTickGap={50}
            tickFormatter={(d) => d.slice(0, 7)}
          />
          <YAxis yAxisId="late" tickFormatter={(v) => pct(v, 0)} tick={{ fontSize: 11 }} width={44} />
          <YAxis
            yAxisId="rain"
            orientation="right"
            tickFormatter={(v) => pct(v, 0)}
            tick={{ fontSize: 11 }}
            width={44}
          />
          <Tooltip
            formatter={(v, name) => [pct(v), name]}
            labelFormatter={(d) => d}
            contentStyle={{ fontSize: 12 }}
          />
          {ranges.map(([a, b]) => (
            <ReferenceArea key={a} yAxisId="late" x1={a} x2={b} fill="#e0a100" fillOpacity={0.25} />
          ))}
          <Area
            yAxisId="rain"
            type="monotone"
            dataKey="heavyRainShare7d"
            name="Heavy-rain share"
            stroke="#3b82c4"
            fill="#3b82c4"
            fillOpacity={0.15}
            dot={false}
          />
          <Line
            yAxisId="late"
            type="monotone"
            dataKey="lateRate7d"
            name="Late rate (7-day)"
            stroke="#d64545"
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="late"
            type="monotone"
            dataKey="firstAttemptRate7d"
            name="First-attempt success (7-day)"
            stroke="#2f9e6b"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
