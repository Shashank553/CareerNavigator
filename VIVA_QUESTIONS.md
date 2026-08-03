# Viva / Interview Questions — AI Career Navigator

30 likely questions and model answers, grouped by topic, based directly on techniques used in this project. Useful for project vivas, placement interviews, and internship screenings.

---

## HTML5 (Q1–Q5)

**Q1. What is semantic HTML, and where is it used in this project?**
Semantic HTML uses tags that describe their meaning/content rather than just their appearance — e.g. `<nav>`, `<header>`, `<section>`, `<footer>`, `<article>`, `<aside>`, `<main>`. In this project, `<nav class="navbar">` wraps site navigation, `<aside class="sidebar">` wraps dashboard navigation, `<main>` wraps the primary content, and each dashboard module is a `<section class="view">`. This improves accessibility (screen readers understand page structure) and SEO.

**Q2. Why does the project use `<canvas>` instead of `<img>` for charts?**
`<canvas>` provides a JavaScript-drawable 2D (or 3D via WebGL) bitmap surface, so charts can be generated dynamically from live data rather than being static images. This project uses `<canvas>` with the 2D rendering context to draw bar, donut, line, and radar charts entirely in JavaScript, updating them whenever the underlying tracked data changes.

**Q3. What is the purpose of the `aria-live` attribute used on the form success message?**
`aria-live="polite"` tells assistive technologies (like screen readers) to announce changes to that element's content without interrupting the user, which is important for accessibility when a success message appears dynamically after form submission (since no page reload occurs to naturally re-announce content).

**Q4. Why is a "skip to main content" link included, and how does it work?**
It's an accessibility feature for keyboard and screen-reader users, letting them bypass repetitive navigation and jump straight to the main content. It's visually hidden by default (`left: -999px`) and becomes visible on keyboard focus, which is a common accessible-but-unobtrusive pattern.

**Q5. What's the difference between `<section>` and `<div>`, and how did you decide which to use?**
`<section>` implies a thematically grouped, meaningful block of content (ideally with a heading), while `<div>` is a generic, non-semantic container used purely for styling/layout hooks. In this project, each dashboard module (`DSA Tracker`, `Analytics`, etc.) is a `<section>`, while purely structural wrappers (like `.kpi-grid` or `.form-row`) are `<div>`s.

---

## CSS3 (Q6–Q10)

**Q6. How does the dark/light theme toggle work without duplicating styles?**
The project defines two sets of CSS custom properties (variables) — one under `:root` for light mode and one under `[data-theme="dark"]` — covering colors like `--bg`, `--ink`, `--accent`, etc. Every component references these variables instead of hardcoded colors, so toggling the `data-theme` attribute on `<html>` instantly re-themes the entire page with zero JavaScript style manipulation.

**Q7. Explain the difference between CSS Grid and Flexbox, and where each is used here.**
Flexbox is one-dimensional (a single row or column) and excels at aligning items within a component, e.g. `.nav-container`, `.kpi-card` internals, and button groups. Grid is two-dimensional and suits page-level layout, e.g. `.feature-grid`, `.kpi-grid`, `.dashboard-grid`, and `.analytics-grid`, where both rows and columns need explicit control.

**Q8. What does `color-mix()` do, and why was it used?**
`color-mix(in srgb, var(--accent) 12%, var(--bg-elevated))` blends two colors in a specified color space at a given ratio. It's used to generate theme-aware tinted backgrounds (e.g., an active sidebar link's highlight, or a feature icon's background) without needing separate hardcoded colors for light and dark mode — the mix automatically adapts since it references CSS variables.

**Q9. How is the project made responsive across mobile, tablet, and desktop?**
Through a mobile-first mindset expressed via `@media (max-width: 1024px)` and `@media (max-width: 760px)` breakpoints that progressively simplify multi-column grids into single columns, hide the desktop nav in favor of a hamburger menu, and convert the persistent sidebar into an off-canvas drawer toggled by a hamburger-style button.

**Q10. What is `prefers-reduced-motion`, and how does this project respect it?**
It's a media feature reflecting a user's OS-level accessibility preference to minimize animation. The project includes a global rule that forces all animations and transitions to near-zero duration when `prefers-reduced-motion: reduce` is detected, preventing motion sickness or distraction for users who've opted out of animations.

---

## JavaScript (Q11–Q17)

**Q11. Why is the JavaScript organized into "modules" using plain objects instead of one big script?**
Each module (e.g., `ThemeModule`, `DsaTrackerModule`, `ChartUtils`) is a self-contained object with its own `init()` method and related functions, grouping related state and behavior together. This keeps the codebase readable and maintainable, avoids naming collisions, and mirrors how real-world JavaScript applications are structured before introducing a framework or bundler.

**Q12. What is event delegation, and does this project use it?**
Event delegation attaches a single listener to a parent element and inspects `event.target` to handle events for many children, rather than attaching individual listeners to each child. This project mostly attaches listeners directly to freshly rendered elements after each re-render (e.g., checkboxes in the DSA tracker) since the lists are small and re-rendered wholesale; for larger dynamic lists, delegation on the parent container would be the next optimization.

**Q13. How does the Resume Analyzer compute its score?**
It combines two heuristics: (1) a keyword-coverage score — checking what percentage of a role-specific keyword list appears in the pasted resume text (case-insensitive substring matching), weighted at 55 points; and (2) a structural score — checking for an email pattern, a phone number pattern, presence of standard section keywords (experience/education/projects/skills), quantified achievements (numbers or percentages), and an appropriate word count, weighted at 45 points. The two scores are summed and clamped to 0–100.

**Q14. Why does the project use `try/catch` around `localStorage` calls?**
`localStorage` can throw exceptions in some situations (e.g., private/incognito browsing with storage disabled, storage quota exceeded, or the site being loaded from a restricted context). Wrapping reads and writes in `try/catch` with warnings and fallbacks prevents the whole app from crashing if storage is temporarily or permanently unavailable.

**Q15. What is `requestAnimationFrame`, and where is it used here?**
It's a browser API that schedules a callback to run before the next repaint, ideal for animation-related work or for waiting a frame before measuring newly visible DOM elements. It's used when switching from the landing page to the dashboard, giving the browser one frame to un-hide the dashboard container before the chart-rendering functions measure canvas dimensions (since hidden elements report zero size).

**Q16. How are the analytics charts kept in sync with tracker data without a framework like React?**
There's no virtual DOM or reactive state system; instead, every module that mutates shared data (DSA tracker, Aptitude tracker, Resume analyzer, Scheduler) explicitly calls `DashboardModule.renderAll()` and, where relevant, `AnalyticsModule.renderAll()` after the mutation, causing those views to re-read the latest values from `localStorage`/module state and redraw.

**Q17. What does the `escapeHTML()` helper do, and why is it important?**
It creates a temporary `<div>`, sets its `textContent` to the raw string (which safely escapes HTML), and returns the resulting `innerHTML`. It's used whenever user-provided or otherwise dynamic text (contact form values, resume text, search matches) is inserted into the DOM via `innerHTML`, preventing that text from being interpreted as executable HTML/script tags.

---

## Responsive Design (Q18–Q22)

**Q18. What is "mobile-first" design, and is this project mobile-first?**
Mobile-first design means writing base styles for small screens and then progressively enhancing the layout for larger screens using `min-width` media queries — or, as a common alternative (used here), writing a desktop-friendly base layout and then simplifying it for smaller screens via `max-width` media queries. This project uses the `max-width` approach, which is equally valid and arguably more common in real-world CSS.

**Q19. How does the sidebar behave differently on desktop vs mobile?**
On desktop, the sidebar is a persistent, always-visible column that can be collapsed (slid off-screen via `margin-left`) using a toggle button. On mobile (`max-width: 760px`), the sidebar becomes a fixed-position off-canvas drawer, hidden by default via `transform: translateX(-100%)` and slid into view when the `.sidebar-open` class is toggled — reusing the same markup and JavaScript toggle handler for both behaviors.

**Q20. What units are used for responsive typography, and why?**
`clamp()` is used for major headings, e.g. `font-size: clamp(2.2rem, 4.6vw, 3.6rem)`, which lets the font size scale fluidly with the viewport width while enforcing sensible minimum and maximum bounds — avoiding the need for many separate media-query overrides just for font size.

**Q21. How is touch-friendliness addressed for mobile users?**
Interactive elements like buttons, checkboxes, and the flashcard flip areas are sized generously (e.g., 40px+ tap targets for icon buttons, full-width buttons in forms) and use `:hover` styles that gracefully degrade to tap-based interaction on touch devices, since hover states simply don't trigger without a pointer.

**Q22. Why use a `<select>` instead of custom-styled radio buttons for the resume target role?**
Native `<select>` elements are automatically accessible, keyboard-navigable, and touch-friendly across all platforms without extra JavaScript, whereas custom dropdown components require significant additional ARIA and keyboard-handling work to reach the same accessibility baseline — a pragmatic choice for a project prioritizing broad compatibility.

---

## DOM Manipulation (Q23–Q26)

**Q23. How does the DSA Tracker render its list of topics dynamically?**
`DsaTrackerModule.render()` filters the static `DataModule.dsaTopics` array based on the current search filter, maps each topic to an HTML string using a template literal, joins them, and assigns the result to `grid.innerHTML`. It then re-queries the newly created checkboxes and attaches `change` event listeners to persist state.

**Q24. What's a potential downside of using `innerHTML` for re-rendering lists, and how would you mitigate it at scale?**
Repeatedly overwriting `innerHTML` destroys and recreates DOM nodes, which can be inefficient for very large lists and loses things like input focus or scroll position within that subtree. For a project at this scale (dozens of items) it's negligible, but at scale you'd move to a diffing approach — either a lightweight virtual-DOM technique or a framework like React — or manually patch only changed nodes.

**Q25. How does the flip-card interview prep feature work under the hood?**
Each flashcard is a 3D-transformed pair of faces (`.front` and `.back`) inside a `.flashcard-inner` container with `transform-style: preserve-3d`. A `flipped` class toggled via a `click` listener rotates the inner container `180deg` around the Y-axis using `rotateY()`, while `backface-visibility: hidden` ensures only one face is visible at a time.

**Q26. How is the global search implemented across different content types (DSA, aptitude, FAQ, interview)?**
`SearchModule.buildIndex()` merges all searchable datasets (DSA topics, aptitude topics, interview questions, and FAQ questions read live from the DOM) into one flat array with a `type` and `label`. On each keystroke, the array is filtered by a case-insensitive substring match against `label`, and matching results are rendered as clickable items that route to the relevant dashboard view via `RouterModule.go()`.

---

## LocalStorage (Q27–Q30)

**Q27. What is `localStorage`, and how is it different from cookies or `sessionStorage`?**
`localStorage` is a browser Web Storage API that persists key-value string data on the client with no built-in expiration, is not automatically sent with every HTTP request (unlike cookies), and is scoped per-origin. `sessionStorage` behaves similarly but is cleared when the browser tab closes, whereas `localStorage` persists across sessions until explicitly cleared.

**Q28. Since `localStorage` only stores strings, how does this project store structured data like arrays and objects?**
All structured values (e.g., the DSA progress map, the array of scheduled sessions) are serialized with `JSON.stringify()` before writing and parsed back with `JSON.parse()` on read. This logic is centralized in the `Utils.storage.get()`/`.set()` helper so every module reuses the same safe serialization pattern.

**Q29. What happens to a user's data if they clear their browser storage or switch browsers?**
Since all progress is scoped to `localStorage` on a specific browser and origin, clearing site data (or using a different browser/device) resets every tracker to its default empty state — there's no server-side backup in this version of the project. This trade-off is explicitly documented in the README as a known limitation of a fully client-side design.

**Q30. How would you extend this project to sync data across devices?**
By introducing a backend (e.g., Node.js + Express with a database like MongoDB or PostgreSQL) and a lightweight authentication system, then replacing direct `localStorage` reads/writes with API calls that sync to a user's account — while potentially keeping `localStorage` as an offline-first cache layer that reconciles with the server when connectivity is available.
