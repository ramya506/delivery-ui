import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { pct, riskColor } from "../format";

export default function Factors({ factors }) {
  const data = factors.map((f) => ({ ...f }));
  return (
    <ResponsiveContainer width="100%" height={Math.max(180, data.length * 38)}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 48, left: 8, bottom: 0 }}>
        <XAxis type="number" hide domain={[0, 1]} />
        <YAxis type="category" dataKey="label" width={96} tick={{ fontSize: 12 }} />
        <Bar dataKey="lateRate" radius={[0, 4, 4, 0]}>
          {data.map((d) => (
            <Cell key={d.label} fill={riskColor(d.lateRate)} />
          ))}
          <LabelList dataKey="lateRate" position="right" formatter={(v) => pct(v)} style={{ fontSize: 12 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
