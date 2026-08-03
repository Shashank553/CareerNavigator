# 🧭 AI Career Navigator — Smart Placement Preparation Portal

A modern, fully responsive, front-end-only placement preparation portal built with **HTML5, CSS3, and Vanilla JavaScript** — no frameworks, no backend, no build tools. Everything runs directly in the browser, with progress persisted via `localStorage`.

> Built as an industry-style academic showcase project — suitable for placement portfolios, hackathons, and internship applications.

---

## ✨ Live Feature List

| Module | Description |
|---|---|
| **Landing Page** | Hero section with an animated radar/compass visual, feature grid, roadmap teaser, testimonials carousel, FAQ accordion, and validated contact form. |
| **Student Dashboard** | KPI cards (DSA %, Aptitude %, Resume score, Mock interviews booked), a weekly-activity bar chart, and an upcoming-sessions widget. |
| **Placement Roadmap** | A 6-stage timeline (Foundations → DSA → Aptitude → Resume → Mock Interviews → Offer) with live status badges derived from your actual tracked progress. |
| **DSA Tracker** | 24 topics across Fundamentals, Linear Structures, Trees & Heaps, Graphs, Recursion & DP, and Math & Bits — filterable, checkbox-driven, saved to `localStorage`. |
| **Aptitude Tracker** | Quantitative / Logical Reasoning / Verbal Ability tabs, each with dedicated topic checklists. |
| **Resume Analyzer** | Paste resume text, choose a target role, and get an instant client-side ATS-style score (0–100) with keyword-gap analysis and actionable tips. Nothing is uploaded anywhere. |
| **AI Interview Prep** | Flip-card Q&A across HR, Technical, and Behavioral categories with filter chips. |
| **Mock Interview Scheduler** | Book sessions (role, date, time, partner), see them listed and sorted chronologically, remove them — all saved locally. |
| **Progress Analytics** | Four hand-built canvas charts (donut, bar, line, radar) — no chart library used — all reactive to your live tracked data. |
| **Dark / Light Mode** | Toggle persists across sessions and instantly redraws every canvas chart to match the active theme. |
| **Global Search** | Search across DSA topics, aptitude topics, interview questions, and FAQs from the dashboard topbar. |
| **Responsive Design** | Fully responsive: collapsible sidebar drawer on mobile, stacked grids on tablet, hamburger nav on the landing page. |

---

## 📁 Project Structure

```
ai-career-navigator/
├── index.html              # Semantic HTML5 markup — landing page + dashboard SPA
├── css/
│   └── style.css           # Design tokens, layout, themes, responsive rules, animations
├── js/
│   └── script.js           # Modular vanilla JS (20 self-contained modules, see below)
├── assets/
│   ├── images/             # Place any screenshots / custom images here
│   └── icons/              # Place any custom icon assets here
├── README.md                # This file
├── PROJECT_REPORT.md         # Full academic-style project report
└── VIVA_QUESTIONS.md         # 30 viva/interview questions with answers
```

> **Note:** All icons in the UI are inline SVG or emoji — no external icon library or image assets are required for the app to run.

---

## 🚀 Installation & Running Locally

No build step, no `npm install`, no dependencies. Three ways to run it:

**Option 1 — Just open the file**
1. Download / clone the project folder.
2. Double-click `index.html` (or right-click → Open with your browser).

**Option 2 — Local static server (recommended, avoids browser file:// restrictions)**
```bash
# Using Python 3
cd ai-career-navigator
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

**Option 3 — VS Code Live Server extension**
1. Open the folder in VS Code.
2. Install the "Live Server" extension.
3. Right-click `index.html` → "Open with Live Server".

No API keys, environment variables, or backend services are required.

---

## 🧠 JavaScript Architecture

`script.js` is organized into 20 clearly separated, single-responsibility modules instead of one large script:

1. **Utils** — shared helpers (DOM selectors, `localStorage` wrapper, HTML escaping, toast notifications)
2. **ThemeModule** — dark/light theme persistence
3. **PreloaderModule** — initial loading screen
4. **NavbarModule** — mobile hamburger menu
5. **AppShell** — landing page ↔ dashboard SPA switching
6. **RouterModule** — sidebar view routing inside the dashboard
7. **FaqModule** — accordion behavior
8. **TestimonialModule** — carousel with auto-advance
9. **ContactFormModule** — client-side form validation
10. **DataModule** — all static datasets (DSA topics, aptitude topics, interview Q&A, roadmap, resume keyword banks)
11. **DsaTrackerModule** — DSA checklist + filtering + persistence
12. **AptTrackerModule** — aptitude checklist with category tabs
13. **ResumeModule** — heuristic ATS scoring engine
14. **InterviewModule** — flip-card rendering and filtering
15. **SchedulerModule** — mock interview CRUD (create/read/delete) via `localStorage`
16. **SearchModule** — cross-content global search
17. **RoadmapModule** — data-driven roadmap timeline
18. **ChartUtils** — dependency-free canvas chart primitives (bar, donut, line, radar)
19. **DashboardModule** — KPI cards + weekly chart
20. **AnalyticsModule** — full analytics chart suite

Each module exposes an `init()` method, called once from a single `DOMContentLoaded` bootstrap block at the bottom of the file — keeping global state minimal and code easy to navigate.

---

## 💾 LocalStorage Keys Used

| Key | Purpose |
|---|---|
| `acn_theme` | `"light"` or `"dark"` |
| `acn_dsa_progress` | Object map of DSA topic IDs → boolean completion |
| `acn_apt_progress` | Object map of aptitude topic IDs → boolean completion |
| `acn_resume_last` | Last pasted resume text + selected target role |
| `acn_resume_score` | Last computed ATS score (0–100) |
| `acn_sessions` | Array of scheduled mock interview sessions |
| `acn_last_contact` | Last submitted contact form payload (local only, no server) |

---

## 🎨 Design System

- **Typography:** Space Grotesk (display/headings), Inter (body text), JetBrains Mono (data, scores, timestamps)
- **Theme:** "Flight Navigator" — a mission-control / radar motif (signal teal `#0E9E8E` primary accent, amber `#F2A03D` secondary accent) representing charting a course through placement prep
- **Layout:** CSS Grid for page-level composition, Flexbox for component-level alignment
- **Motion:** Radar sweep animation in the hero, smooth view transitions, hover micro-interactions, respects `prefers-reduced-motion`

---

## 🛠️ Technology Stack

- HTML5 (semantic elements, ARIA labels, `<canvas>`)
- CSS3 (custom properties, Grid, Flexbox, `color-mix()`, keyframe animations)
- Vanilla JavaScript (ES6+, modular pattern, no frameworks or libraries)
- Browser `localStorage` Web API for persistence
- Google Fonts (Space Grotesk, Inter, JetBrains Mono)

---

## 📌 Known Limitations

- Progress is stored per-browser, per-device (no cloud sync, by design — this is a frontend-only showcase).
- The Resume Analyzer uses keyword + structural heuristics, not a real NLP/ATS engine.
- Charts are hand-drawn on `<canvas>` without any charting library, by design, to demonstrate raw DOM/Canvas API skill.

---

## 📄 License

This project is provided as an educational/portfolio artifact. Feel free to fork, adapt, and extend it for your own placement preparation or coursework submissions.
