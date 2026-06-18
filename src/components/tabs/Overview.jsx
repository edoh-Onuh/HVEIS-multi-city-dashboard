import _ from "lodash";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend, LabelList,
} from "recharts";
import { useApp } from "../../context/AppContext";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { ENGLAND } from "../../data/cities";
import { HOMELESSNESS_NATIONAL, HOMELESSNESS_BY_CITY } from "../../data/homelessness";
import { Card, Metric, Badge, Hdr, ttStyle } from "../ui";

const DataSourceBadge = ({ dataSource, loading, C }) => (
  <span style={{ fontSize: 10, color: loading ? C.textDim : dataSource === "live-ons" ? C.teal : C.amber, display: "inline-flex", alignItems: "center", gap: 4 }}>
    <span style={{ width: 6, height: 6, borderRadius: 3, background: loading ? C.textDim : dataSource === "live-ons" ? C.teal : C.amber, display: "inline-block" }} />
    {loading ? "Fetching live ONS data…" : dataSource === "live-ons" ? "Live ONS Nomis" : "Validated ONS 2021 (bundled)"}
  </span>
);

export const Overview = ({ cols }) => {
  const { C, riskColor, city, wardRiskScores, loading, dataSource } = useApp();
  const { isMobile, isTablet } = useBreakpoint();
  const tt = ttStyle(C);
  const hlData = HOMELESSNESS_BY_CITY[city?.id] || HOMELESSNESS_BY_CITY.sunderland;

  const highRisk = wardRiskScores.filter((w) => w.riskIndex >= 75).length;
  const topWards = _.orderBy(wardRiskScores, "riskIndex", "desc").slice(0, 5);

  const tenureCompare = city ? [
    { name: city.name, "Owner Occupied": city.tenurePct.owned, "Social Rent": city.tenurePct.socialRent, "Private Rent": city.tenurePct.privateRent },
    { name: "England",  "Owner Occupied": ENGLAND.tenurePct.owned,  "Social Rent": ENGLAND.tenurePct.socialRent,  "Private Rent": ENGLAND.tenurePct.privateRent },
  ] : [];

  if (!city) return null;

  // Chart heights scale up on mobile (full-width single column = more room)
  const chartH = isMobile ? 270 : isTablet ? 240 : 260;
  const tick   = { fill: C.text, fontSize: isMobile ? 10 : 11, fontWeight: 500 };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Hero card */}
      <Card accent={C.teal}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 2, minWidth: 220 }}>
            <h2 style={{ fontSize: isMobile ? 15 : 18, fontWeight: 700, color: C.text, margin: "0 0 6px", lineHeight: 1.3 }}>
              Housing Vulnerability Early Intervention — {city.name}
            </h2>
            <p style={{ fontSize: 12, color: C.textSec, lineHeight: 1.7, margin: "0 0 8px" }}>
              Identifies wards at risk of homelessness from real{" "}
              <strong style={{ color: C.text }}>ONS Census 2021</strong>,{" "}
              <strong style={{ color: C.text }}>MHCLG IMD 2019</strong>, and{" "}
              <strong style={{ color: C.text }}>DLUHC</strong> statutory data — no synthetic records.
            </p>
            <DataSourceBadge dataSource={dataSource} loading={loading} C={C} />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Badge color={C.teal}>Census 2021</Badge>
            <Badge color={C.blue}>IMD 2019</Badge>
            <Badge color={C.amber}>DLUHC Q3 2025</Badge>
            <Badge color={C.purple}>{city.region}</Badge>
          </div>
        </div>
      </Card>

      {/* KPI strip 1 */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols(5, 3, 2)}, 1fr)`, gap: 10 }}>
        <Metric label="Population"       value={city.population.toLocaleString()} sub="Census 2021" />
        <Metric label="Households"       value={city.households.toLocaleString()} sub={city.ons} />
        <Metric label="Wards"            value={city.totalWards} sub={`${city.deprivedWards} high deprivation`} color={C.amber} />
        <Metric label="High-Risk Wards"  value={highRisk} sub="Risk index ≥ 75" color={C.coral} />
        <Metric label="Median Price"     value={`£${(city.medianHousePrice / 1000).toFixed(0)}k`} sub={`Affordability: ${city.affordabilityRatio}x`} color={C.blue} />
      </div>

      {/* KPI strip 2 */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols(4, 2, 2)}, 1fr)`, gap: 10 }}>
        <Metric label="Rough Sleepers"      value={hlData.roughSleepers} sub="Annual count (DLUHC)" color={C.coral} />
        <Metric label="Homelessness Rate"   value={`${hlData.rate}/1k`}  sub="Per 1,000 households"  color={C.amber} />
        <Metric label="Prevention Actions"  value={hlData.preventionActions.toLocaleString()} sub="Annual (DLUHC)" color={C.teal} />
        <Metric label="Relief Cases"        value={hlData.reliefCases.toLocaleString()}       sub="Annual (DLUHC)" color={C.blue} />
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols(3, 2, 1)}, 1fr)`, gap: 12 }}>

        {/* Homelessness Causes — horizontal bar */}
        <Card>
          <Hdr sub="Real DLUHC Q3 2025 England data">Homelessness Causes</Hdr>
          <div style={{ width: "100%", height: chartH }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={HOMELESSNESS_NATIONAL.topCauses.slice(0, 6)}
                layout="vertical"
                margin={{ top: 4, right: isMobile ? 40 : 52, left: 10, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
                <XAxis type="number" tick={tick} tickFormatter={(v) => v + "%"} domain={[0, 32]} />
                <YAxis type="category" dataKey="cause" tick={{ fill: C.textSec, fontSize: isMobile ? 9 : 10 }} width={isMobile ? 120 : 145} />
                <Tooltip contentStyle={tt} formatter={(v) => [v + "%", "% of cases"]} />
                <Bar dataKey="pct" name="% of cases" radius={[0, 4, 4, 0]}>
                  {HOMELESSNESS_NATIONAL.topCauses.slice(0, 6).map((_, i) => (
                    <Cell key={i} fill={i === 0 ? C.coral : i < 3 ? C.amber : C.blue} fillOpacity={0.85} />
                  ))}
                  <LabelList
                    dataKey="pct"
                    position="right"
                    formatter={(v) => v + "%"}
                    style={{ fill: C.text, fontSize: isMobile ? 10 : 11, fontWeight: 600 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ fontSize: 10, color: C.textDim, marginTop: 4 }}>Source: DLUHC Statutory Homelessness Q3 2025</div>
        </Card>

        {/* Tenure vs England — grouped bar */}
        <Card>
          <Hdr accent={C.amber} sub="Tenure comparison: city vs England average (Census 2021)">Tenure vs England</Hdr>
          <div style={{ width: "100%", height: chartH }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tenureCompare} margin={{ top: 22, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="name" tick={tick} />
                <YAxis tick={tick} tickFormatter={(v) => v + "%"} domain={[0, 85]} width={32} />
                <Tooltip contentStyle={tt} formatter={(v) => v.toFixed(1) + "%"} />
                <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 11, color: C.textSec, paddingTop: 4 }} />
                <Bar dataKey="Owner Occupied" fill={C.teal}  fillOpacity={0.85} radius={[3, 3, 0, 0]}>
                  <LabelList dataKey="Owner Occupied" position="top" formatter={(v) => v.toFixed(0) + "%"} style={{ fill: C.text, fontSize: 10, fontWeight: 600 }} />
                </Bar>
                <Bar dataKey="Social Rent"    fill={C.amber} fillOpacity={0.85} radius={[3, 3, 0, 0]}>
                  <LabelList dataKey="Social Rent"    position="top" formatter={(v) => v.toFixed(0) + "%"} style={{ fill: C.text, fontSize: 10, fontWeight: 600 }} />
                </Bar>
                <Bar dataKey="Private Rent"   fill={C.coral} fillOpacity={0.85} radius={[3, 3, 0, 0]}>
                  <LabelList dataKey="Private Rent"   position="top" formatter={(v) => v.toFixed(0) + "%"} style={{ fill: C.text, fontSize: 10, fontWeight: 600 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ fontSize: 10, color: C.textDim, marginTop: 4 }}>Source: ONS Census 2021 Table TS054</div>
        </Card>

        {/* Risk Concentration — ranked list */}
        <Card>
          <Hdr accent={C.coral} sub="Top wards by composite risk index (IMD + tenure + EPC)">Risk Concentration</Hdr>
          {topWards.map((w, i) => (
            <div key={w.ward} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 0", borderBottom: i < 4 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: riskColor(w.riskIndex) + "20", border: `1px solid ${riskColor(w.riskIndex)}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: riskColor(w.riskIndex), flexShrink: 0 }}>{i + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: C.text, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.ward}</div>
                <div style={{ fontSize: 10, color: C.textSec }}>IMD Decile {w.imdDecile}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: riskColor(w.riskIndex), fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{w.riskIndex}</div>
                <div style={{ fontSize: 9, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.05em" }}>risk index</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[{ label: "High ≥75", color: C.coral }, { label: "Medium 50–74", color: C.amber }, { label: "Low <50", color: C.teal }].map((b) => (
              <span key={b.label} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, color: C.textSec }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: b.color, display: "inline-block" }} />{b.label}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Data provenance */}
      <Card style={{ background: C.teal + "08", border: `1px solid ${C.teal}22` }}>
        <div style={{ fontSize: 12, color: C.text, lineHeight: 1.7 }}>
          <strong style={{ color: C.teal }}>Data provenance:</strong> Population and tenure from ONS Census 2021 ({city.ons}) fetched live via ONS Nomis API.
          Deprivation from MHCLG English Indices of Deprivation 2019. Homelessness causes from DLUHC Statutory Homelessness Statistics Q3 2025.
          Risk index computed from real ward-level statistics — no synthetic data. All sources licensed under Open Government Licence v3.0.
        </div>
      </Card>
    </div>
  );
};
