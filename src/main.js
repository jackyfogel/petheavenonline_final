import './style.css';
import { scenes } from './data/scenes.js';
import { memorials } from './data/memorials.js';
import { initCreatePage } from './create.js';
import { initContactPage } from './contact.js';
import { initBrowsePage } from './browse.js';
import { initAccountPage } from './account.js';
import { initLegalPage } from './legal.js';
import { initLoginPage, initRegisterPage } from './auth.js';

const stage = document.getElementById("stage");
const sceneEl = document.getElementById("scene");

// --- Route detection ---

const path = window.location.pathname;

if (path.startsWith("/memorial/")) {
  const slug = path.slice("/memorial/".length).replace(/\/$/, "");
  document.body.classList.add("nav--solid", "footer--inline");
  renderMemorialPage(slug);
} else if (path === "/create") {
  document.body.classList.add("nav--solid", "footer--inline");
  initCreatePage();
} else if (path === "/contact") {
  document.body.classList.add("nav--solid", "footer--inline");
  initContactPage();
} else if (path === "/browse") {
  document.body.classList.add("nav--solid", "footer--inline");
  initBrowsePage();
} else if (path === "/account") {
  document.body.classList.add("nav--solid", "footer--inline");
  initAccountPage();
} else if (path === "/login") {
  document.body.classList.add("nav--solid", "footer--inline");
  initLoginPage();
} else if (path === "/register") {
  document.body.classList.add("nav--solid", "footer--inline");
  initRegisterPage();
} else if (path === "/terms") {
  document.body.classList.add("nav--solid", "footer--inline");
  initLegalPage("terms");
} else if (path === "/privacy") {
  document.body.classList.add("nav--solid", "footer--inline");
  initLegalPage("privacy");
} else {
  document.body.classList.add("footer--fixed");
  initHomepage();
}

// --- Memorial detail page ---

function renderMemorialPage(slug) {
  const m = Object.values(memorials).find((mem) => mem.slug === slug);

  sceneEl.style.display = "none";
  stage.classList.add("memorial-page");
  document.documentElement.style.overflow = "auto";
  document.documentElement.style.height = "auto";
  document.body.style.overflow = "auto";
  document.body.style.height = "auto";

  const page = document.createElement("div");
  page.className = "mem-page";

  if (!m) {
    page.innerHTML = `
      <div class="mem-not-found">
        <p>This memorial could not be found.</p>
        <a href="/" class="mem-back-link">← Back to garden</a>
      </div>
    `;
    stage.appendChild(page);
    return;
  }

  const story    = m.story    || "A full story and remembrance will live here.";
  const owner    = m.owner    || "";
  const traits   = m.traits   || [];
  const timeline = m.timeline || [
    { year: m.born,   event: "Born into the world" },
    { year: m.passed, event: "Passed away peacefully" },
  ];

  const galleryItems = Array.from({ length: 6 }, () =>
    m.photo
      ? `<div class="mem-gallery-item" style="background-image:url(${m.photo})"></div>`
      : `<div class="mem-gallery-item"></div>`
  ).join("");

  const timelineHTML = timeline.map(item => `
    <div class="mem-timeline-item">
      <div class="mem-timeline-dot"></div>
      <div class="mem-timeline-content">
        <span class="mem-timeline-year">${item.year}</span>
        <p class="mem-timeline-event">${item.event}</p>
      </div>
    </div>
  `).join("");

  const traitsHTML = traits.length
    ? `<div class="mem-traits">${traits.map(t => `<span class="mem-trait">${t}</span>`).join("")}</div>`
    : "";

  const candleIcons = Array.from({ length: 5 }, () => `<div class="mem-candle-icon"></div>`).join("");

  const tributes = [
    { initials: "SM", name: "Sarah M.",          time: "2 days ago",   msg: `${m.name} was such a wonderful companion. Our hearts go out to your whole family.` },
    { initials: "TL", name: "Tom & Lisa",         time: "1 week ago",   msg: `We'll never forget the joy ${m.name} brought to every gathering. A truly special soul.` },
    { initials: "RF", name: "The Rivera Family",  time: "2 weeks ago",  msg: `May ${m.name} rest in eternal peace. Thinking of you all.` },
  ];

  const tributesHTML = tributes.map(t => `
    <div class="mem-tribute">
      <div class="mem-tribute-avatar">${t.initials}</div>
      <div class="mem-tribute-body">
        <div class="mem-tribute-header">
          <span class="mem-tribute-name">${t.name}</span>
          <span class="mem-tribute-time">${t.time}</span>
        </div>
        <p class="mem-tribute-message">${t.msg}</p>
      </div>
    </div>
  `).join("");

  page.innerHTML = `
    <section class="mem-hero">
      <div class="mem-hero-inner">
        <a href="/" class="mem-back-link">← Back to garden</a>
        <div class="mem-hero-photo-wrap">
          ${m.photo ? `<img src="${m.photo}" alt="${m.name}">` : ""}
        </div>
        <p class="mem-hero-eyebrow">In Loving Memory of</p>
        <h1 class="mem-hero-name">${m.name}</h1>
        <p class="mem-hero-dates">${m.born} — ${m.passed}</p>
        <p class="mem-hero-epitaph">"${m.epitaph}"</p>
        ${owner ? `<p class="mem-hero-owner">Created by ${owner}</p>` : ""}
      </div>
    </section>

    <section class="mem-section">
      <div class="mem-section-inner">
        <h2 class="mem-heading">About ${m.name}</h2>
        <p class="mem-story">${story}</p>
        ${traitsHTML}
      </div>
    </section>

    <section class="mem-section mem-section--alt">
      <div class="mem-section-inner">
        <h2 class="mem-heading">Memories</h2>
        <div class="mem-gallery">${galleryItems}</div>
      </div>
    </section>

    <section class="mem-section">
      <div class="mem-section-inner">
        <h2 class="mem-heading">Life Timeline</h2>
        <div class="mem-timeline">${timelineHTML}</div>
      </div>
    </section>

    <section class="mem-section mem-section--alt">
      <div class="mem-section-inner mem-section-inner--center">
        <h2 class="mem-heading">Light a Candle</h2>
        <p class="mem-candle-count">247 candles have been lit for ${m.name}</p>
        <div class="mem-candle-row">${candleIcons}</div>
        <button class="mem-btn">Light a Candle</button>
      </div>
    </section>

    <section class="mem-section">
      <div class="mem-section-inner mem-section-inner--center">
        <h2 class="mem-heading">Send a Virtual Flower</h2>
        <div class="mem-flowers">
          <div class="mem-flower-option">
            <div class="mem-flower-circle mem-flower-circle--rose"></div>
            <p class="mem-flower-name">Rose</p>
            <p class="mem-flower-price">Free</p>
          </div>
          <div class="mem-flower-option">
            <div class="mem-flower-circle mem-flower-circle--lily"></div>
            <p class="mem-flower-name">Lily</p>
            <p class="mem-flower-price">$1</p>
          </div>
          <div class="mem-flower-option">
            <div class="mem-flower-circle mem-flower-circle--bouquet"></div>
            <p class="mem-flower-name">Bouquet</p>
            <p class="mem-flower-price">$5</p>
          </div>
        </div>
      </div>
    </section>

    <section class="mem-section mem-section--alt">
      <div class="mem-section-inner">
        <h2 class="mem-heading">Tributes</h2>
        <div class="mem-tributes-list">${tributesHTML}</div>
        <button class="mem-btn">Leave a Tribute</button>
      </div>
    </section>

    <section class="mem-section">
      <div class="mem-section-inner mem-section-inner--center">
        <h2 class="mem-heading">Share This Memorial</h2>
        <p class="mem-share-intro">Invite family and friends to remember ${m.name}</p>
        <div class="mem-share-buttons">
          <button class="mem-btn">Copy Link</button>
          <button class="mem-btn">Share</button>
        </div>
        <div class="mem-qr">
          <div class="mem-qr-placeholder"></div>
          <p class="mem-qr-label">Scan to visit this memorial</p>
        </div>
      </div>
    </section>
  `;

  stage.appendChild(page);
}

// --- Homepage ---

function initHomepage() {
  let currentIndex = 0;
  let isTransitioning = false;
  let previewCard = null;
  let markerEls = [];

  function isPortrait() {
    return window.innerHeight > window.innerWidth;
  }

  // Nav arrows
  const prevBtn = document.createElement("button");
  prevBtn.id = "nav-prev";
  prevBtn.setAttribute("aria-label", "Previous scene");
  prevBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
  stage.appendChild(prevBtn);

  const nextBtn = document.createElement("button");
  nextBtn.id = "nav-next";
  nextBtn.setAttribute("aria-label", "Next scene");
  nextBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
  stage.appendChild(nextBtn);

  function updateArrows() {
    prevBtn.classList.toggle("nav--muted", currentIndex === 0);
    nextBtn.classList.toggle("nav--muted", currentIndex === scenes.length - 1);
  }


  // Scene rendering
  function applyScene(sc) {
    stage.style.backgroundColor = sc.ambientColor;
    if (sc.background) {
      sceneEl.style.background = "";
      sceneEl.style.backgroundColor = sc.ambientColor;
      sceneEl.style.backgroundImage = `url(${sc.background})`;
    } else {
      sceneEl.style.backgroundImage = "";
      sceneEl.style.background = sc.gradient;
    }
  }

  function isMobile() {
    return window.innerWidth < 768;
  }

  function fitScene() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (isMobile()) {
      // Fill viewport below nav — no letterbox
      sceneEl.style.position = "absolute";
      sceneEl.style.top      = "54px";
      sceneEl.style.left     = "0";
      sceneEl.style.right    = "0";
      sceneEl.style.bottom   = "0";
      sceneEl.style.width    = "";
      sceneEl.style.height   = "";
      return;
    }

    // Desktop: reset any mobile overrides, then letterbox at 16:9
    sceneEl.style.position = "";
    sceneEl.style.top      = "";
    sceneEl.style.left     = "";
    sceneEl.style.right    = "";
    sceneEl.style.bottom   = "";

    const targetRatio    = 16 / 9;
    const viewportRatio  = vw / vh;
    let width, height;
    if (viewportRatio > targetRatio) {
      height = vh;
      width  = Math.round(vh * targetRatio);
    } else {
      width  = vw;
      height = Math.round(vw / targetRatio);
    }
    sceneEl.style.width  = width  + "px";
    sceneEl.style.height = height + "px";
  }

  function closePreview() {
    if (previewCard) {
      const overlay = previewCard.closest(".mobile-card-overlay");
      if (overlay) overlay.remove();
      else previewCard.remove();
      previewCard = null;
    }
    markerEls.forEach((el) => el.classList.remove("marker--active", "marker--dimmed"));
  }

  function activateMarker(slot, markerEl) {
    closePreview();
    markerEls.forEach((el) => {
      el.classList.add(el === markerEl ? "marker--active" : "marker--dimmed");
    });

    const m = memorials[slot.memorialId];
    const card = document.createElement("div");
    card.className = "preview-card";
    card.style.left = slot.x + "%";
    card.style.top = slot.y + "%";
    card.innerHTML = `
      <button class="preview-close" aria-label="Close">&#215;</button>
      <div class="preview-photo"></div>
      <div class="preview-name">${m.name}</div>
      <div class="preview-dates">${m.born} &ndash; ${m.passed}</div>
      <div class="preview-epitaph">${m.epitaph}</div>
      <a class="preview-enter" href="/memorial/${m.slug}">Enter Memorial</a>
    `;
    card.querySelector(".preview-close").addEventListener("click", (e) => {
      e.stopPropagation();
      closePreview();
    });
    sceneEl.appendChild(card);
    previewCard = card;
  }

  function clearMarkers() {
    markerEls.forEach((el) => el.remove());
    markerEls = [];
  }

  function activeSlots(sc) {
    return (isPortrait() && sc.slotsPortrait) ? sc.slotsPortrait : sc.slots;
  }

  function renderMarkers(sc) {
    if (isMobile()) {
      renderMobileMarkers(sc);
    } else {
      renderDesktopMarkers(sc);
    }
  }

  function renderDesktopMarkers(sc) {
    activeSlots(sc).forEach((slot) => {
      const marker = document.createElement("div");
      marker.className = "marker";
      marker.style.left = slot.x + "%";
      marker.style.top  = slot.y + "%";
      marker.style.setProperty("--base-scale", slot.scale);

      const img = document.createElement("img");
      img.src = "/assets/markers/tombstone.webp";
      img.alt = "";
      img.draggable = false;
      marker.appendChild(img);

      const m = memorials[slot.memorialId];
      const overlay = document.createElement("div");
      overlay.className = "marker-overlay";
      overlay.innerHTML = `
        <div class="marker-photo">${m.photo ? `<img src="${m.photo}" alt="${m.name}">` : ""}</div>
        <div class="marker-name">${m.name}</div>
        <div class="marker-dates">${m.born}–${m.passed}</div>
      `;
      marker.appendChild(overlay);

      marker.addEventListener("click", (e) => {
        e.stopPropagation();
        activateMarker(slot, marker);
      });
      sceneEl.appendChild(marker);
      markerEls.push(marker);
    });
  }

  // Diamond: left=center-x, top=feet-y (marker anchors bottom-center)
  // Grass is bottom 33% (~y:67+). Apex top, wide middle, narrower bottom = no overlap.
  const MOBILE_POSITIONS = [
    { x: 50, y: 78 }, // apex — top-center
    { x: 20, y: 84 }, // mid-left
    { x: 80, y: 84 }, // mid-right
    { x: 33, y: 90 }, // bottom-left
    { x: 67, y: 90 }, // bottom-right
  ];

  function renderMobileMarkers(sc) {
    sc.slots.forEach((slot, i) => {
      const pos    = MOBILE_POSITIONS[i] || { x: 50, y: 55 };
      const marker = document.createElement("div");
      marker.className = "marker";
      marker.style.left = pos.x + "%";
      marker.style.top  = pos.y + "%";
      marker.style.setProperty("--base-scale", 1);

      const img = document.createElement("img");
      img.src = "/assets/markers/tombstone.webp";
      img.alt = "";
      img.draggable = false;
      marker.appendChild(img);

      const m = memorials[slot.memorialId];
      const overlay = document.createElement("div");
      overlay.className = "marker-overlay";
      overlay.innerHTML = `
        <div class="marker-photo">${m.photo ? `<img src="${m.photo}" alt="${m.name}">` : ""}</div>
        <div class="marker-name">${m.name}</div>
        <div class="marker-dates">${m.born}–${m.passed}</div>
      `;
      marker.appendChild(overlay);

      marker.addEventListener("click", (e) => {
        e.stopPropagation();
        activateMobileMarker(slot, marker);
      });
      sceneEl.appendChild(marker);
      markerEls.push(marker);
    });
  }

  function activateMobileMarker(slot, markerEl) {
    closePreview();
    markerEls.forEach((el) => {
      el.classList.add(el === markerEl ? "marker--active" : "marker--dimmed");
    });

    const m = memorials[slot.memorialId];

    const overlay = document.createElement("div");
    overlay.className = "mobile-card-overlay";
    overlay.addEventListener("click", closePreview);

    const card = document.createElement("div");
    card.className = "preview-card preview-card--mobile";
    card.innerHTML = `
      <button class="preview-close" aria-label="Close">&#215;</button>
      <div class="preview-photo"></div>
      <div class="preview-name">${m.name}</div>
      <div class="preview-dates">${m.born} &ndash; ${m.passed}</div>
      <div class="preview-epitaph">${m.epitaph}</div>
      <a class="preview-enter" href="/memorial/${m.slug}">Enter Memorial</a>
    `;
    card.querySelector(".preview-close").addEventListener("click", (e) => {
      e.stopPropagation();
      closePreview();
    });
    card.addEventListener("click", (e) => e.stopPropagation());

    overlay.appendChild(card);
    document.body.appendChild(overlay);
    previewCard = card;
  }

  // Navigation
  function goToScene(index, direction) {
    if (isTransitioning) return;
    if (index < 0 || index >= scenes.length) return;

    isTransitioning = true;
    closePreview();

    const exitClass  = direction === "next" ? "scene--exit-left"        : "scene--exit-right";
    const enterClass = direction === "next" ? "scene--enter-from-right" : "scene--enter-from-left";

    sceneEl.classList.add(exitClass);

    setTimeout(() => {
      sceneEl.classList.remove(exitClass);
      sceneEl.style.opacity = "0";

      clearMarkers();
      currentIndex = index;
      applyScene(scenes[currentIndex]);
      renderMarkers(scenes[currentIndex]);
      updateArrows();

      void sceneEl.offsetWidth;
      sceneEl.style.opacity = "";
      sceneEl.classList.add(enterClass);

      setTimeout(() => {
        sceneEl.classList.remove(enterClass);
        isTransitioning = false;
      }, 310);
    }, 290);
  }

  prevBtn.addEventListener("click", () => goToScene(currentIndex - 1, "prev"));
  nextBtn.addEventListener("click", () => goToScene(currentIndex + 1, "next"));

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") goToScene(currentIndex + 1, "next");
    if (e.key === "ArrowLeft")  goToScene(currentIndex - 1, "prev");
  });

  // Touch swipe
  let touchStartX = 0;

  sceneEl.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  sceneEl.addEventListener("touchend", (e) => {
    if (e.target.closest(".mobile-marker-track")) return;
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) < 50) return;
    if (delta < 0) goToScene(currentIndex + 1, "next");
    else           goToScene(currentIndex - 1, "prev");
  });

  sceneEl.addEventListener("click", (e) => {
    if (e.target.closest(".preview-card")) return;
    closePreview();
  });

  // Resize
  let lastPortrait = isPortrait();
  let lastMobile   = isMobile();

  window.addEventListener("resize", () => {
    fitScene();
    const nowPortrait = isPortrait();
    const nowMobile   = isMobile();
    if (nowPortrait !== lastPortrait || nowMobile !== lastMobile) {
      lastPortrait = nowPortrait;
      lastMobile   = nowMobile;
      closePreview();
      clearMarkers();
      renderMarkers(scenes[currentIndex]);
    }
  });

  // Init
  const vignette = document.createElement("div");
  vignette.id = "vignette";
  sceneEl.appendChild(vignette);


  const hero = document.createElement("div");
  hero.id = "hero";
  const pawSVG = `<svg class="hero-icon hero-icon--paw" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
    <ellipse cx="50" cy="75" rx="24" ry="19"/>
    <ellipse cx="20" cy="46" rx="12" ry="14" transform="rotate(-12 20 46)"/>
    <ellipse cx="39" cy="34" rx="12" ry="14"/>
    <ellipse cx="61" cy="34" rx="12" ry="14"/>
    <ellipse cx="80" cy="46" rx="12" ry="14" transform="rotate(12 80 46)"/>
  </svg>`;
  const heartSVG = `<svg class="hero-icon hero-icon--heart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>`;

  hero.innerHTML = `
    <h1 id="hero-headline">${pawSVG}A peaceful place to remember them${pawSVG}${heartSVG}</h1>
  `;
  sceneEl.appendChild(hero);

  applyScene(scenes[currentIndex]);
  fitScene();
  renderMarkers(scenes[currentIndex]);
  updateArrows();
}

// --- Hamburger menu (runs on all pages) ---

const hamburger   = document.getElementById("nav-hamburger");
const mobileMenu  = document.getElementById("mobile-menu");
const mobileOverlay = document.getElementById("mobile-menu-overlay");
const mobileClose = document.getElementById("mobile-menu-close");

function openMobileMenu() {
  mobileMenu.classList.add("menu--open");
  hamburger.setAttribute("aria-expanded", "true");
}

function closeMobileMenu() {
  mobileMenu.classList.remove("menu--open");
  hamburger.setAttribute("aria-expanded", "false");
}

hamburger.addEventListener("click", openMobileMenu);
mobileClose.addEventListener("click", closeMobileMenu);
mobileOverlay.addEventListener("click", closeMobileMenu);
