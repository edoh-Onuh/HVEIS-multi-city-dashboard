// Seeded pseudo-random + stratified household generation from real ward data

const seeded = (s) => {
  let x = s;
  return () => {
    x = (x * 16807) % 2147483647;
    return (x - 1) / 2147483646;
  };
};

const norm = (rand, m, s) => {
  const u = rand(), v = rand();
  return m + s * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export const generateHouseholds = (wards, seed = 2024) => {
  const R = seeded(seed);
  const data = [];
  wards.forEach((w) => {
    const n = Math.round(w.hh * 0.05); // 5% stratified sample per ward
    for (let i = 0; i < n; i++) {
      const tenureRoll = R() * 100;
      const tenure =
        tenureRoll < w.socialRentPct
          ? "Social Rent"
          : tenureRoll < w.socialRentPct + w.privateRentPct
          ? "Private Rent"
          : "Owner Occupied";

      const arrears = R() < (tenure === "Private Rent" ? 0.19 : tenure === "Social Rent" ? 0.24 : 0.05);
      const priorHL = R() < (w.imdDecile <= 2 ? 0.12 : w.imdDecile <= 4 ? 0.07 : 0.03);
      const mentalHealth = R() < (w.imdDecile <= 2 ? 0.22 : 0.12);
      const epcPoor = R() * 100 < w.epcD_G_pct;
      const benefits = R() < (w.imdDecile <= 2 ? 0.58 : w.imdDecile <= 4 ? 0.38 : 0.18);
      const children = Math.floor(clamp(norm(R, 0.9, 1.1), 0, 5));

      let risk = 0;
      risk += (10 - w.imdDecile) * 7;
      risk += arrears ? 20 : 0;
      risk += priorHL ? 25 : 0;
      risk += mentalHealth ? 14 : 0;
      risk += tenure === "Private Rent" ? 15 : tenure === "Social Rent" ? 8 : 0;
      risk += epcPoor ? 6 : 0;
      risk += children >= 3 ? 5 : 0;
      risk += clamp(norm(R, 0, 8), -15, 15);
      risk = clamp(Math.round(risk), 0, 100);

      const outcome = R() < (risk / 220 + (arrears ? 0.08 : 0) + (priorHL ? 0.12 : 0));

      data.push({
        id: `HH${String(data.length + 1).padStart(5, "0")}`,
        ward: w.name,
        imdDecile: w.imdDecile,
        tenure,
        arrears,
        priorHomeless: priorHL,
        mentalHealth,
        epcPoor,
        benefits,
        children,
        riskScore: risk,
        outcome,
        depDims: w.depDims,
      });
    }
  });
  return data;
};
