export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const q = req.query.q || req.body?.prompt || "";
  if (!q) return res.status(200).json({ status: "Мост работает" });

  try {
    const r = await fetch("https://workers.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
      },
      body: JSON.stringify({ prompt: q })
    });
    const raw = await r.text();
    try {
      return res.status(200).json(JSON.parse(raw));
    } catch {
      return res.status(502).json({ error: "Cloudflare вернул HTML вместо JSON", preview: raw.slice(0, 150) });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
