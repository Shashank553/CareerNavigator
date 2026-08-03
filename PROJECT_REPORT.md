# PROJECT REPORT

<br>

<div align="center">

# AI CAREER NAVIGATOR
## Smart Placement Preparation Portal

**A Front-End Web Development Project**

**Submitted for:** Cognizant Campus Hiring / Academic Portfolio Submission
**Technology Stack:** HTML5, CSS3, JavaScript (ES6+)
**Submitted by:** Gujapaneni Shashank Sreenivas
**Institution:** KL University, Vijayawada
**Program:** B.Tech Computer Science and Engineering (Honors) — AI-Driven Language Technologies
**Academic Year:** 2026 – 2027

</div>

<br>

---

## 1. Abstract

AI Career Navigator is a fully client-side web application designed to consolidate the scattered tools engineering students typically use while preparing for campus placements — spreadsheets for tracking DSA problems, notebooks for aptitude formulas, separate resume-checking websites, and calendar apps for mock interviews — into a single, cohesive dashboard. Built entirely with HTML5, CSS3, and vanilla JavaScript with no backend or external frameworks, the application demonstrates strong command of semantic markup, responsive design, the Canvas API, the `localStorage` Web API, and modular JavaScript architecture. The portal includes a marketing-style landing page and an eight-module dashboard: Overview, Roadmap, DSA Tracker, Aptitude Tracker, Resume Analyzer, Interview Prep, Mock Scheduler, and Progress Analytics — with all four analytics charts (bar, donut, line, radar) hand-implemented on `<canvas>` without any charting library.

## 2. Objective

- To design and develop a professional, industry-grade front-end web application without relying on any backend infrastructure.
- To demonstrate proficiency in semantic HTML5, modern CSS3 (Grid, Flexbox, custom properties), and vanilla JavaScript (DOM manipulation, event handling, the Canvas API, and the `localStorage` API).
- To build a genuinely useful tool that consolidates the fragmented placement-preparation workflow of a typical engineering student into one dashboard.
- To produce a portfolio-ready artifact suitable for demonstration in campus placement interviews, technical vivas, and internship applications.

## 3. Problem Statement

Engineering students preparing for campus placements typically juggle multiple disconnected tools: a spreadsheet to track solved DSA problems, a notebook or app for aptitude formula revision, an external website to sanity-check their resume against a job description, and a calendar reminder for scheduled mock interviews. This fragmentation makes it difficult to get a single, honest picture of overall placement readiness at any given moment, and increases the chance that a preparation area (e.g., aptitude, or resume polish) is quietly neglected. AI Career Navigator addresses this by unifying every one of these workflows into a single, persistent, offline-capable dashboard — with a live "readiness score" that reflects real tracked progress rather than a guess.

## 4. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Structure | HTML5 | Semantic page structure, forms, `<canvas>` elements, ARIA attributes |
| Styling | CSS3 | Design tokens (custom properties), Grid & Flexbox layout, responsive breakpoints, keyframe animations, dark/light theming |
| Behavior | JavaScript (ES6+) | DOM manipulation, event handling, form validation, `localStorage` persistence, Canvas-based charting |
| Fonts | Google Fonts | Space Grotesk (display), Inter (body), JetBrains Mono (data/metrics) |
| Persistence | Web Storage API (`localStorage`) | Client-side, no-backend data persistence across sessions |
| Tooling | None required | No bundler, package manager, or framework — runs directly in any modern browser |

## 5. System Architecture

The application follows a **single-page application (SPA) shell pattern layered on top of a static marketing site**, entirely in the browser:

```
┌─────────────────────────────────────────────┐
│                index.html                    │
│  ┌─────────────┐        ┌──────────────────┐ │
│  │ Landing View │  <-->  │  Dashboard View   │ │
│  │ (marketing)  │        │  (SPA shell)      │ │
│  └─────────────┘        └──────────────────┘ │
│         Shown/hidden via AppShell module      │
└─────────────────────────────────────────────┘
                     │
                     ▼
        ┌─────────────────────────┐
        │        script.js         │
        │  20 self-contained JS    │
        │  modules (see README)    │
        └─────────────────────────┘
                     │
                     ▼
        ┌─────────────────────────┐
        │   Browser localStorage   │
        │  (progress, sessions,    │
        │   theme, resume score)   │
        └─────────────────────────┘
```

Within the Dashboard View, a lightweight **client-side router** (`RouterModule`) toggles `.view.active` classes on section elements based on sidebar clicks — no page reloads, no URL routing library, and no server round-trips.

## 6. Modules Description

1. **Landing Page** — Hero section, feature grid, roadmap teaser, testimonials carousel, FAQ accordion, and a validated contact form.
2. **Student Dashboard** — At-a-glance KPI cards (DSA %, Aptitude %, Resume score, Mock interviews booked) plus a weekly-activity bar chart and an upcoming-sessions list.
3. **Placement Roadmap** — A six-stage timeline whose status badges (`upcoming` / `progress` / `done`) are computed live from actual tracked data rather than being hardcoded.
4. **DSA Tracker** — 24 curated topics grouped into six categories, with live text filtering and persistent checkbox state.
5. **Aptitude Tracker** — Three tabbed categories (Quantitative, Logical Reasoning, Verbal Ability), each with its own topic checklist.
6. **Resume Analyzer** — A heuristic ATS-style scoring engine that checks keyword coverage against a chosen target role, plus structural checks (contact info presence, section headers, quantified achievements, resume length).
7. **AI Interview Prep** — Eighteen flip-card interview questions across HR, Technical, and Behavioral categories with category filter chips.
8. **Mock Interview Scheduler** — A form-driven booking system (role, date, time, partner) with a sorted, persistent, removable session list.
9. **Progress Analytics** — Four canvas-drawn charts: a donut (track completion), a bar chart (DSA category breakdown), a line chart (simulated 8-week readiness trend), and a radar chart (5-axis overall readiness).

## 7. Implementation Details

- **Responsive layout** is achieved through CSS Grid for page-level composition and Flexbox for component alignment, with breakpoints at 1024px (tablet) and 760px/480px (mobile), including a collapsible off-canvas sidebar drawer on small screens.
- **Dark/Light theming** is implemented purely through CSS custom properties toggled via a `data-theme` attribute on `<html>`, meaning no component-level style duplication is required; canvas charts read their colors live from computed CSS variables and are redrawn on theme toggle.
- **Form validation** (contact form, mock scheduler) is implemented in plain JavaScript using regex-based checks and inline error messaging, with `aria-live` regions for accessible success feedback.
- **Charting** is implemented from first principles on the HTML5 `<canvas>` 2D context — bar, donut, line, and radar charts — deliberately avoiding any external charting library to demonstrate raw Canvas API proficiency.
- **State persistence** uses a small `Utils.storage` wrapper around `localStorage` with JSON serialization and try/catch guards, so every tracker, the resume score, and scheduled sessions survive page reloads and browser restarts.
- **Security-conscious rendering:** all user-supplied or dynamically inserted text (contact form fields, resume text, search results) is passed through an `escapeHTML()` helper before being injected into the DOM, mitigating basic HTML/script injection when rendering dynamic content.

## 8. Screenshots

*(Insert screenshots per the Screenshot Guide in Section 12 of the README / below. Placeholder captions listed here for report formatting.)*

- **Figure 1:** Landing page hero section (desktop)
- **Figure 2:** Feature grid section
- **Figure 3:** Student Dashboard with KPI cards and weekly chart
- **Figure 4:** DSA Tracker with topics checked
- **Figure 5:** Resume Analyzer results panel
- **Figure 6:** AI Interview Prep flip-card (front and back)
- **Figure 7:** Progress Analytics view (all four charts)
- **Figure 8:** Mobile responsive view with sidebar drawer open

## 9. Challenges Faced

- **Building charts without a library:** Implementing bar, donut, line, and radar charts directly on `<canvas>` required manually handling device pixel ratio scaling for crisp rendering (`clearHiDPI` helper) and manually computing polar-to-Cartesian coordinates for the radar chart.
- **Theme-aware canvas redraws:** Since canvas content is drawn as pixels rather than styled DOM elements, colors don't automatically update on theme toggle — this required explicitly re-invoking each chart's render function whenever the theme changed.
- **Keeping state consistent across modules:** With DSA progress, aptitude progress, resume score, and scheduled sessions all feeding into the Dashboard KPIs, the Roadmap status, and the Analytics charts, care was needed to re-render all dependent views whenever any one tracker changed, without introducing a heavy state-management framework.
- **Responsive sidebar behavior:** Making a persistent desktop sidebar and a mobile off-canvas drawer share the same markup and JavaScript toggle logic (rather than duplicating navigation) required careful CSS class-based state management (`.sidebar-collapsed` vs `.sidebar-open`).

## 10. Learning Outcomes

- Practical, hands-on reinforcement of semantic HTML5 structure and accessibility basics (skip links, `aria-live`, `aria-expanded`, focus-visible styling).
- Deeper fluency in CSS custom properties as a theming mechanism, and in combining CSS Grid and Flexbox appropriately at different layout scales.
- Direct experience with the HTML5 Canvas 2D API for data visualization, including High-DPI-aware rendering.
- Strengthened understanding of modular, maintainable vanilla JavaScript architecture without relying on a framework — an increasingly valuable skill for understanding what frameworks abstract away.
- Practical experience designing `localStorage`-backed persistence layers, including key-naming conventions and safe JSON serialization.

## 11. Future Enhancements

- Integrate a real backend (Node.js/Express + a database) to enable multi-device sync, authentication, and true resume-parsing via an NLP/ATS API.
- Add a real notification/reminder system (e.g., browser push notifications) for upcoming mock interviews.
- Expand the DSA and Aptitude trackers with difficulty tagging, spaced-repetition scheduling, and per-topic notes.
- Introduce a peer-matching feature for the Mock Interview Scheduler so students can pair up with classmates in real time.
- Add exportable PDF progress reports generated client-side (e.g., via a PDF-generation library) for placement cell submissions.

## 12. Conclusion

AI Career Navigator successfully demonstrates that a genuinely useful, visually polished, and technically substantial web application can be built using only HTML5, CSS3, and vanilla JavaScript. By consolidating DSA tracking, aptitude tracking, resume analysis, interview preparation, and interview scheduling into one dashboard with live, data-driven analytics, the project goes beyond a typical academic front-end exercise and functions as a coherent, deployable tool. It serves as strong evidence of front-end fundamentals — semantic markup, responsive CSS, the Canvas API, and clean modular JavaScript — making it a suitable centerpiece project for campus placement portfolios, technical interviews, and hackathon submissions.

---

<div align="center">

*End of Report*

</div>
