const scene = {
  id: "meadow-dawn",
  title: "Morning Meadow",
  background: null,
  ambientColor: "#c9b99a",
  slots: [
    { id: "slot-1", x: 18, y: 74, scale: 0.90 },
    { id: "slot-2", x: 34, y: 79, scale: 1.00 },
    { id: "slot-3", x: 50, y: 76, scale: 0.95 },
    { id: "slot-4", x: 66, y: 80, scale: 1.05 },
    { id: "slot-5", x: 82, y: 75, scale: 0.92 },
  ],
};

const stage = document.getElementById("stage");
const sceneEl = document.getElementById("scene");

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

function renderMarkers() {
  scene.slots.forEach((slot) => {
    const marker = document.createElement("div");
    marker.className = "marker";
    marker.style.left = slot.x + "%";
    marker.style.top = slot.y + "%";
    marker.style.transform = `translate(-50%, -100%) scale(${slot.scale})`;
    sceneEl.appendChild(marker);
  });
}

applyScene();
fitScene();
renderMarkers();

window.addEventListener("resize", fitScene);
