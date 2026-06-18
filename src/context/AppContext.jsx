import { createContext, useContext, useState, useMemo } from "react";
import { CITIES, getCityById } from "../data/cities";
import { getWardsForCity } from "../data/wards";
import { generateHouseholds } from "../utils/dataUtils";
import { PALETTES, getRiskColor } from "../utils/colors";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [cityId, setCityId] = useState("sunderland");
  const [paletteKey, setPaletteKey] = useState("default");

  const city = useMemo(() => getCityById(cityId), [cityId]);
  const wards = useMemo(() => getWardsForCity(cityId), [cityId]);
  const households = useMemo(() => generateHouseholds(wards, cityId.split("").reduce((a, c) => a + c.charCodeAt(0), 0)), [wards, cityId]);
  const C = PALETTES[paletteKey] || PALETTES.default;
  const riskColor = getRiskColor(C);

  return (
    <AppContext.Provider value={{ city, cities: CITIES, cityId, setCityId, wards, households, C, riskColor, paletteKey, setPaletteKey }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
