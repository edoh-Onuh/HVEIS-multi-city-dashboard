// Fetches DLUHC Statutory Homelessness statistics
// Source: GOV.UK DLUHC Statutory Homelessness Open Data
// https://www.gov.uk/government/collections/homelessness-statistics
// The latest published CSV endpoint from DLUHC Open Data
// Licensed under Open Government Licence v3.0

const DLUHC_NATIONAL_URL =
  "https://assets.publishing.service.gov.uk/media/homelessness/A1_England_data.csv";

function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim());
  return lines.slice(1).map((line) => {
    const vals = line.split(",").map((v) => v.replace(/"/g, "").trim());
    return Object.fromEntries(headers.map((h, i) => [h, vals[i]]));
  });
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=43200, stale-while-revalidate=604800"); // 12h cache

  try {
    const r = await fetch(DLUHC_NATIONAL_URL, { headers: { Accept: "text/csv" } });
    if (!r.ok) throw new Error(`DLUHC ${r.status}`);
    const text = await r.text();
    const rows = parseCSV(text);

    // Extract most recent England totals
    const englandRows = rows.filter((row) => row["Area"] === "England" || row["area_code"] === "E92000001");
    const latest = englandRows[englandRows.length - 1];

    return res.status(200).json({
      source: "DLUHC Statutory Homelessness Open Data",
      fetched: new Date().toISOString(),
      latest,
      totalRows: rows.length,
    });
  } catch (err) {
    // Fall back to bundled DLUHC Q3 2025 statistics published in homelessness.js
    return res.status(502).json({ error: err.message, fallback: true });
  }
}
