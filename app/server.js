// Minimal web app: visitor counter stored in PostgreSQL, health endpoint, version from build.
const http = require("node:http");
const { Pool } = require("pg");

const PORT = Number(process.env.PORT || 3000);
// Set at image build time in GitHub Actions (build arg GIT_SHA -> env APP_VERSION).
const VERSION = process.env.APP_VERSION || "dev";

// Connection settings come from the standard PG* environment variables
// (PGHOST, PGUSER, PGPASSWORD, PGDATABASE), provided by docker compose.
const pool = new Pool({
  max: 5,
  connectionTimeoutMillis: 2000,
  query_timeout: 2000,
});
// Without this handler an idle connection error (e.g. DB restart) would crash the app.
pool.on("error", (err) => console.error("db pool error:", err.message));

let schemaReady = false;
async function ensureSchema() {
  if (schemaReady) return;
  await pool.query(
    "CREATE TABLE IF NOT EXISTS visits (id int PRIMARY KEY, count bigint NOT NULL)"
  );
  schemaReady = true;
}

// Atomically increments the counter in the database and returns the new value.
async function countVisit() {
  await ensureSchema();
  const { rows } = await pool.query(
    `INSERT INTO visits (id, count) VALUES (1, 1)
     ON CONFLICT (id) DO UPDATE SET count = visits.count + 1
     RETURNING count`
  );
  return rows[0].count;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}

function page(line, ok) {
  const color = ok ? "#0969da" : "#cf222e";
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>M042 Webapp</title>
<style>
  body { font-family: system-ui, sans-serif; margin: 0; min-height: 100vh;
         display: flex; align-items: center; justify-content: center; background: #ddf4ff; }
  p { font-size: 1.4rem; padding: 1.5rem 2rem; background: #fff; border-radius: 12px;
      border-left: 8px solid ${color}; box-shadow: 0 2px 8px rgba(0,0,0,.08); margin: 1rem; }
</style>
</head>
<body><p id="status">${escapeHtml(line)}</p></body>
</html>`;
}

function send(res, status, type, body) {
  res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  const path = new URL(req.url, "http://localhost").pathname;

  if (path === "/" && (req.method === "GET" || req.method === "HEAD")) {
    try {
      const n = await countVisit();
      send(res, 200, "text/html; charset=utf-8",
        page(`Hallo von Dani – Besucher Nr. ${n} – DB: verbunden – Version: ${VERSION}`, true));
    } catch (err) {
      console.error("visit failed:", err.message);
      send(res, 503, "text/html; charset=utf-8",
        page(`Hallo von Dani – Besucher Nr. unbekannt – DB: FEHLER – nicht erreichbar – Version: ${VERSION}`, false));
    }
    return;
  }

  if (path === "/health") {
    try {
      await pool.query("SELECT 1");
      send(res, 200, "application/json", JSON.stringify({ status: "ok", db: "verbunden", version: VERSION }));
    } catch (err) {
      send(res, 503, "application/json", JSON.stringify({ status: "error", db: "nicht erreichbar", version: VERSION }));
    }
    return;
  }

  send(res, 404, "text/plain; charset=utf-8", "Nicht gefunden");
});

server.listen(PORT, () => console.log(`app listening on :${PORT}, version ${VERSION}`));

// Clean shutdown when docker stops the container.
function shutdown() {
  server.close(() => pool.end().finally(() => process.exit(0)));
  setTimeout(() => process.exit(0), 5000).unref();
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
