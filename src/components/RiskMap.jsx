import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { inr, num, pct, hrs, riskColor } from "../format";

export default function RiskMap({ pins }) {
  const maxRar = Math.max(1, ...pins.map((p) => p.revenueAtRisk));

  return (
    <>
      <MapContainer center={[16.9, 81.9]} zoom={8} scrollWheelZoom={false} className="map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pins.map((p) => {
          const color = riskColor(p.delayProbability);
          return (
            <CircleMarker
              key={p.pincode}
              center={[p.lat, p.lon]}
              radius={7 + 22 * Math.sqrt(p.revenueAtRisk / maxRar)}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.45, weight: 2 }}
            >
              <Popup>
                <strong>
                  {p.town} ({p.pincode})
                </strong>
                <br />
                {p.district}
                <br />
                Orders: {num(p.orders)}
                <br />
                Delay probability: {pct(p.delayProbability)}
                <br />
                First attempt: {pct(p.firstAttemptRate)}
                <br />
                Avg delay: {hrs(p.avgDelayHours)}
                <br />
                Revenue at risk: {inr(p.revenueAtRisk)}
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      <div className="legend">
        <span><i style={{ background: "#2f9e6b" }} /> under 25% late</span>
        <span><i style={{ background: "#e0a100" }} /> 25-40%</span>
        <span><i style={{ background: "#d64545" }} /> over 40%</span>
      </div>
    </>
  );
}
