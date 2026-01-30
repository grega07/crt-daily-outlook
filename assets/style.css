// Nastavi tukaj svoj Worker API base URL:
const API_BASE = "https://crt-outlook-api.gregorjanezic.workers.dev";
const STATUS_URL = `${API_BASE}/api/status`;

const els = {
  rows: document.getElementById("rows"),
  lastUpdated: document.getElementById("lastUpdated"),
  pill: document.getElementById("statusPill"),
  err: document.getElementById("errorBox"),
  btn: document.getElementById("btnRefresh"),
  auto: document.getElementById("autoRefresh"),
  apiText: document.getElementById("apiUrlText")
};

els.apiText.textContent = STATUS_URL;

function setPill(type, text){
  els.pill.className = "pill " + (type || "");
  els.pill.textContent = text;
}

function showError(msg){
  els.err.textContent = msg;
  els.err.classList.remove("hidden");
  setPill("err", "Error");
}

function clearError(){
  els.err.classList.add("hidden");
  els.err.textContent = "";
}

function fmtTTL(ttlSeconds){
  if (!ttlSeconds && ttlSeconds !== 0) return "—";
  const h = Math.round(ttlSeconds / 3600);
  return `${h}h`;
}

function safe(x){ return (x === null || x === undefined || x === "") ? "—" : String(x); }

async function loadStatus(){
  clearError();
  setPill("warn", "Loading…");

  try{
    const res = await fetch(STATUS_URL, { cache: "no-store" });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    els.lastUpdated.textContent = `updatedAt: ${safe(data.updatedAt)}`;

    const items = Array.isArray(data.items) ? data.items : [];
    if(items.length === 0){
      els.rows.innerHTML = `<tr><td colspan="5" class="muted">No items (KV je prazen ali TTL je potekel).</td></tr>`;
      setPill("ok", "OK (0)");
      return;
    }

    els.rows.innerHTML = items.map(it => {
      const dir = (it.direction || "").toLowerCase();
      const badgeClass = dir === "bull" ? "bull" : dir === "bear" ? "bear" : "na";
      return `
        <tr>
          <td><strong>${safe(it.symbol)}</strong></td>
          <td>${safe(it.tf)}</td>
          <td><span class="badge ${badgeClass}">${safe(dir || "—")}</span></td>
          <td>${safe(it.timestamp)}</td>
          <td>${fmtTTL(it.ttlSeconds)}</td>
        </tr>
      `;
    }).join("");

    setPill("ok", `OK (${items.length})`);
  }catch(e){
    showError(`Ne morem prebrati ${STATUS_URL} → ${e.message}`);
    els.rows.innerHTML = `<tr><td colspan="5" class="muted">—</td></tr>`;
  }
}

let timer = null;
function startAuto(){
  if(timer) clearInterval(timer);
  if(els.auto.checked){
    timer = setInterval(loadStatus, 30000);
  }
}

els.btn.addEventListener("click", loadStatus);
els.auto.addEventListener("change", startAuto);

loadStatus();
startAuto();
