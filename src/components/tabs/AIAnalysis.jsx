import { useState, useCallback } from "react";
import { useApp } from "../../context/AppContext";
import { HOMELESSNESS_NATIONAL } from "../../data/homelessness";
import { ENGLAND } from "../../data/cities";
import { Card, Hdr } from "../ui";

const PRESET_QUERIES = [
  {
    label: "Ward Prioritisation",
    q: "Analyse the risk distribution across wards and recommend which 3 should be prioritised for the pilot intervention, with justification based on IMD decile, tenure mix, and EPC ratings.",
  },
  {
    label: "Risk Factor Analysis",
    q: "What are the key risk factors differentiating the most deprived wards (IMD decile 1-2) from less deprived wards? How should intervention be tailored?",
  },
  {
    label: "Evaluation Design",
    q: "Design a stepped-wedge RCT to evaluate a housing vulnerability intervention across wards over 12 months. What are the key statistical considerations?",
  },
  {
    label: "Ethics Review",
    q: "What are the ethical risks of deploying a predictive homelessness risk model and how should they be mitigated? Consider algorithmic fairness, privacy, and stigmatisation.",
  },
];

export const AIAnalysis = ({ cols }) => {
  const { C, city, wards } = useApp();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState(PRESET_QUERIES[0].q);

  const buildContext = () =>
    `You are an expert housing policy data scientist advising a local authority in England.

City: ${city.name} (${city.ons}), ${city.region}
Population: ${city.population.toLocaleString()}, Households: ${city.households.toLocaleString()}
Tenure: ${city.tenurePct.owned}% owner-occupied, ${city.tenurePct.socialRent}% social rent, ${city.tenurePct.privateRent}% private rent
Male life expectancy: ${city.lifeExpMale}y (England: ${ENGLAND.lifeExpMale}y), Healthy LE: ${city.healthyLifeExp}y (England: ${ENGLAND.healthyLifeExp}y)
${city.deprivedWards}/${city.totalWards} wards in higher-deprivation IMD deciles
Median house price: £${city.medianHousePrice.toLocaleString()}, affordability ratio: ${city.affordabilityRatio}x

Ward data (name | IMD decile | social rent % | private rent % | EPC D-G %):
${wards.map((w) => `${w.name} | IMD ${w.imdDecile} | SR ${w.socialRentPct}% | PR ${w.privateRentPct}% | EPC ${w.epcD_G_pct}%`).join("\n")}

Top homelessness causes (DLUHC England): ${HOMELESSNESS_NATIONAL.topCauses.slice(0, 4).map((c) => `${c.cause} (${c.pct}%)`).join(", ")}
Top support needs: ${HOMELESSNESS_NATIONAL.supportNeeds.slice(0, 4).map((s) => `${s.need} (${s.pct}%)`).join(", ")}

Provide a structured, evidence-based analysis with specific, actionable recommendations.`;

  const runAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: `${buildContext()}\n\nQuestion: ${query}` }],
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Server error ${res.status}`);
      }
      const data = await res.json();
      const text = data.content?.filter((b) => b.type === "text").map((b) => b.text).join("\n") || "No response received.";
      setAnalysis(text);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, [query, city, wards]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card accent={C.cyan}>
        <Hdr accent={C.cyan} sub={`AI-powered analysis using real ONS data for ${city.name}`}>Policy Intelligence Engine</Hdr>
        <div style={{ display: "flex", gap: 8, flexDirection: cols(2, 1, 1) === 1 ? "column" : "row" }}>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={3}
            style={{
              flex: 1,
              padding: 10,
              background: C.surfaceAlt,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              color: C.text,
              fontSize: 12,
              fontFamily: "inherit",
              resize: "vertical",
              outline: "none",
              lineHeight: 1.5,
            }}
            placeholder="Ask about the data..."
            aria-label="Analysis query"
          />
          <button
            onClick={runAnalysis}
            disabled={loading}
            style={{
              padding: "10px 20px",
              background: loading ? C.border : C.cyan,
              color: loading ? C.textDim : C.bg,
              border: "none",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              cursor: loading ? "wait" : "pointer",
              whiteSpace: "nowrap",
              alignSelf: "flex-start",
              minHeight: 40,
            }}
          >
            {loading ? "Analysing..." : "Run Analysis"}
          </button>
        </div>
        <div style={{ marginTop: 8, fontSize: 10, color: C.textDim }}>
          Powered by Claude claude-sonnet-4-6 via a server-side proxy (API key never exposed to browser)
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols(4, 2, 1)}, 1fr)`, gap: 8 }}>
        {PRESET_QUERIES.map((p, i) => (
          <button
            key={i}
            onClick={() => setQuery(p.q)}
            style={{
              padding: "10px 12px",
              background: query === p.q ? C.cyan + "15" : C.surfaceAlt,
              border: `1px solid ${query === p.q ? C.cyan + "50" : C.border}`,
              borderRadius: 6,
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: C.cyan, marginBottom: 3 }}>{p.label}</div>
            <div style={{ fontSize: 10, color: C.textDim, lineHeight: 1.4 }}>{p.q.slice(0, 70)}…</div>
          </button>
        ))}
      </div>

      {error && (
        <Card style={{ borderColor: C.coral + "60" }}>
          <div style={{ color: C.coral, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Error</div>
          <div style={{ color: C.coral + "CC", fontSize: 12 }}>{error}</div>
          <div style={{ marginTop: 8, fontSize: 11, color: C.textDim }}>
            Make sure <code style={{ background: C.surfaceAlt, padding: "1px 4px", borderRadius: 3 }}>ANTHROPIC_API_KEY</code> is set in your Vercel environment variables (or a <code style={{ background: C.surfaceAlt, padding: "1px 4px", borderRadius: 3 }}>.env.local</code> file for local dev).
          </div>
        </Card>
      )}

      {loading && (
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: C.textSec, fontSize: 12 }}>
            <div style={{ width: 16, height: 16, border: `2px solid ${C.cyan}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            Analysing {city.name} data…
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </Card>
      )}

      {analysis && (
        <Card>
          <Hdr accent={C.green}>Analysis Results — {city.name}</Hdr>
          <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{analysis}</div>
        </Card>
      )}
    </div>
  );
};
