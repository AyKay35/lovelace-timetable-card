/**
 * Timetable Card for Home Assistant
 * https://github.com/ay-kay/lovelace-timetable-card
 * @license MIT
 * @version 2.0.0
 */

const CARD_VERSION = "2.0.0";
console.info(
  `%c TIMETABLE-CARD %c v${CARD_VERSION} `,
  "background:#60a5fa;color:white;font-weight:900;padding:2px 4px;border-radius:4px 0 0 4px",
  "background:#1d4ed8;color:white;font-weight:700;padding:2px 4px;border-radius:0 4px 4px 0"
);

/* ═══════════════════════════════════════════════════
   SUBJECT HELPERS
═══════════════════════════════════════════════════ */
function hexToRgb(hex) {
  const h = hex.replace("#","");
  const f = h.length===3 ? h.split("").map(c=>c+c).join("") : h;
  const n = parseInt(f,16);
  return { r:(n>>16)&255, g:(n>>8)&255, b:n&255 };
}
function lighten(hex, ratio) {
  const {r,g,b} = hexToRgb(hex);
  const m = c => Math.round(c+(255-c)*ratio);
  const x = c => m(c).toString(16).padStart(2,"0");
  return `#${x(r)}${x(g)}${x(b)}`;
}
function buildSubjectStyle(color) {
  return { bg:lighten(color,0.82), text:color, border:lighten(color,0.55) };
}
function buildSubjectMap(subjects=[]) {
  const map={};
  for (const s of subjects) if (s.name&&s.color) map[s.name]=buildSubjectStyle(s.color);
  return map;
}
const FALLBACK = { bg:"#f1f5f9", text:"#475569", border:"#cbd5e1" };

/* ═══════════════════════════════════════════════════
   DEFAULTS
═══════════════════════════════════════════════════ */
const DEFAULT_SUBJECTS = [
  { name:"Mathe",       color:"#1d4ed8" },
  { name:"Deutsch",     color:"#854d0e" },
  { name:"Englisch",    color:"#065f46" },
  { name:"Sport",       color:"#5b21b6" },
  { name:"Musik",       color:"#991b1b" },
  { name:"Kunst",       color:"#9d174d" },
  { name:"Sachkunde",   color:"#0f766e" },
  { name:"Religion",    color:"#9a3412" },
  { name:"Geschichte",  color:"#9f1239" },
  { name:"Biologie",    color:"#166534" },
  { name:"Physik",      color:"#075985" },
  { name:"Chemie",      color:"#92400e" },
  { name:"Französisch", color:"#6b21a8" },
  { name:"Informatik",  color:"#3730a3" },
  { name:"KlaRa",       color:"#7e22ce" },
  { name:"LZ",          color:"#14532d" },
  { name:"Coach",       color:"#881337" },
  { name:"Ethik",       color:"#0369a1" },
  { name:"Geographie",  color:"#15803d" },
  { name:"Werken",      color:"#b45309" },
];

const DEFAULT_KIDS = [
  {
    name:"Beispiel Kind", age:"1. Klasse", emoji:"⭐",
    color:"#60a5fa", accent:"#1d4ed8", light:"#eff6ff",
    slots:[
      {slot:1,time:"08:00",end:"08:45"},
      {slot:2,time:"08:45",end:"09:30"},
      {slot:3,time:"09:50",end:"10:35"},
      {slot:4,time:"10:35",end:"11:20"},
    ],
    schedule:{Mo:[],Di:[],Mi:[],Do:[],Fr:[]},
  },
];

const COLOR_PRESETS = [
  {color:"#f87171",accent:"#b91c1c",light:"#fff1f2"},
  {color:"#f472b6",accent:"#be185d",light:"#fdf2f8"},
  {color:"#60a5fa",accent:"#1d4ed8",light:"#eff6ff"},
  {color:"#4ade80",accent:"#15803d",light:"#f0fdf4"},
  {color:"#fb923c",accent:"#c2410c",light:"#fff7ed"},
  {color:"#a78bfa",accent:"#6d28d9",light:"#f5f3ff"},
  {color:"#fbbf24",accent:"#b45309",light:"#fffbeb"},
  {color:"#2dd4bf",accent:"#0f766e",light:"#f0fdfa"},
];
const EMOJIS  = ["⚡","🌸","⭐","🚀","🦋","🌿","🎯","🎨","🏆","🦊","🐬","🌈","🎸","🦄","🏄","🎭"];
const DAYS    = ["Mo","Di","Mi","Do","Fr"];
const DAY_FULL= ["Montag","Dienstag","Mittwoch","Donnerstag","Freitag"];

/* ═══════════════════════════════════════════════════
   SHARED TIMETABLE HTML BUILDER
   Used by both Card (read-only) and Editor (interactive)
═══════════════════════════════════════════════════ */
function buildTimetableHTML(kid, subjectMap, opts={}) {
  const {
    editable   = false,
    selected   = null,
    todayColIdx= new Date().getDay()-1,
  } = opts;

  const maxSlot  = Math.max(...DAYS.flatMap(d=>(kid.schedule[d]||[]).map(l=>l.slot)),2);
  const visSlots = editable ? kid.slots : kid.slots.filter(s=>s.slot<=maxSlot);
  const css      = `--kid-color:${kid.color};--kid-accent:${kid.accent};--kid-light:${kid.light};`;

  return `
    <div class="table-wrap">
      <table style="${css}">
        <thead><tr>
          <th class="th-corner"></th>
          ${DAYS.map((d,i)=>`
            <th class="th-day ${i===todayColIdx?"today":""}" style="${css}">
              <div class="day-label">${DAY_FULL[i].slice(0,2)}<span>${DAY_FULL[i].slice(2)}</span></div>
              ${i===todayColIdx?`<div class="today-dot" style="background:${kid.color};box-shadow:0 0 5px ${kid.color}"></div>`:""}
            </th>`).join("")}
        </tr></thead>
        <tbody>
          ${visSlots.map((s,rowIdx)=>{
            const isLast  = rowIdx===visSlots.length-1;
            const bigBreak= s.slot===2||s.slot===4;
            const rowCls  = isLast?"row-last":bigBreak?"row-break":"row-normal";
            return `
              <tr class="${rowCls} ${rowIdx%2===0?"row-even":"row-odd"}">
                <td class="td-time">
                  <div class="slot-num">${s.slot}</div>
                  <div class="slot-time">${s.time}</div>
                  <div class="slot-end">${s.end}</div>
                </td>
                ${DAYS.map((day,colIdx)=>{
                  const isToday = colIdx===todayColIdx;
                  const lesson  = (kid.schedule[day]||[]).find(l=>l.slot===s.slot);
                  const sc      = lesson?(subjectMap[lesson.subject]||FALLBACK):null;
                  return `
                    <td class="td-subject ${isToday?(rowIdx%2===0?"today-col":"today-col alt"):""}"
                      style="${css}"
                      ${editable?`data-action="slot-click" data-day="${day}" data-slot="${s.slot}" data-current="${lesson?lesson.subject:""}" ondragover="event.preventDefault()" ondrop="event.stopPropagation()`:""}>
                      ${lesson
                        ? `<div class="chip ${editable?"draggable":""}"
                            style="background:${sc.bg};color:${sc.text};border-color:${sc.border}"
                            ${editable?`draggable="true" data-action="chip-drag" data-subject="${lesson.subject}" data-day="${day}" data-slot="${s.slot}"`:""}
                          >
                            ${lesson.subject}
                            ${editable?`<button class="chip-remove" data-action="remove-subject" data-day="${day}" data-slot="${s.slot}">×</button>`:""}
                          </div>`
                        : editable
                          ? `<div class="cell-empty ${selected?"droptarget":""}" style="${selected?`border-color:${kid.color};color:${kid.color}`:""}">+</div>`
                          : `<span class="cell-dot">·</span>`
                      }
                    </td>`;
                }).join("")}
              </tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>`;
}

/* ═══════════════════════════════════════════════════
   SHARED TABLE STYLES
═══════════════════════════════════════════════════ */
const TABLE_STYLES = `
  .table-wrap { overflow-x:auto; padding:14px; }
  table { width:100%; border-collapse:collapse; border-radius:12px; overflow:hidden; box-shadow:0 1px 8px rgba(0,0,0,0.05); background:var(--card-background-color,white); }
  .th-corner { width:80px; background:var(--secondary-background-color,#f8fafc); border-right:2px solid var(--divider-color,#e2e8f0); border-bottom:2px solid var(--divider-color,#e2e8f0); }
  .th-day { padding:11px 6px; text-align:center; background:var(--secondary-background-color,#f8fafc); border-bottom:2px solid var(--divider-color,#e2e8f0); }
  .th-day:not(:last-child) { border-right:1px solid color-mix(in srgb,var(--divider-color,#e2e8f0) 80%,transparent); }
  .th-day.today { background:color-mix(in srgb,var(--kid-color,#60a5fa) 18%,transparent); border-bottom-color:var(--kid-color,#60a5fa); }
  .day-label { font-size:12.5px; font-weight:900; color:var(--secondary-text-color,#475569); }
  .day-label span { font-weight:700; }
  .th-day.today .day-label { color:var(--kid-accent,#1d4ed8); }
  .today-dot { width:5px; height:5px; border-radius:50%; margin:4px auto 0; }
  .td-time { padding:8px; background:var(--secondary-background-color,#f8fafc); border-right:2px solid var(--divider-color,#e2e8f0); vertical-align:middle; text-align:center; }
  .slot-num { width:19px; height:19px; border-radius:50%; background:var(--divider-color,#e2e8f0); color:var(--secondary-text-color,#64748b); font-weight:900; font-size:10px; margin:0 auto 2px; display:flex; align-items:center; justify-content:center; }
  .slot-time { font-size:9.5px; font-weight:800; color:var(--secondary-text-color,#64748b); line-height:1; }
  .slot-end  { font-size:9px; color:var(--disabled-color,#94a3b8); font-weight:600; }
  .td-subject { padding:6px 5px; vertical-align:middle; text-align:center; min-width:82px; }
  .td-subject:not(:last-child) { border-right:1px solid color-mix(in srgb,var(--divider-color,#e2e8f0) 60%,transparent); }
  .td-subject.today-col     { background:color-mix(in srgb,var(--kid-color,#60a5fa) 10%,transparent); }
  .td-subject.today-col.alt { background:color-mix(in srgb,var(--kid-color,#60a5fa) 14%,transparent); }
  .row-even  { background:var(--card-background-color,white); }
  .row-odd   { background:color-mix(in srgb,var(--secondary-background-color,#f8fafc) 60%,transparent); }
  .row-break  td { border-bottom:2px dashed var(--divider-color,#e2e8f0) !important; }
  .row-normal td { border-bottom:1px solid color-mix(in srgb,var(--divider-color,#f0f4f8) 60%,transparent); }
  .row-last   td { border-bottom:none !important; }
  .chip { border-radius:7px; padding:5px 4px; font-size:12px; font-weight:800; line-height:1.2; position:relative; user-select:none; border:1.5px solid transparent; }
  .chip.draggable { cursor:grab; }
  .chip.draggable:active { cursor:grabbing; }
  .chip-remove { position:absolute; top:-5px; right:-5px; width:15px; height:15px; border-radius:50%; background:#ef4444; color:white; font-size:9px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; border:none; box-shadow:0 1px 4px rgba(0,0,0,0.25); }
  .cell-empty { border-radius:7px; padding:8px 4px; font-size:18px; font-weight:900; border:1.5px dashed var(--divider-color,#d1d5db); color:var(--divider-color,#d1d5db); transition:all 0.15s; cursor:pointer; }
  .cell-empty.droptarget { border-color:var(--kid-color,#60a5fa); color:var(--kid-color,#60a5fa); background:color-mix(in srgb,var(--kid-color,#60a5fa) 8%,transparent); }
  .cell-dot { color:var(--disabled-color,#dde3ea); font-size:14px; }
`;

/* ═══════════════════════════════════════════════════
   CARD STYLES (display only)
═══════════════════════════════════════════════════ */
const CARD_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  :host { display:block; font-family:'Nunito',var(--paper-font-common-base_-_font-family,sans-serif); }
  * { box-sizing:border-box; margin:0; padding:0; }
  .card { background:var(--card-background-color,#fff); border-radius:var(--ha-card-border-radius,12px); overflow:hidden; box-shadow:var(--ha-card-box-shadow,0 2px 12px rgba(0,0,0,0.08)); }
  .header { background:var(--card-background-color,#fff); border-bottom:2px solid var(--divider-color,#e2e8f0); }
  .tabs { display:flex; align-items:stretch; }
  .tab { flex:1; padding:11px 6px 13px; background:var(--secondary-background-color,#f8fafc); border:none; border-bottom:3px solid transparent; cursor:pointer; display:flex; align-items:center; gap:7px; justify-content:center; font-family:inherit; transition:all 0.18s; }
  .tab:hover { filter:brightness(0.97); }
  .tab.active { background:var(--kid-light,#eff6ff); border-bottom-color:var(--kid-color,#60a5fa); }
  .tab-avatar { width:30px; height:30px; border-radius:50%; background:var(--disabled-color,#e2e8f0); display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0; transition:all 0.2s; }
  .tab.active .tab-avatar { background:linear-gradient(135deg,var(--kid-color),var(--kid-accent)); box-shadow:0 2px 8px color-mix(in srgb,var(--kid-color) 55%,transparent); }
  .tab-name { font-size:13px; font-weight:900; color:var(--secondary-text-color,#94a3b8); }
  .tab-age  { font-size:10px; font-weight:700; color:var(--disabled-color,#b0bec5); }
  .tab.active .tab-name { color:var(--kid-accent,#1d4ed8); }
  .legend      { margin:10px 14px; display:flex; flex-wrap:wrap; gap:6px; }
  .day-summary { margin:8px 14px 14px; display:flex; gap:7px; flex-wrap:wrap; }
  .legend-chip { border-radius:20px; padding:3px 10px; font-size:11px; font-weight:800; border:1.5px solid transparent; }
  .day-pill { border-radius:9px; padding:4px 10px; display:flex; align-items:center; gap:5px; border:1.5px solid var(--divider-color,#e2e8f0); background:var(--card-background-color,white); }
  .day-pill.today { border-color:var(--kid-color,#60a5fa); background:color-mix(in srgb,var(--kid-color,#60a5fa) 20%,transparent); }
  .day-pill-label { font-size:10.5px; font-weight:900; color:var(--secondary-text-color,#64748b); }
  .day-pill.today .day-pill-label { color:var(--kid-accent,#1d4ed8); }
  .day-pill-count { border-radius:20px; padding:1px 6px; font-size:10.5px; font-weight:800; background:var(--divider-color,#e2e8f0); color:var(--secondary-text-color,#64748b); }
  .day-pill.today .day-pill-count { background:var(--kid-color,#60a5fa); color:white; }
  ${TABLE_STYLES}
`;

/* ═══════════════════════════════════════════════════
   EDITOR STYLES
═══════════════════════════════════════════════════ */
const EDITOR_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  :host { display:block; font-family:'Nunito',var(--paper-font-common-base_-_font-family,sans-serif); }
  * { box-sizing:border-box; margin:0; padding:0; }

  /* ── Tabs ── */
  .editor-tabs { display:flex; align-items:stretch; border-bottom:2px solid var(--divider-color,#e2e8f0); background:var(--card-background-color,white); flex-wrap:nowrap; overflow-x:auto; }
  .etab { flex-shrink:0; padding:10px 14px 12px; border:none; border-bottom:3px solid transparent; background:transparent; cursor:pointer; font-family:inherit; display:flex; align-items:center; gap:6px; font-size:13px; font-weight:800; color:var(--secondary-text-color,#94a3b8); transition:all 0.18s; white-space:nowrap; }
  .etab:hover { color:var(--primary-text-color); }
  .etab.active { color:var(--kid-accent,#1d4ed8); border-bottom-color:var(--kid-color,#60a5fa); }
  .etab-avatar { width:26px; height:26px; border-radius:50%; background:var(--divider-color,#e2e8f0); display:flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0; transition:all 0.2s; }
  .etab.active .etab-avatar { background:linear-gradient(135deg,var(--kid-color,#60a5fa),var(--kid-accent,#1d4ed8)); }
  .etab-add { padding:10px 16px 12px; border:none; background:transparent; color:var(--secondary-text-color); font-size:20px; font-weight:900; cursor:pointer; border-bottom:3px solid transparent; font-family:inherit; }
  .etab-subjects { margin-left:auto; }

  /* ── Kid info bar ── */
  .kid-bar { display:flex; align-items:center; gap:10px; padding:12px 14px; background:color-mix(in srgb,var(--kid-color,#60a5fa) 8%,transparent); border-bottom:1px solid color-mix(in srgb,var(--kid-color,#60a5fa) 20%,transparent); flex-wrap:wrap; }
  .kid-bar-emoji { font-size:24px; cursor:pointer; }
  .kid-bar-name  { font-size:15px; font-weight:900; color:var(--primary-text-color); flex:1; min-width:80px; padding:6px 10px; border-radius:8px; border:2px solid transparent; background:transparent; font-family:inherit; cursor:pointer; transition:all 0.15s; }
  .kid-bar-name:hover, .kid-bar-name:focus { border-color:var(--kid-color,#60a5fa); background:var(--card-background-color,white); outline:none; }
  .kid-bar-age   { font-size:12px; font-weight:700; color:var(--secondary-text-color); padding:6px 10px; border-radius:8px; border:2px solid transparent; background:transparent; font-family:inherit; cursor:pointer; transition:all 0.15s; min-width:80px; }
  .kid-bar-age:hover, .kid-bar-age:focus { border-color:var(--kid-color,#60a5fa); background:var(--card-background-color,white); outline:none; }
  .color-dots { display:flex; gap:6px; }
  .color-dot { width:22px; height:22px; border-radius:50%; cursor:pointer; border:2.5px solid transparent; transition:all 0.15s; flex-shrink:0; }
  .color-dot.sel { border-color:var(--primary-text-color,#0f172a); transform:scale(1.15); }
  .kid-bar-del { padding:5px 10px; border-radius:8px; border:none; background:#fee2e2; color:#b91c1c; font-size:11px; font-weight:800; cursor:pointer; font-family:inherit; }
  .kid-bar-slots-btn { padding:5px 10px; border-radius:8px; border:none; background:var(--secondary-background-color,#f1f5f9); color:var(--secondary-text-color); font-size:11px; font-weight:800; cursor:pointer; font-family:inherit; }
  .emoji-picker { display:flex; flex-wrap:wrap; gap:5px; padding:10px 14px; background:var(--card-background-color,white); border-bottom:1px solid var(--divider-color,#e2e8f0); }
  .emoji-opt { width:32px; height:32px; border-radius:7px; border:2px solid transparent; background:transparent; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
  .emoji-opt.sel { border-color:var(--kid-color,#60a5fa); background:color-mix(in srgb,var(--kid-color,#60a5fa) 10%,transparent); }

  /* ── Slots editor ── */
  .slots-panel { padding:12px 14px; background:var(--secondary-background-color,#f8fafc); border-bottom:1px solid var(--divider-color,#e2e8f0); }
  .slots-panel h4 { font-size:11px; font-weight:800; color:var(--secondary-text-color); letter-spacing:0.5px; margin-bottom:8px; }
  .slots-grid { display:flex; flex-direction:column; gap:5px; }
  .slot-row { display:flex; align-items:center; gap:6px; }
  .slot-badge { width:20px; height:20px; border-radius:50%; background:var(--divider-color,#e2e8f0); color:var(--secondary-text-color); font-size:10px; font-weight:900; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
  .slot-inp { width:72px; padding:5px 7px; border-radius:7px; border:2px solid var(--divider-color,#e2e8f0); background:var(--card-background-color,white); color:var(--primary-text-color); font-size:12px; font-weight:700; font-family:inherit; outline:none; }
  .slot-inp:focus { border-color:var(--kid-color,#60a5fa); }
  .slot-sep { color:var(--secondary-text-color); font-weight:800; font-size:12px; }
  .slot-del { width:22px; height:22px; border-radius:50%; border:none; background:#fee2e2; color:#ef4444; font-size:13px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .slot-add-btn { margin-top:6px; padding:6px; border-radius:8px; border:2px dashed var(--divider-color,#e2e8f0); background:transparent; color:var(--secondary-text-color); font-size:12px; font-weight:800; cursor:pointer; font-family:inherit; width:100%; }

  /* ── Subject palette ── */
  .palette { padding:12px 14px; border-top:2px solid var(--divider-color,#e2e8f0); }
  .palette-hint { font-size:11px; font-weight:800; color:var(--secondary-text-color,#94a3b8); letter-spacing:0.5px; margin-bottom:8px; }
  .palette-chips { display:flex; flex-wrap:wrap; gap:6px; }
  .p-chip { border-radius:20px; padding:5px 12px; font-size:12px; font-weight:800; border:1.5px solid transparent; cursor:grab; user-select:none; transition:all 0.15s; }
  .p-chip:active { cursor:grabbing; }
  .p-chip.sel { transform:scale(1.06); }
  .clear-sel { margin-top:8px; padding:4px 12px; border-radius:20px; border:none; background:var(--secondary-background-color,#f1f5f9); color:var(--secondary-text-color); font-size:12px; font-weight:800; cursor:pointer; font-family:inherit; }

  /* ── Subjects management ── */
  .subjects-panel { padding:16px 14px; }
  .subjects-panel h4 { font-size:11px; font-weight:800; color:var(--secondary-text-color); letter-spacing:0.5px; margin-bottom:10px; }
  .subj-list { display:flex; flex-direction:column; gap:7px; margin-bottom:10px; }
  .subj-row { display:flex; align-items:center; gap:8px; }
  .subj-swatch { width:28px; height:28px; border-radius:8px; border:2px solid rgba(0,0,0,0.1); flex-shrink:0; cursor:pointer; position:relative; overflow:hidden; }
  .subj-swatch input[type=color] { position:absolute; inset:-4px; width:calc(100%+8px); height:calc(100%+8px); opacity:0; cursor:pointer; border:none; padding:0; }
  .subj-name { flex:1; padding:7px 10px; border-radius:8px; border:2px solid var(--divider-color,#e2e8f0); background:var(--card-background-color,white); color:var(--primary-text-color); font-size:13px; font-weight:700; font-family:inherit; outline:none; }
  .subj-name:focus { border-color:#60a5fa; }
  .subj-del { width:28px; height:28px; border-radius:50%; border:none; background:#fee2e2; color:#ef4444; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .subj-add { width:100%; padding:9px; border-radius:10px; border:2px dashed var(--divider-color,#e2e8f0); background:transparent; color:var(--secondary-text-color); font-size:13px; font-weight:800; cursor:pointer; font-family:inherit; transition:all 0.15s; }
  .subj-add:hover { border-color:#60a5fa; color:#60a5fa; }
  .preview-chips { display:flex; flex-wrap:wrap; gap:6px; margin-top:12px; }
  .preview-chip { border-radius:20px; padding:4px 12px; font-size:12px; font-weight:800; border:1.5px solid transparent; }

  /* ── Export/Import ── */
  .actions-bar { display:flex; gap:8px; padding:10px 14px; border-top:1px solid var(--divider-color,#e2e8f0); }
  .action-btn { padding:7px 14px; border-radius:8px; border:1.5px solid var(--divider-color,#e2e8f0); background:var(--card-background-color,white); color:var(--secondary-text-color); font-size:12px; font-weight:800; cursor:pointer; font-family:inherit; transition:all 0.15s; }
  .action-btn:hover { border-color:#60a5fa; color:#60a5fa; }

  ${TABLE_STYLES}
`;

/* ═══════════════════════════════════════════════════
   VISUAL EDITOR
═══════════════════════════════════════════════════ */
class TimetableCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode:"open"});
    this._config     = {};
    this._kids       = [];
    this._subjects   = [];
    this._subjectMap = {};
    this._activeKid  = 0;
    this._section    = "schedule"; // "schedule" | "subjects"
    this._selected   = null;
    this._drag       = null;
    this._showEmoji  = false;
    this._showSlots  = false;
    this._debounce   = null;
  }

  setConfig(config) {
    // Only reset state on first load, not on every HA update
    this._config     = config;
    this._kids       = JSON.parse(JSON.stringify(config.kids     || DEFAULT_KIDS));
    this._subjects   = JSON.parse(JSON.stringify(config.subjects || DEFAULT_SUBJECTS));
    this._subjectMap = buildSubjectMap(this._subjects);
    this._render();
  }

  set hass(h) { this._hass = h; }

  /* ── Fire change to HA ── */
  _fire() {
    clearTimeout(this._debounce);
    this._debounce = setTimeout(() => {
      this._config = { ...this._config, kids: this._kids, subjects: this._subjects };
      this.dispatchEvent(new CustomEvent("config-changed", {
        detail: { config: this._config }, bubbles:true, composed:true,
      }));
    }, 250);
  }

  /* ── Schedule mutations ── */
  _setLesson(kidIdx, day, slot, subject) {
    const kid  = this._kids[kidIdx];
    let   list = [...(kid.schedule[day]||[])];
    if (subject===null) { list=list.filter(l=>l.slot!==slot); }
    else {
      const i=list.findIndex(l=>l.slot===slot);
      if (i>=0) list[i]={slot,subject};
      else { list.push({slot,subject}); list.sort((a,b)=>a.slot-b.slot); }
    }
    this._kids[kidIdx].schedule[day]=list;
    this._fire();
    this._render();
  }

  /* ── Render ── */
  _render() {
    this.shadowRoot.innerHTML="";
    const style=document.createElement("style");
    style.textContent=EDITOR_STYLES;
    this.shadowRoot.appendChild(style);
    const root=document.createElement("div");
    root.innerHTML=this._buildHTML();
    this.shadowRoot.appendChild(root);
    this._attachEvents(root);
  }

  _kid() { return this._kids[this._activeKid]||this._kids[0]; }
  _css(k){ return `--kid-color:${k.color};--kid-accent:${k.accent};--kid-light:${k.light};`; }

  _buildHTML() {
    const kid = this._kid();
    if (!kid) return "<p style='padding:16px'>Kein Kind konfiguriert.</p>";

    return `
      <!-- Tabs -->
      <div class="editor-tabs">
        ${this._kids.map((k,i)=>`
          <button class="etab ${this._activeKid===i&&this._section==="schedule"?"active":""}"
            style="${this._activeKid===i?this._css(k):""}"
            data-action="tab" data-idx="${i}">
            <div class="etab-avatar">${k.emoji}</div>
            ${k.name}
          </button>`).join("")}
        <button class="etab-add" data-action="add-kid" title="Kind hinzufügen">+</button>
        <button class="etab etab-subjects ${this._section==="subjects"?"active":""}" data-action="tab-subjects">
          🎨 Fächer
        </button>
      </div>

      ${this._section==="subjects" ? this._buildSubjectsPanel() : this._buildSchedulePanel(kid)}
    `;
  }

  _buildSchedulePanel(kid) {
    const css = this._css(kid);
    return `
      <!-- Kid info bar -->
      <div class="kid-bar" style="${css}">
        <div class="kid-bar-emoji" data-action="toggle-emoji" title="Emoji ändern">${kid.emoji}</div>
        <input class="kid-bar-name" data-action="kid-name" value="${kid.name}" placeholder="Name" style="color:${kid.accent}">
        <input class="kid-bar-age"  data-action="kid-age"  value="${kid.age}"  placeholder="Klasse">
        <div class="color-dots">
          ${COLOR_PRESETS.map((c,i)=>`
            <div class="color-dot ${c.color===kid.color?"sel":""}"
              style="background:${c.color};${c.color===kid.color?`outline:2px solid ${c.color};outline-offset:2px`:""}"
              data-action="kid-color" data-ci="${i}"></div>`).join("")}
        </div>
        <button class="kid-bar-slots-btn" data-action="toggle-slots">⏱ Zeiten</button>
        ${this._kids.length>1?`<button class="kid-bar-del" data-action="del-kid">Löschen</button>`:""}
      </div>

      <!-- Emoji picker -->
      ${this._showEmoji?`
        <div class="emoji-picker" style="${css}">
          ${EMOJIS.map(e=>`<button class="emoji-opt ${kid.emoji===e?"sel":""}" data-action="kid-emoji" data-emoji="${e}">${e}</button>`).join("")}
        </div>`:""}

      <!-- Slots panel -->
      ${this._showSlots?`
        <div class="slots-panel">
          <h4>UNTERRICHTSZEITEN</h4>
          <div class="slots-grid">
            ${kid.slots.map((s,i)=>`
              <div class="slot-row">
                <div class="slot-badge">${s.slot}</div>
                <input class="slot-inp" data-action="slot-time" data-idx="${i}" value="${s.time}" placeholder="08:00">
                <span class="slot-sep">–</span>
                <input class="slot-inp" data-action="slot-end"  data-idx="${i}" value="${s.end}"  placeholder="08:45">
                <button class="slot-del" data-action="slot-del" data-idx="${i}">×</button>
              </div>`).join("")}
          </div>
          <button class="slot-add-btn" data-action="slot-add">+ Stunde hinzufügen</button>
        </div>`:""}

      <!-- Timetable grid -->
      ${buildTimetableHTML(kid, this._subjectMap, { editable:true, selected:this._selected })}

      <!-- Subject palette -->
      <div class="palette" style="${css}">
        <div class="palette-hint">
          ${this._selected
            ? `"${this._selected}" ausgewählt — tippe auf ein Feld zum Eintragen`
            : "FÄCHER — antippen zum Auswählen, dann ins Feld tippen · oder direkt ziehen"}
        </div>
        <div class="palette-chips">
          ${this._subjects.map(s=>{
            const sc=this._subjectMap[s.name]||FALLBACK;
            const sel=this._selected===s.name;
            return `<div class="p-chip ${sel?"sel":""}"
              style="background:${sel?sc.text:sc.bg};color:${sel?"white":sc.text};border-color:${sel?sc.text:sc.border};box-shadow:${sel?`0 2px 10px ${sc.text}44`:"none"}"
              draggable="true" data-action="palette-drag" data-subject="${s.name}">${s.name}</div>`;
          }).join("")}
        </div>
        ${this._selected?`<button class="clear-sel" data-action="clear-sel">✕ Auswahl aufheben</button>`:""}
      </div>

      <!-- Export / Import -->
      <div class="actions-bar">
        <button class="action-btn" data-action="export">↓ Backup exportieren</button>
        <button class="action-btn" data-action="import">↑ Backup importieren</button>
        <input type="file" accept=".json" data-action="import-file" style="display:none">
      </div>
    `;
  }

  _buildSubjectsPanel() {
    return `
      <div class="subjects-panel">
        <h4>FÄCHER VERWALTEN</h4>
        <div class="subj-list">
          ${this._subjects.map((s,i)=>{
            const sc=buildSubjectStyle(s.color||"#64748b");
            return `
              <div class="subj-row">
                <div class="subj-swatch" style="background:${sc.bg};border-color:${sc.border}" title="Farbe">
                  <input type="color" value="${s.color||"#64748b"}" data-action="subj-color" data-idx="${i}">
                </div>
                <input class="subj-name" value="${s.name||""}" placeholder="Fachname" data-action="subj-name" data-idx="${i}">
                <button class="subj-del" data-action="subj-del" data-idx="${i}">×</button>
              </div>`;
          }).join("")}
        </div>
        <button class="subj-add" data-action="subj-add">+ Fach hinzufügen</button>
        <div class="preview-chips">
          ${this._subjects.map(s=>{
            const sc=buildSubjectStyle(s.color||"#64748b");
            return `<div class="preview-chip" style="background:${sc.bg};color:${sc.text};border-color:${sc.border}">${s.name||"?"}</div>`;
          }).join("")}
        </div>
      </div>
    `;
  }

  /* ── Events ── */
  _attachEvents(root) {
    root.addEventListener("click",     e=>this._onClick(e));
    root.addEventListener("input",     e=>this._onInput(e));
    root.addEventListener("change",    e=>this._onChange(e));
    root.addEventListener("dragstart", e=>this._onDragStart(e));
    root.addEventListener("drop",      e=>this._onDrop(e));
    root.addEventListener("dragover",  e=>e.preventDefault());
  }

  _onClick(e) {
    const el=e.target.closest("[data-action]"); if(!el) return;
    const a=el.dataset.action;

    if (a==="tab") {
      this._activeKid=parseInt(el.dataset.idx); this._section="schedule";
      this._selected=null; this._showEmoji=false; this._showSlots=false; this._render();
    }
    else if (a==="tab-subjects") { this._section="subjects"; this._render(); }
    else if (a==="add-kid") {
      const preset=COLOR_PRESETS[this._kids.length%COLOR_PRESETS.length];
      this._kids.push({name:"Neues Kind",age:"1. Klasse",emoji:"⭐",...preset,
        slots:[{slot:1,time:"08:00",end:"08:45"},{slot:2,time:"08:45",end:"09:30"},{slot:3,time:"09:50",end:"10:35"},{slot:4,time:"10:35",end:"11:20"}],
        schedule:{Mo:[],Di:[],Mi:[],Do:[],Fr:[]}});
      this._activeKid=this._kids.length-1; this._section="schedule";
      this._fire(); this._render();
    }
    else if (a==="del-kid") {
      if(this._kids.length<=1) return;
      this._kids.splice(this._activeKid,1); this._activeKid=0;
      this._fire(); this._render();
    }
    else if (a==="toggle-emoji") { this._showEmoji=!this._showEmoji; this._render(); }
    else if (a==="toggle-slots") { this._showSlots=!this._showSlots; this._render(); }
    else if (a==="kid-emoji") {
      this._kids[this._activeKid].emoji=el.dataset.emoji;
      this._showEmoji=false; this._fire(); this._render();
    }
    else if (a==="kid-color") {
      const p=COLOR_PRESETS[parseInt(el.dataset.ci)];
      Object.assign(this._kids[this._activeKid],p); this._fire(); this._render();
    }
    else if (a==="slot-del") {
      const i=parseInt(el.dataset.idx);
      this._kids[this._activeKid].slots=this._kids[this._activeKid].slots
        .filter((_,j)=>j!==i).map((s,j)=>({...s,slot:j+1}));
      this._fire(); this._render();
    }
    else if (a==="slot-add") {
      const slots=this._kids[this._activeKid].slots;
      const n=slots.length?slots[slots.length-1].slot+1:1;
      slots.push({slot:n,time:"",end:""}); this._fire(); this._render();
    }
    else if (a==="slot-click") {
      const day=el.dataset.day, slot=parseInt(el.dataset.slot), cur=el.dataset.current||null;
      if (this._selected) { this._setLesson(this._activeKid,day,slot,this._selected); }
      else if (cur) { this._selected=cur; this._setLesson(this._activeKid,day,slot,null); }
    }
    else if (a==="remove-subject") { e.stopPropagation(); this._setLesson(this._activeKid,el.dataset.day,parseInt(el.dataset.slot),null); }
    else if (a==="palette-drag") { const s=el.dataset.subject; this._selected=this._selected===s?null:s; this._render(); }
    else if (a==="clear-sel")    { this._selected=null; this._render(); }
    else if (a==="subj-del") {
      this._subjects.splice(parseInt(el.dataset.idx),1);
      this._subjectMap=buildSubjectMap(this._subjects); this._fire(); this._render();
    }
    else if (a==="subj-add") {
      this._subjects.push({name:"",color:"#64748b"});
      this._subjectMap=buildSubjectMap(this._subjects); this._fire(); this._render();
    }
    else if (a==="export") { this._export(); }
    else if (a==="import") { this.shadowRoot.querySelector("[data-action='import-file']")?.click(); }
  }

  _onInput(e) {
    const el=e.target.closest("[data-action]"); if(!el) return;
    const a=el.dataset.action, i=parseInt(el.dataset.idx);
    const kid=this._kids[this._activeKid];

    if (a==="kid-name")  { kid.name=el.value; this._fire(); }
    if (a==="kid-age")   { kid.age=el.value;  this._fire(); }
    if (a==="slot-time") { kid.slots[i]={...kid.slots[i],time:el.value}; this._fire(); }
    if (a==="slot-end")  { kid.slots[i]={...kid.slots[i],end:el.value};  this._fire(); }
    if (a==="subj-name") {
      this._subjects[i].name=el.value;
      this._subjectMap=buildSubjectMap(this._subjects);
      // Update preview chip live
      const chip=this.shadowRoot.querySelectorAll(".preview-chip")[i];
      if(chip) chip.textContent=el.value||"?";
      this._fire();
    }
    if (a==="subj-color") {
      this._subjects[i].color=el.value;
      this._subjectMap=buildSubjectMap(this._subjects);
      const sc=buildSubjectStyle(el.value);
      const row=this.shadowRoot.querySelectorAll(".subj-row")[i];
      const sw=row?.querySelector(".subj-swatch");
      const chip=this.shadowRoot.querySelectorAll(".preview-chip")[i];
      if(sw)   { sw.style.background=sc.bg; sw.style.borderColor=sc.border; }
      if(chip) { chip.style.background=sc.bg; chip.style.color=sc.text; chip.style.borderColor=sc.border; }
      this._fire();
    }
  }

  _onChange(e) {
    const el=e.target.closest("[data-action]"); if(!el||el.dataset.action!=="import-file") return;
    const file=el.files[0]; if(!file) return;
    const r=new FileReader();
    r.onload=ev=>{
      try {
        const d=JSON.parse(ev.target.result);
        if(d.kids)     this._kids=d.kids;
        if(d.subjects) { this._subjects=d.subjects; this._subjectMap=buildSubjectMap(d.subjects); }
        this._fire(); this._render();
      } catch(_) {}
    };
    r.readAsText(file); el.value="";
  }

  _onDragStart(e) {
    const el=e.target.closest("[data-action]"); if(!el) return;
    if(el.dataset.action==="palette-drag") { this._drag={subject:el.dataset.subject}; this._selected=null; }
    if(el.dataset.action==="chip-drag")    { this._drag={subject:el.dataset.subject,fromDay:el.dataset.day,fromSlot:parseInt(el.dataset.slot)}; }
  }

  _onDrop(e) {
    e.preventDefault(); if(!this._drag) return;
    const td=e.target.closest("[data-action='slot-click']");
    if(!td) { this._drag=null; return; }
    const {subject,fromDay,fromSlot}=this._drag;
    if(fromDay) this._setLesson(this._activeKid,fromDay,fromSlot,null);
    this._setLesson(this._activeKid,td.dataset.day,parseInt(td.dataset.slot),subject);
    this._drag=null;
  }

  _export() {
    const blob=new Blob([JSON.stringify({subjects:this._subjects,kids:this._kids},null,2)],{type:"application/json"});
    const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="timetable_backup.json"; a.click();
  }
}
customElements.define("timetable-card-editor", TimetableCardEditor);

/* ═══════════════════════════════════════════════════
   DISPLAY CARD  –  read-only
═══════════════════════════════════════════════════ */
class TimetableCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode:"open"});
    this._config    = {};
    this._kids      = [];
    this._subjects  = {};
    this._activeKid = 0;
  }

  static getConfigElement() { return document.createElement("timetable-card-editor"); }
  static getStubConfig()    { return {subjects:DEFAULT_SUBJECTS, kids:DEFAULT_KIDS}; }
  static getLayoutOptions() { return {grid_columns:"full", grid_rows:"auto"}; }

  setConfig(config) {
    this._config   = config;
    this._kids     = JSON.parse(JSON.stringify(config.kids     || DEFAULT_KIDS));
    this._subjects = buildSubjectMap(config.subjects || DEFAULT_SUBJECTS);
    this._render();
  }

  set hass(h) { this._hass=h; }

  getCardSize() {
    const kid=this._kids[this._activeKid]||this._kids[0]; if(!kid) return 6;
    const max=Math.max(...DAYS.flatMap(d=>(kid.schedule[d]||[]).map(l=>l.slot)),3);
    return Math.max(4,Math.ceil(max*0.8)+3);
  }

  _render() {
    this.shadowRoot.innerHTML="";
    const style=document.createElement("style");
    style.textContent=CARD_STYLES;
    this.shadowRoot.appendChild(style);
    const wrapper=document.createElement("div");
    wrapper.className="card";
    wrapper.innerHTML=this._buildHTML();
    this.shadowRoot.appendChild(wrapper);
    wrapper.addEventListener("click", e=>{
      const tab=e.target.closest("[data-action='tab']");
      if(tab) { this._activeKid=parseInt(tab.dataset.idx); this._render(); }
    });
  }

  _buildHTML() {
    const kid=this._kids[this._activeKid]||this._kids[0];
    if(!kid) return "<p style='padding:16px'>Bitte Kinder im Editor konfigurieren.</p>";
    const todayColIdx=new Date().getDay()-1;
    const usedSubjects=[...new Set(DAYS.flatMap(d=>(kid.schedule[d]||[]).map(l=>l.subject)))];
    const css=k=>`--kid-color:${k.color};--kid-accent:${k.accent};--kid-light:${k.light};`;

    return `
      <div class="header">
        <div class="tabs">
          ${this._kids.map((k,i)=>`
            <div class="tab ${this._activeKid===i?"active":""}" style="${css(k)}" data-action="tab" data-idx="${i}">
              <div class="tab-avatar">${k.emoji}</div>
              <div>
                <div class="tab-name">${k.name}</div>
                <div class="tab-age">${k.age}</div>
              </div>
            </div>`).join("")}
        </div>
      </div>

      ${buildTimetableHTML(kid, this._subjects, {editable:false, todayColIdx})}

      <div class="legend">
        ${usedSubjects.map(name=>{
          const sc=this._subjects[name]||FALLBACK;
          return `<div class="legend-chip" style="background:${sc.bg};color:${sc.text};border-color:${sc.border}">${name}</div>`;
        }).join("")}
      </div>
      <div class="day-summary" style="${css(kid)}">
        ${DAYS.map((day,i)=>{
          const count=(kid.schedule[day]||[]).length;
          const isToday=i===todayColIdx;
          return `<div class="day-pill ${isToday?"today":""}" style="${css(kid)}">
            <span class="day-pill-label">${DAY_FULL[i].slice(0,2)}</span>
            <span class="day-pill-count">${count} Std.</span>
          </div>`;
        }).join("")}
      </div>
    `;
  }
}
customElements.define("timetable-card", TimetableCard);

window.customCards = window.customCards||[];
window.customCards.push({
  type:"timetable-card",
  name:"Timetable Card",
  description:"Interactive family school timetable. Edit via the visual editor.",
  preview:true,
  documentationURL:"https://github.com/ay-kay/lovelace-timetable-card",
});