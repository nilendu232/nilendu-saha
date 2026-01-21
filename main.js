// =============================
//  Navbar
// =============================
function loadNavbar() {
  fetch('navbar.html')
    .then(response => response.text())
    .then(html => {
      const mount = document.getElementById('navbar-placeholder');
      if (mount) mount.innerHTML = html;
      setActiveNav(); // run after inject so IDs exist
    })
    .catch(err => console.log('Navbar load failed:', err));
}

function setActiveNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  const map = {
    "index.html": "nav-home",
    "": "nav-home",
    "resume.html": "nav-resume",
    "projects.html": "nav-projects"
    // If you want a nav state for detail page:
    // "project1.html": "nav-projects"
  };
  const activeId = map[path];
  if (activeId) {
    const el = document.getElementById(activeId);
    if (el) el.classList.add("active");
  }
}


// =============================
//  Counters
// =============================
function animateCounters() {
  document.querySelectorAll('.skill-number').forEach(counter => {
    const targetText = counter.dataset.target; // "5+", "3", "10+"
    const target = parseInt(targetText);
    let current = 0;
    const duration = 1500;
    const increment = target / (duration / 16);

    const updateCounter = () => {
      if (current < target) {
        current += increment;
        const displayNum = Math.floor(current);
        counter.textContent = displayNum >= target ? targetText : displayNum;
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = targetText;
      }
    };

    if (targetText && targetText.includes('+')) {
      counter.textContent = targetText;
    } else {
      updateCounter();
    }
  });
}

function initCounters() {
  setTimeout(animateCounters, 500);

  let scrolled = false;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100 && !scrolled) {
      scrolled = true;
      animateCounters();
    }
  }, { once: true });
}


// =============================
//  Project data
// =============================
const PROJECTS = {
  "fire-detection": {
    title: "Intelligent Fire Detection & Suppression System",
    role: "End‑to‑end design • Embedded & CV",
    location: "Newbury, UK",
    stack: ["Python", "OpenCV", "CNN", "ESP32", "Relays"],
    summary: "Vision‑based fire detection using CNN and OpenCV, triggering a microcontroller‑driven suppression system.",
    highlights: [
      "Real‑time detection pipeline running on edge hardware",
      "Custom PCB for actuation and sensor interfacing",
      "Improved detection reliability over traditional sensor‑only systems"
    ],
    media: [
      { type: "image", src: "images/fire-setup-1.jpg", caption: "System setup overview" },
      { type: "image", src: "images/pcb-closeup.jpg", caption: "Custom PCB close-up" },
      { type: "video", src: "videos/demo.mp4", poster: "images/demo-thumb.jpg", caption: "Demo video" }
    ]
  },

  "industrial-sorter": {
    title: "PCB Design for Industrial Pot Sorting Machine",
    role: "Embedded Systems • Electronics",
    location: "Newbury, UK",
    stack: ["PCB Design", "Eagle", "Microcontroller", "Sensors", "Relays", "Motors", "C/C++"],
    summary: "Designed a custom Eagle-based, application-specific PCB featuring an onboard microcontroller, sensor inputs, and relay/motor points.",
    highlights: [
      "15–20% less wiring by consolidating I/O and connectors",
      "25% faster assembly via repeatable harnessing and clearer integration points",
      "Developed software for autonomous operation",
      "Contributed ~1 unit per 2 seconds throughput to the main production line"
    ],
    media: [
      { type: "image", src: "images/pot-sorter/model-1.jpg", caption: "Sorting machine overview" },
      { type: "image", src: "images/pot-sorter/schematic-page-1.png", caption: "Schematic excerpt" },
      { type: "image", src: "images/pot-sorter/pcb-top.png", caption: "PCB top view" },
      { type: "video", src: "videos/pot-sorter-demo.mp4", poster: "images/pot-sorter/demo-thumb.jpg", caption: "Sorting cycle demo" }
    ]
  }
};


// =============================
//  Helpers (avoid overwriting manual HTML)
// =============================
function setIfEmpty(el, value) {
  if (!el) return;
  if (el.textContent.trim().length === 0) el.textContent = value;
}

function fillListIfEmpty(ul, items) {
  if (!ul) return;
  if (ul.querySelector("li")) return;
  ul.innerHTML = "";
  items.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    ul.appendChild(li);
  });
}

function fillChipsIfEmpty(box, items) {
  if (!box) return;
  if (box.querySelector(".chip")) return;
  box.innerHTML = "";
  items.forEach(t => {
    const span = document.createElement("span");
    span.className = "chip";
    span.textContent = t;
    box.appendChild(span);
  });
}

function fillMediaIfEmpty(box, mediaItems) {
  if (!box) return;
  if (box.querySelector(".media-item")) return;
  if (!Array.isArray(mediaItems) || mediaItems.length === 0) return;

  box.innerHTML = "";

  mediaItems.forEach(m => {
    const fig = document.createElement("figure");
    fig.className = "media-item";

    if (m.type === "image") {
      const img = document.createElement("img");
      img.src = m.src;               // sets image URL [web:376]
      img.alt = m.caption || "Project image";
      fig.appendChild(img);
    } else if (m.type === "video") {
      const vid = document.createElement("video");
      vid.controls = true;
      if (m.poster) vid.poster = m.poster;

      const source = document.createElement("source");
      source.src = m.src;
      source.type = "video/mp4";
      vid.appendChild(source);

      fig.appendChild(vid);
    }

    if (m.caption) {
      const cap = document.createElement("figcaption");
      cap.textContent = m.caption;
      fig.appendChild(cap);
    }

    box.appendChild(fig);
  });
}


// =============================
//  Project detail renderer
// =============================
function renderProjectDetail() {
  const container = document.getElementById("project-detail");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id"); // null if missing [web:287]
  if (!id) return;

  const data = PROJECTS[id];
  if (!data) return;

  setIfEmpty(container.querySelector(".pd-title"), data.title);
  setIfEmpty(container.querySelector(".pd-role"), data.role);
  setIfEmpty(container.querySelector(".pd-location"), data.location);
  setIfEmpty(container.querySelector(".pd-summary"), data.summary);

  fillChipsIfEmpty(container.querySelector(".pd-stack"), data.stack);
  fillListIfEmpty(container.querySelector(".pd-highlights"), data.highlights);

  // Media (requires <div class="media-grid pd-media"></div> in HTML)
  fillMediaIfEmpty(container.querySelector(".pd-media"), data.media);
}


// =============================
//  INIT
// =============================
document.addEventListener("DOMContentLoaded", () => {
  loadNavbar();
  setActiveNav();
  initCounters();
  renderProjectDetail();
});
