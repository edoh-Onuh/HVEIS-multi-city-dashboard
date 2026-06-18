import { useState, useEffect } from "react";

export const useBreakpoint = () => {
  const [bp, setBp] = useState("lg");

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setBp(w < 480 ? "xs" : w < 640 ? "sm" : w < 1024 ? "md" : w < 1280 ? "lg" : "xl");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const isMobile = bp === "xs" || bp === "sm";
  const isTablet = bp === "md";
  const cols = (lg, md, sm) => (isMobile ? sm || 1 : isTablet ? md || lg : lg);

  return { bp, isMobile, isTablet, cols };
};
