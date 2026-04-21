const scene = {
  id: "meadow-dawn",
  title: "Morning Meadow",
  background: null,
  ambientColor: "#c9b99a",
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

applyScene();
fitScene();

window.addEventListener("resize", fitScene);
