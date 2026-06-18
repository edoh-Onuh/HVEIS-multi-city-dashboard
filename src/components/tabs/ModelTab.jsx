import { useMemo } from "react";
import _ from "lodash";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from "recharts";
import { useApp } from "../../context/AppContext";
import { Card, Metric, Badge, Hdr, ttStyle } from "../ui";

export const ModelTab = ({ cols }) => {
  const { C, riskColor, households } = useApp();
  const tt = ttStyle(C);

  const feats = [
    { f: "Prior Homelessness", imp: 0.23 },
    { f: "Rent Arrears", imp: 0.19 },
    { f: "IMD Decile", imp: 0.16 },
    { f: "Tenure Type", imp: 0.12 },
    { f: "Mental Health Flag", imp: 0.09 },
    { f: "EPC Rating", imp: 0.07 },
    { f: "Children Count", imp: 0.06 },
    { f: "Benefits Receipt", imp: 0.05 },
    { f: "Deprivation Dims", imp: 0.03 },
  ];

  const fairness = useMemo(() => {
    const groups = [
      { label: "Social Rent", filter: (h) => h.tenure === "Social Rent" },
      { label: "Private Rent", filter: (h) => h.tenure === "Private Rent" },
      { label: "Owner Occupied", filter: (h) => h.tenure === "Owner Occupied" },
    ];
    return groups.map((g) => {
      const sub = households.filter(g.filter);
      const flagged = sub.filter((h) => h.riskScore >= 55);
      const tp = flagged.filter((h) => h.outcome).length;
      const fp = flagged.filter((h) => !h.outcome).length;
      const fn = sub.filter((h) => h.riskScore < 55 && h.outcome).length;
      return {
        group: g.label,
        n: sub.length,
        flagRate: +((flagged.length / sub.length) * 100).toFixed(1),
        precision: +((tp / Math.max(tp + fp, 1)) * 100).toFixed(1),
        recall: +((tp / Math.max(tp + fn, 1)) * 100).toFixed(1),
        fpr: +((fp / Math.max(sub.filter((h) => !h.outcome).length, 1)) * 100).toFixed(1),
      };
    });
  }, [households]);

  const di = (Math.min(...fairness.map((f) => f.flagRate)) / Math.max(...fairness.map((f) => f.flagRate))).toFixed(2);

  const riskDist = useMemo(() => {
    const bins = Array.from({ length: 20 }, (_, i) => ({ range: `${i * 5}-${i * 5 + 5}`, score: i * 5, count: 0 }));
    households.forEach((h) => { const idx = Math.min(19, Math.floor(h.riskScore / 5)); bins[idx].count++; });
    return bins;
  }, [households]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols(5, 3, 2)}, 1fr)`, gap: 10 }}>
        <Metric label="AUC-ROC" value="0.867" color={C.blue} />
        <Metric label="F1 Score" value="0.74" color={C.teal} />
        <Metric label="Precision" value="0.71" sub="@threshold=0.55" color={C.amber} />
        <Metric label="Recall" value="0.78" sub="@threshold=0.55" color={C.green} />
        <Metric label="Brier Score" value="0.098" sub="Calibration" color={C.purple} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols(2, 1, 1)}, 1fr)`, gap: 12 }}>
        <Card>
          <Hdr sub="SHAP-based global feature importance (XGBoost)">Feature Importance</Hdr>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={feats} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis type="number" tick={{ fill: C.textDim, fontSize: 9 }} tickFormatter={(v) => (v * 100) + "%"} />
              <YAxis type="category" dataKey="f" tick={{ fill: C.textSec, fontSize: 10 }} width={120} />
              <Tooltip contentStyle={tt} formatter={(v) => (v * 100).toFixed(1) + "%"} />
              <Bar dataKey="imp" radius={[0, 4, 4, 0]}>
                {feats.map((d, i) => <Cell key={i} fill={i < 3 ? C.blue : C.blue + "70"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <Hdr accent={C.coral} sub={`Risk score distribution (n=${households.length})`}>Risk Distribution</Hdr>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={riskDist}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="score" tick={{ fill: C.textDim, fontSize: 9 }} interval={3} />
              <YAxis tick={{ fill: C.textDim, fontSize: 10 }} />
              <Tooltip contentStyle={tt} labelFormatter={(v) => `Risk ${v}-${+v + 5}`} />
              <defs>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={C.teal} />
                  <stop offset="50%" stopColor={C.amber} />
                  <stop offset="100%" stopColor={C.coral} />
                </linearGradient>
              </defs>
              <Area dataKey="count" name="Households" fill="url(#riskGrad)" stroke={C.border} fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card accent={C.coral}>
        <Hdr accent={C.coral} sub="Disparate impact and equalised odds analysis by tenure group">Fairness Audit</Hdr>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols(3, 3, 1)}, 1fr)`, gap: 10, marginBottom: 12 }}>
          <Metric label="Disparate Impact" value={di} sub={+di >= 0.8 ? "Passes 4/5 rule" : "Below threshold"} color={+di >= 0.8 ? C.teal : C.coral} style={{ background: C.surfaceAlt }} />
          <Metric label="Flag Rate Gap" value={(Math.max(...fairness.map((f) => f.flagRate)) - Math.min(...fairness.map((f) => f.flagRate))).toFixed(1) + "pp"} sub="Max gap between groups" color={C.amber} style={{ background: C.surfaceAlt }} />
          <Metric label="Groups" value={fairness.length} sub="Tenure-based analysis" color={C.blue} style={{ background: C.surfaceAlt }} />
        </div>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, minWidth: 500 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                {["Group", "N", "Flag Rate", "Precision", "Recall", "FPR", "Status"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "6px 8px", color: C.textSec, fontWeight: 600, fontSize: 10, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fairness.map((r) => {
                const dev = Math.abs(r.flagRate - _.meanBy(fairness, "flagRate"));
                const st = dev < 5 ? "Pass" : dev < 10 ? "Monitor" : "Flag";
                return (
                  <tr key={r.group} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "6px 8px", color: C.text, fontWeight: 500 }}>{r.group}</td>
                    <td style={{ padding: "6px 8px", color: C.textSec, fontVariantNumeric: "tabular-nums" }}>{r.n}</td>
                    <td style={{ padding: "6px 8px", color: C.text, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{r.flagRate}%</td>
                    <td style={{ padding: "6px 8px", color: C.textSec, fontVariantNumeric: "tabular-nums" }}>{r.precision}%</td>
                    <td style={{ padding: "6px 8px", color: C.textSec, fontVariantNumeric: "tabular-nums" }}>{r.recall}%</td>
                    <td style={{ padding: "6px 8px", color: C.textSec, fontVariantNumeric: "tabular-nums" }}>{r.fpr}%</td>
                    <td style={{ padding: "6px 8px" }}>
                      <Badge color={st === "Pass" ? C.teal : st === "Monitor" ? C.amber : C.coral}>{st}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 12, padding: 12, background: C.surfaceAlt, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 11, color: C.textSec, lineHeight: 1.6 }}>
          <strong style={{ color: C.amber }}>Governance:</strong> Risk scores are recommendations only — caseworkers retain full discretion. Scores are never disclosed to households. Quarterly bias audits mandated. Fairlearn ThresholdOptimizer applied for equalised odds.
        </div>
      </Card>
    </div>
  );
};
