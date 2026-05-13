# 📅 Timetable Card for Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![Version](https://img.shields.io/github/v/release/ay-kay/lovelace-timetable-card)](https://github.com/ay-kay/lovelace-timetable-card/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Stars](https://img.shields.io/github/stars/ay-kay/lovelace-timetable-card?style=flat)](https://github.com/ay-kay/lovelace-timetable-card/stargazers)

A beautiful, interactive school timetable card for [Home Assistant](https://www.home-assistant.io/) — perfect for families with multiple children at different schools.

---

## ✨ Features

- 📅 **Weekly timetable** — full Monday–Friday overview at a glance
- 👨‍👩‍👧‍👦 **Multiple children** — one tab per child, personal color theme and emoji
- 🏫 **Per-child time slots** — different schools, different schedules, no problem
- 🎨 **Fully customizable subjects** — define your own subjects with individual colors
- ✏️ **Visual editor** — configure everything without touching YAML
- 🖱️ **Drag & drop + tap-to-place** — fill in the timetable intuitively
- 💾 **Stored in HA config** — backed up automatically with Home Assistant
- 📱 **Tablet-optimized** — designed for wall-mounted tablets
- 🌙 **Dark mode support** — respects Home Assistant theme variables

---

## 📦 Installation

### Via HACS (recommended)

1. Open **HACS** → **Frontend** → three-dot menu (⋮) → **Custom repositories**
2. Add:
   ```
   https://github.com/ay-kay/lovelace-timetable-card
   ```
   Category: **Dashboard**
3. Find **Timetable Card** → **Download**
4. Hard-refresh your browser (`Ctrl+Shift+R`)

### Manual

1. Download `timetable-card.js` from the [latest release](https://github.com/ay-kay/lovelace-timetable-card/releases)
2. Copy to `/config/www/timetable-card.js`
3. Add as Lovelace resource: `/local/timetable-card.js` (JavaScript module)

---

## 🚀 Quick Start

1. Add card → search **Timetable**
2. Card appears with example data
3. Click card → **Edit** to open the visual editor
4. Add your children, set time slots, fill in the timetable

No YAML required. Everything works through the visual editor.

---

## 🖼️ Visual Editor

The editor is split into tabs — one per child — plus a **🎨 Fächer** tab for subject management.

### Per-child configuration

| Element      | Action                                           |
| ------------ | ------------------------------------------------ |
| Emoji        | Click to open emoji picker                       |
| Name / Class | Click to edit, saves on blur (Tab or click away) |
| Color dots   | Click to change color theme                      |
| ⏱ Zeiten     | Toggle time slot editor                          |
| **+** button | Add a new child                                  |

### Filling in the timetable

- **Tap-to-place**: tap a subject in the palette → tap a cell
- **Drag & drop**: drag from palette directly into a cell
- **Remove**: tap the × on a filled cell

### Managing subjects (🎨 Fächer tab)

- Click the colored circle to open a color picker
- Edit name directly in the field
- Add / remove subjects freely
- Live preview shows all chips with their colors

---

## ⚙️ Full YAML Reference

```yaml
type: custom:timetable-card

subjects:
  - name: Mathe
    color: "#1d4ed8"
  - name: Deutsch
    color: "#854d0e"
  - name: Englisch
    color: "#065f46"
  - name: Sport
    color: "#5b21b6"
  - name: KlaRa # custom school-specific subjects
    color: "#7e22ce"
  - name: LZ
    color: "#14532d"
  # add as many as you need...

kids:
  - name: Lena
    age: 3. Klasse
    emoji: "🌸"
    color: "#f472b6" # tab accent color
    accent: "#be185d" # darker shade for text
    light: "#fdf2f8" # light background for active tab
    slots:
      - slot: 1
        time: "08:00"
        end: "08:45"
      - slot: 2
        time: "08:45"
        end: "09:30"
      - slot: 3
        time: "09:50"
        end: "10:35"
      - slot: 4
        time: "10:35"
        end: "11:20"
      # afternoon lessons:
      # - slot: 7
      #   time: "14:00"
      #   end: "14:45"
    schedule:
      Mo:
        - slot: 1
          subject: Deutsch
        - slot: 2
          subject: Mathe
        - slot: 3
          subject: Sport
      Di:
        - slot: 1
          subject: Mathe
        - slot: 2
          subject: Englisch
      Mi: []
      Do:
        - slot: 1
          subject: Kunst
        - slot: 2
          subject: Musik
      Fr:
        - slot: 1
          subject: Deutsch
        - slot: 2
          subject: Sport

  - name: Jonas
    age: 5. Klasse
    emoji: "🚀"
    color: "#60a5fa"
    accent: "#1d4ed8"
    light: "#eff6ff"
    slots: # Jonas's school starts earlier
      - slot: 1
        time: "07:55"
        end: "08:40"
      - slot: 2
        time: "08:40"
        end: "09:25"
      - slot: 3
        time: "09:45"
        end: "10:30"
    schedule:
      Mo:
        - slot: 1
          subject: Englisch
        - slot: 2
          subject: Mathe
      Di: []
      Mi: []
      Do: []
      Fr: []
```

### Child color presets

| Color     | `color`   | `accent`  | `light`   |
| --------- | --------- | --------- | --------- |
| 🔴 Red    | `#f87171` | `#b91c1c` | `#fff1f2` |
| 🩷 Pink   | `#f472b6` | `#be185d` | `#fdf2f8` |
| 🔵 Blue   | `#60a5fa` | `#1d4ed8` | `#eff6ff` |
| 🟢 Green  | `#4ade80` | `#15803d` | `#f0fdf4` |
| 🟠 Orange | `#fb923c` | `#c2410c` | `#fff7ed` |
| 🟣 Purple | `#a78bfa` | `#6d28d9` | `#f5f3ff` |
| 🟡 Yellow | `#fbbf24` | `#b45309` | `#fffbeb` |
| 🩵 Teal   | `#2dd4bf` | `#0f766e` | `#f0fdfa` |

---

## 💾 Backup & Restore

Timetable data is stored in the Lovelace config and included in every HA backup automatically.

For manual backup: **↓ Backup exportieren** in the editor downloads a JSON file.
To restore: **↑ Backup importieren** reads it back in.

---

## 🗺️ Roadmap

- [ ] English language support
- [ ] Configurable break line positions (currently fixed after slots 2 and 4)
- [ ] Week A/B alternating schedules
- [ ] Holiday / no-school day indicators

---

## 🤝 Contributing

Pull requests are welcome! Please open an issue first to discuss what you'd like to change.

---

## ☕ Support

If this card is useful for your family:

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/aykay35)

---

## 📄 License

MIT © [ay-kay](https://github.com/ay-kay)
