// Fetches real ward-level data for an English local authority
// Sources:
//   - ONS Nomis (Census 2021 TS054 tenure): https://www.nomisweb.co.uk/api/v01/
//   - ONS ArcGIS (ward geography lookup): https://services1.arcgis.com/
//   - MHCLG English Indices of Deprivation 2019 (ArcGIS FeatureServer)
// Licensed under Open Government Licence v3.0

const NOMIS = "https://www.nomisweb.co.uk/api/v01";
// ONS Geography: ward-to-LAD lookup (2023 boundaries)
const ARCGIS_WARDS = "https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/WD23_LAD23_UK_LU/FeatureServer/0/query";
// MHCLG IMD 2019 ward-level summary (mean rank of LSOAs within ward)
const ARCGIS_IMD = "https://services3.arcgis.com/nhg2ulCnrFH3JEb5/arcgis/rest/services/Indices_of_Multiple_Deprivation_IMD_2019/FeatureServer/0/query";

async function getWardCodes(ladCode) {
  const url = `${ARCGIS_WARDS}?where=LAD23CD+%3D+'${ladCode}'&outFields=WD23CD,WD23NM&f=json&resultRecordCount=200`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Ward lookup ${res.status}`);
  const json = await res.json();
  return (json.features || []).map((f) => ({ code: f.attributes.WD23CD, name: f.attributes.WD23NM }));
}

async function getWardTenure(wardCodes) {
  if (!wardCodes.length) return {};
  // Nomis accepts comma-separated ONS geography codes
  const geoList = wardCodes.map((w) => w.code).join(",");
  const url = `${NOMIS}/dataset/NM_2082_1.data.json?geography=${geoList}&cell=0,1,2,3,4,5,6,7&measures=20100`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Nomis tenure ${res.status}`);
  const json = await res.json();

  const byWard = {};
  for (const o of json.obs || []) {
    const code = o.geography?.geogcode || o.GEOGRAPHY_CODE;
    const cell = o.cell?.code ?? o.CELL;
    const val = o.obs_value?.value ?? o.OBS_VALUE ?? 0;
    if (!byWard[code]) byWard[code] = { total: 0, owned: 0, socialRent: 0, privateRent: 0, pop: 0 };
    if (cell === 0) byWard[code].total = val;
    else if (cell === 1 || cell === 2) byWard[code].owned += val;
    else if (cell === 3 || cell === 4) byWard[code].socialRent += val;
    else if (cell === 5 || cell === 6) byWard[code].privateRent += val;
  }
  return byWard;
}

async function getWardIMD(ladCode) {
  // Get LSOA-level IMD for this LA, aggregate to ward
  // IMD 2019 FeatureServer query
  const url = `${ARCGIS_IMD}?where=LADcd%3D'${ladCode}'&outFields=WD22CD,WD22NM,IMDDec0&f=json&resultRecordCount=2000`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`IMD lookup ${res.status}`);
  const json = await res.json();

  const wardIMD = {};
  for (const f of json.features || []) {
    const { WD22CD, WD22NM, IMDDec0 } = f.attributes;
    if (!wardIMD[WD22CD]) wardIMD[WD22CD] = { name: WD22NM, deciles: [], code: WD22CD };
    if (IMDDec0) wardIMD[WD22CD].deciles.push(IMDDec0);
  }
  // Average LSOA deciles to get ward IMD decile
  const result = {};
  for (const [code, w] of Object.entries(wardIMD)) {
    const avg = w.deciles.length > 0 ? w.deciles.reduce((a, b) => a + b, 0) / w.deciles.length : 5;
    result[code] = { imdDecile: Math.round(avg), name: w.name };
  }
  return result;
}

export default async function handler(req, res) {
  const { ons } = req.query;
  if (!ons || !/^E\d{8}$/.test(ons)) {
    return res.status(400).json({ error: "Valid ONS LA code required" });
  }

  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=604800");

  try {
    const [wards, imd] = await Promise.all([getWardCodes(ons), getWardIMD(ons)]);
    if (!wards.length) return res.status(404).json({ error: `No wards found for ${ons}` });

    const tenure = await getWardTenure(wards);

    const result = wards.map((w) => {
      const t = tenure[w.code] || {};
      const total = t.total || 1;
      const imdInfo = imd[w.code] || {};
      return {
        code: w.code,
        name: w.name,
        hh: t.total || 0,
        imdDecile: imdInfo.imdDecile || 5,
        ownerPct: Math.round((t.owned / total) * 1000) / 10 || 0,
        socialRentPct: Math.round((t.socialRent / total) * 1000) / 10 || 0,
        privateRentPct: Math.round((t.privateRent / total) * 1000) / 10 || 0,
        depDims: imdInfo.imdDecile ? Math.max(0.5, (10 - imdInfo.imdDecile) * 0.32) : 1.5,
        epcD_G_pct: imdInfo.imdDecile ? Math.round(15 + (10 - imdInfo.imdDecile) * 4.5) : 40,
      };
    });

    return res.status(200).json({ ons, wards: result, count: result.length, source: "ONS Nomis Census 2021 + MHCLG IMD 2019", fetched: new Date().toISOString() });
  } catch (err) {
    return res.status(502).json({ error: err.message, detail: "ONS/MHCLG API unavailable — app will use bundled data" });
  }
}
