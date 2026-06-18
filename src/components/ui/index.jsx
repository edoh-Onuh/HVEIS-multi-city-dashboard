import { useApp } from "../../context/AppContext";

export const Card = ({ children, style, accent }) => {
  const { C } = useApp();
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: 16,
        borderTop: accent ? `3px solid ${accent}` : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Metric = ({ label, value, sub, color, style }) => {
  const { C } = useApp();
  const col = color || C.teal;
  return (
    <div
      style={{
        padding: "14px 16px",
        background: C.surface,
        borderRadius: 8,
        border: `1px solid ${C.border}`,
        flex: 1,
        minWidth: 110,
        ...style,
      }}
    >
      <div style={{ fontSize: 10, color: C.textSec, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: col, fontVariantNumeric: "tabular-nums", lineHeight: 1.2 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{sub}</div>}
    </div>
  );
};

export const Badge = ({ children, color }) => {
  const { C } = useApp();
  const col = color || C.teal;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 10,
        fontSize: 10,
        fontWeight: 600,
        background: col + "18",
        color: col,
        border: `1px solid ${col}28`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
};

export const Hdr = ({ children, sub, accent }) => {
  const { C } = useApp();
  const col = accent || C.teal;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 4, height: 20, borderRadius: 2, background: col, flexShrink: 0 }} />
        <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0 }}>{children}</h3>
      </div>
      {sub && <p style={{ fontSize: 12, color: C.textSec, margin: "4px 0 0 12px", lineHeight: 1.5 }}>{sub}</p>}
    </div>
  );
};

export const Btn = ({ children, active, onClick, color }) => {
  const { C } = useApp();
  const col = color || C.teal;
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 12px",
        borderRadius: 6,
        border: `1px solid ${active ? col : C.border}`,
        background: active ? col + "15" : "transparent",
        color: active ? col : C.textSec,
        fontSize: 11,
        cursor: "pointer",
        fontWeight: active ? 600 : 400,
        whiteSpace: "nowrap",
        transition: "all 0.15s",
        minHeight: 32,
      }}
    >
      {children}
    </button>
  );
};

export const ttStyle = (C) => ({
  background: C.elevated,
  border: `1px solid ${C.border}`,
  borderRadius: 6,
  color: C.text,
  fontSize: 11,
});
