// Proxies to ONS Nomis API for real Census 2021 data
// Nomis docs: https://www.nomisweb.co.uk/api/v01/help
// Dataset NM_2082_1 = Census 2021 Table TS054 (Tenure of household)
// Dataset NM_2041_1 = Census 2021 Table TS001 (Number of usual residents)
// Licensed under Open Government Licence v3.0

const NOMIS = "https://www.nomisweb.co.uk/api/v01";

async function fetchNomis(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Nomis ${res.status}: ${url}`);
  return res.json();
}

function parseTenure(obs) {
  // TS054 cell codes: 1=Owned outright, 2=Owned with mortgage/shared ownership,
  // 3=Social rented (council), 4=Social rented (other),
  // 5=Private rented (landlord), 6=Private rented (other), 7=Rent free, 0=Total
  let total = 0, owned = 0, socialRent = 0, privateRent = 0;
  for (const o of obs) {
    const code = o.cell?.code ?? o.CELL;
    const val = o.obs_value?.value ?? o.OBS_VALUE ?? 0;
    if (code === 0) total = val;
    else if (code === 1 || code === 2) owned += val;
    else if (code === 3 || code === 4) socialRent += val;
    else if (code === 5 || code === 6) privateRent += val;
  }
  const pct = (n) => total > 0 ? Math.round((n / total) * 1000) / 10 : 0;
  return { total, ownedPct: pct(owned), socialRentPct: pct(socialRent), privateRentPct: pct(privateRent) };
}

export default async function handler(req, res) {
  const { ons } = req.query;
  if (!ons || !/^E\d{8}$/.test(ons)) {
    return res.status(400).json({ error: "Valid ONS LA code required (e.g. E08000024)" });
  }

  // Cache 24 hours at Vercel edge, serve stale for up to 7 days while revalidating
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=604800");

  try {
    const [tenureData, popData] = await Promise.all([
      fetchNomis(`${NOMIS}/dataset/NM_2082_1.data.json?geography=${ons}&cell=0,1,2,3,4,5,6,7&measures=20100`),
      fetchNomis(`${NOMIS}/dataset/NM_2041_1.data.json?geography=${ons}&cell=0&measures=20100`),
    ]);

    const tenure = parseTenure(tenureData.obs || []);
    const population = (popData.obs?.[0]?.obs_value?.value) ?? (popData.obs?.[0]?.OBS_VALUE) ?? null;

    return res.status(200).json({ ons, tenure, population, source: "ONS Nomis Census 2021", fetched: new Date().toISOString() });
  } catch (err) {
    return res.status(502).json({ error: err.message });
  }
}
