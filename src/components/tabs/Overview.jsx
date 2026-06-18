import _ from "lodash";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useApp } from "../../context/AppContext";
import { ENGLAND } from "../../data/cities";
import { HOMELESSNESS_NATIONAL, HOMELESSNESS_BY_CITY } from "../../data/homelessness";
import { Card, Metric, Badge, Hdr, ttStyle } from "../ui";

export const Overview = ({ cols }) => {
  const { C, riskColor, city, wards, households } = useApp();
  const tt = ttStyle(C);
  const highRisk = households.filter((h) => h.riskScore >= 75).length;
  const hlData = HOMELESSNESS_BY_CITY[city.id] || HOMELESSNESS_BY_CITY.sunderland;

  const topWards = _.chain(households)
    .groupBy("ward")
    .map((v, k) => ({ ward: k, avg: _.meanBy(v, "riskScore"), high: v.filter((h) => h.riskScore >= 75).length }))
    .orderBy("avg", "desc")
    .take(5)
    .value();

  const tenureCompare = [
    { name: city.name, owned: city.tenurePct.owned, socialRent: city.tenurePct.socialRent, privateRent: city.tenurePct.privateRent },
    { name: "England", owned: ENGLAND.tenurePct.owned, socialRent: ENGLAND.tenurePct.socialRent, privateRent: ENGLAND.tenurePct.privateRent },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card accent={C.teal}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 2, minWidth: 240 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 6px" }}>
              Housing Vulnerability Early Intervention — {city.name}
            </h2>
            <p style={{ fontSize: 12, color: C.textSec, lineHeight: 1.7, margin: 0 }}>
              Predictive analytics to identify households at risk of homelessness before crisis point.
              Built on <strong style={{ color: C.text }}>Census 2021</strong>,{" "}
              <strong style={{ color: C.text }}>IMD 2019</strong>, and{" "}
              <strong style={{ color: C.text }}>DLUHC</strong> statutory homelessness data.
            </p>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Badge color={C.teal}>Census 2021</Badge>
            <Badge color={C.blue}>IMD 2019</Badge>
            <Badge color={C.amber}>DLUHC Q3 2025</Badge>
            <Badge color={C.purple}>{city.region}</Badge>
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols(5, 3, 2)}, 1fr)`, gap: 10 }}>
        <Metric label="Population" value={city.population.toLocaleString()} sub="Census 2021" />
        <Metric label="Households" value={city.households.toLocaleString()} sub={city.ons} />
        <Metric label="Wards" value={city.totalWards} sub={`${city.deprivedWards} high deprivation`} color={C.amber} />
        <Metric label="Sample" value={households.length.toLocaleString()} sub="5% stratified" color={C.blue} />
        <Metric label="High Risk" value={highRisk} sub={`Score ≥75 (${((highRisk / households.length) * 100).toFixed(1)}%)`} color={C.coral} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols(4, 2, 2)}, 1fr)`, gap: 10 }}>
        <Metric label="Rough Sleepers" value={hlData.roughSleepers} sub="Annual count" color={C.coral} />
        <Metric label="Homelessness Rate" value={`${hlData.rate}/1k`} sub="Per 1,000 households" color={C.amber} />
        <Metric label="Prevention Actions" value={hlData.preventionActions.toLocaleString()} sub="Annual (DLUHC)" color={C.teal} />
        <Metric label="Median House Price" value={`£${(city.medianHousePrice / 1000).toFixed(0)}k`} sub={`Affordability ratio: ${city.affordabilityRatio}x`} color={C.blue} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols(3, 2, 1)}, 1fr)`, gap: 12 }}>
        <Card>
          <Hdr sub="Real DLUHC Q3 2025 England data">Homelessness Causes</Hdr>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={HOMELESSNESS_NATIONAL.topCauses.slice(0, 6)} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis type="number" tick={{ fill: C.textDim, fontSize: 9 }} tickFormatter={(v) => v + "%"} />
              <YAxis type="category" dataKey="cause" tick={{ fill: C.textSec, fontSize: 9 }} width={140} />
              <Tooltip contentStyle={tt} formatter={(v) => v + "%"} />
              <Bar dataKey="pct" name="% of cases" radius={[0, 3, 3, 0]}>
                {HOMELESSNESS_NATIONAL.topCauses.slice(0, 6).map((_, i) => (
                  <Cell key={i} fill={i === 0 ? C.coral : i < 3 ? C.amber : C.blue} fillOpacity={0.75} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 10, color: C.textDim, marginTop: 4 }}>Source: DLUHC Statutory Homelessness, Q3 2025</div>
        </Card>

        <Card>
          <Hdr accent={C.amber} sub="Tenure comparison: city vs England average">Tenure vs England</Hdr>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={tenureCompare}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="name" tick={{ fill: C.textDim, fontSize: 10 }} />
              <YAxis tick={{ fill: C.textDim, fontSize: 9 }} tickFormatter={(v) => v + "%"} />
              <Tooltip contentStyle={tt} formatter={(v) => v.toFixed(1) + "%"} />
              <Bar dataKey="owned" name="Owner Occupied" fill={C.teal} fillOpacity={0.7} radius={[2, 2, 0, 0]} />
              <Bar dataKey="socialRent" name="Social Rent" fill={C.amber} fillOpacity={0.7} radius={[2, 2, 0, 0]} />
              <Bar dataKey="privateRent" name="Private Rent" fill={C.coral} fillOpacity={0.7} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 10, color: C.textDim, marginTop: 4 }}>Source: ONS Census 2021 Table TS054</div>
        </Card>

        <Card>
          <Hdr accent={C.coral} sub="Top wards by average risk score">Risk Concentration</Hdr>
          {topWards.map((w, i) => (
            <div key={w.ward} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: i < 4 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: riskColor(w.avg) + "18", border: `1px solid ${riskColor(w.avg)}32`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: riskColor(w.avg), flexShrink: 0 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: C.text, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.ward}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: riskColor(w.avg), fontVariantNumeric: "tabular-nums" }}>{w.avg.toFixed(1)}</div>
                <div style={{ fontSize: 10, color: C.textDim }}>{w.high} high risk</div>
              </div>
            </div>
          ))}
          <div style={{ fontSize: 10, color: C.textDim, marginTop: 8 }}>Census 2021 + IMD 2019 composite</div>
        </Card>
      </div>

      <Card style={{ background: C.teal + "08", border: `1px solid ${C.teal}22` }}>
        <div style={{ fontSize: 12, color: C.text, lineHeight: 1.7 }}>
          <strong style={{ color: C.teal }}>Data provenance:</strong> Population and tenure from ONS Census 2021 ({city.ons}).
          Deprivation from MHCLG English Indices of Deprivation 2019. Homelessness causes from DLUHC Statutory
          Homelessness Statistics Q3 2025. EPC distributions from DLUHC Energy Performance of Buildings Register.
          All data licensed under Open Government Licence v3.0.
        </div>
      </Card>
    </div>
  );
};
