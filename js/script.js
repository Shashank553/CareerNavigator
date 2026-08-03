/* =====================================================================
   AI CAREER NAVIGATOR — SCRIPT.JS
   Vanilla JavaScript, organized into small self-contained modules.
   Each module exposes an `init()` that is called once from the
   bottom-of-file bootstrap. Shared helpers live in the Utils module.
   ===================================================================== */
"use strict";

/* ---------------------------------------------------------------------
   0. UTILS — small shared helpers used across modules
   --------------------------------------------------------------------- */
const Utils = {
  $: (sel, ctx = document) => ctx.querySelector(sel),
  $$: (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel)),

  // Safe LocalStorage read/write with JSON handling + graceful fallback
  storage: {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        console.warn("Storage read failed for", key, e);
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn("Storage write failed for", key, e);
      }
    }
  },

  clamp(n, min, max) { return Math.max(min, Math.min(max, n)); },

  formatDate(d) {
    return d.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  },

  // Basic HTML-escaping to keep any user-typed text (contact form, resume box)
  // from being injected as markup when reflected back into the DOM.
  escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  },

  toast(message, type = "info") {
    const container = Utils.$("#toastContainer");
    if (!container) return;
    const el = document.createElement("div");
    el.className = `toast ${type === "error" ? "error" : ""}`;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => {
      el.classList.add("leaving");
      setTimeout(() => el.remove(), 260);
    }, 3200);
  }
};

/* ---------------------------------------------------------------------
   1. THEME MODULE — dark / light toggle persisted to LocalStorage
   --------------------------------------------------------------------- */
const ThemeModule = {
  key: "acn_theme",
  init() {
    const saved = Utils.storage.get(this.key, null);
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved || (prefersDark ? "dark" : "light");
    this.apply(theme);

    ["themeToggle", "themeToggle2"].forEach(id => {
      const btn = Utils.$("#" + id);
      if (btn) btn.addEventListener("click", () => this.toggle());
    });
  },
  apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    Utils.storage.set(this.key, theme);
  },
  toggle() {
    const current = document.documentElement.getAttribute("data-theme");
    this.apply(current === "dark" ? "light" : "dark");
    Utils.toast(`Switched to ${current === "dark" ? "light" : "dark"} mode`);
    // Redraw canvases since colors depend on CSS variables
    if (window.AnalyticsModule) AnalyticsModule.renderAll();
    if (window.DashboardModule) DashboardModule.renderWeeklyChart();
  }
};

/* ---------------------------------------------------------------------
   2. PRELOADER MODULE
   --------------------------------------------------------------------- */
const PreloaderModule = {
  init() {
    window.addEventListener("load", () => {
      const el = Utils.$("#preloader");
      setTimeout(() => el && el.classList.add("done"), 400);
    });
    // Fallback in case 'load' already fired
    setTimeout(() => {
      const el = Utils.$("#preloader");
      if (el && !el.classList.contains("done")) el.classList.add("done");
    }, 1200);
  }
};

/* ---------------------------------------------------------------------
   3. NAVBAR MODULE — mobile hamburger + smooth in-page navigation
   --------------------------------------------------------------------- */
const NavbarModule = {
  init() {
    const hamburger = Utils.$("#hamburgerBtn");
    const navLinks = Utils.$("#navLinks");

    hamburger.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      hamburger.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
    });

    // Close mobile menu after tapping a link
    Utils.$$("[data-nav-link]").forEach(link => {
      link.addEventListener("click", (e) => {
        navLinks.classList.remove("open");
        hamburger.classList.remove("open");
        // If we're inside the dashboard, jump back to landing first
        if (!Utils.$("#appView").hidden) AppShell.showLanding();
      });
    });
  }
};

/* ---------------------------------------------------------------------
   4. APP SHELL MODULE — switching between Landing page and Dashboard SPA
   --------------------------------------------------------------------- */
const AppShell = {
  init() {
    Utils.$("#launchDashboardBtn").addEventListener("click", () => this.showDashboard());
    Utils.$("#heroCta").addEventListener("click", () => this.showDashboard());
    Utils.$("#footerDashboardLink").addEventListener("click", (e) => { e.preventDefault(); this.showDashboard(); });
    Utils.$("#exitDashboardBtn").addEventListener("click", () => this.showLanding());
  },
  showDashboard() {
    Utils.$("#landingView").hidden = true;
    Utils.$("#appView").hidden = false;
    window.scrollTo(0, 0);
    Utils.toast("Dashboard loaded — your progress is saved automatically.");
    // Give the DOM a tick to un-hide before measuring canvases
    requestAnimationFrame(() => {
      DashboardModule.renderAll();
      AnalyticsModule.renderAll();
    });
  },
  showLanding() {
    Utils.$("#appView").hidden = true;
    Utils.$("#landingView").hidden = false;
  }
};

/* ---------------------------------------------------------------------
   5. SIDEBAR / VIEW ROUTER MODULE
   --------------------------------------------------------------------- */
const RouterModule = {
  init() {
    Utils.$$(".side-link").forEach(btn => {
      btn.addEventListener("click", () => this.go(btn.dataset.view));
    });
    Utils.$$("[data-view-link]").forEach(btn => {
      btn.addEventListener("click", () => this.go(btn.dataset.viewLink));
    });
    Utils.$("#sidebarToggleBtn").addEventListener("click", () => {
      const app = Utils.$("#appView");
      const isMobile = window.innerWidth <= 760;
      if (isMobile) app.classList.toggle("sidebar-open");
      else app.classList.toggle("sidebar-collapsed");
    });
  },
  go(viewName) {
    Utils.$$(".side-link").forEach(b => b.classList.toggle("active", b.dataset.view === viewName));
    Utils.$$(".view").forEach(v => v.classList.toggle("active", v.id === "view-" + viewName));
    Utils.$("#appView").classList.remove("sidebar-open"); // close mobile drawer after nav
    if (viewName === "analytics") AnalyticsModule.renderAll();
    if (viewName === "dashboard") DashboardModule.renderWeeklyChart();
  }
};

/* ---------------------------------------------------------------------
   6. FAQ ACCORDION MODULE
   --------------------------------------------------------------------- */
const FaqModule = {
  init() {
    Utils.$$(".faq-item").forEach(item => {
      const question = Utils.$(".faq-question", item);
      question.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        Utils.$$(".faq-item").forEach(i => { i.classList.remove("open"); Utils.$(".faq-question", i).setAttribute("aria-expanded", "false"); });
        if (!isOpen) { item.classList.add("open"); question.setAttribute("aria-expanded", "true"); }
      });
    });
  }
};

/* ---------------------------------------------------------------------
   7. TESTIMONIAL CAROUSEL MODULE
   --------------------------------------------------------------------- */
const TestimonialModule = {
  index: 0,
  init() {
    this.track = Utils.$("#testimonialTrack");
    this.slides = Utils.$$(".testimonial-card", this.track);
    Utils.$("#testimonialNext").addEventListener("click", () => this.move(1));
    Utils.$("#testimonialPrev").addEventListener("click", () => this.move(-1));
    // Auto-advance every 6s, pausing politely isn't essential for a demo project
    this.timer = setInterval(() => this.move(1), 6000);
  },
  move(dir) {
    this.index = (this.index + dir + this.slides.length) % this.slides.length;
    this.track.style.transform = `translateX(-${this.index * 100}%)`;
  }
};

/* ---------------------------------------------------------------------
   8. CONTACT FORM VALIDATION MODULE
   --------------------------------------------------------------------- */
const ContactFormModule = {
  init() {
    this.form = Utils.$("#contactForm");
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  },
  validators: {
    name: v => v.trim().length >= 2 || "Please enter your full name (min 2 characters).",
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Please enter a valid email address.",
    subject: v => v !== "" || "Please choose a subject.",
    message: v => v.trim().length >= 10 || "Message should be at least 10 characters."
  },
  handleSubmit(e) {
    e.preventDefault();
    let valid = true;
    Object.keys(this.validators).forEach(field => {
      const input = Utils.$("#cf-" + field);
      const errorEl = Utils.$("#err-" + field);
      const result = this.validators[field](input.value);
      const row = input.closest(".form-row");
      if (result !== true) {
        valid = false;
        row.classList.add("invalid");
        errorEl.textContent = result;
      } else {
        row.classList.remove("invalid");
        errorEl.textContent = "";
      }
    });

    const successEl = Utils.$("#formSuccess");
    if (!valid) {
      successEl.textContent = "";
      Utils.toast("Please fix the highlighted fields.", "error");
      return;
    }

    // No backend: persist the last submission locally and show confirmation
    Utils.storage.set("acn_last_contact", {
      name: Utils.$("#cf-name").value,
      email: Utils.$("#cf-email").value,
      subject: Utils.$("#cf-subject").value,
      message: Utils.$("#cf-message").value,
      sentAt: new Date().toISOString()
    });
    successEl.textContent = "✅ Message sent! We'll get back to you within 2 business days.";
    Utils.toast("Message sent successfully.");
    this.form.reset();
  }
};

/* ---------------------------------------------------------------------
   9. DATA MODULE — static datasets that power the trackers, flashcards,
      roadmap and search. Kept in one place so content is easy to extend.
   --------------------------------------------------------------------- */
const DataModule = {
  dsaTopics: [
    { id: "arr", title: "Arrays & Prefix Sums", cat: "Fundamentals" },
    { id: "str", title: "Strings & Pattern Matching", cat: "Fundamentals" },
    { id: "two", title: "Two Pointers", cat: "Fundamentals" },
    { id: "slide", title: "Sliding Window", cat: "Fundamentals" },
    { id: "hash", title: "Hashing & HashMaps", cat: "Fundamentals" },
    { id: "sort", title: "Sorting Algorithms", cat: "Fundamentals" },
    { id: "bsearch", title: "Binary Search", cat: "Search" },
    { id: "ll", title: "Linked List Basics", cat: "Linear Structures" },
    { id: "llrev", title: "Linked List Reversal", cat: "Linear Structures" },
    { id: "stack", title: "Stack Applications", cat: "Linear Structures" },
    { id: "queue", title: "Queue & Deque", cat: "Linear Structures" },
    { id: "heap", title: "Heaps & Priority Queue", cat: "Trees & Heaps" },
    { id: "tree", title: "Binary Trees", cat: "Trees & Heaps" },
    { id: "bst", title: "Binary Search Trees", cat: "Trees & Heaps" },
    { id: "bfsdfs", title: "Tree BFS / DFS", cat: "Trees & Heaps" },
    { id: "graph", title: "Graph Basics (BFS/DFS)", cat: "Graphs" },
    { id: "graphadv", title: "Shortest Path & MST", cat: "Graphs" },
    { id: "recur", title: "Recursion", cat: "Recursion & DP" },
    { id: "backtrack", title: "Backtracking", cat: "Recursion & DP" },
    { id: "dpbasic", title: "Dynamic Programming Basics", cat: "Recursion & DP" },
    { id: "dpadv", title: "DP on Subsequences & Grids", cat: "Recursion & DP" },
    { id: "greedy", title: "Greedy Algorithms", cat: "Recursion & DP" },
    { id: "bit", title: "Bit Manipulation", cat: "Math & Bits" },
    { id: "numtheory", title: "Number Theory Basics", cat: "Math & Bits" }
  ],

  aptitudeTopics: {
    "Quantitative": ["Number System", "Percentages", "Profit & Loss", "Time & Work", "Speed, Distance & Time", "Ratio & Proportion", "Averages", "Permutation & Combination", "Geometry & Mensuration", "Simple & Compound Interest"],
    "Logical Reasoning": ["Coding-Decoding", "Blood Relations", "Directions Sense", "Seating Arrangement", "Syllogisms", "Logical Sequences", "Puzzles & Series", "Data Sufficiency"],
    "Verbal Ability": ["Reading Comprehension", "Sentence Correction", "Para Jumbles", "Synonyms & Antonyms", "Verbal Analogies", "Fill in the Blanks", "Error Spotting"]
  },

  interviewCards: [
    { cat: "HR", q: "Tell me about yourself.", a: "Give a 60-90 second summary: your degree & specialization, 2-3 standout projects or achievements, and what role you're targeting next — end with why you're a fit." },
    { cat: "HR", q: "Why should we hire you?", a: "Connect your specific, demonstrable skills to the role's requirements, back it with one concrete project or result, and show genuine interest in the company." },
    { cat: "HR", q: "What are your strengths and weaknesses?", a: "Pick a strength relevant to the job with a quick example. For weaknesses, choose a real but non-critical one and describe the concrete steps you're taking to improve it." },
    { cat: "HR", q: "Where do you see yourself in 5 years?", a: "Show ambition tied to growth within the field (e.g., deepening technical expertise, taking ownership of larger systems) rather than an unrelated career pivot." },
    { cat: "HR", q: "Why do you want to work here?", a: "Reference something specific about the company — its products, engineering culture, or mission — and connect it to your own goals and skills." },
    { cat: "HR", q: "How do you handle pressure or tight deadlines?", a: "Describe a structured approach: prioritizing tasks, communicating early about blockers, and a real example where this worked." },
    { cat: "Behavioral", q: "Describe a time you faced a conflict in a team project.", a: "Use the STAR method: Situation, Task, Action, Result. Focus on how you communicated and what the resolution taught you." },
    { cat: "Behavioral", q: "Tell me about a time you failed.", a: "Pick a real, moderate failure, own it without over-justifying, and emphasize the specific lesson and behavior change that followed." },
    { cat: "Behavioral", q: "Describe a situation where you took initiative.", a: "Highlight a moment you identified a gap or problem no one assigned to you, and the concrete steps you took to address it." },
    { cat: "Behavioral", q: "How do you prioritize multiple tasks or deadlines?", a: "Explain a simple framework (urgency vs. impact), mention tools you use (to-do lists, calendars), and give one real example." },
    { cat: "Technical", q: "What is the time complexity of binary search?", a: "O(log n), since the search space is halved with every comparison on a sorted array." },
    { cat: "Technical", q: "Explain the difference between an array and a linked list.", a: "Arrays offer O(1) indexed access but costly insertion/deletion; linked lists offer O(1) insertion/deletion at known nodes but O(n) access, using extra pointer memory." },
    { cat: "Technical", q: "What is dynamic programming?", a: "An optimization technique that solves problems by breaking them into overlapping subproblems, storing (memoizing) results to avoid recomputation." },
    { cat: "Technical", q: "Explain normalization in DBMS.", a: "The process of organizing tables to reduce redundancy and dependency, typically progressing through normal forms (1NF, 2NF, 3NF, BCNF)." },
    { cat: "Technical", q: "What is the difference between process and thread?", a: "A process is an independent execution unit with its own memory space; a thread is a lightweight unit within a process that shares memory with other threads of the same process." },
    { cat: "Technical", q: "What is REST API?", a: "An architectural style for web services using stateless HTTP requests and standard verbs (GET, POST, PUT, DELETE) to operate on resources identified by URLs." },
    { cat: "Technical", q: "Explain OOP's four pillars.", a: "Encapsulation (bundling data & methods), Abstraction (hiding complexity), Inheritance (reusing behavior), and Polymorphism (many forms of the same interface)." },
    { cat: "Technical", q: "What is a hash collision and how is it handled?", a: "It occurs when two keys map to the same bucket. Common resolutions are chaining (linked lists per bucket) and open addressing (probing for the next free slot)." }
  ],

  roadmap: [
    { title: "Foundations", desc: "Programming language proficiency, basic CS fundamentals, and Git/GitHub workflow.", tags: ["Python/Java", "Git", "CS Basics"] },
    { title: "DSA Mastery", desc: "Pattern-based problem solving across arrays, trees, graphs and dynamic programming.", tags: ["Arrays", "Trees", "DP", "Graphs"] },
    { title: "Aptitude Drills", desc: "Timed practice across quantitative, logical reasoning and verbal ability sections.", tags: ["Quant", "Logical", "Verbal"] },
    { title: "Resume & Portfolio", desc: "ATS-friendly resume, polished GitHub profile, and 2-3 flagship projects.", tags: ["ATS", "GitHub", "Projects"] },
    { title: "Mock Interviews", desc: "Simulated technical and HR rounds with structured feedback loops.", tags: ["Technical", "HR", "GD"] },
    { title: "Offer Letter", desc: "Final rounds, negotiation, and onboarding preparation. Touchdown! 🎯", tags: ["Negotiation", "Onboarding"] }
  ],

  resumeKeywords: {
    fullstack: ["JavaScript", "React", "Node.js", "REST API", "MongoDB", "SQL", "Git", "HTML", "CSS", "Express", "Responsive Design", "Deployment"],
    aiml: ["Python", "Machine Learning", "TensorFlow", "PyTorch", "NLP", "Deep Learning", "Pandas", "NumPy", "Model Training", "Data Preprocessing", "Scikit-learn"],
    dataanalyst: ["SQL", "Excel", "Power BI", "Tableau", "Python", "Data Visualization", "Statistics", "Pandas", "Dashboard", "A/B Testing"],
    generalsde: ["Java", "Data Structures", "Algorithms", "OOP", "DBMS", "Operating Systems", "Problem Solving", "Communication", "Teamwork", "Agile"]
  }
};

/* ---------------------------------------------------------------------
   10. DSA TRACKER MODULE
   --------------------------------------------------------------------- */
const DsaTrackerModule = {
  key: "acn_dsa_progress",
  init() {
    this.progress = Utils.storage.get(this.key, {});
    this.render();
    Utils.$("#dsaFilter").addEventListener("input", (e) => this.render(e.target.value));
    Utils.$("#dsaResetBtn").addEventListener("click", () => {
      if (confirm("Reset all DSA tracker progress? This cannot be undone.")) {
        this.progress = {};
        Utils.storage.set(this.key, this.progress);
        this.render();
        Utils.toast("DSA progress reset.");
      }
    });
  },
  render(filter = "") {
    const grid = Utils.$("#dsaGrid");
    const q = filter.trim().toLowerCase();
    const items = DataModule.dsaTopics.filter(t => !q || t.title.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q));

    grid.innerHTML = items.map(t => `
      <label class="tracker-card ${this.progress[t.id] ? "checked" : ""}" data-id="${t.id}">
        <input type="checkbox" ${this.progress[t.id] ? "checked" : ""} data-id="${t.id}">
        <span class="tracker-card-body">
          <h4>${Utils.escapeHTML(t.title)}</h4>
          <span>${Utils.escapeHTML(t.cat)}</span>
        </span>
      </label>`).join("") || `<p class="empty-state">No topics match that filter.</p>`;

    Utils.$$("input[type=checkbox]", grid).forEach(cb => {
      cb.addEventListener("change", () => {
        this.progress[cb.dataset.id] = cb.checked;
        Utils.storage.set(this.key, this.progress);
        cb.closest(".tracker-card").classList.toggle("checked", cb.checked);
        this.updateChip();
        DashboardModule.renderAll();
      });
    });
    this.updateChip();
  },
  updateChip() {
    const total = DataModule.dsaTopics.length;
    const done = DataModule.dsaTopics.filter(t => this.progress[t.id]).length;
    Utils.$("#dsaProgressChip").textContent = `${done} / ${total} complete`;
  },
  percent() {
    const total = DataModule.dsaTopics.length;
    const done = DataModule.dsaTopics.filter(t => this.progress[t.id]).length;
    return total ? Math.round((done / total) * 100) : 0;
  },
  byCategory() {
    const cats = {};
    DataModule.dsaTopics.forEach(t => {
      cats[t.cat] = cats[t.cat] || { done: 0, total: 0 };
      cats[t.cat].total++;
      if (this.progress[t.id]) cats[t.cat].done++;
    });
    return cats;
  }
};

/* ---------------------------------------------------------------------
   11. APTITUDE TRACKER MODULE
   --------------------------------------------------------------------- */
const AptTrackerModule = {
  key: "acn_apt_progress",
  activeCat: "Quantitative",
  init() {
    this.progress = Utils.storage.get(this.key, {});
    Utils.$$(".apt-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        Utils.$$(".apt-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        this.activeCat = tab.dataset.cat;
        this.render();
      });
    });
    this.render();
  },
  allTopics() {
    const list = [];
    Object.entries(DataModule.aptitudeTopics).forEach(([cat, topics]) => {
      topics.forEach(t => list.push({ id: `${cat}::${t}`, title: t, cat }));
    });
    return list;
  },
  render() {
    const grid = Utils.$("#aptGrid");
    const topics = DataModule.aptitudeTopics[this.activeCat].map(t => ({ id: `${this.activeCat}::${t}`, title: t }));
    grid.innerHTML = topics.map(t => `
      <label class="tracker-card ${this.progress[t.id] ? "checked" : ""}" data-id="${t.id}">
        <input type="checkbox" ${this.progress[t.id] ? "checked" : ""} data-id="${t.id}">
        <span class="tracker-card-body">
          <h4>${Utils.escapeHTML(t.title)}</h4>
          <span>${Utils.escapeHTML(this.activeCat)}</span>
        </span>
      </label>`).join("");

    Utils.$$("input[type=checkbox]", grid).forEach(cb => {
      cb.addEventListener("change", () => {
        this.progress[cb.dataset.id] = cb.checked;
        Utils.storage.set(this.key, this.progress);
        cb.closest(".tracker-card").classList.toggle("checked", cb.checked);
        this.updateChip();
        DashboardModule.renderAll();
      });
    });
    this.updateChip();
  },
  updateChip() {
    const all = this.allTopics();
    const done = all.filter(t => this.progress[t.id]).length;
    Utils.$("#aptProgressChip").textContent = `${done} / ${all.length} complete`;
  },
  percent() {
    const all = this.allTopics();
    const done = all.filter(t => this.progress[t.id]).length;
    return all.length ? Math.round((done / all.length) * 100) : 0;
  }
};

/* ---------------------------------------------------------------------
   12. RESUME ANALYZER MODULE (fully client-side heuristic scoring)
   --------------------------------------------------------------------- */
const ResumeModule = {
  key: "acn_resume_last",
  init() {
    const saved = Utils.storage.get(this.key, null);
    if (saved) {
      Utils.$("#resumeInput").value = saved.text || "";
      Utils.$("#targetRole").value = saved.role || "fullstack";
    }
    Utils.$("#analyzeResumeBtn").addEventListener("click", () => this.analyze());
  },
  analyze() {
    const text = Utils.$("#resumeInput").value;
    const role = Utils.$("#targetRole").value;
    if (text.trim().length < 30) {
      Utils.toast("Paste a bit more resume content for a meaningful scan.", "error");
      return;
    }
    Utils.storage.set(this.key, { text, role });

    const lower = text.toLowerCase();
    const keywords = DataModule.resumeKeywords[role];
    const found = keywords.filter(k => lower.includes(k.toLowerCase()));
    const missing = keywords.filter(k => !found.includes(k));
    const keywordScore = (found.length / keywords.length) * 55; // out of 55

    // Structural checks (sections, contact info, quantified impact, length)
    const hasEmail = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(text);
    const hasPhone = /(\+?\d[\d\s\-]{8,}\d)/.test(text);
    const sections = ["experience", "education", "project", "skill"];
    const sectionHits = sections.filter(s => lower.includes(s));
    const hasNumbers = /\d+%|\d+\s?(users|projects|hours|points|percent)/i.test(text);
    const wordCount = text.trim().split(/\s+/).length;
    const lengthOk = wordCount >= 150 && wordCount <= 900;

    let structureScore = 0;
    structureScore += hasEmail ? 8 : 0;
    structureScore += hasPhone ? 6 : 0;
    structureScore += (sectionHits.length / sections.length) * 20;
    structureScore += hasNumbers ? 6 : 0;
    structureScore += lengthOk ? 5 : 0;

    const total = Math.round(Utils.clamp(keywordScore + structureScore, 0, 100));

    const tips = [];
    if (!hasEmail) tips.push("Add a professional email address so recruiters can reach you.");
    if (!hasPhone) tips.push("Include a phone number in your header for ATS contact parsing.");
    if (sectionHits.length < sections.length) tips.push("Use clear section headers: Experience, Education, Projects, Skills.");
    if (!hasNumbers) tips.push("Quantify impact — e.g. \"improved load time by 30%\" reads stronger than a plain description.");
    if (!lengthOk) tips.push(wordCount < 150 ? "Resume looks short — add more detail on projects and outcomes." : "Resume looks long — aim for a focused one-page format.");
    if (missing.length) tips.push(`Consider adding role-relevant keywords: ${missing.slice(0, 5).join(", ")}.`);
    if (!tips.length) tips.push("Strong coverage! Fine-tune wording and keep it to one page for ATS parsing.");

    this.renderResult(total, found, missing, tips);
    Utils.storage.set("acn_resume_score", total);
    DashboardModule.renderAll();
  },
  renderResult(score, found, missing, tips) {
    const color = score >= 75 ? "var(--success)" : score >= 45 ? "var(--accent-2)" : "var(--danger)";
    const el = Utils.$("#resumeResult");
    el.innerHTML = `
      <div class="score-ring-wrap">
        <svg width="84" height="84" viewBox="0 0 84 84">
          <circle cx="42" cy="42" r="36" fill="none" stroke="var(--bg-sunken)" stroke-width="8"/>
          <circle cx="42" cy="42" r="36" fill="none" stroke="${color}" stroke-width="8"
            stroke-dasharray="${2 * Math.PI * 36}" stroke-dashoffset="${2 * Math.PI * 36 * (1 - score / 100)}"
            stroke-linecap="round" transform="rotate(-90 42 42)"/>
        </svg>
        <div>
          <p class="score-ring-label">ATS Readiness Score</p>
          <p class="score-ring-value" style="color:${color}">${score}<span style="font-size:1rem;">/100</span></p>
        </div>
      </div>
      <div class="result-section">
        <h4>Keywords found (${found.length})</h4>
        <div class="keyword-pills">${found.map(k => `<span class="keyword-pill found">${Utils.escapeHTML(k)}</span>`).join("") || "<span class='keyword-pill missing'>None yet</span>"}</div>
      </div>
      <div class="result-section">
        <h4>Missing keywords (${missing.length})</h4>
        <div class="keyword-pills">${missing.map(k => `<span class="keyword-pill missing">${Utils.escapeHTML(k)}</span>`).join("") || "<span class='keyword-pill found'>None — great coverage!</span>"}</div>
      </div>
      <div class="result-section">
        <h4>Recommendations</h4>
        <ul class="tip-list">${tips.map(t => `<li>💡 ${Utils.escapeHTML(t)}</li>`).join("")}</ul>
      </div>`;
  }
};

/* ---------------------------------------------------------------------
   13. INTERVIEW FLASHCARDS MODULE
   --------------------------------------------------------------------- */
const InterviewModule = {
  activeCat: "all",
  init() {
    Utils.$$("#interviewFilters .chip").forEach(chip => {
      chip.addEventListener("click", () => {
        Utils.$$("#interviewFilters .chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        this.activeCat = chip.dataset.cat;
        this.render();
      });
    });
    this.render();
  },
  render() {
    const grid = Utils.$("#flashcardGrid");
    const cards = DataModule.interviewCards.filter(c => this.activeCat === "all" || c.cat === this.activeCat);
    grid.innerHTML = cards.map((c, i) => `
      <div class="flashcard" data-i="${i}">
        <div class="flashcard-inner">
          <div class="flashcard-face front">
            <span class="flashcard-cat">${c.cat}</span>
            <p>${Utils.escapeHTML(c.q)}</p>
            <span class="flashcard-hint">Tap to flip ↻</span>
          </div>
          <div class="flashcard-face back">
            <span class="flashcard-cat">Model answer</span>
            <p>${Utils.escapeHTML(c.a)}</p>
          </div>
        </div>
      </div>`).join("");

    Utils.$$(".flashcard", grid).forEach(card => {
      card.addEventListener("click", () => card.classList.toggle("flipped"));
    });
  }
};

/* ---------------------------------------------------------------------
   14. MOCK INTERVIEW SCHEDULER MODULE
   --------------------------------------------------------------------- */
const SchedulerModule = {
  key: "acn_sessions",
  init() {
    this.sessions = Utils.storage.get(this.key, []);
    Utils.$("#schedulerForm").addEventListener("submit", (e) => this.addSession(e));
    this.render();
  },
  addSession(e) {
    e.preventDefault();
    const role = Utils.$("#mockRole").value;
    const date = Utils.$("#mockDate").value;
    const time = Utils.$("#mockTime").value;
    const partner = Utils.$("#mockPartner").value.trim() || "Self-practice";
    const errEl = Utils.$("#err-mock");

    if (!date || !time) {
      errEl.textContent = "Please choose both a date and a time.";
      return;
    }
    errEl.textContent = "";

    this.sessions.push({ id: Date.now(), role, date, time, partner });
    this.sessions.sort((a, b) => new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time));
    Utils.storage.set(this.key, this.sessions);
    Utils.toast("Mock interview scheduled!");
    e.target.reset();
    this.render();
    DashboardModule.renderAll();
  },
  remove(id) {
    this.sessions = this.sessions.filter(s => s.id !== id);
    Utils.storage.set(this.key, this.sessions);
    this.render();
    DashboardModule.renderAll();
  },
  render() {
    const list = Utils.$("#sessionList");
    if (!this.sessions.length) {
      list.innerHTML = `<li class="empty-state">No sessions booked yet — plan your first one!</li>`;
      return;
    }
    list.innerHTML = this.sessions.map(s => `
      <li class="session-item">
        <span class="session-item-info">
          <strong>${Utils.escapeHTML(s.role)}</strong>
          <span>${s.date} · ${s.time} · with ${Utils.escapeHTML(s.partner)}</span>
        </span>
        <button class="session-remove" data-id="${s.id}" aria-label="Remove session">&times;</button>
      </li>`).join("");
    Utils.$$(".session-remove", list).forEach(btn => {
      btn.addEventListener("click", () => this.remove(Number(btn.dataset.id)));
    });
  },
  upcoming(limit = 3) {
    const now = new Date();
    return this.sessions
      .filter(s => new Date(s.date + "T" + s.time) >= now)
      .slice(0, limit);
  }
};

/* ---------------------------------------------------------------------
   15. GLOBAL SEARCH MODULE — searches DSA topics, aptitude topics,
       interview questions and FAQ entries, then routes to that view.
   --------------------------------------------------------------------- */
const SearchModule = {
  init() {
    this.input = Utils.$("#globalSearch");
    this.results = Utils.$("#searchResults");
    this.input.addEventListener("input", () => this.search());
    this.input.addEventListener("focus", () => { if (this.input.value.trim()) this.results.hidden = false; });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".topbar-search")) this.results.hidden = true;
    });
  },
  buildIndex() {
    const index = [];
    DataModule.dsaTopics.forEach(t => index.push({ type: "DSA Topic", label: t.title, view: "dsa" }));
    Object.entries(DataModule.aptitudeTopics).forEach(([cat, topics]) => topics.forEach(t => index.push({ type: "Aptitude · " + cat, label: t, view: "aptitude" })));
    DataModule.interviewCards.forEach(c => index.push({ type: "Interview Q · " + c.cat, label: c.q, view: "interview" }));
    Utils.$$(".faq-question").forEach(q => index.push({ type: "FAQ", label: q.textContent.replace("+", "").trim(), view: null }));
    return index;
  },
  search() {
    const q = this.input.value.trim().toLowerCase();
    if (!q) { this.results.hidden = true; return; }
    const index = this.buildIndex();
    const matches = index.filter(item => item.label.toLowerCase().includes(q)).slice(0, 8);
    this.results.hidden = false;
    this.results.innerHTML = matches.length
      ? matches.map(m => `<div class="search-result-item" data-view="${m.view || ""}"><small>${Utils.escapeHTML(m.type)}</small>${Utils.escapeHTML(m.label)}</div>`).join("")
      : `<div class="search-empty">No matches found.</div>`;

    Utils.$$(".search-result-item", this.results).forEach(el => {
      el.addEventListener("click", () => {
        const view = el.dataset.view;
        if (view) RouterModule.go(view);
        this.results.hidden = true;
        this.input.value = "";
      });
    });
  }
};

/* ---------------------------------------------------------------------
   16. ROADMAP MODULE (dashboard timeline — status derived from progress)
   --------------------------------------------------------------------- */
const RoadmapModule = {
  init() { this.render(); },
  render() {
    const dsaPct = DsaTrackerModule.percent();
    const aptPct = AptTrackerModule.percent();
    const resumeScore = Utils.storage.get("acn_resume_score", 0);
    const mockCount = SchedulerModule.sessions.length;

    // Simple heuristic to decide each stage's status for a living, data-driven roadmap
    const statuses = [
      dsaPct + aptPct > 0 || resumeScore > 0 ? "done" : "progress",       // Foundations (assume started if anything moved)
      dsaPct >= 80 ? "done" : dsaPct > 0 ? "progress" : "upcoming",       // DSA Mastery
      aptPct >= 80 ? "done" : aptPct > 0 ? "progress" : "upcoming",       // Aptitude Drills
      resumeScore >= 70 ? "done" : resumeScore > 0 ? "progress" : "upcoming", // Resume
      mockCount >= 2 ? "done" : mockCount > 0 ? "progress" : "upcoming",  // Mock Interviews
      "upcoming"                                                          // Offer Letter
    ];

    const timeline = Utils.$("#roadmapTimeline");
    timeline.innerHTML = DataModule.roadmap.map((stage, i) => `
      <div class="timeline-item ${statuses[i] === "done" ? "done" : ""}" data-num="${i + 1}">
        <div class="timeline-card">
          <h4>${Utils.escapeHTML(stage.title)} <span class="stage-badge ${statuses[i]}">${statuses[i]}</span></h4>
          <p>${Utils.escapeHTML(stage.desc)}</p>
          <div class="timeline-tags">${stage.tags.map(t => `<span>${Utils.escapeHTML(t)}</span>`).join("")}</div>
        </div>
      </div>`).join("");
  }
};

/* ---------------------------------------------------------------------
   17. CANVAS CHART HELPERS — tiny dependency-free chart primitives
   --------------------------------------------------------------------- */
const ChartUtils = {
  cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  },
  clearHiDPI(canvas) {
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = (rect.width || canvas.width) * dpr;
    canvas.height = (canvas.dataset.baseHeight ? Number(canvas.dataset.baseHeight) : rect.height || canvas.height) * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return { ctx, w: rect.width || canvas.width / dpr, h: (canvas.dataset.baseHeight ? Number(canvas.dataset.baseHeight) : canvas.height / dpr) };
  },
  drawBarChart(canvas, labels, values, color) {
    canvas.dataset.baseHeight = canvas.height;
    const { ctx, w, h } = this.clearHiDPI(canvas);
    const pad = 30, max = Math.max(...values, 1);
    const barW = (w - pad * 2) / values.length * 0.6;
    const gap = (w - pad * 2) / values.length;
    ctx.strokeStyle = this.cssVar("--border");
    ctx.beginPath(); ctx.moveTo(pad, h - pad); ctx.lineTo(w - 10, h - pad); ctx.stroke();

    values.forEach((v, i) => {
      const barH = ((h - pad * 2) * v) / max;
      const x = pad + i * gap + (gap - barW) / 2;
      const y = h - pad - barH;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(x, y, barW, barH, 5) : ctx.rect(x, y, barW, barH);
      ctx.fill();
      ctx.fillStyle = this.cssVar("--ink-faint");
      ctx.font = "11px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(labels[i], x + barW / 2, h - pad + 16);
    });
  },
  drawDonut(canvas, segments) {
    canvas.dataset.baseHeight = canvas.height;
    const { ctx, w, h } = this.clearHiDPI(canvas);
    const cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2 - 10, thickness = 22;
    const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
    let start = -Math.PI / 2;
    segments.forEach(seg => {
      const angle = (seg.value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, start, start + angle);
      ctx.strokeStyle = seg.color;
      ctx.lineWidth = thickness;
      ctx.lineCap = "butt";
      ctx.stroke();
      start += angle;
    });
    ctx.fillStyle = this.cssVar("--ink");
    ctx.font = "700 20px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText(Math.round((segments.reduce((s, x) => s + (x.done || 0), 0) / (segments.reduce((s, x) => s + (x.total || x.value), 0) || 1)) * 100) + "%", cx, cy + 7);
  },
  drawLine(canvas, labels, values, color) {
    canvas.dataset.baseHeight = canvas.height;
    const { ctx, w, h } = this.clearHiDPI(canvas);
    const pad = 34, max = 100;
    ctx.strokeStyle = this.cssVar("--border");
    for (let g = 0; g <= 4; g++) {
      const y = pad + ((h - pad * 2) / 4) * g;
      ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(w - 10, y); ctx.stroke();
    }
    const stepX = (w - pad - 20) / (values.length - 1);
    ctx.beginPath();
    values.forEach((v, i) => {
      const x = pad + i * stepX;
      const y = h - pad - ((h - pad * 2) * v) / max;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.stroke();

    values.forEach((v, i) => {
      const x = pad + i * stepX;
      const y = h - pad - ((h - pad * 2) * v) / max;
      ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
      ctx.fillStyle = this.cssVar("--ink-faint");
      ctx.font = "10px Inter, sans-serif"; ctx.textAlign = "center";
      ctx.fillText(labels[i], x, h - pad + 16);
    });
  },
  drawRadar(canvas, labels, values) {
    canvas.dataset.baseHeight = canvas.height;
    const { ctx, w, h } = this.clearHiDPI(canvas);
    const cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2 - 34, n = labels.length;
    ctx.strokeStyle = this.cssVar("--border");
    for (let ring = 1; ring <= 4; ring++) {
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const angle = (Math.PI * 2 * (i % n)) / n - Math.PI / 2;
        const x = cx + Math.cos(angle) * r * (ring / 4);
        const y = cy + Math.sin(angle) * r * (ring / 4);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.beginPath();
    values.forEach((v, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const x = cx + Math.cos(angle) * r * (v / 100);
      const y = cy + Math.sin(angle) * r * (v / 100);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = this.cssVar("--accent") + "55";
    ctx.strokeStyle = this.cssVar("--accent");
    ctx.lineWidth = 2;
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = this.cssVar("--ink-soft");
    ctx.font = "11px Inter, sans-serif";
    labels.forEach((label, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const x = cx + Math.cos(angle) * (r + 18);
      const y = cy + Math.sin(angle) * (r + 18);
      ctx.textAlign = Math.abs(Math.cos(angle)) < 0.2 ? "center" : (Math.cos(angle) > 0 ? "left" : "right");
      ctx.fillText(label, x, y);
    });
  }
};

/* ---------------------------------------------------------------------
   18. DASHBOARD MODULE — KPI cards, weekly activity chart, upcoming list
   --------------------------------------------------------------------- */
const DashboardModule = {
  init() {
    Utils.$("#todayDate").textContent = Utils.formatDate(new Date());
    this.renderAll();
  },
  renderAll() {
    const dsaPct = DsaTrackerModule.percent();
    const aptPct = AptTrackerModule.percent();
    const resumeScore = Utils.storage.get("acn_resume_score", null);
    const mockCount = SchedulerModule.sessions.length;
    const overall = Math.round((dsaPct + aptPct + (resumeScore || 0) + Math.min(mockCount * 20, 100)) / 4);

    Utils.$("#kpiDsa").textContent = dsaPct + "%";
    Utils.$("#kpiDsaFill").style.width = dsaPct + "%";
    Utils.$("#kpiApt").textContent = aptPct + "%";
    Utils.$("#kpiAptFill").style.width = aptPct + "%";
    Utils.$("#kpiResume").textContent = resumeScore !== null ? resumeScore + "%" : "--";
    Utils.$("#kpiResumeFill").style.width = (resumeScore || 0) + "%";
    Utils.$("#kpiMock").textContent = String(mockCount);
    Utils.$("#kpiMockFill").style.width = Math.min(mockCount * 25, 100) + "%";

    Utils.$("#topbarReadiness").textContent = `Readiness: ${overall}%`;
    Utils.$("#heroReadiness") && (Utils.$("#heroReadiness").textContent = overall + "%");

    const upcoming = SchedulerModule.upcoming();
    const list = Utils.$("#upcomingList");
    list.innerHTML = upcoming.length
      ? upcoming.map(s => `<li><span>${Utils.escapeHTML(s.role)}</span><span>${s.date} · ${s.time}</span></li>`).join("")
      : `<li class="empty-state">No mock interviews scheduled yet.</li>`;

    RoadmapModule.render();
    this.renderWeeklyChart();
  },
  renderWeeklyChart() {
    const canvas = Utils.$("#chartWeekly");
    if (!canvas || !canvas.offsetParent) return;
    // Deterministic-but-varied weekly activity derived from current progress,
    // so the chart still feels alive without needing a backend.
    const dsaPct = DsaTrackerModule.percent(), aptPct = AptTrackerModule.percent();
    const base = Math.max(1, Math.round((dsaPct + aptPct) / 20));
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const values = days.map((_, i) => Math.max(0, base + Math.round(Math.sin(i * 1.3) * 2) + (i % 3 === 0 ? 1 : 0)));
    ChartUtils.drawBarChart(canvas, days, values, ChartUtils.cssVar("--accent"));
  }
};

/* ---------------------------------------------------------------------
   19. ANALYTICS MODULE — full chart suite for the Analytics view
   --------------------------------------------------------------------- */
const AnalyticsModule = {
  renderAll() {
    const view = Utils.$("#view-analytics");
    if (!view || !view.classList.contains("active")) {
      // still safe to draw off-screen later; but skip to save cycles until visited
    }
    this.renderDonut();
    this.renderDsaBar();
    this.renderLine();
    this.renderRadar();
  },
  renderDonut() {
    const canvas = Utils.$("#chartDonut");
    if (!canvas) return;
    const dsaPct = DsaTrackerModule.percent(), aptPct = AptTrackerModule.percent();
    const resumeScore = Utils.storage.get("acn_resume_score", 0);
    const segs = [
      { label: "DSA", value: Math.max(dsaPct, 1), done: dsaPct, total: 100, color: ChartUtils.cssVar("--accent") },
      { label: "Aptitude", value: Math.max(aptPct, 1), done: aptPct, total: 100, color: ChartUtils.cssVar("--accent-2") },
      { label: "Resume", value: Math.max(resumeScore, 1), done: resumeScore, total: 100, color: "#6C8EF5" }
    ];
    ChartUtils.drawDonut(canvas, segs);
    Utils.$("#donutLegend").innerHTML = segs.map(s => `<span class="legend-item"><span class="legend-dot" style="background:${s.color}"></span>${s.label}: ${s.done}%</span>`).join("");
  },
  renderDsaBar() {
    const canvas = Utils.$("#chartBarDsa");
    if (!canvas) return;
    const cats = DsaTrackerModule.byCategory();
    const labels = Object.keys(cats).map(c => c.split(" ")[0]);
    const values = Object.values(cats).map(c => Math.round((c.done / c.total) * 100));
    ChartUtils.drawBarChart(canvas, labels, values, ChartUtils.cssVar("--accent-2"));
  },
  renderLine() {
    const canvas = Utils.$("#chartLine");
    if (!canvas) return;
    const overall = Math.round((DsaTrackerModule.percent() + AptTrackerModule.percent() + (Utils.storage.get("acn_resume_score", 0))) / 3);
    // Simulate an 8-week upward trend converging on today's actual overall readiness
    const values = Array.from({ length: 8 }, (_, i) => Math.max(2, Math.round(overall * ((i + 1) / 8) - (7 - i) * 1.5)));
    values[values.length - 1] = overall;
    ChartUtils.drawLine(canvas, ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"], values, ChartUtils.cssVar("--accent"));
  },
  renderRadar() {
    const canvas = Utils.$("#chartRadar");
    if (!canvas) return;
    const dsaPct = DsaTrackerModule.percent(), aptPct = AptTrackerModule.percent();
    const resumeScore = Utils.storage.get("acn_resume_score", 0);
    const mockCount = SchedulerModule.sessions.length;
    const consistency = Utils.clamp(Math.round((dsaPct + aptPct) / 2), 0, 100);
    const values = [dsaPct, aptPct, resumeScore, Math.min(mockCount * 25, 100), consistency];
    ChartUtils.drawRadar(canvas, ["DSA", "Aptitude", "Resume", "Interviews", "Consistency"], values);
  }
};

/* ---------------------------------------------------------------------
   20. BOOTSTRAP — run all modules once the DOM is ready
   --------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  Utils.$("#year").textContent = new Date().getFullYear();

  PreloaderModule.init();
  ThemeModule.init();
  NavbarModule.init();
  AppShell.init();
  RouterModule.init();
  FaqModule.init();
  TestimonialModule.init();
  ContactFormModule.init();

  DsaTrackerModule.init();
  AptTrackerModule.init();
  ResumeModule.init();
  InterviewModule.init();
  SchedulerModule.init();
  SearchModule.init();
  RoadmapModule.init();
  DashboardModule.init();
  AnalyticsModule.renderAll();

  // Redraw charts responsively (debounced)
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      DashboardModule.renderWeeklyChart();
      AnalyticsModule.renderAll();
    }, 200);
  });
});

// Expose modules on window for cross-module calls used above (theme toggle redraw, etc.)
window.AnalyticsModule = AnalyticsModule;
window.DashboardModule = DashboardModule;
