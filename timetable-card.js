/**
 * Timetable Card
 * A Lovelace card for Home Assistant to display and manage family school timetables.
 * https://github.com/ay-kay/lovelace-timetable-card
 * @license MIT
 */

/* ═══════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════ */
const SUBJECT_COLORS = {
  Mathe:       { bg:"#dbeafe", text:"#1d4ed8", border:"#93c5fd" },
  Deutsch:     { bg:"#fef9c3", text:"#854d0e", border:"#fde047" },
  Englisch:    { bg:"#d1fae5", text:"#065f46", border:"#6ee7b7" },
  Sport:       { bg:"#ede9fe", text:"#5b21b6", border:"#c4b5fd" },
  Musik:       { bg:"#fee2e2", text:"#991b1b", border:"#fca5a5" },
  Kunst:       { bg:"#fce7f3", text:"#9d174d", border:"#f9a8d4" },
  Sachkunde:   { bg:"#ccfbf1", text:"#065f46", border:"#5eead4" },
  Religion:    { bg:"#fff7ed", text:"#9a3412", border:"#fdba74" },
  Geschichte:  { bg:"#ffe4e6", text:"#9f1239", border:"#fda4af" },
  Biologie:    { bg:"#dcfce7", text:"#166534", border:"#86efac" },
  Physik:      { bg:"#e0f2fe", text:"#075985", border:"#7dd3fc" },
  Chemie:      { bg:"#fef3c7", text:"#92400e", border:"#fcd34d" },
  Französisch: { bg:"#f3e8ff", text:"#6b21a8", border:"#d8b4fe" },
  Informatik:  { bg:"#e0e7ff", text:"#3730a3", border:"#a5b4fc" },
  KlaRa:       { bg:"#fdf4ff", text:"#7e22ce", border:"#e9d5ff" },
  LZ:          { bg:"#f0fdf4", text:"#14532d", border:"#bbf7d0" },
  Coach:       { bg:"#fff1f2", text:"#881337", border:"#fecdd3" },
  Fach_A:      { bg:"#fefce8", text:"#713f12", border:"#fef08a" },
  Fach_B:      { bg:"#f0f9ff", text:"#0c4a6e", border:"#bae6fd" },
  Fach_C:      { bg:"#faf5ff", text:"#581c87", border:"#e9d5ff" },
};

const COLOR_PRESETS = [
  { color:"#f87171", accent:"#b91c1c", light:"#fff1f2" },
  { color:"#f472b6", accent:"#be185d", light:"#fdf2f8" },
  { color:"#60a5fa", accent:"#1d4ed8", light:"#eff6ff" },
  { color:"#4ade80", accent:"#15803d", light:"#f0fdf4" },
  { color:"#fb923c", accent:"#c2410c", light:"#fff7ed" },
  { color:"#a78bfa", accent:"#6d28d9", light:"#f5f3ff" },
  { color:"#fbbf24", accent:"#b45309", light:"#fffbeb" },
  { color:"#2dd4bf", accent:"#0f766e", light:"#f0fdfa" },
];

const EMOJIS = ["⚡","🌸","⭐","🚀","🦋","🌿","🎯","🎨","🏆","🦊","🐬","🌈","🎸","🦄","🏄","🎭"];

const DAYS = ["Mo","Di","Mi","Do","Fr"];
const DAY_LABELS = ["Montag","Dienstag","Mittwoch","Donnerstag","Freitag"];

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

/* ═══════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

  :host {
    display: block;
    font-family: 'Nunito', var(--paper-font-common-base_-_font-family, sans-serif);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeIn {
    from { opacity:0; transform:translateY(6px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .card {
    background: var(--card-background-color, #fff);
    border-radius: var(--ha-card-border-radius, 12px);
    overflow: hidden;
    box-shadow: var(--ha-card-box-shadow, 0 2px 12px rgba(0,0,0,0.08));
  }

  .fade-in { animation: fadeIn 0.25s ease forwards; }

  /* ── Header / Tabs ── */
  .header {
    background: var(--card-background-color, #fff);
    border-bottom: 2px solid var(--divider-color, #e2e8f0);
    transition: border-color 0.3s;
  }
  .header.edit-mode {
    border-bottom-color: var(--kid-color, #60a5fa);
  }

  .tabs {
    display: flex;
    align-items: stretch;
  }

  .tab {
    flex: 1;
    padding: 11px 6px 13px;
    background: var(--secondary-background-color, #f8fafc);
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 7px;
    justify-content: center;
    font-family: inherit;
    transition: all 0.18s ease;
    position: relative;
  }
  .tab:hover { filter: brightness(0.97); }
  .tab.active {
    background: var(--kid-light, #eff6ff);
    border-bottom-color: var(--kid-color, #60a5fa);
  }

  .tab-avatar {
    width: 30px; height: 30px;
    border-radius: 50%;
    background: var(--disabled-color, #e2e8f0);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; flex-shrink: 0;
    transition: all 0.2s;
  }
  .tab.active .tab-avatar {
    background: linear-gradient(135deg, var(--kid-color), var(--kid-accent));
    box-shadow: 0 2px 8px color-mix(in srgb, var(--kid-color) 55%, transparent);
  }

  .tab-name  { font-size: 13px; font-weight: 900; color: var(--secondary-text-color, #94a3b8); text-align: left; }
  .tab-age   { font-size: 10px; font-weight: 700; color: var(--disabled-color, #b0bec5); }
  .tab.active .tab-name { color: var(--kid-accent, #1d4ed8); }

  .tab-edit-btn {
    position: absolute; top: 6px; right: 5px;
    width: 18px; height: 18px; border-radius: 50%;
    border: none;
    background: var(--kid-color, #60a5fa); color: white;
    font-size: 9px; cursor: pointer; font-weight: 900;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 1px 4px rgba(0,0,0,0.25);
  }

  .tab-add {
    padding: 11px 16px 13px;
    border: none; border-left: 1px solid var(--divider-color, #f1f5f9);
    border-bottom: 3px solid transparent;
    background: var(--secondary-background-color, #f8fafc);
    color: var(--secondary-text-color, #94a3b8);
    font-size: 22px; font-weight: 900; cursor: pointer;
    font-family: inherit;
    transition: all 0.18s;
  }
  .tab-add:hover { filter: brightness(0.97); }

  .pencil-wrap {
    display: flex; align-items: center;
    padding: 0 12px;
    border-left: 1px solid var(--divider-color, #f1f5f9);
    background: var(--secondary-background-color, #f8fafc);
    flex-shrink: 0;
  }

  .pencil-btn {
    width: 36px; height: 36px; border-radius: 10px;
    border: none;
    background: var(--disabled-color, #e2e8f0);
    color: var(--secondary-text-color, #64748b);
    font-size: 16px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .pencil-btn.active {
    background: var(--kid-color, #60a5fa);
    color: white;
    font-size: 15px;
    box-shadow: 0 2px 10px color-mix(in srgb, var(--kid-color) 55%, transparent);
  }

  .status-bar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 4px 14px 6px;
    border-top: 1px solid color-mix(in srgb, var(--kid-color, #60a5fa) 33%, transparent);
    background: color-mix(in srgb, var(--kid-color, #60a5fa) 10%, transparent);
  }

  .status-text { font-size: 11px; font-weight: 800; color: var(--secondary-text-color); }
  .status-text.saved { color: #4ade80; }

  .status-actions { display: flex; gap: 8px; }
  .status-btn {
    padding: 3px 10px; border-radius: 8px; border: none;
    background: var(--divider-color, #e2e8f0);
    color: var(--secondary-text-color, #475569);
    font-size: 11px; font-weight: 800; cursor: pointer;
    font-family: inherit;
  }

  /* ── Table ── */
  .table-wrap {
    padding: 14px 14px 18px;
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: var(--card-background-color, white);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 8px rgba(0,0,0,0.05);
  }

  th, td {
    padding: 0;
    border: none;
  }

  .th-corner {
    width: 80px;
    background: var(--secondary-background-color, #f8fafc);
    border-right: 2px solid var(--divider-color, #e2e8f0);
    border-bottom: 2px solid var(--divider-color, #e2e8f0);
  }

  .th-day {
    padding: 11px 6px; text-align: center;
    background: var(--secondary-background-color, #f8fafc);
    border-bottom: 2px solid var(--divider-color, #e2e8f0);
  }
  .th-day.today {
    background: color-mix(in srgb, var(--kid-color, #60a5fa) 18%, transparent);
    border-bottom-color: var(--kid-color, #60a5fa);
  }
  .th-day:not(:last-child) { border-right: 1px solid color-mix(in srgb, var(--divider-color, #e2e8f0) 80%, transparent); }

  .day-label { font-size: 12.5px; font-weight: 900; color: var(--secondary-text-color, #475569); }
  .th-day.today .day-label { color: var(--kid-accent, #1d4ed8); }
  .today-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--kid-color, #60a5fa);
    margin: 4px auto 0;
    box-shadow: 0 0 5px var(--kid-color, #60a5fa);
  }

  .td-time {
    padding: 8px; background: var(--secondary-background-color, #f8fafc);
    border-right: 2px solid var(--divider-color, #e2e8f0);
    vertical-align: middle; text-align: center;
  }

  .slot-num {
    width: 19px; height: 19px; border-radius: 50%;
    background: var(--divider-color, #e2e8f0);
    color: var(--secondary-text-color, #64748b);
    font-weight: 900; font-size: 10px; margin: 0 auto 2px;
    display: flex; align-items: center; justify-content: center;
  }
  .slot-time { font-size: 9.5px; font-weight: 800; color: var(--secondary-text-color, #64748b); line-height: 1; }
  .slot-end  { font-size: 9px; color: var(--disabled-color, #94a3b8); font-weight: 600; }

  .td-subject {
    padding: 6px 5px;
    vertical-align: middle; text-align: center;
    min-width: 82px;
  }
  .td-subject:not(:last-child) {
    border-right: 1px solid color-mix(in srgb, var(--divider-color, #e2e8f0) 60%, transparent);
  }
  .td-subject.today-col {
    background: color-mix(in srgb, var(--kid-color, #60a5fa) 10%, transparent);
  }
  .td-subject.today-col.alt {
    background: color-mix(in srgb, var(--kid-color, #60a5fa) 14%, transparent);
  }

  .row-even  { background: var(--card-background-color, white); }
  .row-odd   { background: color-mix(in srgb, var(--secondary-background-color, #f8fafc) 60%, transparent); }
  .row-break td { border-bottom: 2px dashed var(--divider-color, #e2e8f0) !important; }
  .row-normal td { border-bottom: 1px solid color-mix(in srgb, var(--divider-color, #f0f4f8) 60%, transparent); }
  .row-last td   { border-bottom: none !important; }

  .chip {
    border-radius: 7px; padding: 5px 4px;
    font-size: 12px; font-weight: 800; line-height: 1.2;
    position: relative; user-select: none;
    border: 1.5px solid transparent;
  }
  .chip.draggable { cursor: grab; }
  .chip.draggable:active { cursor: grabbing; }

  .chip-remove {
    position: absolute; top: -5px; right: -5px;
    width: 15px; height: 15px; border-radius: 50%;
    background: #ef4444; color: white;
    font-size: 9px; font-weight: 900; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 1px 4px rgba(0,0,0,0.25);
    border: none;
  }

  .cell-empty {
    border-radius: 7px; padding: 8px 4px;
    font-size: 18px; font-weight: 900;
    border: 1.5px dashed var(--divider-color, #d1d5db);
    color: var(--divider-color, #d1d5db);
    cursor: default;
    transition: all 0.15s;
  }
  .cell-empty.droptarget {
    border-color: var(--kid-color, #60a5fa);
    color: var(--kid-color, #60a5fa);
    background: color-mix(in srgb, var(--kid-color, #60a5fa) 8%, transparent);
  }
  .cell-dot { color: var(--disabled-color, #dde3ea); font-size: 14px; }

  /* ── Palette ── */
  .palette {
    margin: 12px 14px;
    background: var(--card-background-color, white);
    border-radius: 12px; padding: 12px 14px;
    box-shadow: 0 1px 8px rgba(0,0,0,0.05);
    border: 1.5px solid color-mix(in srgb, var(--kid-color, #60a5fa) 44%, transparent);
  }

  .palette-hint {
    font-size: 11px; font-weight: 800;
    color: var(--secondary-text-color, #94a3b8);
    letter-spacing: 0.5px; margin-bottom: 9px;
  }

  .palette-chips { display: flex; flex-wrap: wrap; gap: 6px; }

  .p-chip {
    border-radius: 20px; padding: 5px 12px;
    font-size: 12px; font-weight: 800;
    border: 1.5px solid transparent;
    cursor: grab; user-select: none;
    transition: all 0.15s;
  }
  .p-chip:active { cursor: grabbing; }
  .p-chip.selected {
    transform: scale(1.06);
  }

  .clear-sel {
    margin-top: 9px; padding: 4px 12px;
    border-radius: 20px; border: none;
    background: var(--secondary-background-color, #f1f5f9);
    color: var(--secondary-text-color, #64748b);
    font-size: 12px; font-weight: 800; cursor: pointer;
    font-family: inherit;
  }

  /* ── Legend & day summary ── */
  .legend  { margin: 10px 14px; display: flex; flex-wrap: wrap; gap: 6px; }
  .day-summary { margin: 8px 14px 14px; display: flex; gap: 7px; flex-wrap: wrap; }

  .legend-chip {
    border-radius: 20px; padding: 3px 10px;
    font-size: 11px; font-weight: 800;
    border: 1.5px solid transparent;
  }

  .day-pill {
    border-radius: 9px; padding: 4px 10px;
    display: flex; align-items: center; gap: 5px;
    border: 1.5px solid var(--divider-color, #e2e8f0);
    background: var(--card-background-color, white);
  }
  .day-pill.today {
    border-color: var(--kid-color, #60a5fa);
    background: color-mix(in srgb, var(--kid-color, #60a5fa) 20%, transparent);
  }
  .day-pill-label { font-size: 10.5px; font-weight: 900; color: var(--secondary-text-color, #64748b); }
  .day-pill.today .day-pill-label { color: var(--kid-accent, #1d4ed8); }
  .day-pill-count {
    border-radius: 20px; padding: 1px 6px;
    font-size: 10.5px; font-weight: 800;
    background: var(--divider-color, #e2e8f0);
    color: var(--secondary-text-color, #64748b);
  }
  .day-pill.today .day-pill-count {
    background: var(--kid-color, #60a5fa);
    color: white;
  }

  /* ── Modal ── */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(15,23,42,0.55);
    z-index: 999;
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
  }

  .modal {
    background: var(--card-background-color, white);
    border-radius: 20px; padding: 22px;
    width: 100%; max-width: 380px;
    max-height: 90vh; overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  }

  .modal-title { font-size: 17px; font-weight: 900; color: var(--primary-text-color); margin-bottom: 18px; }

  .field-label {
    font-size: 11px; font-weight: 800;
    color: var(--secondary-text-color);
    letter-spacing: 0.5px;
  }

  .emoji-grid { display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 0 16px; }
  .emoji-btn {
    width: 34px; height: 34px; border-radius: 8px;
    cursor: pointer; font-size: 17px;
    border: 2px solid var(--divider-color, #e2e8f0);
    background: var(--card-background-color, white);
    transition: all 0.15s;
  }
  .emoji-btn.selected { border-color: var(--kid-color, #60a5fa); }

  .text-input {
    display: block; width: 100%;
    padding: 9px 11px; border-radius: 9px;
    border: 2px solid var(--divider-color, #e2e8f0);
    background: var(--card-background-color, white);
    color: var(--primary-text-color);
    font-size: 14px; font-weight: 700;
    font-family: inherit; outline: none;
    margin-top: 6px; margin-bottom: 14px;
  }
  .text-input:focus { border-color: var(--kid-color, #60a5fa); }

  .color-grid { display: flex; gap: 9px; flex-wrap: wrap; margin: 8px 0 16px; }
  .color-dot {
    width: 28px; height: 28px; border-radius: 50%;
    cursor: pointer; border: 3px solid transparent;
    transition: all 0.15s;
  }
  .color-dot.selected { border-color: var(--primary-text-color, #0f172a); outline-offset: 2px; }

  .slots-list { margin: 8px 0 18px; display: flex; flex-direction: column; gap: 6px; }
  .slot-row { display: flex; align-items: center; gap: 6px; }
  .slot-num-badge {
    width: 22px; height: 22px; border-radius: 50%;
    background: var(--secondary-background-color, #f1f5f9);
    color: var(--secondary-text-color);
    font-size: 11px; font-weight: 900; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .slot-input {
    flex: 1; padding: 7px 8px; border-radius: 8px;
    border: 2px solid var(--divider-color, #e2e8f0);
    background: var(--card-background-color, white);
    color: var(--primary-text-color);
    font-size: 13px; font-weight: 700;
    font-family: inherit; outline: none;
  }
  .slot-sep { color: var(--secondary-text-color); font-weight: 800; }
  .slot-remove {
    width: 24px; height: 24px; border-radius: 50%;
    border: none; background: #fee2e2; color: #ef4444;
    font-size: 14px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .slot-add {
    padding: 7px; border-radius: 8px;
    border: 2px dashed var(--divider-color, #e2e8f0);
    background: transparent; color: var(--secondary-text-color);
    font-size: 12px; font-weight: 800; cursor: pointer;
    font-family: inherit; width: 100%;
  }

  .modal-actions { display: flex; gap: 8px; margin-top: 4px; }
  .btn-delete {
    padding: 10px 14px; border-radius: 10px; border: none;
    background: #fee2e2; color: #b91c1c;
    font-size: 13px; font-weight: 800; cursor: pointer;
    font-family: inherit;
  }
  .btn-cancel {
    flex: 1; padding: 10px; border-radius: 10px;
    border: 2px solid var(--divider-color, #e2e8f0);
    background: var(--card-background-color, white);
    color: var(--secondary-text-color);
    font-size: 13px; font-weight: 800; cursor: pointer;
    font-family: inherit;
  }
  .btn-save {
    flex: 2; padding: 10px; border-radius: 10px; border: none;
    background: var(--kid-color, #60a5fa); color: white;
    font-size: 14px; font-weight: 900; cursor: pointer;
    font-family: inherit;
  }
`;

/* ═══════════════════════════════════════════════════
   TIMETABLE CARD  –  Web Component
═══════════════════════════════════════════════════ */
class TimetableCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config   = {};
    this._kids     = [];
    this._activeKid = 0;
    this._editMode  = false;
    this._selected  = null;   // palette subject selected for tap-to-place
    this._drag      = null;   // drag state
    this._savedTimer = null;
    this._showSaved  = false;
    this._modal      = null;  // null | { idx: number | "new" }
  }

  /* ── HA Card API ─────────────────────────────────── */

  static getStubConfig() {
    return { kids: DEFAULT_KIDS };
  }

  setConfig(config) {
    this._config = config;
    this._kids   = JSON.parse(JSON.stringify(config.kids || DEFAULT_KIDS));
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    // Re-render not needed on every hass update
  }

  getCardSize() {
    const kid = this._kids[this._activeKid] || this._kids[0];
    if (!kid) return 6;
    const maxSlot = Math.max(...DAYS.flatMap(d => (kid.schedule[d] || []).map(l => l.slot)), 3);
    return Math.max(4, Math.ceil(maxSlot * 0.8) + 3);
  }

  /* ── Internal: save config back to HA ───────────── */

  _saveConfig() {
    const newConfig = { ...this._config, kids: this._kids };
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    }));
    this._showSaved = true;
    clearTimeout(this._savedTimer);
    this._savedTimer = setTimeout(() => {
      this._showSaved = false;
      this._render();
    }, 1800);
    this._render();
  }

  /* ── Internal: schedule mutations ───────────────── */

  _setSubject(kidIdx, day, slot, subject) {
    const kid  = this._kids[kidIdx];
    let   list = [...(kid.schedule[day] || [])];
    if (subject === null) {
      list = list.filter(l => l.slot !== slot);
    } else {
      const i = list.findIndex(l => l.slot === slot);
      if (i >= 0) list[i] = { slot, subject };
      else { list.push({ slot, subject }); list.sort((a, b) => a.slot - b.slot); }
    }
    this._kids[kidIdx].schedule[day] = list;
    this._saveConfig();
  }

  /* ── Render ──────────────────────────────────────── */

  _render() {
    const shadow = this.shadowRoot;
    shadow.innerHTML = "";

    const style = document.createElement("style");
    style.textContent = STYLES;
    shadow.appendChild(style);

    const wrapper = document.createElement("div");
    wrapper.className = "card";
    wrapper.innerHTML = this._buildHTML();
    shadow.appendChild(wrapper);

    this._attachEvents(wrapper);
  }

  _buildHTML() {
    const kid     = this._kids[this._activeKid] || this._kids[0];
    if (!kid) return "<p style='padding:16px'>Bitte Kinder konfigurieren.</p>";

    const today       = new Date();
    const todayColIdx = today.getDay() - 1;

    const maxSlot     = Math.max(...DAYS.flatMap(d => (kid.schedule[d] || []).map(l => l.slot)), 2);
    const visSlots    = this._editMode ? kid.slots : kid.slots.filter(s => s.slot <= maxSlot);
    const usedSubjects= [...new Set(DAYS.flatMap(d => (kid.schedule[d] || []).map(l => l.subject)))];

    const css = (k) => `--kid-color:${k.color};--kid-accent:${k.accent};--kid-light:${k.light};`;

    return `
      <!-- Header -->
      <div class="header ${this._editMode ? "edit-mode" : ""}" style="${css(kid)}">
        <div class="tabs">
          ${this._kids.map((k, i) => `
            <div class="tab ${this._activeKid === i ? "active" : ""}"
              style="${css(k)}"
              data-action="tab" data-idx="${i}">
              <div class="tab-avatar">${k.emoji}</div>
              <div>
                <div class="tab-name">${k.name}</div>
                <div class="tab-age">${k.age}</div>
              </div>
              ${this._editMode ? `<button class="tab-edit-btn" style="background:${k.color}" data-action="edit-kid" data-idx="${i}">✏</button>` : ""}
            </div>
          `).join("")}
          ${this._editMode ? `<button class="tab-add" data-action="add-kid">+</button>` : ""}
          <div class="pencil-wrap" style="${css(kid)}">
            <button class="pencil-btn ${this._editMode ? "active" : ""}" data-action="toggle-edit"
              style="${this._editMode ? `background:${kid.color};color:white;box-shadow:0 2px 10px ${kid.color}55` : ""}">
              ${this._editMode ? "✓" : "✏️"}
            </button>
          </div>
        </div>

        ${(this._editMode || this._showSaved) ? `
          <div class="status-bar" style="${css(kid)}">
            <span class="status-text ${this._showSaved ? "saved" : ""}">
              ${this._showSaved ? "✓ gespeichert" : "Bearbeitungsmodus"}
            </span>
            ${this._editMode ? `
              <div class="status-actions">
                <button class="status-btn" data-action="export">↓ Export</button>
                <button class="status-btn" data-action="import">↑ Import</button>
                <input type="file" accept=".json" data-action="import-file" style="display:none">
              </div>
            ` : ""}
          </div>
        ` : ""}
      </div>

      <!-- Table -->
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th class="th-corner"></th>
              ${DAYS.map((day, i) => `
                <th class="th-day ${i === todayColIdx ? "today" : ""}" style="${css(kid)}">
                  <div class="day-label">${DAY_LABELS[i].slice(0,2)}<span style="font-weight:700">${DAY_LABELS[i].slice(2)}</span></div>
                  ${i === todayColIdx ? `<div class="today-dot" style="background:${kid.color};box-shadow:0 0 5px ${kid.color}"></div>` : ""}
                </th>
              `).join("")}
            </tr>
          </thead>
          <tbody>
            ${visSlots.map((s, rowIdx) => {
              const isLast   = rowIdx === visSlots.length - 1;
              const bigBreak = s.slot === 2 || s.slot === 4;
              const rowClass = isLast ? "row-last" : bigBreak ? "row-break" : "row-normal";
              const bgClass  = rowIdx % 2 === 0 ? "row-even" : "row-odd";
              return `
                <tr class="${rowClass} ${bgClass}">
                  <td class="td-time">
                    <div class="slot-num">${s.slot}</div>
                    <div class="slot-time">${s.time}</div>
                    <div class="slot-end">${s.end}</div>
                  </td>
                  ${DAYS.map((day, colIdx) => {
                    const isToday = colIdx === todayColIdx;
                    const lesson  = (kid.schedule[day] || []).find(l => l.slot === s.slot);
                    const sc      = lesson ? (SUBJECT_COLORS[lesson.subject] || { bg:"#f1f5f9", text:"#475569", border:"#cbd5e1" }) : null;
                    return `
                      <td class="td-subject ${isToday ? (rowIdx%2===0?"today-col":"today-col alt") : ""}"
                        data-action="slot-click" data-day="${day}" data-slot="${s.slot}"
                        data-current="${lesson ? lesson.subject : ""}"
                        style="${css(kid)}"
                        ondragover="event.preventDefault()"
                        ondrop="event.stopPropagation()">
                        ${lesson
                          ? `<div class="chip ${this._editMode ? "draggable" : ""}"
                              style="background:${sc.bg};color:${sc.text};border-color:${sc.border}"
                              draggable="${this._editMode}"
                              data-action="chip-drag"
                              data-subject="${lesson.subject}"
                              data-day="${day}"
                              data-slot="${s.slot}">
                              ${lesson.subject}
                              ${this._editMode ? `<button class="chip-remove" data-action="remove-subject" data-day="${day}" data-slot="${s.slot}">×</button>` : ""}
                            </div>`
                          : this._editMode
                            ? `<div class="cell-empty ${this._selected ? "droptarget" : ""}"
                                style="${this._selected ? `border-color:${kid.color};color:${kid.color};background:color-mix(in srgb,${kid.color} 8%,transparent)` : ""}">+</div>`
                            : `<span class="cell-dot">·</span>`
                        }
                      </td>
                    `;
                  }).join("")}
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>

      <!-- Palette (edit mode) -->
      ${this._editMode ? `
        <div class="palette" style="${css(kid)}">
          <div class="palette-hint">
            ${this._selected
              ? `"${this._selected}" ausgewählt — tippe auf ein Feld zum Eintragen`
              : "FÄCHER — tippen zum Auswählen · ziehen direkt in den Plan"}
          </div>
          <div class="palette-chips">
            ${Object.entries(SUBJECT_COLORS).map(([subj, sc]) => {
              const sel = this._selected === subj;
              return `<div class="p-chip ${sel ? "selected" : ""}"
                style="background:${sel ? sc.text : sc.bg};color:${sel ? "white" : sc.text};border-color:${sel ? sc.text : sc.border};box-shadow:${sel ? `0 2px 10px ${sc.text}44` : "none"}"
                draggable="true"
                data-action="palette-drag"
                data-subject="${subj}">
                ${subj}
              </div>`;
            }).join("")}
          </div>
          ${this._selected ? `<button class="clear-sel" data-action="clear-sel">✕ Auswahl aufheben</button>` : ""}
        </div>
      ` : ""}

      <!-- Legend (view mode) -->
      ${!this._editMode ? `
        <div class="legend">
          ${usedSubjects.map(subj => {
            const sc = SUBJECT_COLORS[subj] || { bg:"#f1f5f9", text:"#475569", border:"#cbd5e1" };
            return `<div class="legend-chip" style="background:${sc.bg};color:${sc.text};border-color:${sc.border}">${subj}</div>`;
          }).join("")}
        </div>
        <div class="day-summary" style="${css(kid)}">
          ${DAYS.map((day, i) => {
            const count   = (kid.schedule[day] || []).length;
            const isToday = i === todayColIdx;
            return `<div class="day-pill ${isToday ? "today" : ""}" style="${css(kid)}">
              <span class="day-pill-label">${DAY_LABELS[i].slice(0,2)}</span>
              <span class="day-pill-count">${count} Std.</span>
            </div>`;
          }).join("")}
        </div>
      ` : ""}

      <!-- Modal -->
      ${this._modal ? this._buildModal() : ""}
    `;
  }

  _buildModal() {
    const isNew = this._modal.idx === "new";
    const kid   = isNew ? null : this._kids[this._modal.idx];
    const preset= kid ? (COLOR_PRESETS.find(c => c.color === kid.color) || COLOR_PRESETS[0]) : COLOR_PRESETS[0];

    return `
      <div class="modal-overlay" data-action="modal-overlay">
        <div class="modal" style="--kid-color:${preset.color}">
          <div class="modal-title">${isNew ? "Kind hinzufügen" : "Kind bearbeiten"}</div>

          <div class="field-label">EMOJI</div>
          <div class="emoji-grid">
            ${EMOJIS.map(e => `
              <button class="emoji-btn ${(kid?.emoji||"⭐")===e?"selected":""}"
                style="${(kid?.emoji||"⭐")===e?`border-color:${preset.color};background:${preset.light}`:""}"
                data-action="modal-emoji" data-emoji="${e}">${e}</button>
            `).join("")}
          </div>

          <div class="field-label">NAME</div>
          <input class="text-input" data-action="modal-name" placeholder="z.B. Lena" value="${kid?.name||""}">

          <div class="field-label">KLASSE</div>
          <input class="text-input" data-action="modal-age" placeholder="z.B. 3. Klasse" value="${kid?.age||""}">

          <div class="field-label">FARBE</div>
          <div class="color-grid">
            ${COLOR_PRESETS.map((c, i) => `
              <div class="color-dot ${c.color===preset.color?"selected":""}"
                style="background:${c.color};${c.color===preset.color?`border-color:#0f172a;outline:2px solid ${c.color}`:""}"
                data-action="modal-color" data-colidx="${i}"></div>
            `).join("")}
          </div>

          <div class="field-label">STUNDEN & ZEITEN</div>
          <div class="slots-list">
            ${(kid?.slots||[{slot:1,time:"08:00",end:"08:45"},{slot:2,time:"08:45",end:"09:30"}]).map((s, i) => `
              <div class="slot-row">
                <div class="slot-num-badge">${s.slot}</div>
                <input class="slot-input" data-action="modal-slot-time" data-idx="${i}" placeholder="08:00" value="${s.time}">
                <span class="slot-sep">–</span>
                <input class="slot-input" data-action="modal-slot-end" data-idx="${i}" placeholder="08:45" value="${s.end}">
                <button class="slot-remove" data-action="modal-slot-remove" data-idx="${i}">×</button>
              </div>
            `).join("")}
            <button class="slot-add" data-action="modal-slot-add">+ Stunde hinzufügen</button>
          </div>

          <div class="modal-actions">
            ${!isNew ? `<button class="btn-delete" data-action="modal-delete">Löschen</button>` : ""}
            <button class="btn-cancel" data-action="modal-cancel">Abbrechen</button>
            <button class="btn-save" style="background:${preset.color}" data-action="modal-save">Speichern</button>
          </div>
        </div>
      </div>
    `;
  }

  /* ── Events ──────────────────────────────────────── */

  _attachEvents(root) {
    // Delegated click / input handler
    root.addEventListener("click",   e => this._onClick(e));
    root.addEventListener("change",  e => this._onChange(e));
    root.addEventListener("input",   e => this._onInput(e));
    root.addEventListener("dragstart", e => this._onDragStart(e));
    root.addEventListener("drop",    e => this._onDrop(e));
    root.addEventListener("dragover", e => e.preventDefault());
  }

  _target(e, action) {
    return e.target.closest(`[data-action="${action}"]`);
  }

  _onClick(e) {
    const el = e.target.closest("[data-action]");
    if (!el) return;
    const action = el.dataset.action;

    if (action === "tab") {
      this._activeKid = parseInt(el.dataset.idx);
      this._selected  = null;
      this._render();
    }
    else if (action === "toggle-edit") {
      this._editMode = !this._editMode;
      this._selected = null;
      this._render();
    }
    else if (action === "edit-kid") {
      e.stopPropagation();
      this._openModal(parseInt(el.dataset.idx));
    }
    else if (action === "add-kid") {
      this._openModal("new");
    }
    else if (action === "slot-click") {
      if (!this._editMode) return;
      const day  = el.dataset.day;
      const slot = parseInt(el.dataset.slot);
      const cur  = el.dataset.current || null;
      if (this._selected) {
        this._setSubject(this._activeKid, day, slot, this._selected);
      } else if (cur) {
        this._selected = cur;
        this._setSubject(this._activeKid, day, slot, null);
      }
    }
    else if (action === "remove-subject") {
      e.stopPropagation();
      this._setSubject(this._activeKid, el.dataset.day, parseInt(el.dataset.slot), null);
    }
    else if (action === "palette-drag") {
      const subj = el.dataset.subject;
      this._selected = this._selected === subj ? null : subj;
      this._render();
    }
    else if (action === "clear-sel") {
      this._selected = null;
      this._render();
    }
    else if (action === "export")  { this._export(); }
    else if (action === "import")  {
      const inp = this.shadowRoot.querySelector("[data-action='import-file']");
      inp && inp.click();
    }
    else if (action === "modal-overlay") {
      if (e.target === el) this._closeModal();
    }
    else if (action === "modal-cancel")  { this._closeModal(); }
    else if (action === "modal-save")    { this._saveModal(); }
    else if (action === "modal-delete")  { this._deleteKid(); }
    else if (action === "modal-emoji") {
      this._modalState.emoji = el.dataset.emoji;
      this._render();
    }
    else if (action === "modal-color") {
      this._modalState.colorIdx = parseInt(el.dataset.colidx);
      this._modalState.preset = COLOR_PRESETS[this._modalState.colorIdx];
      this._render();
    }
    else if (action === "modal-slot-remove") {
      const i = parseInt(el.dataset.idx);
      this._modalState.slots = this._modalState.slots
        .filter((_, j) => j !== i)
        .map((s, j) => ({ ...s, slot: j + 1 }));
      this._render();
    }
    else if (action === "modal-slot-add") {
      const n = this._modalState.slots.length ? this._modalState.slots[this._modalState.slots.length - 1].slot + 1 : 1;
      this._modalState.slots = [...this._modalState.slots, { slot: n, time: "", end: "" }];
      this._render();
    }
  }

  _onInput(e) {
    const el = e.target.closest("[data-action]");
    if (!el || !this._modalState) return;
    const action = el.dataset.action;
    if (action === "modal-name") this._modalState.name = el.value;
    if (action === "modal-age")  this._modalState.age  = el.value;
    if (action === "modal-slot-time") {
      const i = parseInt(el.dataset.idx);
      this._modalState.slots[i] = { ...this._modalState.slots[i], time: el.value };
    }
    if (action === "modal-slot-end") {
      const i = parseInt(el.dataset.idx);
      this._modalState.slots[i] = { ...this._modalState.slots[i], end: el.value };
    }
  }

  _onChange(e) {
    const el = e.target.closest("[data-action]");
    if (!el) return;
    if (el.dataset.action === "import-file") {
      const file = el.files[0];
      if (!file) return;
      const r = new FileReader();
      r.onload = ev => {
        try {
          this._kids = JSON.parse(ev.target.result);
          this._saveConfig();
        } catch (_) {}
      };
      r.readAsText(file);
    }
  }

  _onDragStart(e) {
    const el = e.target.closest("[data-action]");
    if (!el) return;
    if (el.dataset.action === "palette-drag") {
      this._drag = { subject: el.dataset.subject };
      this._selected = null;
    }
    if (el.dataset.action === "chip-drag") {
      this._drag = { subject: el.dataset.subject, fromDay: el.dataset.day, fromSlot: parseInt(el.dataset.slot) };
    }
  }

  _onDrop(e) {
    e.preventDefault();
    if (!this._drag) return;
    const td = e.target.closest("[data-action='slot-click']");
    if (!td) { this._drag = null; return; }
    const { subject, fromDay, fromSlot } = this._drag;
    if (fromDay) this._setSubject(this._activeKid, fromDay, fromSlot, null);
    this._setSubject(this._activeKid, td.dataset.day, parseInt(td.dataset.slot), subject);
    this._drag = null;
  }

  /* ── Modal state ─────────────────────────────────── */

  _openModal(idx) {
    const isNew = idx === "new";
    const kid   = isNew ? null : this._kids[idx];
    const ci    = kid ? Math.max(0, COLOR_PRESETS.findIndex(c => c.color === kid.color)) : 0;
    this._modal = { idx };
    this._modalState = {
      name:     kid?.name  || "",
      age:      kid?.age   || "",
      emoji:    kid?.emoji || "⭐",
      colorIdx: ci,
      preset:   COLOR_PRESETS[ci],
      slots:    kid?.slots ? [...kid.slots] : [
        { slot:1, time:"08:00", end:"08:45" },
        { slot:2, time:"08:45", end:"09:30" },
        { slot:3, time:"09:50", end:"10:35" },
        { slot:4, time:"10:35", end:"11:20" },
      ],
    };
    this._render();
  }

  _closeModal() {
    this._modal = null;
    this._modalState = null;
    this._render();
  }

  _saveModal() {
    const s = this._modalState;
    if (!s.name.trim()) return;
    const data = {
      name:   s.name.trim(),
      age:    s.age.trim(),
      emoji:  s.emoji,
      color:  s.preset.color,
      accent: s.preset.accent,
      light:  s.preset.light,
      slots:  s.slots,
    };
    if (this._modal.idx === "new") {
      this._kids.push({ ...data, schedule: { Mo:[], Di:[], Mi:[], Do:[], Fr:[] } });
      this._activeKid = this._kids.length - 1;
    } else {
      const existing = this._kids[this._modal.idx];
      this._kids[this._modal.idx] = { ...data, schedule: existing.schedule };
    }
    this._closeModal();
    this._saveConfig();
  }

  _deleteKid() {
    if (this._kids.length <= 1) return;
    this._kids.splice(this._modal.idx, 1);
    this._activeKid = 0;
    this._closeModal();
    this._saveConfig();
  }

  /* ── Export / Import ─────────────────────────────── */

  _export() {
    const blob = new Blob([JSON.stringify(this._kids, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "timetable_backup.json";
    a.click();
  }
}

/* ═══════════════════════════════════════════════════
   REGISTER
═══════════════════════════════════════════════════ */
customElements.define("timetable-card", TimetableCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type:        "timetable-card",
  name:        "Timetable Card",
  description: "Interactive family school timetable with edit mode, drag & drop, and per-child configuration.",
  preview:     true,
  documentationURL: "https://github.com/ay-kay/lovelace-timetable-card",
});