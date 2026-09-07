/* SocialBot board v3 — stacked column, copy-first, no nested scroll */
const STATE_KEY = "socialbot-board-v3-sep7-2026";

const DATA = {
  weekOf: "2026-09-07",
  weekLabel: "Sep 7–11, 2026",
  timezone: "America/Chicago",
  status: "awaiting_lock",
  channels: ["LinkedIn", "X"],
  build: "SocialBot board v3",
  days: [
    {
      id: "mon",
      date: "2026-09-07",
      dow: "Mon",
      subject: "Square for AI",
      blurb: "SMB adoption gap / Square-for-AI thesis.",
      status: "ready",
      statusLabel: "Ready — waiting lock",
      format: "Text + graphic",
      source: "Ian 9/1 rewrite + Fed adoption graphic",
      inputType: "essay",
      graphic: "Fed adoption (note in meta)",
      linkedin: `SQUARE FOR AI

Wrote this recently in an essay but absolutely think there's a "Square for AI" type business to be built right now.

So far small businesses aren't really adopting AI. A Fed report surveyed small employers and while 46% are using AI, only 7% have fully integrated it. AI adoption isn't binary, its a scale. Just using Claude to check your emails or send you customer service reports is merely scratching the surface. Agents can now fully automate entire backoffice workflows if someone actually spends the time to set it up.

The market is there. The report also said that 43% of users struggled to adapt these tools and 54% of planned adopters found it hard to find a tool that fit their needs.`,
      x: `there's a square for AI to be built right now.

fed: 46% of small employers using AI, 7% fully integrated. 43% struggled to adapt the tools, 54% of planned adopters couldn't find a fit.

claude for email isn't adoption. agents can run the back office if someone sets it up.`
    },
    {
      id: "tue",
      date: "2026-09-08",
      dow: "Tue",
      subject: "Katz clip",
      blurb: "Agents need identity/auth/budget before autonomy (ClickHouse Katz / 20VC clip).",
      status: "clip_ready",
      statusLabel: "Clip ready — captions draft",
      format: "Vertical clip + captions",
      source: "Aaron Katz · ClickHouse · 20VC — sequential VO vertical ~60s",
      inputType: "clip",
      graphic: "Clip package",
      linkedin: `Agents that provision infra need identity, authorization, and a budget first.

Human oversight is still carrying most of these systems. The control plane is the product before autonomy is.

(Clip: Aaron Katz · ClickHouse · 20VC — sequential VO vertical ~60s)`,
      x: `agents that provision infra need identity, authorization, and a budget first.

human oversight is still carrying the system. control plane before autonomy.`
    },
    {
      id: "wed",
      date: "2026-09-09",
      dow: "Wed",
      subject: "Nvidia China-hedge",
      blurb: "Nvidia OSS as hedge vs Chinese models-on-Chinese-chips.",
      status: "needs_draft",
      statusLabel: "Needs draft",
      format: "Essay slice / thread",
      source: "Nvidia essay §7 China-hedge twist",
      inputType: "essay",
      graphic: "—",
      linkedin: "[Needs draft — Nvidia essay §7 China-hedge twist. Lock week to greenlight.]",
      x: "[Needs draft — Nvidia essay §7 China-hedge twist. Lock week to greenlight.]"
    },
    {
      id: "thu",
      date: "2026-09-10",
      dow: "Thu",
      subject: "News slot",
      blurb: "Open news slot (Cisco was placeholder; Scout fuel waiting).",
      status: "needs_take",
      statusLabel: "Needs your take",
      format: "News + Ian take",
      source: "Scout candidates waiting",
      inputType: "news",
      graphic: "—",
      linkedin: "[Needs your take — candidates: GitHub HydraFusion routing; CIO Dive outcome billing; Cisco open-weight agent traffic.]",
      x: "[Needs your take — candidates: GitHub HydraFusion routing; CIO Dive outcome billing; Cisco open-weight agent traffic.]"
    },
    {
      id: "fri",
      date: "2026-09-11",
      dow: "Fri",
      subject: "CoS chart (CVE parabolic)",
      blurb: "Critical CVEs under ~100/mo → 600+; high >2,000.",
      status: "ready",
      statusLabel: "Draft ready",
      format: "Chart or text",
      source: "CoS CVE parabolic chart / draft",
      inputType: "chart",
      graphic: "a16z critical vulns parabolic",
      linkedin: `Critical and high-severity CVEs at major software cos went from under ~100 critical a month to 600+, with high over 2,000, in mid-2026.

That is not a slow creep. Patch calendars, SLA clocks, and cyber insurance models were still priced for the old slope.

If you are also shipping agents with write access into that stack, I think the control plane problem and the vuln problem are the same budget conversation. One without the other is theater.`,
      x: `critical cves at big software cos went from under ~100/month to 600+. high severity cleared 2,000.

patch calendars and cyber insurance were priced for the old slope.

if you're also giving agents write access into that stack, the control plane and the vuln budget are the same conversation.`
    }
  ],
  queue: [
    { id: "q-hydrafusion", kind: "Scout", title: "GitHub HydraFusion multi-model routing cost vs quality" },
    { id: "q-cio-dive", kind: "Scout", title: "CIO Dive agentic outcome-based billing" },
    { id: "q-anthropic-compute", kind: "Scout", title: "Anthropic ~$517B compute / GW (TI)" },
    { id: "q-openai-wiki", kind: "Scout", title: "OpenAI wiki incident → disclosure framework" },
    { id: "q-singerman", kind: "Holding", title: "Singerman concentration ≠ calibration" },
    { id: "q-ken-roi", kind: "Holding", title: "Ken ROI without denominator" },
    { id: "q-lambda", kind: "Swap", title: "Anthropic–Lambda ~$35B Nvidia lease stack" }
  ]
};

function defaultState() {
  const days = {};
  DATA.days.forEach(d => {
    days[d.id] = {
      decision: null,
      note: "",
      linkedin: d.linkedin,
      x: d.x,
      viewChannel: "linkedin",
      openEditor: null
    };
  });
  const promoted = {};
  DATA.queue.forEach(q => { promoted[q.id] = false; });
  return { days, promoted };
}

function loadState() {
  try {
    const raw = JSON.parse(localStorage.getItem(STATE_KEY) || "null");
    if (!raw || !raw.days) return defaultState();
    const base = defaultState();
    DATA.days.forEach(d => {
      if (raw.days[d.id]) {
        base.days[d.id] = {
          ...base.days[d.id],
          ...raw.days[d.id],
          viewChannel: raw.days[d.id].viewChannel === "x" ? "x" : "linkedin",
          openEditor: null
        };
      }
    });
    if (raw.promoted) {
      Object.keys(base.promoted).forEach(id => {
        if (raw.promoted[id]) base.promoted[id] = true;
      });
    }
    return base;
  } catch {
    return defaultState();
  }
}

function persist(state) {
  const toSave = {
    days: {},
    promoted: { ...state.promoted }
  };
  Object.entries(state.days).forEach(([id, v]) => {
    toSave.days[id] = {
      decision: v.decision,
      note: v.note || "",
      linkedin: v.linkedin,
      x: v.x,
      viewChannel: v.viewChannel || "linkedin"
    };
  });
  localStorage.setItem(STATE_KEY, JSON.stringify(toSave));
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isPlaceholder(text) {
  return /^\[Needs /.test(String(text || "").trim());
}

function dayCardHTML(day, st) {
  const view = st.viewChannel === "x" ? "x" : "linkedin";
  const body = view === "x" ? st.x : st.linkedin;
  const previewClass = isPlaceholder(body) ? "draft-preview placeholder" : "draft-preview";
  const statusCls = String(day.status || "tbd");
  const cardCls = [
    "day",
    st.decision === "killed" ? "killed" : "",
    st.decision === "approved" ? "approved" : ""
  ].filter(Boolean).join(" ");
  const liView = view === "linkedin" ? "open" : "";
  const xView = view === "x" ? "open" : "";
  const liEdit = st.openEditor === "linkedin" ? "open" : "";
  const xEdit = st.openEditor === "x" ? "open" : "";
  const draftLabel = view === "x" ? "Draft · X" : "Draft · LinkedIn (primary)";

  return `
  <article class="${cardCls}" data-id="${day.id}">
    <div class="day-head">
      <div class="day-livery">
        <span class="livery">${day.dow.slice(0, 1)}</span>
        <span class="dow">${day.dow} · ${day.date.slice(5).replace("-", "/")}</span>
      </div>
      <span class="status ${statusCls}">${escapeHtml(day.statusLabel)}</span>
    </div>
    <h3 class="subject">${escapeHtml(day.subject)}</h3>
    <p class="blurb">${escapeHtml(day.blurb)}</p>

    <div class="draft-block">
      <div class="draft-label">${draftLabel}</div>
      <pre class="${previewClass}">${escapeHtml(body)}</pre>
    </div>

    <div class="channel-bar">
      <button type="button" class="channel-btn ${liView}" data-view="linkedin">LinkedIn</button>
      <button type="button" class="channel-btn ${xView}" data-view="x">X</button>
      <button type="button" class="channel-btn ${liEdit}" data-ch="linkedin">LinkedIn<span class="ch-tag">edit</span></button>
      <button type="button" class="channel-btn ${xEdit}" data-ch="x">X<span class="ch-tag">edit</span></button>
    </div>

    <div class="editor-pane ${liEdit}" data-editor="linkedin">
      <h4>LinkedIn copy</h4>
      <textarea data-field="linkedin">${escapeHtml(st.linkedin)}</textarea>
      <div class="editor-actions">
        <button type="button" class="primary" data-save="linkedin">Save</button>
        <button type="button" data-close="linkedin">Close</button>
        <span class="saved-flash" data-flash="linkedin">Saved</span>
      </div>
    </div>

    <div class="editor-pane ${xEdit}" data-editor="x">
      <h4>X copy</h4>
      <textarea data-field="x">${escapeHtml(st.x)}</textarea>
      <div class="editor-actions">
        <button type="button" class="primary" data-save="x">Save</button>
        <button type="button" data-close="x">Close</button>
        <span class="saved-flash" data-flash="x">Saved</span>
      </div>
    </div>

    <details class="meta-details">
      <summary>Metadata</summary>
      <div class="meta-grid">
        <b>Format</b><span>${escapeHtml(day.format)}</span>
        <b>Source</b><span>${escapeHtml(day.source)}</span>
        <b>Type</b><span>${escapeHtml(day.inputType)}</span>
        <b>Graphic</b><span>${escapeHtml(day.graphic || "—")}</span>
        <b>Channels</b><span>LinkedIn · X</span>
      </div>
    </details>

    <div class="day-actions">
      <button type="button" class="primary" data-act="approved">Approve</button>
      <button type="button" data-act="note">Save note</button>
      <button type="button" class="danger" data-act="killed">Kill</button>
    </div>
  </article>`;
}

function queueCardHTML(item, promoted) {
  return `
  <div class="queue-card ${promoted ? "promoted" : ""}" data-qid="${item.id}">
    <div class="q-body">
      <div class="q-kind">${escapeHtml(item.kind)}</div>
      <p class="q-title">${escapeHtml(item.title)}</p>
    </div>
    ${promoted
      ? `<span class="q-badge">Promoted</span><button type="button" data-promote="0">Undo</button>`
      : `<button type="button" class="primary" data-promote="1">Promote</button>`}
  </div>`;
}

function renderDecisions(state) {
  const el = document.getElementById("decisions");
  const lines = [];
  DATA.days.forEach(d => {
    const st = state.days[d.id];
    if (!st) return;
    const dirtyLi = st.linkedin !== d.linkedin;
    const dirtyX = st.x !== d.x;
    if (!st.decision && !st.note && !dirtyLi && !dirtyX) return;
    const mark = st.decision === "approved" ? "✓" : st.decision === "killed" ? "✗" : "·";
    const edits = [dirtyLi ? "LI edited" : null, dirtyX ? "X edited" : null].filter(Boolean).join(", ");
    const note = st.note ? ` — ${escapeHtml(st.note)}` : "";
    const editBit = edits ? ` (${edits})` : "";
    lines.push(`<li><b>${d.dow.toUpperCase()}</b> ${mark} ${escapeHtml(st.decision || "noted")}${editBit}${note}</li>`);
  });
  const promoted = DATA.queue.filter(q => state.promoted[q.id]).map(q => q.title);
  if (promoted.length) {
    lines.push(`<li><b>QUEUE</b> promoted: ${promoted.map(escapeHtml).join("; ")}</li>`);
  }
  if (!lines.length) {
    el.innerHTML = `<p class="empty">No edits yet. Toggle LinkedIn/X to read full drafts, expand edit to revise, approve/kill a day, or promote from the queue.</p>`;
    return;
  }
  el.innerHTML = `<ul>${lines.join("")}</ul>`;
}

function render(state) {
  document.getElementById("days").innerHTML = DATA.days
    .map(d => dayCardHTML(d, state.days[d.id]))
    .join("");
  document.getElementById("queue").innerHTML = DATA.queue
    .map(q => queueCardHTML(q, !!state.promoted[q.id]))
    .join("");
  renderDecisions(state);
  wire(state);
}

function flash(el) {
  if (!el) return;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 1200);
}

function wire(state) {
  document.querySelectorAll(".day").forEach(card => {
    const id = card.dataset.id;

    card.querySelectorAll("[data-view]").forEach(btn => {
      btn.addEventListener("click", () => {
        state.days[id].viewChannel = btn.dataset.view;
        persist(state);
        render(state);
      });
    });

    card.querySelectorAll(".channel-btn[data-ch]").forEach(btn => {
      btn.addEventListener("click", () => {
        const ch = btn.dataset.ch;
        const cur = state.days[id].openEditor;
        state.days[id].openEditor = cur === ch ? null : ch;
        if (state.days[id].openEditor) {
          state.days[id].viewChannel = ch;
        }
        render(state);
      });
    });

    card.querySelectorAll("[data-save]").forEach(btn => {
      btn.addEventListener("click", () => {
        const field = btn.dataset.save;
        const ta = card.querySelector(`textarea[data-field="${field}"]`);
        state.days[id][field] = ta.value;
        persist(state);
        flash(card.querySelector(`[data-flash="${field}"]`));
        const preview = card.querySelector(".draft-preview");
        if (preview && state.days[id].viewChannel === field) {
          preview.textContent = state.days[id][field];
          preview.classList.toggle("placeholder", isPlaceholder(state.days[id][field]));
        }
        renderDecisions(state);
      });
    });

    card.querySelectorAll("[data-close]").forEach(btn => {
      btn.addEventListener("click", () => {
        state.days[id].openEditor = null;
        render(state);
      });
    });

    card.querySelectorAll("[data-act]").forEach(btn => {
      btn.addEventListener("click", () => {
        const act = btn.dataset.act;
        if (act === "note") {
          const existing = state.days[id].note || "";
          const n = window.prompt("Note for " + id.toUpperCase() + ":", existing);
          if (n === null) return;
          state.days[id].note = n.trim();
        } else {
          state.days[id].decision = act;
        }
        persist(state);
        card.classList.toggle("killed", state.days[id].decision === "killed");
        card.classList.toggle("approved", state.days[id].decision === "approved");
        renderDecisions(state);
      });
    });
  });

  document.querySelectorAll(".queue-card").forEach(card => {
    const qid = card.dataset.qid;
    const btn = card.querySelector("[data-promote]");
    if (!btn) return;
    btn.addEventListener("click", () => {
      state.promoted[qid] = btn.dataset.promote === "1";
      persist(state);
      render(state);
    });
  });
}

function exportLock(state) {
  const days = DATA.days.map(d => {
    const st = state.days[d.id];
    return {
      id: d.id,
      date: d.date,
      dow: d.dow,
      subject: d.subject,
      decision: st.decision,
      note: st.note || "",
      linkedin: st.linkedin,
      x: st.x,
      linkedinEdited: st.linkedin !== d.linkedin,
      xEdited: st.x !== d.x,
      statusLabel: d.statusLabel
    };
  });
  const payload = {
    build: DATA.build,
    weekOf: DATA.weekOf,
    weekLabel: DATA.weekLabel,
    exportedAt: new Date().toISOString(),
    days,
    queue: DATA.queue.map(q => ({
      id: q.id,
      kind: q.kind,
      title: q.title,
      promoted: !!state.promoted[q.id]
    }))
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `socialbot-lock-${DATA.weekOf}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

(function main() {
  const state = loadState();
  render(state);

  document.getElementById("export").addEventListener("click", () => exportLock(state));
  document.getElementById("reset").addEventListener("click", () => {
    if (!confirm("Reset all decisions, edits, and promotions?")) return;
    localStorage.removeItem(STATE_KEY);
    location.reload();
  });
})();
