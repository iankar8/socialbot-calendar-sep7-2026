const STATE_KEY = "socialbot-calendar-v1-claude-brief";

async function loadCalendar() {
  return {
  "title": "SocialBot Editorial Calendar",
  "weekOf": "2026-09-07",
  "weekLabel": "Sep 7\u201311, 2026",
  "timezone": "America/Chicago",
  "status": "awaiting_lock",
  "channels": [
    "LinkedIn",
    "X"
  ],
  "mixNote": "1 ready text \u00b7 1 clip \u00b7 1 essay \u00b7 1 news \u00b7 1 chart-or-backup. Same take twice banned across days.",
  "days": [
    {
      "id": "mon",
      "date": "2026-09-07",
      "dow": "Mon",
      "channels": [
        "LinkedIn",
        "X"
      ],
      "format": "Text + graphic",
      "subject": "Square for AI / Fed 46%\u21927%",
      "source": "Ian 9/1 rewrite + Fed adoption graphic v2",
      "inputType": "essay",
      "status": "ready",
      "statusLabel": "Ready \u2014 waiting lock",
      "notes": "Light-edit only on Ian's copy. Essay URL in comment/reply."
    },
    {
      "id": "tue",
      "date": "2026-09-08",
      "dow": "Tue",
      "channels": [
        "LinkedIn",
        "X"
      ],
      "format": "Vertical clip + captions",
      "subject": "Agents need identity / auth / budget before autonomy",
      "source": "Aaron Katz \u00b7 ClickHouse \u00b7 20VC \u00b7 v3-vo-sequential.mp4",
      "inputType": "clip",
      "status": "ready",
      "statusLabel": "Clip ready \u2014 captions to polish",
      "notes": "Sequential VO package (~60s). Disclose synthetic VO."
    },
    {
      "id": "wed",
      "date": "2026-09-09",
      "dow": "Wed",
      "channels": [
        "LinkedIn",
        "X"
      ],
      "format": "Essay slice / thread",
      "subject": "Nvidia open-source as hedge vs Chinese models-on-Chinese-chips",
      "source": "Locked Nvidia essay \u2014 unused Section 7 twist",
      "inputType": "essay",
      "status": "needs_draft",
      "statusLabel": "Needs draft",
      "notes": "\u2260 08-28 P&L/incentive take. Optional alt: $20B \u2248 <3 weeks of NVDA revenue."
    },
    {
      "id": "thu",
      "date": "2026-09-10",
      "dow": "Thu",
      "channels": [
        "LinkedIn",
        "X"
      ],
      "format": "News + Ian take",
      "subject": "Cisco: majority of 90k-employee agent traffic on open weights on own GPUs",
      "source": "https://ai2.work/blog/cisco-sends-most-90-000-employee-ai-agent-traffic-to-open-models",
      "inputType": "news",
      "status": "needs_take",
      "statusLabel": "Needs your take",
      "notes": "Optional swap: Anthropic\u2013Lambda ~$35B / Nvidia lease stack (WSJ)."
    },
    {
      "id": "fri",
      "date": "2026-09-11",
      "dow": "Fri",
      "channels": [
        "LinkedIn",
        "X"
      ],
      "format": "Chart or text",
      "subject": "CoS Monday chart if it lands; else concentration \u2260 calibration (Singerman)",
      "source": "CoS ping / drafts/2026-09-04.md",
      "inputType": "chart",
      "status": "tbd",
      "statusLabel": "Chart TBD \u00b7 Singerman backup ready",
      "notes": "Optional swap: unused vendor-dependency essay."
    }
  ],
  "holding": [
    "Aug 27\u201331: megawatt, Casado, Nvidia P&L, Slootman, McKinsey 80/6, Cursor CoC",
    "Sep 3: Ken ROI kill-list",
    "Arcana company Azure/outage drafts (parked with Arcana social)"
  ],
  "optionalSwaps": [
    {
      "slot": "Thu",
      "alt": "Anthropic\u2013Lambda ~$35B / Nvidia lease stack (WSJ)"
    },
    {
      "slot": "Fri",
      "alt": "Unmanaged vendor-dependency essay"
    }
  ]
};
}

function statusClass(s) {
  return String(s || "tbd").replace(/\s+/g, "_");
}

function loadState() {
  try { return JSON.parse(localStorage.getItem(STATE_KEY) || "{}"); }
  catch { return {}; }
}

function saveState(state) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
  renderDecisions(state);
}

function renderDecisions(state) {
  const el = document.getElementById("decisions");
  const days = Object.entries(state);
  if (!days.length) {
    el.textContent = "No edits yet. Approve, kill, or annotate a day.";
    return;
  }
  el.innerHTML = days.map(([id, v]) => {
    const mark = v.decision === "approved" ? "✓" : v.decision === "killed" ? "✗" : "·";
    const note = v.note ? ` — ${v.note}` : "";
    return `<li><b>${id.toUpperCase()}</b> ${mark} ${v.decision || "noted"}${note}</li>`;
  }).join("");
}

function cardHTML(day, state) {
  const st = state[day.id] || {};
  const cls = ["card", st.decision === "killed" ? "killed" : "", st.decision === "approved" ? "approved" : ""]
    .filter(Boolean).join(" ");
  return `
  <article class="${cls}" data-id="${day.id}">
    <div class="livery">${day.dow.slice(0,1)}</div>
    <div class="dow">${day.dow} · ${day.date.slice(5)}</div>
    <h3 class="subject">${day.subject}</h3>
    <div class="status ${statusClass(day.status)}">${day.statusLabel}</div>
    <div class="meta"><b>Format</b> ${day.format}<br>
    <b>Channels</b> ${day.channels.join(" · ")}<br>
    <b>Source</b> ${day.source}<br>
    <b>Type</b> ${day.inputType}</div>
    <div class="meta">${day.notes || ""}</div>
    <textarea placeholder="Your edit / swap note…">${st.note || ""}</textarea>
    <div class="actions">
      <button class="primary" data-act="approved">Approve</button>
      <button data-act="note">Save note</button>
      <button class="danger" data-act="killed">Kill</button>
    </div>
  </article>`;
}

function wire(state) {
  document.querySelectorAll(".card").forEach(card => {
    const id = card.dataset.id;
    const ta = card.querySelector("textarea");
    card.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        const act = btn.dataset.act;
        state[id] = state[id] || {};
        if (act === "note") {
          state[id].note = ta.value.trim();
        } else {
          state[id].decision = act;
          state[id].note = ta.value.trim();
        }
        saveState(state);
        card.classList.toggle("killed", state[id].decision === "killed");
        card.classList.toggle("approved", state[id].decision === "approved");
        renderDecisions(state);
      });
    });
  });
}

(async function main() {
  const data = await loadCalendar();
  document.getElementById("week").textContent = data.weekLabel;
  document.getElementById("mix").textContent = data.mixNote;
  document.getElementById("holding").innerHTML = data.holding.map(h => `<li>${h}</li>`).join("");
  document.getElementById("swaps").innerHTML = data.optionalSwaps
    .map(s => `<li><b>${s.slot}</b> → ${s.alt}</li>`).join("");

  const state = loadState();
  document.getElementById("grid").innerHTML = data.days.map(d => cardHTML(d, state)).join("");
  wire(state);
  renderDecisions(state);

  document.getElementById("export").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify({ calendar: data, decisions: state, build: "Claude-brief · SocialBot-exec" }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `claude-brief-calendar-lock-${data.weekOf}.json`;
    a.click();
  });
  document.getElementById("reset").addEventListener("click", () => {
    localStorage.removeItem(STATE_KEY);
    location.reload();
  });
})();
