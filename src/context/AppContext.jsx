import { createContext, useContext, useState, useMemo } from "react";
import { CITIES } from "../data/cities";
import { PALETTES, getRiskColor } from "../utils/colors";
import { useCityData } from "../hooks/useCityData";
import { computeWardRiskScores } from "../utils/dataUtils";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [cityId, setCityId] = useState("sunderland");
  const [paletteKey, setPaletteKey] = useState("default");

  const { city, wards, loading, error, dataSource } = useCityData(cityId);

  // Compute ward-level risk scores from real ONS/IMD data — no synthetic households
  const wardRiskScores = useMemo(() => computeWardRiskScores(wards), [wards]);

  const C = PALETTES[paletteKey] || PALETTES.default;
  const riskColor = getRiskColor(C);

  return (
    <AppContext.Provider value={{
      city, cities: CITIES, cityId, setCityId,
      wards, wardRiskScores,
      loading, error, dataSource,
      C, riskColor, paletteKey, setPaletteKey,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
