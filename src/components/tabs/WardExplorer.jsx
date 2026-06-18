import { useState, useMemo } from "react";
import _ from "lodash";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, ScatterChart, Scatter, ZAxis } from "recharts";
import { useApp } from "../../context/AppContext";
import { ENGLAND } from "../../data/cities";
import { Card, Metric, Badge, Hdr, Btn, ttStyle } from "../ui";

export const WardExplorer = ({ cols }) => {
  const { C, city, wards, riskColor } = useApp();
  const [sort, setSort] = useState("imdDecile");
  const [selected, setSelected] = useState(null);
  const tt = ttStyle(C);

  const sorted = useMemo(() => [...wards].sort((a, b) => sort === "imdDecile" ? a.imdDecile - b.imdDecile : b[sort] - a[sort]), [wards, sort]);

  const tenureAgg = useMemo(() => [
    { name: "Owner Occupied", value: city.tenurePct.owned, color: C.teal },
    { name: "Social Rent", value: city.tenurePct.socialRent, color: C.amber },
    { name: "Private Rent", value: city.tenurePct.privateRent, color: C.coral },
  ], [city, C]);

  const selectedWard = wards.find((w) => w.name === selected);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols(4, 2, 2)}, 1fr)`, gap: 10 }}>
        <Metric label="Social Rent" value={city.tenurePct.socialRent + "%"} sub={`vs ${ENGLAND.tenurePct.socialRent}% England`} color={C.amber} />
        <Metric label="Private Rent" value={city.tenurePct.privateRent + "%"} sub={`vs ${ENGLAND.tenurePct.privateRent}% England`} color={C.coral} />
        <Metric label="Healthy Life Exp." value={city.healthyLifeExp + "y"} sub={`vs ${ENGLAND.healthyLifeExp}y England`} color={city.healthyLifeExp < ENGLAND.healthyLifeExp ? C.coral : C.teal} />
        <Metric label="Male Life Exp." value={city.lifeExpMale + "y"} sub={`vs ${ENGLAND.lifeExpMale}y England`} color={city.lifeExpMale < ENGLAND.lifeExpMale ? C.coral : C.teal} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols(2, 1, 1)}, 1fr)`, gap: 12 }}>
        <Card>
          <Hdr sub={`Census 2021 housing tenure for ${city.name} (${city.ons})`}>Tenure Distribution</Hdr>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={tenureAgg}
                cx="50%" cy="50%"
                innerRadius={50} outerRadius={80}
                dataKey="value" nameKey="name"
                label={({ name, value }) => `${value}%`}
                labelLine={false}
              >
                {tenureAgg.map((d, i) => <Cell key={i} fill={d.color} fillOpacity={0.75} />)}
              </Pie>
              <Tooltip contentStyle={tt} formatter={(v) => v + "%"} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 4 }}>
            {tenureAgg.map((d) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                <span style={{ fontSize: 10, color: C.textSec }}>{d.name}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <Hdr accent={C.amber} sub="IMD 2019 decile distribution across wards">Deprivation Profile</Hdr>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={_.chain(wards).groupBy("imdDecile").map((v, k) => ({ decile: "D" + k, count: v.length })).sortBy("decile").value()}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="decile" tick={{ fill: C.textDim, fontSize: 10 }} />
              <YAxis tick={{ fill: C.textDim, fontSize: 10 }} />
              <Tooltip contentStyle={tt} />
              <Bar dataKey="count" name="Wards" radius={[3, 3, 0, 0]}>
                {_.chain(wards).groupBy("imdDecile").map((v, k) => ({ decile: +k })).sortBy("decile").value().map((d, i) => (
                  <Cell key={i} fill={d.decile <= 2 ? C.coral : d.decile <= 4 ? C.amber : C.teal} fillOpacity={0.75} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
          <Hdr sub={`All ${wards.length} wards — Census 2021 + IMD 2019 data`}>Ward-Level Data</Hdr>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {[["imdDecile", "IMD"], ["socialRentPct", "Social Rent %"], ["epcD_G_pct", "Poor EPC %"], ["depDims", "Deprivation"]].map(([k, l]) => (
              <Btn key={k} active={sort === k} onClick={() => setSort(k)}>{l}</Btn>
            ))}
          </div>
        </div>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, minWidth: 600 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                {["Ward", "Pop", "HH", "IMD", "Social %", "Private %", "Owner %", "EPC D-G %", "Dep.Dims"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "7px 8px", color: C.textSec, fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((w, i) => (
                <tr
                  key={w.name}
                  onClick={() => setSelected(selected === w.name ? null : w.name)}
                  style={{ borderBottom: `1px solid ${C.border}`, background: selected === w.name ? C.teal + "10" : i % 2 ? C.surfaceAlt + "60" : "transparent", cursor: "pointer", transition: "background 0.1s" }}
                >
                  <td style={{ padding: "7px 8px", color: C.text, fontWeight: 500 }}>{w.name}</td>
                  <td style={{ padding: "7px 8px", color: C.textSec, fontVariantNumeric: "tabular-nums" }}>{w.pop.toLocaleString()}</td>
                  <td style={{ padding: "7px 8px", color: C.textSec, fontVariantNumeric: "tabular-nums" }}>{w.hh.toLocaleString()}</td>
                  <td style={{ padding: "7px 8px" }}><Badge color={w.imdDecile <= 2 ? C.coral : w.imdDecile <= 4 ? C.amber : C.teal}>{w.imdDecile}</Badge></td>
                  <td style={{ padding: "7px 8px", color: w.socialRentPct > 30 ? C.amber : C.textSec, fontWeight: w.socialRentPct > 30 ? 600 : 400, fontVariantNumeric: "tabular-nums" }}>{w.socialRentPct}%</td>
                  <td style={{ padding: "7px 8px", color: w.privateRentPct > 35 ? C.coral : C.textSec, fontVariantNumeric: "tabular-nums" }}>{w.privateRentPct}%</td>
                  <td style={{ padding: "7px 8px", color: C.textSec, fontVariantNumeric: "tabular-nums" }}>{w.ownerPct}%</td>
                  <td style={{ padding: "7px 8px", color: w.epcD_G_pct > 50 ? C.coral : C.textSec, fontVariantNumeric: "tabular-nums" }}>{w.epcD_G_pct}%</td>
                  <td style={{ padding: "7px 8px", color: C.textSec, fontVariantNumeric: "tabular-nums" }}>{w.depDims.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedWard && (
          <div style={{ marginTop: 12, padding: 12, background: C.surfaceAlt, borderRadius: 8, border: `1px solid ${C.teal}30` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.teal, marginBottom: 6 }}>{selectedWard.name} — Detailed Profile</div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 11, color: C.textSec }}>
              <span>IMD Decile: <strong style={{ color: selectedWard.imdDecile <= 2 ? C.coral : selectedWard.imdDecile <= 4 ? C.amber : C.teal }}>{selectedWard.imdDecile}</strong></span>
              <span>Population: <strong style={{ color: C.text }}>{selectedWard.pop.toLocaleString()}</strong></span>
              <span>Social Rent: <strong style={{ color: C.amber }}>{selectedWard.socialRentPct}%</strong></span>
              <span>Private Rent: <strong style={{ color: C.coral }}>{selectedWard.privateRentPct}%</strong></span>
              <span>Poor EPC: <strong style={{ color: C.coral }}>{selectedWard.epcD_G_pct}%</strong></span>
              <span>Dep. Dimensions: <strong style={{ color: C.text }}>{selectedWard.depDims.toFixed(1)}</strong></span>
            </div>
          </div>
        )}
        <div style={{ fontSize: 10, color: C.textDim, marginTop: 8 }}>
          Sources: ONS Census 2021 Table TS054 (tenure), MHCLG IoD2019 (IMD), DLUHC EPC Register · Click a row to expand
        </div>
      </Card>
    </div>
  );
};
