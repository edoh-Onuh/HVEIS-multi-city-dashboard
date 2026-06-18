import { useState } from "react";
import { useApp } from "../context/AppContext";
import { PALETTES, PALETTE_ICONS } from "../utils/colors";

export const ColorModeToggle = ({ isMobile }) => {
  const { C, paletteKey, setPaletteKey } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        title="Color accessibility mode"
        aria-label="Change color mode for color blindness accessibility"
        style={{
          padding: "5px 10px",
          background: C.surfaceAlt,
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          color: C.teal,
          fontSize: 11,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <span style={{ fontSize: 14 }}>{PALETTE_ICONS[paletteKey]}</span>
        {!isMobile && <span>{PALETTES[paletteKey].label}</span>}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 4px)",
            background: C.elevated,
            border: `1px solid ${C.borderLight}`,
            borderRadius: 8,
            padding: 8,
            zIndex: 100,
            minWidth: 220,
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}
        >
          <div style={{ fontSize: 10, color: C.textDim, padding: "4px 8px 8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Colour Accessibility
          </div>
          {Object.entries(PALETTES).map(([key, palette]) => (
            <button
              key={key}
              onClick={() => { setPaletteKey(key); setOpen(false); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                padding: "7px 8px",
                background: paletteKey === key ? C.teal + "15" : "transparent",
                border: `1px solid ${paletteKey === key ? C.teal + "40" : "transparent"}`,
                borderRadius: 6,
                color: paletteKey === key ? C.teal : C.text,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: 16, width: 20 }}>{PALETTE_ICONS[key]}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{palette.label}</div>
                <div style={{ fontSize: 10, color: paletteKey === key ? C.teal + "AA" : C.textDim }}>{palette.description}</div>
              </div>
              {paletteKey === key && (
                <span style={{ marginLeft: "auto", color: C.teal, fontSize: 12 }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
