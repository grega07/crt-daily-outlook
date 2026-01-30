// assets/app.js
(() => {
  const API_URL = "https://crt-outlook-api.gregorjanezic.workers.dev/api/status";

  const statusEl = document.getElementById("status");
  const gridEl = document.getElementById("grid");
  const refreshBtn = document.getElementById("refreshBtn");

  function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[c]));
  }

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function render(data) {
    const items = Array.isArray(data?.items) ? data.items : [];

    if (!gridEl) return;

    if (items.length === 0) {
      gridEl.innerHTML = `<div class="card"><div class="row"><b>No active signals</b></div>
        <div class="meta">Nothing in the list right now.</div></div>`;
      return;
    }

    gridEl.innerHTML = items.map((it) => {
      const dir = (it.direction || "").toLowerCase();
      const cls = dir === "bull" ? "bull" : (dir === "bear" ? "bear" : "");
      const badge = `<span class="badge ${cls}">${esc(dir || "n/a")}</span>`;
      return `
        <div class="card">
          <div class="row">
            <b>${esc(it.symbol)}</b>
            ${badge}
          </div>
          <div class="meta">
            TF: <b>${esc(it.tf)}</b><br/>
            Updated: ${esc(data.updatedAt || it.timestamp || "")}
          </div>
        </div>
      `;
    }).join("");
  }

  async function load() {
    try {
      setStatus("Loading…");
      if (gridEl) gridEl.innerHTML = "";

      const res = await fetch(API_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);

      const data = await res.json();
      render(data);

      const when = data?.updatedAt ? `Last update: ${data.updatedAt}` : "Loaded";
      setStatus(when);
    } catch (err) {
      console.error(err);
      setStatus("Error (open console)");
      if (gridEl) {
        gridEl.innerHTML = `
          <div class="card">
            <div class="row"><b>Could not load data</b></div>
            <div class="meta">${esc(err?.message || err)}</div>
          </div>`;
      }
    }
  }

  if (refreshBtn) refreshBtn.addEventListener("click", load);
  load();
})();

