# 📅 Timetable Card for Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![Version](https://img.shields.io/github/v/release/ay-kay/lovelace-timetable-card)](https://github.com/ay-kay/lovelace-timetable-card/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A beautiful, interactive school timetable card for [Home Assistant](https://www.home-assistant.io/) — perfect for families with multiple children at different schools.

![Timetable Card Preview](https://raw.githubusercontent.com/ay-kay/lovelace-timetable-card/main/docs/preview.png)

---

## ✨ Features

- 📅 **Weekly timetable** — full Monday–Friday overview at a glance
- 👨‍👩‍👧‍👦 **Multiple children** — one tab per child, each with their own color theme and emoji
- 🏫 **Per-child time slots** — different schools, different schedules, no problem
- 🎨 **Fully customizable subjects** — define your own subjects with individual colors via the visual editor
- ✏️ **Visual editor** — configure everything without touching YAML: children, time slots, subjects, and the full timetable grid
- 🖱️ **Drag & drop + tap-to-place** — fill in the timetable intuitively
- 💾 **Stored in HA config** — data lives in your Lovelace configuration, backed up with Home Assistant
- 📱 **Tablet-optimized** — designed for wall-mounted tablets running Fully Kiosk Browser or similar
- 🌙 **Dark mode support** — respects Home Assistant's theme variables

---

## 📦 Installation

### Via HACS (recommended)

1. Open **HACS** in your Home Assistant instance
2. Go to **Frontend** → click the three-dot menu (⋮) → **Custom repositories**
3. Enter the repository URL and select category **Dashboard**:
   ```
   https://github.com/ay-kay/lovelace-timetable-card
   ```
4. Click **Add** → find **Timetable Card** in the list → **Download**
5. Reload your browser (hard refresh: `Ctrl+Shift+R`)

### Manual

1. Download `timetable-card.js` from the [latest release](https://github.com/ay-kay/lovelace-timetable-card/releases)
2. Copy it to `/config/www/timetable-card.js`
3. Add it as a Lovelace resource:
   - Go to **Settings → Dashboards → three-dot menu → Resources**
   - Add `/local/timetable-card.js` as **JavaScript module**
4. Reload your browser

---

## 🚀 Usage

### Adding the card

1. Edit your dashboard → **Add card** → search for **Timetable Card**
2. The card will be added with example data
3. Click the card to open the editor

### Using the visual editor

The editor is split into two areas:

#### 👶 Children tabs (left side)

Each child gets their own tab. Click a tab to switch to that child's configuration.

| Element       | What it does                                       |
| ------------- | -------------------------------------------------- |
| Emoji (click) | Opens emoji picker                                 |
| Name field    | Edit child's name — saved when you leave the field |
| Class field   | Edit class/grade — saved when you leave the field  |
| Color dots    | Change the color theme                             |
| ⏱ Zeiten      | Toggle the time slot editor                        |
| Löschen       | Remove this child                                  |
| **+** button  | Add a new child                                    |

#### ⏱ Time slots

Each child can have completely independent time slots — useful when children attend different schools with different schedules. Just click **⏱ Zeiten** to expand the slot editor.

#### 📋 Timetable grid

Fill in the timetable by:

- **Tap-to-place**: tap a subject in the palette → tap a cell in the grid
- **Drag & drop**: drag a subject from the palette directly into a cell
- **Remove**: tap the × on a filled cell, or tap it to pick it up and re-place it elsewhere

#### 🎨 Subjects tab

Click the **🎨 Fächer** tab to manage subjects:

- Click the colored circle to change a subject's color
- Edit the name directly
- Add or remove subjects
- A live preview shows all subject chips with their colors

---

## ⚙️ YAML Configuration

While the visual editor handles everything, here is the full YAML structure for reference or manual setup:

```yaml
type: custom:timetable-card

# Subjects — define all subjects and their colors here
subjects:
  - name: Mathe
    color: "#1d4ed8"
  - name: Deutsch
    color: "#854d0e"
  - name: Englisch
    color: "#065f46"
  - name: Sport
    color: "#5b21b6"
  # Add as many as you need...

# Children
kids:
  - name: Lena
    age: 3. Klasse
    emoji: "🌸"
    color: "#f472b6"
    accent: "#be185d"
    light: "#fdf2f8"
    # Time slots for THIS child's school
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
    slots:
      - slot: 1
        time: "07:55"
        end: "08:40"
      - slot: 2
        time: "08:40"
        end: "09:25"
    schedule:
      Mo:
        - slot: 1
          subject: Englisch
      Di: []
      Mi: []
      Do: []
      Fr: []
```

### Adding afternoon lessons

Simply add more slots with higher numbers:

```yaml
slots:
  - slot: 1
    time: "08:00"
    end: "08:45"
  - slot: 2
    time: "08:45"
    end: "09:30"
  # ... morning slots ...
  - slot: 7
    time: "14:00"
    end: "14:45"
  - slot: 8
    time: "14:45"
    end: "15:30"
```

Dashed break lines are shown automatically after slots 2 and 4.

---

## 💾 Backup & Restore

Your timetable data is stored directly in the Lovelace configuration and is automatically included in your Home Assistant backups.

For manual backups, use the **↓ Backup exportieren** button in the editor to download a JSON file. Restore it via **↑ Backup importieren**.

---

## 🎨 Subject Color Reference

The card automatically generates a light background and border color from each subject's single base color. You only need to define one color per subject.

Some suggested colors:

| Subject    | Color     |
| ---------- | --------- |
| Mathe      | `#1d4ed8` |
| Deutsch    | `#854d0e` |
| Englisch   | `#065f46` |
| Sport      | `#5b21b6` |
| Musik      | `#991b1b` |
| Kunst      | `#9d174d` |
| Geschichte | `#9f1239` |
| Biologie   | `#166534` |
| Physik     | `#075985` |
| Chemie     | `#92400e` |
| Informatik | `#3730a3` |

---

## 🖼️ Screenshots

| View mode                                                                                    | Editor                                                                                           |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| ![View](https://raw.githubusercontent.com/ay-kay/lovelace-timetable-card/main/docs/view.png) | ![Editor](https://raw.githubusercontent.com/ay-kay/lovelace-timetable-card/main/docs/editor.png) |

---

## 🗺️ Roadmap

- [ ] English language support
- [ ] Configurable break lines (currently fixed after slots 2 and 4)
- [ ] Week A/B alternating schedules
- [ ] Holiday / no-school day indicators
- [ ] Color picker for child theme colors in editor

---

## 🤝 Contributing

Pull requests are welcome! Please open an issue first to discuss what you would like to change.

---

## ☕ Support

If this card saves you time and you'd like to say thanks:

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/aykay35)

---

## 📄 License

MIT © [ay-kay](https://github.com/ay-kay)
