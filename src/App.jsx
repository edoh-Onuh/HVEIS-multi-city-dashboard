import { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { useBreakpoint } from "./hooks/useBreakpoint";
import { CitySelector } from "./components/CitySelector";
import { ColorModeToggle } from "./components/ColorModeToggle";
import { Overview } from "./components/tabs/Overview";
import { WardExplorer } from "./components/tabs/WardExplorer";
import { ModelTab } from "./components/tabs/ModelTab";
import { SecurityAudit } from "./components/tabs/SecurityAudit";
import { ProjectAudit } from "./components/tabs/ProjectAudit";
import { AIAnalysis } from "./components/tabs/AIAnalysis";

const TABS = [
  { label: "Dashboard", short: "Dash" },
  { label: "Ward Explorer", short: "Wards" },
  { label: "Model & Fairness", short: "Model" },
  { label: "Security Audit", short: "Security" },
  { label: "Project Audit", short: "Project" },
  { label: "AI Analysis", short: "AI" },
];

const AppShell = () => {
  const { C, city } = useApp();
  const { bp, isMobile, isTablet, cols } = useBreakpoint();
  const [tab, setTab] = useState(0);

  const tabColors = [C.teal, C.blue, C.coral, C.amber, C.purple, C.cyan];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "'Inter', -apple-system, system-ui, sans-serif", fontSize: 14 }}>
      {/* Skip to main content for screen readers */}
      <a href="#main-content" style={{ position: "absolute", top: -40, left: 0, padding: "8px 12px", background: C.teal, color: C.bg, fontWeight: 700, borderRadius: 4, zIndex: 1000, transition: "top 0.1s" }}
        onFocus={(e) => (e.target.style.top = "0")}
        onBlur={(e) => (e.target.style.top = "-40px")}
      >
        Skip to content
      </a>

      {/* Header */}
      <header style={{ padding: isMobile ? "10px 12px" : "10px 20px", borderBottom: `1px solid ${C.border}`, background: C.surface, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: C.teal, boxShadow: `0 0 8px ${C.teal}70`, flexShrink: 0 }} />
          <span style={{ fontSize: isMobile ? 13 : 15, fontWeight: 700, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>HVEIS</span>
          {!isMobile && <span style={{ fontSize: 11, color: C.textDim }}>Housing Vulnerability Early Intervention System</span>}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <CitySelector isMobile={isMobile} />
          <ColorModeToggle isMobile={isMobile} />
        </div>
      </header>

      {/* Tab bar */}
      <nav
        role="tablist"
        aria-label="Dashboard sections"
        style={{ display: "flex", gap: 0, overflowX: "auto", WebkitOverflowScrolling: "touch", borderBottom: `1px solid ${C.border}`, background: C.surface, padding: "0 8px", scrollbarWidth: "none" }}
      >
        {TABS.map((t, i) => (
          <button
            key={t.label}
            role="tab"
            aria-selected={tab === i}
            onClick={() => setTab(i)}
            style={{
              padding: isMobile ? "10px 10px" : "10px 16px",
              border: "none",
              borderBottom: tab === i ? `2px solid ${tabColors[i]}` : "2px solid transparent",
              background: "transparent",
              color: tab === i ? tabColors[i] : C.textDim,
              fontSize: isMobile ? 11 : 12,
              cursor: "pointer",
              fontWeight: tab === i ? 600 : 400,
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "color 0.15s",
            }}
          >
            {isMobile ? t.short : t.label}
          </button>
        ))}
      </nav>

      {/* Main content */}
      <main id="main-content" style={{ padding: isMobile ? "12px" : "20px", maxWidth: 1400, margin: "0 auto" }}>
        {tab === 0 && <Overview cols={cols} />}
        {tab === 1 && <WardExplorer cols={cols} />}
        {tab === 2 && <ModelTab cols={cols} />}
        {tab === 3 && <SecurityAudit cols={cols} />}
        {tab === 4 && <ProjectAudit cols={cols} />}
        {tab === 5 && <AIAnalysis cols={cols} />}
      </main>

      {/* Footer */}
      <footer style={{ padding: "12px 20px", borderTop: `1px solid ${C.border}`, background: C.surface, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 10, color: C.textDim }}>
          Data: ONS Census 2021 · MHCLG IMD 2019 · DLUHC Statutory Homelessness Q3 2025 · All OGL v3.0
        </div>
        <div style={{ fontSize: 10, color: C.textDim }}>
          {city.name} · {city.region} · {bp.toUpperCase()} viewport
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
