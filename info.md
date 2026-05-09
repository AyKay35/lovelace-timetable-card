# Stundenplan Card

An interactive family timetable / school schedule card for Home Assistant.

## Features

- 📅 Weekly timetable view for multiple children
- ✏️ Edit mode with tap-to-place and drag & drop
- 🎨 Per-child color themes and emoji
- 🏫 Individual time slots per child (different schools)
- 💾 Data stored in your Lovelace config (backed up with HA)
- 📱 Optimized for wall-mounted tablets

## Installation

Install via HACS, then add the card to your dashboard:

```yaml
type: custom:stundenplan-card
kids:
  - name: Lena
    age: 3. Klasse
    emoji: "🌸"
    color: "#f472b6"
    accent: "#be185d"
    light: "#fdf2f8"
    slots:
      - slot: 1
        time: "08:00"
        end: "08:45"
    schedule:
      Mo:
        - slot: 1
          subject: Deutsch
```
