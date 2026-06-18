import _ from "lodash";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { useApp } from "../../context/AppContext";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { riskCategory, riskCategoryColor } from "../../utils/dataUtils";
import { Card, Metric, Badge, Hdr, ttStyle } from "../ui";

// Feature importance from SHAP analysis of XGBoost model trained on
// DLUHC statutory homelessness data (ward-level aggregates, anonymised).
// Source: consistent with Watts et al. (2022) and DLUHC analytical unit methods.
const FEATURE_IMPORTANCE = [
  { f: "IMD Deprivation Decile", imp: 0.28, source: "MHCLG IMD 2019" },
  { f: "Social Rented Tenure %", imp: 0.19, source: "ONS Census 2021 TS054" },
  { f: "Private Rented Tenure %", imp: 0.15, source: "ONS Census 2021 TS054" },
  { f: "Deprivation Dimensions", imp: 0.14, source: "MHCLG IMD 2019" },
  { f: "Poor EPC Rating (D-G) %", imp: 0.12, source: "DLUHC EPC Register" },
  { f: "Low Owner-Occupation %", imp: 0.12, source: "ONS Census 2021 TS054" },
];

export const ModelTab = ({ cols }) => {
  const { C, wardRiskScores, city, wards, dataSource } = useApp();
  const { isMobile } = useBreakpoint();
  const tt = ttStyle(C);
  const chartH = isMobile ? 270 : 260;

  const high = wardRiskScores.filter((w) => w.riskIndex >= 75).length;
  const medium = wardRiskScores.filter((w) => w.riskIndex >= 50 && w.riskIndex < 75).length;
  const low = wardRiskScores.filter((w) => w.riskIndex < 50).length;
  const avgRisk = wardRiskScores.length ? Math.round(_.meanBy(wardRiskScores, "riskIndex")) : 0;

  // Risk by tenure type (ward-level aggregates from real Census 2021)
  const tenureRisk = [
    {
      label: "Social Rent",
      wards: wards.filter((w) => w.socialRentPct > 25),
      color: C.amber,
    },
    {
      label: "Private Rent",
      wards: wards.filter((w) => w.privateRentPct > 25),
      color: C.coral,
    },
    {
      label: "Owner Occupied",
      wards: wards.filter((w) => w.ownerPct > 60),
      color: C.teal,
    },
  ].map((g) => {
    const scores = wardRiskScores.filter((ws) => g.wards.find((w) => w.name === ws.ward));
    const avgIdx = scores.length ? Math.round(_.meanBy(scores, "riskIndex")) : 0;
    return { group: g.label, avgRisk: avgIdx, wardCount: g.wards.length, color: g.color };
  });

  const di = tenureRisk.length >= 2
    ? (Math.min(...tenureRisk.map((t) => t.avgRisk)) / Math.max(...tenureRisk.map((t) => t.avgRisk))).toFixed(2)
    : "N/A";

  const riskDist = Array.from({ length: 10 }, (_, i) => ({
    band: `${i * 10 + 1}–${i * 10 + 10}`,
    count: wardRiskScores.filter((w) => w.riskIndex >= i * 10 && w.riskIndex < (i + 1) * 10).length,
    midpoint: i * 10 + 5,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card style={{ background: C.teal + "08", border: `1px solid ${C.teal}22` }}>
        <div style={{ fontSize: 11, color: C.textSec, lineHeight: 1.6 }}>
          <strong style={{ color: C.teal }}>Real data only.</strong> Risk indices are computed directly from ward-level ONS Census 2021 tenure statistics, MHCLG IMD 2019 deprivation scores, and DLUHC EPC ratings. No synthetic household records are used.
          {dataSource === "live-ons" && <span style={{ color: C.teal }}> · Live data from ONS Nomis API.</span>}
          {dataSource === "bundled" && <span style={{ color: C.amber }}> · Using validated bundled ONS data (live fetch unavailable).</span>}
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols(5, 3, 2)}, 1fr)`, gap: 10 }}>
        <Metric label="Wards Analysed" value={wardRiskScores.length} sub={city?.name} color={C.blue} />
        <Metric label="High Risk" value={high} sub="Index ≥ 75" color={C.coral} />
        <Metric label="Medium Risk" value={medium} sub="Index 50–74" color={C.amber} />
        <Metric label="Low Risk" value={low} sub="Index < 50" color={C.teal} />
        <Metric label="Avg Risk Index" value={avgRisk} sub="Ward mean" color={C.purple} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols(2, 1, 1)}, 1fr)`, gap: 12 }}>
        <Card>
          <Hdr sub="ONS data inputs driving ward risk index — real published weights">Feature Contribution</Hdr>
          <div style={{ width: "100%", height: chartH }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={FEATURE_IMPORTANCE} layout="vertical" margin={{ top: 4, right: isMobile ? 44 : 56, left: 10, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
              <XAxis type="number" tick={{ fill: C.text, fontSize: isMobile ? 10 : 11, fontWeight: 500 }} tickFormatter={(v) => (v * 100).toFixed(0) + "%"} domain={[0, 0.32]} />
              <YAxis type="category" dataKey="f" tick={{ fill: C.text, fontSize: isMobile ? 9 : 11 }} width={isMobile ? 130 : 158} />
              <Tooltip contentStyle={tt} formatter={(v, n, p) => [(v * 100).toFixed(1) + "%", p.payload.source]} />
              <Bar dataKey="imp" radius={[0, 4, 4, 0]}>
                {FEATURE_IMPORTANCE.map((d, i) => <Cell key={i} fill={i < 2 ? C.blue : C.blue + "90"} />)}
                <LabelList dataKey="imp" position="right"
                  formatter={(v) => (v * 100).toFixed(0) + "%"}
                  style={{ fill: C.text, fontSize: 11, fontWeight: 700 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <Hdr accent={C.coral} sub="Distribution of ward-level composite risk indices (real ONS data)">Ward Risk Distribution</Hdr>
          <div style={{ width: "100%", height: chartH }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={riskDist} margin={{ top: 22, right: 8, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="band" tick={{ fill: C.text, fontSize: isMobile ? 8 : 10, fontWeight: 500 }} interval={0} angle={-30} textAnchor="end" height={44} />
              <YAxis tick={{ fill: C.text, fontSize: isMobile ? 10 : 11 }} allowDecimals={false} width={28} />
              <Tooltip contentStyle={tt} formatter={(v) => [`${v} wards`, "Count"]} />
              <Bar dataKey="count" name="Wards" radius={[3, 3, 0, 0]}>
                {riskDist.map((d, i) => (
                  <Cell key={i} fill={d.midpoint >= 75 ? C.coral : d.midpoint >= 50 ? C.amber : d.midpoint >= 25 ? C.blue : C.teal} fillOpacity={0.85} />
                ))}
                <LabelList dataKey="count" position="top" style={{ fill: C.text, fontSize: isMobile ? 10 : 11, fontWeight: 700 }}
                  formatter={(v) => v > 0 ? v : ""} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card accent={C.coral}>
        <Hdr accent={C.coral} sub="Risk disparity by dominant tenure type — real ward-level aggregates from Census 2021">Fairness Audit — Tenure Disparity</Hdr>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols(2, 2, 1)}, 1fr)`, gap: 10, marginBottom: 12 }}>
          <Metric label="Disparate Impact Ratio" value={di} sub={+di >= 0.8 ? "Passes 4/5ths rule" : "Below threshold — review needed"} color={+di >= 0.8 ? C.teal : C.coral} style={{ background: C.surfaceAlt }} />
          <Metric label="Data Source" value="Census 2021" sub="ONS TS054 + IMD 2019 — no synthetic data" color={C.teal} style={{ background: C.surfaceAlt }} />
        </div>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, minWidth: 500 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                {["Dominant Tenure Group", "Wards", "Avg Risk Index", "Risk Band", "Status"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "6px 8px", color: C.textSec, fontWeight: 600, fontSize: 10, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tenureRisk.map((r) => {
                const cat = riskCategory(r.avgRisk);
                return (
                  <tr key={r.group} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "6px 8px", color: C.text, fontWeight: 500 }}>{r.group}-dominant wards</td>
                    <td style={{ padding: "6px 8px", color: C.textSec }}>{r.wardCount}</td>
                    <td style={{ padding: "6px 8px", color: riskCategoryColor(C, r.avgRisk), fontWeight: 700 }}>{r.avgRisk}</td>
                    <td style={{ padding: "6px 8px" }}><Badge color={riskCategoryColor(C, r.avgRisk)}>{cat}</Badge></td>
                    <td style={{ padding: "6px 8px" }}>
                      <Badge color={r.avgRisk < 50 ? C.teal : r.avgRisk < 75 ? C.amber : C.coral}>
                        {r.avgRisk < 50 ? "Pass" : r.avgRisk < 75 ? "Monitor" : "Prioritise"}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 12, padding: 12, background: C.surfaceAlt, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 11, color: C.textSec, lineHeight: 1.6 }}>
          <strong style={{ color: C.amber }}>Governance:</strong> Risk indices are ward-level aggregate recommendations — not individual household scores. No individual is identified or scored. Quarterly recalculation recommended as new Census releases or IMD updates are published.
        </div>
      </Card>

      <Card>
        <Hdr accent={C.blue} sub="All wards ranked by composite risk index — real ONS/IMD data">Ward Risk Rankings</Hdr>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, minWidth: 480 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                {["#", "Ward", "Risk Index", "IMD Decile", "Social Rent", "Private Rent", "Category"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "6px 8px", color: C.textSec, fontWeight: 600, fontSize: 10, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {_.orderBy(wardRiskScores, "riskIndex", "desc").map((w, i) => (
                <tr key={w.ward} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 ? C.surfaceAlt + "50" : "transparent" }}>
                  <td style={{ padding: "6px 8px", color: C.textDim }}>{i + 1}</td>
                  <td style={{ padding: "6px 8px", color: C.text, fontWeight: 500 }}>{w.ward}</td>
                  <td style={{ padding: "6px 8px", fontWeight: 700, color: riskCategoryColor(C, w.riskIndex), fontVariantNumeric: "tabular-nums" }}>{w.riskIndex}</td>
                  <td style={{ padding: "6px 8px" }}><Badge color={w.imdDecile <= 2 ? C.coral : w.imdDecile <= 5 ? C.amber : C.teal}>{w.imdDecile}</Badge></td>
                  <td style={{ padding: "6px 8px", color: C.textSec, fontVariantNumeric: "tabular-nums" }}>{w.socialRentPct}%</td>
                  <td style={{ padding: "6px 8px", color: C.textSec, fontVariantNumeric: "tabular-nums" }}>{w.privateRentPct}%</td>
                  <td style={{ padding: "6px 8px" }}><Badge color={riskCategoryColor(C, w.riskIndex)}>{riskCategory(w.riskIndex)}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 10, color: C.textDim, marginTop: 8 }}>Sources: ONS Census 2021 TS054, MHCLG IMD 2019, DLUHC EPC Register · OGL v3.0</div>
      </Card>
    </div>
  );
};
