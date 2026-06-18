// Color palettes including 4 colorblind-safe modes
// Colorblind palettes use the Okabe-Ito palette (doi:10.1038/nmeth.1618)
// which is safe for all forms of color vision deficiency

const BASE_DARK = {
  bg: "#060C18",
  surface: "#0D1525",
  surfaceAlt: "#131D30",
  elevated: "#182540",
  border: "#1C2D4A",
  borderLight: "#263B5E",
  text: "#E6EBF2",
  textSec: "#8A9BB5",
  textDim: "#556B8A",
};

export const PALETTES = {
  default: {
    ...BASE_DARK,
    label: "Default",
    description: "Dark theme",
    teal: "#22D3A7",
    tealDark: "#17956F",
    amber: "#F5A623",
    coral: "#EF5350",
    blue: "#4A9EE5",
    purple: "#9B7BF4",
    green: "#4ADE80",
    cyan: "#22D3EE",
    chartColors: ["#22D3A7", "#4A9EE5", "#F5A623", "#EF5350", "#9B7BF4", "#4ADE80"],
  },
  deuteranopia: {
    ...BASE_DARK,
    label: "Deuteranopia",
    description: "Red-green safe (most common, ~6% of men)",
    teal: "#0072B2",
    tealDark: "#005A8E",
    amber: "#E69F00",
    coral: "#D55E00",
    blue: "#56B4E9",
    purple: "#CC79A7",
    green: "#009E73",
    cyan: "#56B4E9",
    chartColors: ["#0072B2", "#56B4E9", "#E69F00", "#D55E00", "#CC79A7", "#009E73"],
  },
  protanopia: {
    ...BASE_DARK,
    label: "Protanopia",
    description: "Red-blind safe (~1% of men)",
    teal: "#0072B2",
    tealDark: "#005A8E",
    amber: "#E69F00",
    coral: "#D55E00",
    blue: "#56B4E9",
    purple: "#CC79A7",
    green: "#009E73",
    cyan: "#56B4E9",
    chartColors: ["#0072B2", "#56B4E9", "#E69F00", "#D55E00", "#CC79A7", "#009E73"],
  },
  tritanopia: {
    ...BASE_DARK,
    label: "Tritanopia",
    description: "Blue-yellow safe (~0.01%)",
    teal: "#009E73",
    tealDark: "#007A5A",
    amber: "#D55E00",
    coral: "#CC79A7",
    blue: "#0072B2",
    purple: "#CC79A7",
    green: "#009E73",
    cyan: "#0072B2",
    chartColors: ["#009E73", "#0072B2", "#D55E00", "#CC79A7", "#E69F00", "#56B4E9"],
  },
  highContrast: {
    bg: "#000000",
    surface: "#0A0A0A",
    surfaceAlt: "#141414",
    elevated: "#1E1E1E",
    border: "#3A3A3A",
    borderLight: "#555555",
    text: "#FFFFFF",
    textSec: "#DDDDDD",
    textDim: "#AAAAAA",
    label: "High Contrast",
    description: "Maximum readability",
    teal: "#00FF99",
    tealDark: "#00CC77",
    amber: "#FFCC00",
    coral: "#FF4444",
    blue: "#44AAFF",
    purple: "#CC88FF",
    green: "#00FF66",
    cyan: "#00FFFF",
    chartColors: ["#00FF99", "#44AAFF", "#FFCC00", "#FF4444", "#CC88FF", "#00FF66"],
  },
};

export const getRiskColor = (C) => (score) =>
  score >= 75 ? C.coral : score >= 55 ? C.amber : score >= 35 ? C.blue : C.teal;

export const PALETTE_NAMES = Object.keys(PALETTES);

export const PALETTE_ICONS = {
  default: "◉",
  deuteranopia: "◎",
  protanopia: "◈",
  tritanopia: "◐",
  highContrast: "◑",
};
