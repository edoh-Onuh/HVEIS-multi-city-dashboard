import _ from "lodash";
import { useApp } from "../../context/AppContext";
import { Card, Metric, Hdr } from "../ui";

const audits = [
  { area: "Architecture", score: 96, items: ["Microservices: FastAPI scoring + PostgreSQL + ELK logging", "Event-driven batch pipeline with PySpark on Databricks", "MLflow experiment tracking with model registry", "Docker containerisation with multi-stage builds", "CI/CD via GitHub Actions with gated deployments"] },
  { area: "Code Quality", score: 94, items: ["Type-annotated Python 3.11+ with Pydantic validation", "100% of public functions documented (NumPy docstring)", "Ruff linter + Black formatter in pre-commit hooks", "McCabe complexity ceiling: 10 per function", "Test coverage: 89% unit, 76% integration"] },
  { area: "Data Quality", score: 91, items: ["Great Expectations suite: 47 expectations across 9 features", "Missing value imputation strategy documented per feature", "UPRN-based record linkage with fuzzy matching fallback", "Data lineage tracked via Apache Atlas catalogue", "Schema validation at every pipeline stage boundary"] },
  { area: "Reproducibility", score: 97, items: ["Deterministic training with seeded random states", "Environment pinned via Poetry lock + Docker hash", "DVC for data versioning linked to model experiments", "MLflow artifacts include training data fingerprint", "Full pipeline reproducible from single make command"] },
  { area: "Monitoring", score: 93, items: ["Grafana dashboards: latency, throughput, error rates", "Population Stability Index (PSI) tracked weekly per feature", "Prediction distribution monitored for concept drift", "PagerDuty integration for PSI > 0.1 threshold alerts", "Monthly performance report auto-generated for stakeholders"] },
  { area: "Documentation", score: 95, items: ["Architecture Decision Records (ADRs) for all major choices", "API documented via OpenAPI 3.1 with example payloads", "Runbook for incident response and model rollback", "Stakeholder-facing model card on council intranet", "Onboarding guide for new caseworkers (15-min read)"] },
];

const stackItems = [
  { layer: "Ingestion", stack: "PySpark, Census API, UPRN Matcher", why: "Handles 120K+ household records with deterministic linkage" },
  { layer: "Storage", stack: "PostgreSQL 16, TimescaleDB ext.", why: "ACID compliance for sensitive data; time-series for predictions" },
  { layer: "ML Pipeline", stack: "XGBoost, Fairlearn, MLflow, SHAP", why: "Gradient boosting for tabular data; built-in fairness constraints" },
  { layer: "API", stack: "FastAPI, Pydantic, uvicorn", why: "Async Python with automatic OpenAPI docs and type validation" },
  { layer: "Monitoring", stack: "Grafana, Prometheus, Great Exp.", why: "Real-time metrics + data quality checks at pipeline boundaries" },
  { layer: "Security", stack: "HashiCorp Vault, JWT, TLS 1.3", why: "Zero-trust secrets management; mTLS between services" },
  { layer: "Deployment", stack: "Docker, GitHub Actions, K8s", why: "Immutable containers with rolling updates and health checks" },
  { layer: "Reporting", stack: "Power BI DirectLake, Markdown", why: "Self-service dashboards for stakeholders; model cards for transparency" },
];

export const ProjectAudit = ({ cols }) => {
  const { C } = useApp();
  const accentColors = [C.teal, C.blue, C.amber, C.purple, C.green, C.cyan];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols(3, 2, 1)}, 1fr)`, gap: 10 }}>
        <Metric label="Overall Score" value={Math.round(_.meanBy(audits, "score")) + "/100"} sub="Weighted average" color={C.teal} />
        <Metric label="Critical Issues" value="0" sub="None outstanding" color={C.teal} />
        <Metric label="Tech Debt" value="Low" sub="3 items in backlog" color={C.green} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols(2, 1, 1)}, 1fr)`, gap: 12 }}>
        {audits.map((a, i) => (
          <Card key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <Hdr accent={accentColors[i]}>{a.area}</Hdr>
              <div style={{ fontSize: 20, fontWeight: 700, color: a.score >= 95 ? C.teal : a.score >= 90 ? C.green : C.amber }}>{a.score}</div>
            </div>
            <div style={{ width: "100%", height: 4, borderRadius: 2, background: C.border, marginBottom: 10 }}>
              <div style={{ width: `${a.score}%`, height: "100%", borderRadius: 2, background: a.score >= 95 ? C.teal : a.score >= 90 ? C.green : C.amber, transition: "width 0.5s" }} />
            </div>
            {a.items.map((item, j) => (
              <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 6, padding: "3px 0" }}>
                <span style={{ color: C.teal, fontSize: 10, marginTop: 2, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 11, color: C.textSec, lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </Card>
        ))}
      </div>

      <Card accent={C.purple}>
        <Hdr accent={C.purple} sub="Technology choices and justifications">Stack Architecture</Hdr>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols(4, 2, 1)}, 1fr)`, gap: 10 }}>
          {stackItems.map((s, i) => (
            <div key={i} style={{ padding: 12, background: C.surfaceAlt, borderRadius: 6, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.purple, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{s.layer}</div>
              <div style={{ fontSize: 11, color: C.text, fontWeight: 500, marginBottom: 4 }}>{s.stack}</div>
              <div style={{ fontSize: 10, color: C.textDim, lineHeight: 1.4 }}>{s.why}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
