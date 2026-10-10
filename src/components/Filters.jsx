function shift(isoDate, days) {
  const d = new Date(isoDate + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function Filters({ meta, filters, onChange }) {
  const set = (patch) => onChange({ ...filters, ...patch });

  const preset = (days) => {
    const from = days ? shift(meta.maxDate, -(days - 1)) : meta.minDate;
    set({ from: from < meta.minDate ? meta.minDate : from, to: meta.maxDate });
  };

  return (
    <div className="filters card">
      <label>
        From
        <input
          type="date"
          value={filters.from}
          min={meta.minDate}
          max={filters.to}
          onChange={(e) => e.target.value && set({ from: e.target.value })}
        />
      </label>
      <label>
        To
        <input
          type="date"
          value={filters.to}
          min={filters.from}
          max={meta.maxDate}
          onChange={(e) => e.target.value && set({ to: e.target.value })}
        />
      </label>
      <div className="presets">
        <button onClick={() => preset(30)}>30 days</button>
        <button onClick={() => preset(90)}>90 days</button>
        <button onClick={() => preset(365)}>1 year</button>
        <button onClick={() => preset(0)}>All</button>
      </div>
      <label>
        Partner
        <select value={filters.partner} onChange={(e) => set({ partner: e.target.value })}>
          <option value="">All partners</option>
          {meta.partners.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Region (district)
        <select value={filters.district} onChange={(e) => set({ district: e.target.value })}>
          <option value="">All districts</option>
          {meta.districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
