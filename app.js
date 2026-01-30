const API_BASE = "https://crt-outlook-api.gregorjanezic.workers.dev";

const grid = document.getElementById("grid");
const statusEl = document.getElementById("status");
const btn = document.getElementById("refreshBtn");

function fmtDirection(d) {
  return d === "bull" ? "Bullish" : "Bearish";
}

function timeAgo(iso) {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "";
  const diff = Math.max(0, Date.now() - t);
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

async function load() {
  statusEl.textContent = "Loading…";
  grid.innerHTML = "";

  const res = await fetch(`${API_BASE}/api/status`);
  if (!res.ok) {
    statusEl.textContent = `API error: ${res.status}`;
    return;
  }

  const data = await res.json();
  const items = data.items || [];

  statusEl.textContent = `Updated: ${new Date(data.updatedAt).toLocaleString()} • Active signals: ${items.length}`;

  if (items.length === 0) {
    grid.innerHTML = `<div class="card">No active D1/W1 CRT signals right now.</div>`;
    return;
  }

  for (const it of items) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="row">
        <div style="font-size:18px;font-weight:900">${it.symbol}</div>
        <div class="badge">${it.tf}</div>
      </div>
      <div class="row">
        <div class="${it.direction}">${fmtDirection(it.direction)}</div>
        <div class="meta">${timeAgo(it.timestamp)}</div>
      </div>
      <div class="meta">TTL: ${Math.round((it.ttlSeconds || 0)/3600)}h</div>
    `;
    grid.appendChild(card);
  }
}

btn.addEventListener("click", load);
load();
