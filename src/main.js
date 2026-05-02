import { scenes } from './data/scenes.js';
import { memorials } from './data/memorials.js';

const stage = document.getElementById("stage");
const sceneEl = document.getElementById("scene");

// --- Route detection ---

const path = window.location.pathname;

if (path.startsWith("/memorial/")) {
  const slug = path.slice("/memorial/".length).replace(/\/$/, "");
  renderMemorialPage(slug);
} else {
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

  const content = document.createElement("div");
  content.className = "memorial-content";

  if (!m) {
    content.innerHTML = `
      <p class="memorial-not-found">This memorial could not be found.</p>
      <a href="/" class="memorial-back">&#8592; Back to Home</a>
    `;
  } else {
    content.innerHTML = `
      <div class="memorial-hero-band">
        <a href="/" class="memorial-back">&#8592; Back to Home</a>
        <div class="memorial-photo-placeholder"></div>
        <h1 class="memorial-name">${m.name}</h1>
        <p class="memorial-dates">${m.born} &ndash; ${m.passed}</p>
        <p class="memorial-epitaph">${m.epitaph}</p>
      </div>

      <section class="memorial-section">
        <h2 class="memorial-section-title">In Memory</h2>
        <p class="memorial-story">A fuller story and remembrance will live here.</p>
      </section>

      <section class="memorial-section">
        <h2 class="memorial-section-title">Photos</h2>
        <div class="memorial-gallery">
          <div class="memorial-gallery-item"></div>
          <div class="memorial-gallery-item"></div>
          <div class="memorial-gallery-item"></div>
          <div class="memorial-gallery-item"></div>
        </div>
      </section>

      <section class="memorial-section">
        <h2 class="memorial-section-title">Light a Candle</h2>
        <div class="memorial-candles">
          <div class="memorial-candle"></div>
          <div class="memorial-candle"></div>
          <div class="memorial-candle"></div>
          <div class="memorial-candle"></div>
        </div>
      </section>

      <section class="memorial-section">
        <h2 class="memorial-section-title">Tributes</h2>
        <div class="memorial-tributes">
          <div class="memorial-tribute">
            <div class="memorial-tribute-author"></div>
            <div class="memorial-tribute-line"></div>
            <div class="memorial-tribute-line memorial-tribute-line--short"></div>
          </div>
          <div class="memorial-tribute">
            <div class="memorial-tribute-author"></div>
            <div class="memorial-tribute-line"></div>
            <div class="memorial-tribute-line memorial-tribute-line--mid"></div>
          </div>
          <div class="memorial-tribute">
            <div class="memorial-tribute-author"></div>
            <div class="memorial-tribute-line"></div>
            <div class="memorial-tribute-line memorial-tribute-line--short"></div>
          </div>
        </div>
      </section>
    `;
  }

  stage.appendChild(content);
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

  const indicator = document.createElement("div");
  indicator.id = "scene-indicator";
  stage.appendChild(indicator);

  function updateIndicator() {
    const sc = scenes[currentIndex];
    indicator.textContent = `${sc.title} · ${currentIndex + 1} / ${scenes.length}`;
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

  function fitScene() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const targetRatio = 16 / 9;
    const viewportRatio = vw / vh;
    let width, height;
    if (viewportRatio > targetRatio) {
      height = vh;
      width = Math.round(vh * targetRatio);
    } else {
      width = vw;
      height = Math.round(vw / targetRatio);
    }
    sceneEl.style.width = width + "px";
    sceneEl.style.height = height + "px";
  }

  function closePreview() {
    if (previewCard) {
      previewCard.remove();
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
    activeSlots(sc).forEach((slot) => {
      const marker = document.createElement("div");
      marker.className = "marker";
      marker.style.left = slot.x + "%";
      marker.style.top = slot.y + "%";
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
      updateIndicator();

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

  window.addEventListener("resize", () => {
    fitScene();
    const nowPortrait = isPortrait();
    if (nowPortrait !== lastPortrait) {
      lastPortrait = nowPortrait;
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
  hero.innerHTML = `
    <h1 id="hero-headline">A peaceful place to remember them</h1>
  `;
  sceneEl.appendChild(hero);

  applyScene(scenes[currentIndex]);
  fitScene();
  renderMarkers(scenes[currentIndex]);
  updateArrows();
  updateIndicator();
}
