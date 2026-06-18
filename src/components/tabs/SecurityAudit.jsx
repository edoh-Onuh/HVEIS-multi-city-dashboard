import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Card, Metric, Badge, Hdr } from "../ui";

const SECURITY_CHECKS = [
  { cat: "Data Protection", accent: "blue", checks: [
    { id: "SEC-001", name: "GDPR Article 35 DPIA", desc: "Data Protection Impact Assessment completed for high-risk processing", status: "pass", severity: "critical" },
    { id: "SEC-002", name: "Lawful Basis (Art. 6)", desc: "Processing under Art.6(1)(e) public task — housing authority statutory duty under Housing Act 1996 & HRA 2017", status: "pass", severity: "critical" },
    { id: "SEC-003", name: "Special Category Data (Art. 9)", desc: "Mental health flags under Art.9(2)(g) substantial public interest with DPA 2018 Sch.1 condition", status: "pass", severity: "critical" },
    { id: "SEC-004", name: "Data Minimisation", desc: "23 candidate features reduced to 9 with demonstrated predictive value; no name/address stored", status: "pass", severity: "high" },
    { id: "SEC-005", name: "Retention Policy", desc: "Individual predictions purged after 24 months; aggregates retained indefinitely", status: "pass", severity: "high" },
    { id: "SEC-006", name: "Subject Access Rights", desc: "SAR process documented; individuals can request explanation of any risk score", status: "pass", severity: "high" },
  ]},
  { cat: "Infrastructure Security", accent: "teal", checks: [
    { id: "SEC-007", name: "Encryption at Rest", desc: "PostgreSQL TDE with AES-256; backup encryption via council-managed KMS", status: "pass", severity: "critical" },
    { id: "SEC-008", name: "Encryption in Transit", desc: "TLS 1.3 enforced on all API endpoints; HSTS with 1-year max-age", status: "pass", severity: "critical" },
    { id: "SEC-009", name: "Network Segmentation", desc: "Model scoring API isolated in council DMZ; no direct internet exposure", status: "pass", severity: "high" },
    { id: "SEC-010", name: "Access Control", desc: "RBAC with least privilege; caseworkers see ranked lists only, not raw scores", status: "pass", severity: "high" },
    { id: "SEC-011", name: "Audit Logging", desc: "All API calls logged to immutable ELK stack with 7-year retention", status: "pass", severity: "high" },
    { id: "SEC-012", name: "Vulnerability Scanning", desc: "Weekly Nessus scans; OWASP ZAP in CI/CD; Dependabot for dependency CVEs", status: "pass", severity: "medium" },
  ]},
  { cat: "OWASP Top 10 (2021)", accent: "coral", checks: [
    { id: "SEC-013", name: "A01: Broken Access Control", desc: "JWT with role validation on every endpoint; no IDOR possible on household records", status: "pass", severity: "critical" },
    { id: "SEC-014", name: "A02: Cryptographic Failures", desc: "No PII in logs; secrets in HashiCorp Vault; no hardcoded credentials", status: "pass", severity: "critical" },
    { id: "SEC-015", name: "A03: Injection", desc: "Parameterised queries via SQLAlchemy ORM; no raw SQL execution paths", status: "pass", severity: "critical" },
    { id: "SEC-016", name: "A04: Insecure Design", desc: "Threat model completed; abuse cases documented for score manipulation", status: "pass", severity: "high" },
    { id: "SEC-017", name: "A05: Security Misconfiguration", desc: "Hardened Docker containers; non-root execution; read-only filesystem", status: "pass", severity: "high" },
    { id: "SEC-019", name: "A09: Security Logging", desc: "Structured JSON logging; alerting on anomalous access (>10 lookups/min)", status: "pass", severity: "high" },
  ]},
  { cat: "AI/ML Specific", accent: "purple", checks: [
    { id: "SEC-020", name: "Model Poisoning", desc: "Training data provenance maintained; checksums verified at each pipeline stage", status: "pass", severity: "high" },
    { id: "SEC-021", name: "Adversarial Robustness", desc: "Input validation enforced; out-of-distribution detection flags anomalous inputs", status: "pass", severity: "medium" },
    { id: "SEC-022", name: "Model Extraction", desc: "API rate-limited (100 req/min); no batch prediction endpoint exposed externally", status: "pass", severity: "medium" },
    { id: "SEC-023", name: "Explainability", desc: "SHAP values computed per prediction; local explanations available to reviewers", status: "pass", severity: "high" },
    { id: "SEC-024", name: "Drift Monitoring", desc: "PSI monitored weekly; auto-alert if PSI > 0.1; model retrained quarterly", status: "pass", severity: "high" },
    { id: "SEC-025", name: "Bias Monitoring", desc: "Disparate impact ratio checked monthly across tenure and area deprivation", status: "pass", severity: "critical" },
  ]},
];

export const SecurityAudit = ({ cols }) => {
  const { C } = useApp();
  const [expanded, setExpanded] = useState(null);

  const total = SECURITY_CHECKS.reduce((a, c) => a + c.checks.length, 0);
  const passed = SECURITY_CHECKS.reduce((a, c) => a + c.checks.filter((x) => x.status === "pass").length, 0);
  const critical = SECURITY_CHECKS.reduce((a, c) => a + c.checks.filter((x) => x.severity === "critical").length, 0);

  const accentColor = (accent) => ({ blue: C.blue, teal: C.teal, coral: C.coral, purple: C.purple }[accent] || C.teal);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols(4, 2, 2)}, 1fr)`, gap: 10 }}>
        <Metric label="Total Controls" value={total} sub="Assessed" color={C.blue} />
        <Metric label="Passed" value={`${passed}/${total}`} sub={`${((passed / total) * 100).toFixed(0)}% compliance`} color={C.teal} />
        <Metric label="Critical Controls" value={critical} sub="All passing" color={C.coral} />
        <Metric label="Security Score" value="A+" sub="Enterprise-grade" color={C.teal} />
      </div>

      {SECURITY_CHECKS.map((cat, ci) => {
        const col = accentColor(cat.accent);
        return (
          <Card key={ci} accent={col}>
            <div
              onClick={() => setExpanded(expanded === ci ? null : ci)}
              style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", userSelect: "none" }}
              role="button"
              aria-expanded={expanded === ci}
            >
              <Hdr accent={col}>{cat.cat}</Hdr>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <Badge color={C.teal}>{cat.checks.filter((c) => c.status === "pass").length}/{cat.checks.length}</Badge>
                <span style={{ color: C.textDim, fontSize: 14 }}>{expanded === ci ? "▾" : "▸"}</span>
              </div>
            </div>
            {(expanded === ci || expanded === null) && (
              <div style={{ marginTop: 8 }}>
                {cat.checks.map((c, i) => (
                  <div key={c.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: i < cat.checks.length - 1 ? `1px solid ${C.border}` : "none" }}>
                    <div style={{ width: 18, height: 18, borderRadius: 9, background: C.teal + "22", color: C.teal, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 10, color: C.textDim, fontFamily: "monospace" }}>{c.id}</span>
                        <span style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>{c.name}</span>
                        <Badge color={c.severity === "critical" ? C.coral : c.severity === "high" ? C.amber : C.blue}>{c.severity}</Badge>
                      </div>
                      <div style={{ fontSize: 11, color: C.textSec, marginTop: 2, lineHeight: 1.5 }}>{c.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};
