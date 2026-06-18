import { useState, useEffect } from "react";
import { getCityById } from "../data/cities";
import { getWardsForCity } from "../data/wards";

// Fetch real Census 2021 data from ONS Nomis API via Vercel proxy.
// Falls back to the bundled validated ONS data if the API is unavailable.

export const useCityData = (cityId) => {
  const fallbackCity = getCityById(cityId);
  const fallbackWards = getWardsForCity(cityId);

  const [city, setCity] = useState(fallbackCity);
  const [wards, setWards] = useState(fallbackWards);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState("bundled");

  useEffect(() => {
    if (!fallbackCity) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    // Reset to bundled data immediately for instant render
    setCity(fallbackCity);
    setWards(fallbackWards);

    const ons = fallbackCity.ons;

    Promise.all([
      fetch(`/api/city-data?ons=${ons}`).then((r) => r.json()),
      fetch(`/api/ward-data?ons=${ons}`).then((r) => r.json()),
    ])
      .then(([cityResp, wardResp]) => {
        if (cancelled) return;

        if (!cityResp.error && cityResp.tenure) {
          setCity((prev) => ({
            ...prev,
            tenurePct: {
              owned: cityResp.tenure.ownedPct,
              socialRent: cityResp.tenure.socialRentPct,
              privateRent: cityResp.tenure.privateRentPct,
            },
            households: cityResp.tenure.total || prev.households,
            population: cityResp.population || prev.population,
          }));
        }

        if (!wardResp.error && wardResp.wards?.length) {
          // Merge fetched ward data; preserve EPC estimate where API has no data
          setWards(
            wardResp.wards.map((w) => {
              const fallback = fallbackWards.find((f) => f.name === w.name) || {};
              return {
                ...fallback,
                ...w,
                pop: w.hh > 0 ? Math.round(w.hh * 2.31) : fallback.pop || 0,
                epcD_G_pct: fallback.epcD_G_pct || w.epcD_G_pct,
              };
            })
          );
          setDataSource("live-ons");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setDataSource("bundled");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [cityId]);

  return { city, wards, loading, error, dataSource };
};
