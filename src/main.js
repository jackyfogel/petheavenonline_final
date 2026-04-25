const scenes = [
  {
    id: "meadow-dawn",
    title: "Morning Meadow",
    ambientColor: "#c9b99a",
    gradient: "linear-gradient(to bottom, #b8cfe8 0%, #d4c5a0 55%, #8a7d5a 100%)",
    slots: [
      { id: "slot-1", x: 18, y: 74, scale: 0.90, memorial: { name: "Buddy",   born: "2010", passed: "2023", epitaph: "Loyal beyond measure."              } },
      { id: "slot-2", x: 34, y: 79, scale: 1.00, memorial: { name: "Luna",    born: "2015", passed: "2024", epitaph: "She filled every room with light."   } },
      { id: "slot-3", x: 50, y: 76, scale: 0.95, memorial: { name: "Oscar",   born: "2008", passed: "2022", epitaph: "A gentleman until the very end."     } },
      { id: "slot-4", x: 66, y: 80, scale: 1.05, memorial: { name: "Daisy",   born: "2012", passed: "2023", epitaph: "Forever chasing sunbeams."           } },
      { id: "slot-5", x: 82, y: 75, scale: 0.92, memorial: { name: "Milo",    born: "2017", passed: "2025", epitaph: "Small paws, enormous heart."         } },
    ],
    slotsPortrait: [
      { id: "slot-1", x: 18, y: 68, scale: 0.90, memorial: { name: "Buddy",   born: "2010", passed: "2023", epitaph: "Loyal beyond measure."              } },
      { id: "slot-2", x: 34, y: 73, scale: 1.00, memorial: { name: "Luna",    born: "2015", passed: "2024", epitaph: "She filled every room with light."   } },
      { id: "slot-3", x: 50, y: 70, scale: 0.95, memorial: { name: "Oscar",   born: "2008", passed: "2022", epitaph: "A gentleman until the very end."     } },
      { id: "slot-4", x: 66, y: 74, scale: 1.05, memorial: { name: "Daisy",   born: "2012", passed: "2023", epitaph: "Forever chasing sunbeams."           } },
      { id: "slot-5", x: 82, y: 69, scale: 0.92, memorial: { name: "Milo",    born: "2017", passed: "2025", epitaph: "Small paws, enormous heart."         } },
    ],
  },
  {
    id: "quiet-forest",
    title: "Quiet Forest",
    ambientColor: "#4a5e43",
    gradient: "linear-gradient(to bottom, #2d4a2a 0%, #4a6e42 40%, #3a5230 70%, #2a3a22 100%)",
    slots: [
      { id: "slot-1", x: 15, y: 76, scale: 0.88, memorial: { name: "Shadow",  born: "2011", passed: "2022", epitaph: "He walked quietly beside us."        } },
      { id: "slot-2", x: 30, y: 80, scale: 1.02, memorial: { name: "Maple",   born: "2013", passed: "2024", epitaph: "Gentle and curious always."          } },
      { id: "slot-3", x: 50, y: 77, scale: 0.96, memorial: { name: "Bear",    born: "2009", passed: "2021", epitaph: "Brave, warm, and true."              } },
      { id: "slot-4", x: 68, y: 81, scale: 1.04, memorial: { name: "Willow",  born: "2016", passed: "2025", epitaph: "She taught us how to rest."          } },
      { id: "slot-5", x: 84, y: 74, scale: 0.90, memorial: { name: "Chester", born: "2007", passed: "2020", epitaph: "Steadfast to the last."              } },
    ],
    slotsPortrait: [
      { id: "slot-1", x: 15, y: 70, scale: 0.88, memorial: { name: "Shadow",  born: "2011", passed: "2022", epitaph: "He walked quietly beside us."        } },
      { id: "slot-2", x: 30, y: 74, scale: 1.02, memorial: { name: "Maple",   born: "2013", passed: "2024", epitaph: "Gentle and curious always."          } },
      { id: "slot-3", x: 50, y: 71, scale: 0.96, memorial: { name: "Bear",    born: "2009", passed: "2021", epitaph: "Brave, warm, and true."              } },
      { id: "slot-4", x: 68, y: 75, scale: 1.04, memorial: { name: "Willow",  born: "2016", passed: "2025", epitaph: "She taught us how to rest."          } },
      { id: "slot-5", x: 84, y: 68, scale: 0.90, memorial: { name: "Chester", born: "2007", passed: "2020", epitaph: "Steadfast to the last."              } },
    ],
  },
  {
    id: "evening-shore",
    title: "Evening Shore",
    ambientColor: "#9a8878",
    gradient: "linear-gradient(to bottom, #d4a89a 0%, #c8b89a 45%, #9a8878 70%, #7a6858 100%)",
    slots: [
      { id: "slot-1", x: 20, y: 73, scale: 0.91, memorial: { name: "Pearl",   born: "2014", passed: "2024", epitaph: "She shone in every quiet moment."    } },
      { id: "slot-2", x: 36, y: 78, scale: 1.00, memorial: { name: "Sandy",   born: "2012", passed: "2023", epitaph: "Always running toward the waves."    } },
      { id: "slot-3", x: 52, y: 75, scale: 0.94, memorial: { name: "Finn",    born: "2010", passed: "2022", epitaph: "Free and joyful every single day."   } },
      { id: "slot-4", x: 67, y: 79, scale: 1.06, memorial: { name: "Coral",   born: "2018", passed: "2025", epitaph: "Too bright, too brief."              } },
      { id: "slot-5", x: 83, y: 74, scale: 0.93, memorial: { name: "Duke",    born: "2006", passed: "2019", epitaph: "A long life, well and fully lived."   } },
    ],
    slotsPortrait: [
      { id: "slot-1", x: 20, y: 67, scale: 0.91, memorial: { name: "Pearl",   born: "2014", passed: "2024", epitaph: "She shone in every quiet moment."    } },
      { id: "slot-2", x: 36, y: 72, scale: 1.00, memorial: { name: "Sandy",   born: "2012", passed: "2023", epitaph: "Always running toward the waves."    } },
      { id: "slot-3", x: 52, y: 69, scale: 0.94, memorial: { name: "Finn",    born: "2010", passed: "2022", epitaph: "Free and joyful every single day."   } },
      { id: "slot-4", x: 67, y: 73, scale: 1.06, memorial: { name: "Coral",   born: "2018", passed: "2025", epitaph: "Too bright, too brief."              } },
      { id: "slot-5", x: 83, y: 68, scale: 0.93, memorial: { name: "Duke",    born: "2006", passed: "2019", epitaph: "A long life, well and fully lived."   } },
    ],
  },
];

let currentIndex = 0;
let isTransitioning = false;

const stage = document.getElementById("stage");
const sceneEl = document.getElementById("scene");

let previewCard = null;
let markerEls = [];

// --- Orientation helper ---

function isPortrait() {
  return window.innerHeight > window.innerWidth;
}

// --- Nav arrows ---

const prevBtn = document.createElement("button");
prevBtn.id = "nav-prev";
prevBtn.setAttribute("aria-label", "Previous scene");
prevBtn.innerHTML = "&#8249;";
stage.appendChild(prevBtn);

const nextBtn = document.createElement("button");
nextBtn.id = "nav-next";
nextBtn.setAttribute("aria-label", "Next scene");
nextBtn.innerHTML = "&#8250;";
stage.appendChild(nextBtn);

function updateArrows() {
  prevBtn.classList.toggle("nav--muted", currentIndex === 0);
  nextBtn.classList.toggle("nav--muted", currentIndex === scenes.length - 1);
}

// --- Scene rendering ---

function applyScene(sc) {
  stage.style.backgroundColor = sc.ambientColor;
  sceneEl.style.background = sc.gradient;
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

  const m = slot.memorial;
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
    <button class="preview-enter">Enter Memorial</button>
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
    marker.style.setProperty("--base-opacity", slot.scale * 0.83);
    marker.addEventListener("click", (e) => {
      e.stopPropagation();
      activateMarker(slot, marker);
    });
    sceneEl.appendChild(marker);
    markerEls.push(marker);
  });
}

// --- Navigation ---

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

// --- Keyboard ---

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") goToScene(currentIndex + 1, "next");
  if (e.key === "ArrowLeft")  goToScene(currentIndex - 1, "prev");
});

// --- Touch swipe ---

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

// --- Close preview on background click ---

sceneEl.addEventListener("click", (e) => {
  if (e.target.closest(".preview-card")) return;
  closePreview();
});

// --- Resize: re-render markers only on orientation change ---

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

// --- Init ---

const vignette = document.createElement("div");
vignette.id = "vignette";
sceneEl.appendChild(vignette);

applyScene(scenes[currentIndex]);
fitScene();
renderMarkers(scenes[currentIndex]);
updateArrows();
