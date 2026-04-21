const scene = {
  id: "meadow-dawn",
  title: "Morning Meadow",
  background: null,
  ambientColor: "#c9b99a",
  slots: [
    { id: "slot-1", x: 18, y: 74, scale: 0.90, memorial: { name: "Buddy",  born: "2010", passed: "2023", epitaph: "Loyal beyond measure."               } },
    { id: "slot-2", x: 34, y: 79, scale: 1.00, memorial: { name: "Luna",   born: "2015", passed: "2024", epitaph: "She filled every room with light."    } },
    { id: "slot-3", x: 50, y: 76, scale: 0.95, memorial: { name: "Oscar",  born: "2008", passed: "2022", epitaph: "A gentleman until the very end."      } },
    { id: "slot-4", x: 66, y: 80, scale: 1.05, memorial: { name: "Daisy",  born: "2012", passed: "2023", epitaph: "Forever chasing sunbeams."            } },
    { id: "slot-5", x: 82, y: 75, scale: 0.92, memorial: { name: "Milo",   born: "2017", passed: "2025", epitaph: "Small paws, enormous heart."          } },
  ],
};

const stage = document.getElementById("stage");
const sceneEl = document.getElementById("scene");

let previewCard = null;
const markerEls = [];

function applyScene() {
  stage.style.backgroundColor = scene.ambientColor;

  if (scene.background) {
    sceneEl.style.backgroundImage = `url(${scene.background})`;
  } else {
    sceneEl.style.background =
      "linear-gradient(to bottom, #b8cfe8 0%, #d4c5a0 55%, #8a7d5a 100%)";
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

function renderMarkers() {
  scene.slots.forEach((slot) => {
    const marker = document.createElement("div");
    marker.className = "marker";
    marker.style.left = slot.x + "%";
    marker.style.top = slot.y + "%";
    marker.style.setProperty("--base-scale", slot.scale);

    marker.addEventListener("click", (e) => {
      e.stopPropagation();
      activateMarker(slot, marker);
    });

    sceneEl.appendChild(marker);
    markerEls.push(marker);
  });
}

sceneEl.addEventListener("click", (e) => {
  if (e.target.closest(".preview-card")) return;
  closePreview();
});

applyScene();
fitScene();
renderMarkers();

window.addEventListener("resize", fitScene);
