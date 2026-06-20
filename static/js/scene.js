(function () {
  // Authored slot positions for the 3 scene types, cycled by page index
  var SLOT_CONFIGS = [
    {
      slots: [
        { x: 13, y: 78, scale: 0.90 },
        { x: 31, y: 83, scale: 1.00 },
        { x: 50, y: 80, scale: 0.95 },
        { x: 69, y: 84, scale: 1.05 },
        { x: 87, y: 79, scale: 0.92 },
      ],
      slotsPortrait: [
        { x: 13, y: 72, scale: 0.90 },
        { x: 31, y: 77, scale: 1.00 },
        { x: 50, y: 74, scale: 0.95 },
        { x: 69, y: 78, scale: 1.05 },
        { x: 87, y: 73, scale: 0.92 },
      ],
    },
    {
      slots: [
        { x: 13, y: 80, scale: 0.88 },
        { x: 31, y: 84, scale: 1.02 },
        { x: 50, y: 81, scale: 0.96 },
        { x: 69, y: 85, scale: 1.04 },
        { x: 87, y: 78, scale: 0.90 },
      ],
      slotsPortrait: [
        { x: 13, y: 74, scale: 0.88 },
        { x: 31, y: 78, scale: 1.02 },
        { x: 50, y: 75, scale: 0.96 },
        { x: 69, y: 79, scale: 1.04 },
        { x: 87, y: 72, scale: 0.90 },
      ],
    },
    {
      slots: [
        { x: 13, y: 77, scale: 0.91 },
        { x: 31, y: 82, scale: 1.00 },
        { x: 50, y: 79, scale: 0.94 },
        { x: 69, y: 83, scale: 1.06 },
        { x: 87, y: 78, scale: 0.93 },
      ],
      slotsPortrait: [
        { x: 13, y: 71, scale: 0.91 },
        { x: 31, y: 76, scale: 1.00 },
        { x: 50, y: 73, scale: 0.94 },
        { x: 69, y: 77, scale: 1.06 },
        { x: 87, y: 72, scale: 0.93 },
      ],
    },
  ];

  var MOBILE_POSITIONS = [
    { x: 50, y: 78 },
    { x: 20, y: 84 },
    { x: 80, y: 84 },
    { x: 33, y: 90 },
    { x: 67, y: 90 },
  ];

  // Build SCENES from server-injected window.SCENE_DATA
  var RAW = window.SCENE_DATA || [];
  var SCENES = RAW.map(function (sd, i) {
    var cfg = SLOT_CONFIGS[i % SLOT_CONFIGS.length];
    return {
      background: sd.background,
      ambientColor: sd.ambientColor,
      slots: sd.memorials.map(function (m, j) {
        var pos = cfg.slots[j] || { x: 50, y: 80, scale: 1.0 };
        return { x: pos.x, y: pos.y, scale: pos.scale, memorial: m };
      }),
      slotsPortrait: sd.memorials.map(function (m, j) {
        var pos = cfg.slotsPortrait[j] || { x: 50, y: 74, scale: 1.0 };
        return { x: pos.x, y: pos.y, scale: pos.scale, memorial: m };
      }),
    };
  });

  if (SCENES.length === 0) {
    SCENES = [{ background: '/static/assets/scenes/meadow-dawn.webp', ambientColor: '#e8d5a8', slots: [], slotsPortrait: [] }];
  }

  document.addEventListener("DOMContentLoaded", function () {
    var stage   = document.getElementById("stage");
    var sceneEl = document.getElementById("scene");
    if (!stage || !sceneEl) return;

    // Read ?scene=N param (1-based) to start on a specific page
    var urlParams = new URLSearchParams(window.location.search);
    var sceneParam = parseInt(urlParams.get('scene'), 10);
    var startIndex = (!isNaN(sceneParam) && sceneParam >= 1 && sceneParam <= SCENES.length)
      ? sceneParam - 1
      : 0;

    var currentIndex   = startIndex;
    var isTransitioning = false;
    var previewCard    = null;
    var markerEls      = [];
    var petalEls       = [];

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

    function updateHero() {
      var heroEl = document.getElementById('hero');
      if (heroEl) heroEl.style.display = currentIndex === 0 ? '' : 'none';
      if (currentIndex === 0) showPetals(); else hidePetals();
      var contentEl = document.getElementById('home-content');
      if (contentEl) contentEl.style.display = currentIndex === 0 ? '' : 'none';
      stage.style.height = currentIndex === 0 ? '88vh' : '100vh';
      fitScene();
    }

    function createPetals() {
      var configs = [
        { size: 9,  ratio: 1.6, top: 22, dur: 22, del: -3,  op: 0.55, r0: 20  , dy: 55 },
        { size: 11, ratio: 1.5, top: 45, dur: 18, del: -9,  op: 0.50, r0: 140 , dy: 80 },
        { size: 8,  ratio: 1.7, top: 35, dur: 25, del: -1,  op: 0.60, r0: 70  , dy: 45 },
        { size: 10, ratio: 1.4, top: 60, dur: 20, del: -14, op: 0.52, r0: 200 , dy: 70 },
        { size: 12, ratio: 1.5, top: 28, dur: 17, del: -7,  op: 0.58, r0: 310 , dy: 60 },
        { size: 9,  ratio: 1.6, top: 52, dur: 23, del: -18, op: 0.48, r0: 95  , dy: 90 },
      ];
      configs.forEach(function (c) {
        var p = document.createElement('div');
        p.className = 'petal';
        p.style.cssText = [
          'width:'  + c.size + 'px',
          'height:' + Math.round(c.size * c.ratio) + 'px',
          'top:'    + c.top + '%',
          'left:-20px',
          '--dur:'  + c.dur + 's',
          '--del:'  + c.del + 's',
          '--op:'   + c.op,
          '--r0:'   + c.r0 + 'deg',
          '--r1:'   + (c.r0 + 260 + Math.floor(Math.random() * 100)) + 'deg',
          '--dy:'   + c.dy + 'px',
        ].join(';');
        sceneEl.appendChild(p);
        petalEls.push(p);
      });
    }

    function showPetals() {
      petalEls.forEach(function (p) { p.style.visibility = 'visible'; });
    }

    function hidePetals() {
      petalEls.forEach(function (p) { p.style.visibility = 'hidden'; });
    }

    function applyScene(sc) {
      stage.style.backgroundColor = sc.ambientColor;
      sceneEl.style.backgroundImage = sc.background ? "url(" + sc.background + ")" : "";
      if (!sc.background) sceneEl.style.background = sc.gradient || "";
      else sceneEl.style.backgroundColor = sc.ambientColor;
    }

    function fitScene() {
      var vw = window.innerWidth;
      var vh = stage.offsetHeight;
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

    function buildCardHTML(m) {
      return (
        '<button class="preview-close" aria-label="Close">&#215;</button>' +
        '<div class="preview-photo">' + (m.photo ? '<img src="' + m.photo + '" alt="' + m.name + '">' : '') + '</div>' +
        '<p class="preview-eyebrow">In Loving Memory of</p>' +
        '<div class="preview-name">' + m.name + '</div>' +
        '<div class="preview-dates">' + m.born + ' &mdash; ' + m.passed + '</div>' +
        '<div class="preview-epitaph">' + m.epitaph + '</div>' +
        (m.owner ? '<div class="preview-owner">Created by ' + m.owner + '</div>' : '') +
        '<a class="preview-enter" href="/memorial/' + m.slug + '/">View Memorial</a>'
      );
    }

    function activateMarker(slot, markerEl) {
      closePreview();
      markerEls.forEach(function (el) {
        el.classList.add(el === markerEl ? "marker--active" : "marker--dimmed");
      });
      var m    = slot.memorial;
      var card = document.createElement("div");
      card.className = "preview-card";
      card.style.left = slot.x + "%";
      card.style.top  = slot.y + "%";
      card.innerHTML = buildCardHTML(m);
      card.querySelector(".preview-close").addEventListener("click", function (e) {
        e.stopPropagation(); closePreview();
      });
      sceneEl.appendChild(card);
      previewCard = card;

      // Clamp card so it never hides behind the fixed nav (54px)
      requestAnimationFrame(function () {
        if (!card.parentNode) return;
        var rect   = card.getBoundingClientRect();
        var minTop = 54 + 12; // nav height + breathing room
        if (rect.top < minTop) {
          var overflow     = minTop - rect.top;
          var currentTopPx = (parseFloat(card.style.top) / 100) * sceneEl.offsetHeight;
          card.style.top   = ((currentTopPx + overflow) / sceneEl.offsetHeight * 100).toFixed(2) + '%';
        }
      });
    }

    function activateMobileMarker(slot, markerEl) {
      closePreview();
      markerEls.forEach(function (el) {
        el.classList.add(el === markerEl ? "marker--active" : "marker--dimmed");
      });
      var m       = slot.memorial;
      var overlay = document.createElement("div");
      overlay.className = "mobile-card-overlay";
      overlay.addEventListener("click", closePreview);
      var card = document.createElement("div");
      card.className = "preview-card preview-card--mobile";
      card.innerHTML = buildCardHTML(m);
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
      img.src = "/static/assets/markers/tombstone.webp";
      img.alt = "";
      img.draggable = false;
      marker.appendChild(img);
      var m = slot.memorial;
      var ov = document.createElement("div");
      ov.className = "marker-overlay";
      ov.innerHTML =
        '<div class="marker-photo">' + (m.photo ? '<img src="' + m.photo + '" alt="Photo of ' + m.name + '">' : "") + '</div>' +
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
        updateArrows(); updateHero();
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
    hero.innerHTML = '<h1 id="hero-headline">A peaceful place to remember them</h1>';
    sceneEl.appendChild(hero);

    createPetals();

    applyScene(SCENES[currentIndex]);
    fitScene();
    renderMarkers(SCENES[currentIndex]);
    updateArrows();
    updateHero();
  });
})();
