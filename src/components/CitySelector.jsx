import { useApp } from "../context/AppContext";
import { ENGLAND } from "../data/cities";

export const CitySelector = ({ isMobile }) => {
  const { C, city, cities, cityId, setCityId } = useApp();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      {!isMobile && (
        <span style={{ fontSize: 11, color: C.textDim, whiteSpace: "nowrap" }}>City:</span>
      )}
      <select
        value={cityId}
        onChange={(e) => setCityId(e.target.value)}
        style={{
          padding: "5px 10px",
          background: C.surfaceAlt,
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          color: C.text,
          fontSize: 12,
          cursor: "pointer",
          outline: "none",
          maxWidth: isMobile ? 140 : 200,
        }}
        aria-label="Select city"
      >
        {cities.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {!isMobile && city && (
        <span style={{ fontSize: 10, color: C.textDim }}>
          {city.region} · {city.ons}
        </span>
      )}
    </div>
  );
};
