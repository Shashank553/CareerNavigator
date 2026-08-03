# Resume Content, GitHub Content & Screenshot Guide

## 1. ATS-Friendly Resume Bullet Points

Use under a "Projects" section. Pick 3–4 depending on space; the first four are the core set, the rest are optional swaps/additions.

- Developed **AI Career Navigator**, a responsive placement-preparation portal using HTML5, CSS3, and vanilla JavaScript, consolidating DSA tracking, aptitude tracking, resume analysis, and interview prep into a single dashboard.
- Implemented interactive dashboards, progress tracking, and client-side data persistence using LocalStorage, eliminating the need for a backend while retaining full state across sessions.
- Designed mobile-first, responsive user interfaces with modern UI/UX principles, including a collapsible sidebar, dark/light theming via CSS custom properties, and WCAG-conscious accessibility features (skip links, ARIA live regions, focus-visible states).
- Improved user engagement through dynamic content rendering, real-time form validation, and a global cross-module search feature spanning 60+ topics and questions.
- Built four dependency-free, Canvas-API-based data visualizations (bar, donut, line, and radar charts) that update reactively based on live user progress, without relying on any external charting library.
- Architected a modular, 20-module vanilla JavaScript codebase following single-responsibility principles, improving readability and maintainability without introducing a frontend framework.
- Engineered a heuristic, client-side ATS resume-scoring engine that evaluates keyword coverage and structural completeness against role-specific keyword banks (Full Stack, AI/ML, Data Analyst, General SDE).

**One-line project summary (for resume header/project title line):**
> AI Career Navigator | HTML5, CSS3, JavaScript | Personal Project — A responsive, no-backend placement prep dashboard with DSA/aptitude tracking, resume analysis, and canvas-based analytics.

---

## 2. GitHub Repository Content

### Repository Name
`ai-career-navigator`

### Repository Description (GitHub "About" field, ≤350 chars)
> 🧭 A responsive, no-backend placement preparation portal built with HTML5, CSS3 & vanilla JavaScript — DSA & aptitude trackers, an ATS resume analyzer, AI interview flashcards, a mock interview scheduler, and hand-built Canvas analytics charts. All progress saved locally via localStorage.

### Repository Topics / Tags
```
html5  css3  javascript  vanilla-javascript  frontend  responsive-design
localstorage  canvas-api  dashboard  student-project  placement-preparation
ats-resume  data-visualization  dark-mode  spa  portfolio-project
```

### Suggested README Badges (Markdown, optional)
```markdown
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![No Backend](https://img.shields.io/badge/Backend-None%20required-success)
![License](https://img.shields.io/badge/License-Educational-blue)
```

### Portfolio / Personal Website Project Description (short version)

> **AI Career Navigator** — a placement preparation dashboard built with pure HTML5, CSS3, and JavaScript. Tracks DSA and aptitude progress, scores resumes against ATS-style keyword banks, offers flip-card interview prep, schedules mock interviews, and visualizes overall readiness through four hand-coded Canvas charts — all without a single line of backend code. [Live Demo] · [Source Code]

### Portfolio Project Description (longer version, for a case-study page)

> Most students preparing for campus placements end up juggling a spreadsheet for DSA problems, a notebook for aptitude formulas, a separate website to sanity-check their resume, and a calendar reminder for mock interviews. **AI Career Navigator** consolidates all of it into one dashboard.
>
> Built with only HTML5, CSS3, and vanilla JavaScript — no frameworks, no backend, no build tools — the project pushed me to solve problems frameworks usually abstract away: theme-aware canvas redraws, a from-scratch radar chart using polar-to-Cartesian math, a responsive off-canvas sidebar sharing logic between desktop collapse and mobile drawer states, and a 20-module JavaScript architecture kept clean without React or Vue.
>
> Every tracker, score, and scheduled session persists via `localStorage`, so the "readiness score" shown across the dashboard, roadmap, and analytics views is always computed from genuinely live user data — not hardcoded placeholders.

---

## 3. Screenshot Guide — Exactly 8 Screenshots to Capture

For placement submissions, portfolio case studies, and project documentation, capture these 8 screenshots (desktop resolution ~1440×900 unless noted):

1. **Landing Page — Hero Section** (full viewport, light or dark mode, showing the radar visual and headline)
2. **Landing Page — Features Grid** (scroll to the "Every gauge you need" section)
3. **Student Dashboard** (KPI cards + weekly activity bar chart + upcoming sessions, with at least a few trackers checked off so the KPIs aren't all zero)
4. **DSA Tracker** (grid view with several topics checked, filter box visible)
5. **Resume Analyzer — Results Panel** (after pasting sample resume text and clicking "Analyze", showing the score ring, found/missing keyword pills, and tips)
6. **AI Interview Prep — Flashcard Flipped** (one card in its flipped/answer state, ideally alongside a couple of un-flipped cards for contrast)
7. **Progress Analytics View** (all four charts visible — donut, bar, line, radar — in one screenshot if possible, or a scrolling capture)
8. **Mobile Responsive View** (browser dev tools set to a mobile width like 390px, sidebar drawer open, showing the hamburger-driven mobile navigation)

**Tips for clean screenshots:**
- Populate a few trackers and schedule one mock session *before* capturing, so the dashboard and analytics don't look empty.
- Capture one set of screenshots in light mode and, optionally, a second matching set in dark mode to showcase the theming system.
- Use your browser's built-in responsive/device-toolbar mode (F12 → toggle device toolbar) for the mobile screenshot rather than physically resizing the window.
