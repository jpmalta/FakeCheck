// utils/api.js
// Centraliza chamadas ao backend da extensão e expõe uma API no escopo global
// Uso: importScripts('utils/api.js') no service worker/background, então
//      FakeCheckApi.analyzeText(text, source, options)

(function () {
  const DEFAULT_BASE = 'http://127.0.0.1:8000';

  async function fetchWithTimeoutAndSignal(url, options = {}, timeout = 12000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const resp = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      return resp;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  }

  async function analyzeText(text, source = '', opts = {}) {
    // opts: { baseUrl, endpoint, timeout, retries, backoff }
    const baseUrl = opts.baseUrl || DEFAULT_BASE;
    const endpoint = opts.endpoint || '/predict';
    const timeout = opts.timeout || 12000;
    const retries = typeof opts.retries === 'number' ? opts.retries : 1;
    const backoff = typeof opts.backoff === 'number' ? opts.backoff : 300;

    const url = (baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl) + endpoint;

    let attempt = 0;
    let lastErr = null;
    while (attempt <= retries) {
      attempt += 1;
      try {
        const resp = await fetchWithTimeoutAndSignal(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, source })
        }, timeout);

        const contentType = resp.headers.get?.('content-type') || '';
        const bodyText = await resp.text().catch(() => '');
        let bodyJson = null;
        try { if (contentType.includes('application/json')) bodyJson = JSON.parse(bodyText); } catch (e) { bodyJson = null; }

        if (!resp.ok) {
          return {
            ok: false,
            status: resp.status,
            statusText: resp.statusText,
            bodyText,
            bodyJson,
            attempts: attempt
          };
        }

        return { ok: true, status: resp.status, json: bodyJson ?? bodyText, attempts: attempt };
      } catch (err) {
        lastErr = err;
        // timeout or network error
        if (attempt > retries) break;
        // wait backoff (linear)
        await new Promise(r => setTimeout(r, backoff * attempt));
      }
    }

    return { ok: false, error: lastErr?.message || String(lastErr), attempts: attempt };
  }

  // Expose as global for service worker to import via importScripts
  try {
    self.FakeCheckApi = self.FakeCheckApi || {};
    self.FakeCheckApi.analyzeText = analyzeText;
  } catch (e) {
    // ignore if not in worker/global scope
  }
})();
