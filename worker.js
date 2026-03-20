// ── ANM Turni — Cloudflare Worker Proxy ──────────────────────────────────────
// Incolla questo codice su: dash.cloudflare.com → Workers → Create Worker

const ANTHROPIC_API_KEY = "INSERISCI_QUI_LA_TUA_CHIAVE_API"; // es: sk-ant-api03-...
const ALLOWED_ORIGIN = "*"; // oppure metti il tuo dominio GitHub Pages es: "https://tuonome.github.io"

export default {
  async fetch(request) {

    // Gestisci preflight CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // Solo POST
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const body = await request.json();

      // Chiama l'API Anthropic
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(body),
      });

      const data = await resp.json();

      // Rispondi all'app con CORS header
      return new Response(JSON.stringify(data), {
        status: resp.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: { message: err.message } }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        },
      });
    }
  },
};
