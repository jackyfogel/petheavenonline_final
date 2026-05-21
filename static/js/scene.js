(function () {
  var SCENES = [
    {
      id: "meadow-dawn",
      ambientColor: "#e8d5a8",
      background: "/assets/scenes/meadow-dawn.webp",
      slots: [
        { x: 13, y: 78, scale: 0.90, memorialId: "mem-buddy"   },
        { x: 31, y: 83, scale: 1.00, memorialId: "mem-luna"    },
        { x: 50, y: 80, scale: 0.95, memorialId: "mem-oscar"   },
        { x: 69, y: 84, scale: 1.05, memorialId: "mem-daisy"   },
        { x: 87, y: 79, scale: 0.92, memorialId: "mem-milo"    },
      ],
      slotsPortrait: [
        { x: 13, y: 72, scale: 0.90, memorialId: "mem-buddy"   },
        { x: 31, y: 77, scale: 1.00, memorialId: "mem-luna"    },
        { x: 50, y: 74, scale: 0.95, memorialId: "mem-oscar"   },
        { x: 69, y: 78, scale: 1.05, memorialId: "mem-daisy"   },
        { x: 87, y: 73, scale: 0.92, memorialId: "mem-milo"    },
      ],
    },
    {
      id: "sunset-lake",
      ambientColor: "#e8b078",
      background: "/assets/scenes/sunset-lake.webp",
      slots: [
        { x: 13, y: 80, scale: 0.88, memorialId: "mem-shadow"  },
        { x: 31, y: 84, scale: 1.02, memorialId: "mem-maple"   },
        { x: 50, y: 81, scale: 0.96, memorialId: "mem-bear"    },
        { x: 69, y: 85, scale: 1.04, memorialId: "mem-willow"  },
        { x: 87, y: 78, scale: 0.90, memorialId: "mem-chester" },
      ],
      slotsPortrait: [
        { x: 13, y: 74, scale: 0.88, memorialId: "mem-shadow"  },
        { x: 31, y: 78, scale: 1.02, memorialId: "mem-maple"   },
        { x: 50, y: 75, scale: 0.96, memorialId: "mem-bear"    },
        { x: 69, y: 79, scale: 1.04, memorialId: "mem-willow"  },
        { x: 87, y: 72, scale: 0.90, memorialId: "mem-chester" },
      ],
    },
    {
      id: "twilight-garden",
      ambientColor: "#b8a5d4",
      background: "/assets/scenes/twilight-garden.webp",
      slots: [
        { x: 13, y: 77, scale: 0.91, memorialId: "mem-pearl"   },
        { x: 31, y: 82, scale: 1.00, memorialId: "mem-sandy"   },
        { x: 50, y: 79, scale: 0.94, memorialId: "mem-finn"    },
        { x: 69, y: 83, scale: 1.06, memorialId: "mem-coral"   },
        { x: 87, y: 78, scale: 0.93, memorialId: "mem-duke"    },
      ],
      slotsPortrait: [
        { x: 13, y: 71, scale: 0.91, memorialId: "mem-pearl"   },
        { x: 31, y: 76, scale: 1.00, memorialId: "mem-sandy"   },
        { x: 50, y: 73, scale: 0.94, memorialId: "mem-finn"    },
        { x: 69, y: 77, scale: 1.06, memorialId: "mem-coral"   },
        { x: 87, y: 72, scale: 0.93, memorialId: "mem-duke"    },
      ],
    },
  ];

  var MEMORIALS = {
    "mem-buddy":   { slug: "buddy",   name: "Buddy",   born: "2010", passed: "2023", epitaph: "Loyal beyond measure.",              photo: "/assets/memorials/mem-buddy.webp"   },
    "mem-luna":    { slug: "luna",    name: "Luna",    born: "2015", passed: "2024", epitaph: "She filled every room with light.",   photo: "/assets/memorials/mem-luna.webp"    },
    "mem-oscar":   { slug: "oscar",   name: "Oscar",   born: "2008", passed: "2022", epitaph: "A gentleman until the very end.",     photo: "/assets/memorials/mem-oscar.webp"   },
    "mem-daisy":   { slug: "daisy",   name: "Daisy",   born: "2012", passed: "2023", epitaph: "Forever chasing sunbeams.",           photo: "/assets/memorials/mem-daisy.webp"   },
    "mem-milo":    { slug: "milo",    name: "Milo",    born: "2017", passed: "2025", epitaph: "Small paws, enormous heart.",         photo: "/assets/memorials/mem-milo.webp"    },
    "mem-shadow":  { slug: "shadow",  name: "Shadow",  born: "2011", passed: "2022", epitaph: "He walked quietly beside us.",        photo: null },
    "mem-maple":   { slug: "maple",   name: "Maple",   born: "2013", passed: "2024", epitaph: "Gentle and curious always.",          photo: null },
    "mem-bear":    { slug: "bear",    name: "Bear",    born: "2009", passed: "2021", epitaph: "Brave, warm, and true.",              photo: null },
    "mem-willow":  { slug: "willow",  name: "Willow",  born: "2016", passed: "2025", epitaph: "She taught us how to rest.",          photo: null },
    "mem-chester": { slug: "chester", name: "Chester", born: "2007", passed: "2020", epitaph: "Steadfast to the last.",              photo: null },
    "mem-pearl":   { slug: "pearl",   name: "Pearl",   born: "2014", passed: "2024", epitaph: "She shone in every quiet moment.",    photo: null },
    "mem-sandy":   { slug: "sandy",   name: "Sandy",   born: "2012", passed: "2023", epitaph: "Always running toward the waves.",    photo: null },
    "mem-finn":    { slug: "finn",    name: "Finn",    born: "2010", passed: "2022", epitaph: "Free and joyful every single day.",   photo: null },
    "mem-coral":   { slug: "coral",   name: "Coral",   born: "2018", passed: "2025", epitaph: "Too bright, too brief.",              photo: null },
    "mem-duke":    { slug: "duke",    name: "Duke",    born: "2006", passed: "2019", epitaph: "A long life, well and fully lived.",  photo: null },
  };

  var MOBILE_POSITIONS = [
    { x: 50, y: 78 },
    { x: 20, y: 84 },
    { x: 80, y: 84 },
    { x: 33, y: 90 },
    { x: 67, y: 90 },
  ];

  document.addEventListener("DOMContentLoaded", function () {
    var stage   = document.getElementById("stage");
    var sceneEl = document.getElementById("scene");
    if (!stage || !sceneEl) return;

    var currentIndex   = 0;
    var isTransitioning = false;
    var previewCard    = null;
    var markerEls      = [];

    function isPortrait() { return window.innerHeight > window.innerWidth; }
    function isMobile()   { return window.innerWidth < 768; }

    // Nav arrows
    var prevBtn = document.createElement("button");
    prevBtn.id = "nav-prev";
    prevBtn.setAttribute("aria-label", "Previous scene");
    prevBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
    stage.appendChild(prevBtn);

    var nextBtn = document.createElement("button");
    nextBtn.id = "nav-next";
    nextBtn.setAttribute("aria-label", "Next scene");
    nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
    stage.appendChild(nextBtn);

    function updateArrows() {
      prevBtn.classList.toggle("nav--muted", currentIndex === 0);
      nextBtn.classList.toggle("nav--muted", currentIndex === SCENES.length - 1);
    }

    function applyScene(sc) {
      stage.style.backgroundColor = sc.ambientColor;
      sceneEl.style.backgroundImage = sc.background ? "url(" + sc.background + ")" : "";
      if (!sc.background) sceneEl.style.background = sc.gradient || "";
      else sceneEl.style.backgroundColor = sc.ambientColor;
    }

    function fitScene() {
      var vw = window.innerWidth;
      var vh = window.innerHeight;
      if (isMobile()) {
        sceneEl.style.position = "absolute";
        sceneEl.style.top      = "54px";
        sceneEl.style.left     = "0";
        sceneEl.style.right    = "0";
        sceneEl.style.bottom   = "0";
        sceneEl.style.width    = "";
        sceneEl.style.height   = "";
        return;
      }
      sceneEl.style.position = "";
      sceneEl.style.top = sceneEl.style.left = sceneEl.style.right = sceneEl.style.bottom = "";
      var targetRatio   = 16 / 9;
      var viewportRatio = vw / vh;
      var width, height;
      if (viewportRatio > targetRatio) {
        height = vh; width = Math.round(vh * targetRatio);
      } else {
        width = vw; height = Math.round(vw / targetRatio);
      }
      sceneEl.style.width  = width  + "px";
      sceneEl.style.height = height + "px";
    }

    function closePreview() {
      if (previewCard) {
        var overlay = previewCard.closest(".mobile-card-overlay");
        if (overlay) overlay.remove(); else previewCard.remove();
        previewCard = null;
      }
      markerEls.forEach(function (el) { el.classList.remove("marker--active", "marker--dimmed"); });
    }

    function activateMarker(slot, markerEl) {
      closePreview();
      markerEls.forEach(function (el) {
        el.classList.add(el === markerEl ? "marker--active" : "marker--dimmed");
      });
      var m    = MEMORIALS[slot.memorialId];
      var card = document.createElement("div");
      card.className = "preview-card";
      card.style.left = slot.x + "%";
      card.style.top  = slot.y + "%";
      card.innerHTML =
        '<button class="preview-close" aria-label="Close">&#215;</button>' +
        '<div class="preview-photo"></div>' +
        '<div class="preview-name">'   + m.name    + '</div>' +
        '<div class="preview-dates">'  + m.born + ' &ndash; ' + m.passed + '</div>' +
        '<div class="preview-epitaph">' + m.epitaph + '</div>' +
        '<a class="preview-enter" href="/memorial/' + m.slug + '/">Enter Memorial</a>';
      card.querySelector(".preview-close").addEventListener("click", function (e) {
        e.stopPropagation(); closePreview();
      });
      sceneEl.appendChild(card);
      previewCard = card;
    }

    function activateMobileMarker(slot, markerEl) {
      closePreview();
      markerEls.forEach(function (el) {
        el.classList.add(el === markerEl ? "marker--active" : "marker--dimmed");
      });
      var m       = MEMORIALS[slot.memorialId];
      var overlay = document.createElement("div");
      overlay.className = "mobile-card-overlay";
      overlay.addEventListener("click", closePreview);
      var card = document.createElement("div");
      card.className = "preview-card preview-card--mobile";
      card.innerHTML =
        '<button class="preview-close" aria-label="Close">&#215;</button>' +
        '<div class="preview-photo"></div>' +
        '<div class="preview-name">'   + m.name    + '</div>' +
        '<div class="preview-dates">'  + m.born + ' &ndash; ' + m.passed + '</div>' +
        '<div class="preview-epitaph">' + m.epitaph + '</div>' +
        '<a class="preview-enter" href="/memorial/' + m.slug + '/">Enter Memorial</a>';
      card.querySelector(".preview-close").addEventListener("click", function (e) {
        e.stopPropagation(); closePreview();
      });
      card.addEventListener("click", function (e) { e.stopPropagation(); });
      overlay.appendChild(card);
      document.body.appendChild(overlay);
      previewCard = card;
    }

    function clearMarkers() {
      markerEls.forEach(function (el) { el.remove(); });
      markerEls = [];
    }

    function activeSlots(sc) {
      return (isPortrait() && sc.slotsPortrait) ? sc.slotsPortrait : sc.slots;
    }

    function buildMarker(x, y, scale, slot, clickFn) {
      var marker = document.createElement("div");
      marker.className = "marker";
      marker.style.left = x + "%";
      marker.style.top  = y + "%";
      marker.style.setProperty("--base-scale", scale);
      var img = document.createElement("img");
      img.src = "/assets/markers/tombstone.webp";
      img.alt = "";
      img.draggable = false;
      marker.appendChild(img);
      var m = MEMORIALS[slot.memorialId];
      var ov = document.createElement("div");
      ov.className = "marker-overlay";
      ov.innerHTML =
        '<div class="marker-photo">' + (m.photo ? '<img src="' + m.photo + '" alt="' + m.name + '">' : "") + '</div>' +
        '<div class="marker-name">'  + m.name + '</div>' +
        '<div class="marker-dates">' + m.born + "–" + m.passed + '</div>';
      marker.appendChild(ov);
      marker.addEventListener("click", function (e) { e.stopPropagation(); clickFn(slot, marker); });
      sceneEl.appendChild(marker);
      markerEls.push(marker);
    }

    function renderMarkers(sc) {
      if (isMobile()) {
        sc.slots.forEach(function (slot, i) {
          var pos = MOBILE_POSITIONS[i] || { x: 50, y: 55 };
          buildMarker(pos.x, pos.y, 1, slot, activateMobileMarker);
        });
      } else {
        activeSlots(sc).forEach(function (slot) {
          buildMarker(slot.x, slot.y, slot.scale, slot, activateMarker);
        });
      }
    }

    function goToScene(index, direction) {
      if (isTransitioning) return;
      if (index < 0 || index >= SCENES.length) return;
      isTransitioning = true;
      closePreview();
      var exitClass  = direction === "next" ? "scene--exit-left"        : "scene--exit-right";
      var enterClass = direction === "next" ? "scene--enter-from-right" : "scene--enter-from-left";
      sceneEl.classList.add(exitClass);
      setTimeout(function () {
        sceneEl.classList.remove(exitClass);
        sceneEl.style.opacity = "0";
        clearMarkers();
        currentIndex = index;
        applyScene(SCENES[currentIndex]);
        renderMarkers(SCENES[currentIndex]);
        updateArrows();
        void sceneEl.offsetWidth;
        sceneEl.style.opacity = "";
        sceneEl.classList.add(enterClass);
        setTimeout(function () {
          sceneEl.classList.remove(enterClass);
          isTransitioning = false;
        }, 310);
      }, 290);
    }

    prevBtn.addEventListener("click", function () { goToScene(currentIndex - 1, "prev"); });
    nextBtn.addEventListener("click", function () { goToScene(currentIndex + 1, "next"); });

    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") goToScene(currentIndex + 1, "next");
      if (e.key === "ArrowLeft")  goToScene(currentIndex - 1, "prev");
    });

    var touchStartX = 0;
    sceneEl.addEventListener("touchstart", function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    sceneEl.addEventListener("touchend", function (e) {
      var delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) < 50) return;
      if (delta < 0) goToScene(currentIndex + 1, "next");
      else           goToScene(currentIndex - 1, "prev");
    });

    sceneEl.addEventListener("click", function (e) {
      if (e.target.closest(".preview-card")) return;
      closePreview();
    });

    var lastPortrait = isPortrait();
    var lastMobile   = isMobile();
    window.addEventListener("resize", function () {
      fitScene();
      var nowPortrait = isPortrait();
      var nowMobile   = isMobile();
      if (nowPortrait !== lastPortrait || nowMobile !== lastMobile) {
        lastPortrait = nowPortrait;
        lastMobile   = nowMobile;
        closePreview();
        clearMarkers();
        renderMarkers(SCENES[currentIndex]);
      }
    });

    // Hero text
    var vignette = document.createElement("div");
    vignette.id = "vignette";
    sceneEl.appendChild(vignette);

    var hero = document.createElement("div");
    hero.id = "hero";
    var pawSVG  = '<svg class="hero-icon hero-icon--paw" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true"><ellipse cx="50" cy="75" rx="24" ry="19"/><ellipse cx="20" cy="46" rx="12" ry="14" transform="rotate(-12 20 46)"/><ellipse cx="39" cy="34" rx="12" ry="14"/><ellipse cx="61" cy="34" rx="12" ry="14"/><ellipse cx="80" cy="46" rx="12" ry="14" transform="rotate(12 80 46)"/></svg>';
    var heartSVG = '<svg class="hero-icon hero-icon--heart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
    hero.innerHTML = '<h1 id="hero-headline">' + pawSVG + 'A peaceful place to remember them' + pawSVG + heartSVG + '</h1>';
    sceneEl.appendChild(hero);

    applyScene(SCENES[currentIndex]);
    fitScene();
    renderMarkers(SCENES[currentIndex]);
    updateArrows();
  });
})();
