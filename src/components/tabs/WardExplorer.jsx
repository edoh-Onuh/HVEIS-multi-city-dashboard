import { useState, useMemo } from "react";
import _ from "lodash";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend, LabelList, Sector,
} from "recharts";
import { useApp } from "../../context/AppContext";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { ENGLAND } from "../../data/cities";
import { Card, Metric, Badge, Hdr, Btn, ttStyle } from "../ui";

// Interactive active shape for the donut — enlarges hovered/touched segment
const ActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
  return (
    <g>
      <text x={cx} y={cy - 8} textAnchor="middle" fill={fill} fontSize={22} fontWeight={800}>{value}%</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill={props.textColor || "#8A9BB5"} fontSize={10}>{payload.name}</text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} innerRadius={outerRadius + 12} outerRadius={outerRadius + 16} startAngle={startAngle} endAngle={endAngle} fill={fill} fillOpacity={0.4} />
    </g>
  );
};

export const WardExplorer = ({ cols }) => {
  const { C, city, wards, riskColor } = useApp();
  const { isMobile, isTablet } = useBreakpoint();
  const [sort, setSort] = useState("imdDecile");
  const [selected, setSelected] = useState(null);
  const [activePieIdx, setActivePieIdx] = useState(0);
  const tt = ttStyle(C);

  const sorted = useMemo(
    () => [...wards].sort((a, b) => sort === "imdDecile" ? a.imdDecile - b.imdDecile : b[sort] - a[sort]),
    [wards, sort]
  );

  const tenureAgg = useMemo(() => [
    { name: "Owner Occupied", value: +(city.tenurePct.owned).toFixed(1), color: C.teal },
    { name: "Social Rent",    value: +(city.tenurePct.socialRent).toFixed(1), color: C.amber },
    { name: "Private Rent",   value: +(city.tenurePct.privateRent).toFixed(1), color: C.coral },
  ], [city, C]);

  const imdData = useMemo(() =>
    _.chain(wards)
      .groupBy("imdDecile")
      .map((v, k) => ({ decile: "D" + k, count: v.length, decileNum: +k }))
      .sortBy("decile")
      .value(),
    [wards]
  );

  const selectedWard = wards.find((w) => w.name === selected);
  const chartH = isMobile ? 260 : 240;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols(4, 2, 2)}, 1fr)`, gap: 10 }}>
        <Metric label="Social Rent"       value={city.tenurePct.socialRent + "%"}  sub={`vs ${ENGLAND.tenurePct.socialRent}% England`}   color={C.amber} />
        <Metric label="Private Rent"      value={city.tenurePct.privateRent + "%"} sub={`vs ${ENGLAND.tenurePct.privateRent}% England`}  color={C.coral} />
        <Metric label="Healthy Life Exp." value={city.healthyLifeExp + "y"}        sub={`vs ${ENGLAND.healthyLifeExp}y England`}          color={city.healthyLifeExp < ENGLAND.healthyLifeExp ? C.coral : C.teal} />
        <Metric label="Male Life Exp."    value={city.lifeExpMale + "y"}           sub={`vs ${ENGLAND.lifeExpMale}y England`}             color={city.lifeExpMale < ENGLAND.lifeExpMale ? C.coral : C.teal} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols(2, 1, 1)}, 1fr)`, gap: 12 }}>
        {/* Tenure donut — active shape pattern: no external labels, no labelLine */}
        <Card>
          <Hdr sub={`Census 2021 housing tenure — ${city.name} (${city.ons}) · Tap a segment to highlight`}>
            Tenure Distribution
          </Hdr>
          <div style={{ width: "100%", height: chartH }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activePieIdx}
                  activeShape={(props) => <ActiveShape {...props} textColor={C.textSec} />}
                  data={tenureAgg}
                  cx="50%"
                  cy="50%"
                  innerRadius={isMobile ? 55 : 65}
                  outerRadius={isMobile ? 85 : 95}
                  dataKey="value"
                  nameKey="name"
                  onMouseEnter={(_, idx) => setActivePieIdx(idx)}
                  onClick={(_, idx) => setActivePieIdx(idx)}
                  stroke="none"
                >
                  {tenureAgg.map((d, i) => (
                    <Cell key={i} fill={d.color} fillOpacity={i === activePieIdx ? 1 : 0.7} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tt}
                  formatter={(v, name) => [v.toFixed(1) + "%", name]}
                />
                <Legend
                  formatter={(value, entry) =>
                    `${value}: ${entry.payload.value.toFixed(1)}%`
                  }
                  wrapperStyle={{ fontSize: isMobile ? 10 : 11, color: C.textSec, paddingTop: 4 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ fontSize: 10, color: C.textDim, marginTop: 2 }}>
            Source: ONS Census 2021 TS054 · Tap / hover a segment to see details
          </div>
        </Card>

        {/* IMD Deprivation bar chart */}
        <Card>
          <Hdr accent={C.amber} sub="IMD 2019 decile distribution across wards">Deprivation Profile</Hdr>
          <div style={{ width: "100%", height: chartH }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={imdData} margin={{ top: 22, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="decile" tick={{ fill: C.text, fontSize: isMobile ? 10 : 11, fontWeight: 500 }} />
                <YAxis tick={{ fill: C.text, fontSize: isMobile ? 10 : 11 }} allowDecimals={false} width={28} />
                <Tooltip contentStyle={tt} formatter={(v) => [`${v} wards`, "Count"]} />
                <Bar dataKey="count" name="Wards" radius={[3, 3, 0, 0]}>
                  {imdData.map((d, i) => (
                    <Cell key={i} fill={d.decileNum <= 2 ? C.coral : d.decileNum <= 4 ? C.amber : C.teal} fillOpacity={0.85} />
                  ))}
                  <LabelList
                    dataKey="count"
                    position="top"
                    style={{ fill: C.text, fontSize: isMobile ? 10 : 11, fontWeight: 700 }}
                    formatter={(v) => (v > 0 ? v : "")}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: 6, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[{ label: "Decile 1–2 (most deprived)", color: C.coral }, { label: "3–4", color: C.amber }, { label: "5–10", color: C.teal }].map((b) => (
              <span key={b.label} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, color: C.textSec }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: b.color, display: "inline-block", flexShrink: 0 }} />
                {b.label}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Ward table */}
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
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: isMobile ? 10 : 11, minWidth: isMobile ? 480 : 600 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                {(isMobile
                  ? ["Ward", "IMD", "Social %", "Private %", "EPC D-G %"]
                  : ["Ward", "Pop", "HH", "IMD", "Social %", "Private %", "Owner %", "EPC D-G %", "Dep.Dims"]
                ).map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "7px 8px", color: C.textSec, fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((w, i) => (
                <tr
                  key={w.name}
                  onClick={() => setSelected(selected === w.name ? null : w.name)}
                  style={{ borderBottom: `1px solid ${C.border}`, background: selected === w.name ? C.teal + "14" : i % 2 ? C.surfaceAlt + "60" : "transparent", cursor: "pointer", transition: "background 0.1s" }}
                >
                  <td style={{ padding: "7px 8px", color: C.text, fontWeight: 500 }}>{w.name}</td>
                  {!isMobile && <td style={{ padding: "7px 8px", color: C.textSec, fontVariantNumeric: "tabular-nums" }}>{w.pop.toLocaleString()}</td>}
                  {!isMobile && <td style={{ padding: "7px 8px", color: C.textSec, fontVariantNumeric: "tabular-nums" }}>{w.hh.toLocaleString()}</td>}
                  <td style={{ padding: "7px 8px" }}><Badge color={w.imdDecile <= 2 ? C.coral : w.imdDecile <= 4 ? C.amber : C.teal}>{w.imdDecile}</Badge></td>
                  <td style={{ padding: "7px 8px", color: w.socialRentPct > 30 ? C.amber : C.textSec, fontWeight: w.socialRentPct > 30 ? 600 : 400, fontVariantNumeric: "tabular-nums" }}>{w.socialRentPct}%</td>
                  <td style={{ padding: "7px 8px", color: w.privateRentPct > 35 ? C.coral : C.textSec, fontVariantNumeric: "tabular-nums" }}>{w.privateRentPct}%</td>
                  {!isMobile && <td style={{ padding: "7px 8px", color: C.textSec, fontVariantNumeric: "tabular-nums" }}>{w.ownerPct}%</td>}
                  <td style={{ padding: "7px 8px", color: w.epcD_G_pct > 50 ? C.coral : C.textSec, fontVariantNumeric: "tabular-nums" }}>{w.epcD_G_pct}%</td>
                  {!isMobile && <td style={{ padding: "7px 8px", color: C.textSec, fontVariantNumeric: "tabular-nums" }}>{w.depDims.toFixed(1)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedWard && (
          <div style={{ marginTop: 12, padding: 12, background: C.surfaceAlt, borderRadius: 8, border: `1px solid ${C.teal}30` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.teal, marginBottom: 8 }}>{selectedWard.name} — Detailed Profile</div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols(3, 2, 2)}, 1fr)`, gap: 8 }}>
              {[
                { label: "IMD Decile", value: selectedWard.imdDecile, color: selectedWard.imdDecile <= 2 ? C.coral : selectedWard.imdDecile <= 4 ? C.amber : C.teal },
                { label: "Population", value: selectedWard.pop.toLocaleString(), color: C.text },
                { label: "Households", value: selectedWard.hh.toLocaleString(), color: C.text },
                { label: "Social Rent", value: selectedWard.socialRentPct + "%", color: C.amber },
                { label: "Private Rent", value: selectedWard.privateRentPct + "%", color: C.coral },
                { label: "Owner Occupied", value: selectedWard.ownerPct + "%", color: C.teal },
                { label: "Poor EPC (D–G)", value: selectedWard.epcD_G_pct + "%", color: selectedWard.epcD_G_pct > 50 ? C.coral : C.textSec },
                { label: "Dep. Dimensions", value: selectedWard.depDims.toFixed(1), color: C.text },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ padding: "6px 8px", background: C.bg, borderRadius: 6, border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 9, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{ fontSize: 10, color: C.textDim, marginTop: 8 }}>
          Sources: ONS Census 2021 TS054 · MHCLG IMD 2019 · DLUHC EPC Register · Tap a row to expand
        </div>
      </Card>
    </div>
  );
};
