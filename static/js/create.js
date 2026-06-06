(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var container = document.getElementById("create-stage");
    if (!container) return;
    initCreate(container);
  });

  function initCreate(container) {
    var currentStep = 1;
    var TOTAL = 5;

    var fd = {
      pet_name: "", species: "", breed: "",
      birth_date: "", passing_date: "",
      photo: null, photoUrl: null,
      epitaph: "", story: "",
      traits: [],
      timeline: [{ date: "", description: "" }, { date: "", description: "" }],
      gallery: [], galleryFiles: [],
      owner_name: "",
    };

    var page = document.createElement("div");
    page.className = "create-page";
    page.innerHTML =
      '<div class="create-inner">' +
        '<div class="create-header">' +
          '<a href="/" class="mem-back-link">← Back to garden</a>' +
          '<h1 class="create-title">Create a Memorial</h1>' +
          '<p class="create-subtitle">A beautiful, lasting tribute for your beloved pet</p>' +
        '</div>' +
        '<nav class="create-progress" id="create-progress" aria-label="Form progress"></nav>' +
        '<div id="create-body"></div>' +
      '</div>';
    container.appendChild(page);

    function renderProgress() {
      var labels = ["Pet Info", "Story", "Traits", "Gallery", "Preview"];
      document.getElementById("create-progress").innerHTML =
        labels.map(function (lbl, i) {
          var n = i + 1;
          var cls = n < currentStep ? "step-done" : n === currentStep ? "step-active" : "step-future";
          var circle = n < currentStep ? "✓" : n;
          return (i > 0 ? '<div class="pip-connector"></div>' : "") +
            '<div class="create-step-pip ' + cls + '">' +
              '<div class="pip-circle">' + circle + '</div>' +
              '<span class="pip-label">' + lbl + '</span>' +
            '</div>';
        }).join("");
    }

    function renderStep() {
      var body = document.getElementById("create-body");
      body.innerHTML = "";
      var content = document.createElement("div");
      content.className = "create-step-content";
      var builders = [null, step1, step2, step3, step4, step5];
      content.innerHTML = builders[currentStep]();
      var nav = document.createElement("div");
      nav.className = "create-nav";
      nav.innerHTML =
        (currentStep > 1
          ? '<button type="button" class="create-btn create-btn--ghost" id="btn-back">← Back</button>'
          : '<div></div>') +
        '<button type="button" class="create-btn create-btn--primary" id="btn-next">' +
          (currentStep === TOTAL ? "Create Memorial" : "Next →") +
        '</button>';
      body.appendChild(content);
      body.appendChild(nav);
      requestAnimationFrame(function () { content.classList.add("step-visible"); });
      attachListeners();
    }

    var speciesOptions = ["", "Dog", "Cat", "Bird", "Rabbit", "Hamster", "Fish", "Reptile", "Horse", "Other"];

    function step1() {
      return '<h2 class="create-step-title">Step 1 — Pet Info &amp; Photo</h2>' +
        '<div class="create-field-group">' +
          '<label class="create-label" for="f-pet_name">Pet name <span class="req">*</span></label>' +
          '<input class="create-input" id="f-pet_name" name="pet_name" type="text" value="' + esc(fd.pet_name) + '" placeholder="e.g. Buddy">' +
        '</div>' +
        '<div class="create-field-row">' +
          '<div class="create-field-group">' +
            '<label class="create-label" for="f-species">Species <span class="req">*</span></label>' +
            '<select class="create-input" id="f-species" name="species">' +
              speciesOptions.map(function (s) { return '<option value="' + s + '"' + (fd.species === s ? " selected" : "") + '>' + (s || "Select species…") + '</option>'; }).join("") +
            '</select>' +
          '</div>' +
          '<div class="create-field-group">' +
            '<label class="create-label" for="f-breed">Breed <span class="opt">(optional)</span></label>' +
            '<input class="create-input" id="f-breed" name="breed" type="text" value="' + esc(fd.breed) + '" placeholder="e.g. Golden Retriever">' +
          '</div>' +
        '</div>' +
        '<div class="create-field-row">' +
          '<div class="create-field-group">' +
            '<label class="create-label" for="f-birth_date">Date of birth <span class="opt">(optional)</span></label>' +
            '<input class="create-input" id="f-birth_date" name="birth_date" type="date" value="' + fd.birth_date + '">' +
          '</div>' +
          '<div class="create-field-group">' +
            '<label class="create-label" for="f-passing_date">Date of passing <span class="req">*</span></label>' +
            '<input class="create-input" id="f-passing_date" name="passing_date" type="date" value="' + fd.passing_date + '">' +
          '</div>' +
        '</div>' +
        '<div class="create-field-group">' +
          '<label class="create-label">Memorial photo <span class="req">*</span></label>' +
          '<div class="create-dropzone" id="dz-photo">' +
            '<div class="dropzone-placeholder" id="dz-photo-placeholder"' + (fd.photoUrl ? ' style="display:none"' : "") + '>' +
              '<svg class="dz-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>' +
              '<p>Drag &amp; drop or <span class="dz-link">browse</span></p>' +
              '<p class="dz-hint">JPG, PNG or WEBP</p>' +
            '</div>' +
            '<img class="dropzone-preview" id="dz-photo-img" src="' + (fd.photoUrl || "") + '" alt="Photo preview" style="' + (fd.photoUrl ? "" : "display:none") + '">' +
            '<input type="file" class="dropzone-input" id="f-photo" name="photo" accept="image/*">' +
          '</div>' +
          '<p class="create-hint" style="margin-top:6px" id="photo-hint">A photo of your pet is required to create a memorial.</p>' +
        '</div>';
    }

    function step2() {
      var rem = 100 - fd.epitaph.length;
      return '<h2 class="create-step-title">Step 2 — Epitaph &amp; Story</h2>' +
        '<div class="create-field-group">' +
          '<label class="create-label" for="f-epitaph">Epitaph <span class="req">*</span></label>' +
          '<p class="create-hint">A short phrase that appears on the tombstone. Keep it personal.</p>' +
          '<input class="create-input" id="f-epitaph" name="epitaph" type="text" maxlength="100" value="' + esc(fd.epitaph) + '" placeholder="e.g. Loyal beyond measure.">' +
          '<div class="epitaph-counter' + (rem < 20 ? " counter-warn" : "") + '" id="epi-counter">' + rem + ' characters remaining</div>' +
        '</div>' +
        '<div class="create-field-group">' +
          '<label class="create-label" for="f-story">Pet story <span class="opt">(optional)</span></label>' +
          '<p class="create-hint">Tell the world about your pet — their personality, favourite moments, what made them unique.</p>' +
          '<textarea class="create-input create-textarea" id="f-story" name="story" placeholder="Write about your pet here…">' + esc(fd.story) + '</textarea>' +
        '</div>';
    }

    function step3() {
      var tagHTML = fd.traits.map(function (t) {
        return '<span class="trait-tag">' + esc(t) + '<button type="button" class="trait-remove" data-trait="' + esc(t) + '" aria-label="Remove ' + esc(t) + '">\xd7</button></span>';
      }).join("");
      var rowsHTML = fd.timeline.map(function (item, i) { return timelineRowHTML(item, i); }).join("");
      return '<h2 class="create-step-title">Step 3 — Traits &amp; Timeline</h2>' +
        '<div class="create-field-group">' +
          '<label class="create-label">Personality traits <span class="opt">(optional)</span></label>' +
          '<p class="create-hint">Type a trait and press Enter to add it.</p>' +
          '<div class="trait-input-wrap" id="trait-wrap">' +
            '<div class="trait-tags" id="trait-tags">' + tagHTML + '</div>' +
            '<input class="trait-input" id="trait-input" type="text" placeholder="e.g. Playful, Gentle, Loved swimming…">' +
          '</div>' +
        '</div>' +
        '<div class="create-field-group">' +
          '<label class="create-label">Life milestones <span class="opt">(optional)</span></label>' +
          '<p class="create-hint">Add key moments from your pet\'s life.</p>' +
          '<div class="timeline-rows" id="timeline-rows">' + rowsHTML + '</div>' +
          '<button type="button" class="create-btn create-btn--ghost create-btn--sm" id="add-milestone">+ Add milestone</button>' +
        '</div>';
    }

    function timelineRowHTML(item, i) {
      return '<div class="timeline-row" data-index="' + i + '">' +
        '<input class="create-input timeline-date" type="date" value="' + item.date + '" data-field="date" data-index="' + i + '">' +
        '<input class="create-input timeline-desc" type="text" placeholder="e.g. Born into the world" value="' + esc(item.description) + '" data-field="description" data-index="' + i + '">' +
        '<button type="button" class="timeline-remove" data-index="' + i + '" aria-label="Remove milestone">\xd7</button>' +
      '</div>';
    }

    function step4() {
      var thumbsHTML = fd.gallery.length
        ? fd.gallery.map(function (url) { return '<div class="gallery-thumb" style="background-image:url(' + url + ')"></div>'; }).join("")
        : Array.from({ length: 4 }, function () { return '<div class="gallery-thumb gallery-thumb--empty"></div>'; }).join("");
      return '<h2 class="create-step-title">Step 4 — Gallery</h2>' +
        '<p class="create-hint" style="margin-bottom:24px">Add photos of your pet\'s favourite moments.</p>' +
        '<div class="create-field-group">' +
          '<div class="create-dropzone create-dropzone--gallery" id="dz-gallery">' +
            '<div class="dropzone-placeholder">' +
              '<svg class="dz-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' +
              '<p>Drag &amp; drop or <span class="dz-link">browse</span></p>' +
              '<p class="dz-hint">Select multiple photos</p>' +
            '</div>' +
            '<input type="file" class="dropzone-input" id="f-gallery" name="gallery" accept="image/*" multiple>' +
          '</div>' +
          '<div class="gallery-grid" id="gallery-grid">' + thumbsHTML + '</div>' +
        '</div>';
    }

    function step5() {
      var byear = fd.birth_date   ? fd.birth_date.slice(0, 4)   : "—";
      var pyear = fd.passing_date ? fd.passing_date.slice(0, 4) : "—";
      return '<h2 class="create-step-title">Step 5 — Owner Info &amp; Preview</h2>' +
        '<div class="create-field-group">' +
          '<label class="create-label" for="f-owner_name">Your name or family name <span class="req">*</span></label>' +
          '<input class="create-input" id="f-owner_name" name="owner_name" type="text" value="' + esc(fd.owner_name) + '" placeholder="e.g. The Johnson Family">' +
        '</div>' +
        '<div class="create-field-group">' +
          '<label class="create-label">Memorial preview</label>' +
          '<div class="create-preview-hero" id="preview-hero">' +
            '<div class="preview-hero-photo" id="preview-photo">' + (fd.photoUrl ? '<img src="' + fd.photoUrl + '" alt="' + esc(fd.pet_name) + '">' : "") + '</div>' +
            '<p class="preview-hero-eyebrow">In Loving Memory of</p>' +
            '<h3 class="preview-hero-name" id="preview-name">' + (esc(fd.pet_name) || "Your Pet’s Name") + '</h3>' +
            '<p class="preview-hero-dates">' + byear + ' — ' + pyear + '</p>' +
            '<p class="preview-hero-epitaph" id="preview-epitaph">' + (fd.epitaph ? '"' + esc(fd.epitaph) + '"' : "Your epitaph will appear here") + '</p>' +
            '<p class="preview-hero-owner" id="preview-owner">' + (fd.owner_name ? "Created by " + esc(fd.owner_name) : "") + '</p>' +
          '</div>' +
        '</div>';
    }

    function attachListeners() {
      var btnBack = document.getElementById("btn-back");
      var btnNext = document.getElementById("btn-next");
      if (btnBack) btnBack.addEventListener("click", function () { saveStep(); goTo(currentStep - 1); });
      if (btnNext) btnNext.addEventListener("click", function () {
        saveStep();
        if (!validateStep()) return;
        if (currentStep === TOTAL) handleSubmit();
        else goTo(currentStep + 1);
      });

      var photoInput = document.getElementById("f-photo");
      if (photoInput) {
        photoInput.addEventListener("change", function () {
          var file = photoInput.files[0];
          if (!file) return;
          fd.photo    = file;
          fd.photoUrl = URL.createObjectURL(file);
          document.getElementById("dz-photo-placeholder").style.display = "none";
          var img = document.getElementById("dz-photo-img");
          img.src = fd.photoUrl; img.style.display = "block";
        });
      }

      var epitaphInput = document.getElementById("f-epitaph");
      if (epitaphInput) {
        epitaphInput.addEventListener("input", function () {
          var rem = 100 - epitaphInput.value.length;
          var counter = document.getElementById("epi-counter");
          counter.textContent = rem + " characters remaining";
          counter.classList.toggle("counter-warn", rem < 20);
        });
      }

      var traitInput = document.getElementById("trait-input");
      if (traitInput) {
        traitInput.addEventListener("keydown", function (e) {
          if (e.key !== "Enter" && e.key !== ",") return;
          e.preventDefault();
          var val = traitInput.value.trim().replace(/,+$/, "");
          if (val && fd.traits.indexOf(val) === -1) { fd.traits.push(val); refreshTraitTags(); }
          traitInput.value = "";
        });
      }

      var tagContainer = document.getElementById("trait-tags");
      if (tagContainer) {
        tagContainer.addEventListener("click", function (e) {
          var btn = e.target.closest(".trait-remove");
          if (!btn) return;
          fd.traits = fd.traits.filter(function (t) { return t !== btn.dataset.trait; });
          refreshTraitTags();
        });
      }

      var rowsContainer = document.getElementById("timeline-rows");
      if (rowsContainer) {
        rowsContainer.addEventListener("input", function (e) {
          var idx = parseInt(e.target.dataset.index);
          var field = e.target.dataset.field;
          if (!isNaN(idx) && field) fd.timeline[idx][field] = e.target.value;
        });
        rowsContainer.addEventListener("click", function (e) {
          var btn = e.target.closest(".timeline-remove");
          if (!btn || fd.timeline.length <= 1) return;
          fd.timeline.splice(parseInt(btn.dataset.index), 1);
          refreshTimelineRows();
        });
      }

      var addBtn = document.getElementById("add-milestone");
      if (addBtn) {
        addBtn.addEventListener("click", function () {
          fd.timeline.push({ date: "", description: "" });
          refreshTimelineRows();
        });
      }

      var galInput = document.getElementById("f-gallery");
      if (galInput) {
        galInput.addEventListener("change", function () {
          fd.galleryFiles = Array.from(galInput.files);
          fd.gallery = fd.galleryFiles.map(function (f) { return URL.createObjectURL(f); });
          document.getElementById("gallery-grid").innerHTML =
            fd.gallery.map(function (url) { return '<div class="gallery-thumb" style="background-image:url(' + url + ')"></div>'; }).join("");
        });
      }

      var ownerInput = document.getElementById("f-owner_name");
      if (ownerInput) {
        ownerInput.addEventListener("input", function () {
          var el = document.getElementById("preview-owner");
          if (el) el.textContent = ownerInput.value ? "Created by " + ownerInput.value : "";
        });
      }
    }

    function refreshTraitTags() {
      var c = document.getElementById("trait-tags");
      if (!c) return;
      c.innerHTML = fd.traits.map(function (t) {
        return '<span class="trait-tag">' + esc(t) + '<button type="button" class="trait-remove" data-trait="' + esc(t) + '" aria-label="Remove">\xd7</button></span>';
      }).join("");
    }

    function refreshTimelineRows() {
      var c = document.getElementById("timeline-rows");
      if (!c) return;
      c.innerHTML = fd.timeline.map(function (item, i) { return timelineRowHTML(item, i); }).join("");
    }

    function saveStep() {
      function v(id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; }
      if (currentStep === 1) {
        fd.pet_name = v("f-pet_name"); fd.species = v("f-species");
        fd.breed = v("f-breed"); fd.birth_date = v("f-birth_date"); fd.passing_date = v("f-passing_date");
      } else if (currentStep === 2) {
        fd.epitaph = v("f-epitaph"); fd.story = v("f-story");
      } else if (currentStep === 5) {
        fd.owner_name = v("f-owner_name");
      }
    }

    function validateStep() {
      clearErrors();
      var ok = true;
      function need(id, msg) {
        var el = document.getElementById(id);
        if (!el || !el.value.trim()) { markError(el, msg); ok = false; }
      }
      if (currentStep === 1) {
        need("f-pet_name", "Please enter your pet's name.");
        need("f-species",  "Please select a species.");
        need("f-passing_date", "Please enter the date of passing.");
        if (!fd.photo) {
          var dz = document.getElementById("dz-photo");
          if (dz) dz.classList.add("input-error");
          var hint = document.getElementById("photo-hint");
          if (hint) hint.classList.add("create-error-msg");
          ok = false;
        }
      } else if (currentStep === 2) {
        need("f-epitaph", "Please write a short epitaph for the tombstone.");
      } else if (currentStep === 5) {
        need("f-owner_name", "Please enter your name or family name.");
      }
      return ok;
    }

    function markError(el, msg) {
      if (!el) return;
      el.classList.add("input-error");
      var p = document.createElement("p");
      p.className = "create-error-msg"; p.textContent = msg;
      el.after(p);
    }

    function clearErrors() {
      document.querySelectorAll(".input-error").forEach(function (el) { el.classList.remove("input-error"); });
      document.querySelectorAll(".create-error-msg").forEach(function (el) {
        if (el.id === "photo-hint") el.classList.remove("create-error-msg"); else el.remove();
      });
    }

    function goTo(n) {
      currentStep = n;
      renderProgress();
      renderStep();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleSubmit() {
      var btnNext = document.getElementById("btn-next");
      if (btnNext) { btnNext.disabled = true; btnNext.textContent = "Saving…"; }

      var formData = new FormData();
      var csrf = document.querySelector("[name=csrfmiddlewaretoken]");
      if (csrf) formData.append("csrfmiddlewaretoken", csrf.value);

      formData.append("pet_name",    fd.pet_name);
      formData.append("species",     fd.species);
      formData.append("breed",       fd.breed);
      formData.append("birth_date",  fd.birth_date);
      formData.append("passing_date", fd.passing_date);
      formData.append("epitaph",     fd.epitaph);
      formData.append("story",       fd.story);
      formData.append("owner_name",  fd.owner_name);

      if (fd.photo) formData.append("photo", fd.photo);

      fd.traits.forEach(function (t) {
        if (t.trim()) formData.append("traits", t.trim());
      });

      fd.timeline.forEach(function (item) {
        if (item.date || item.description) {
          formData.append("timeline_date", item.date || "");
          formData.append("timeline_desc", item.description || "");
        }
      });

      (fd.galleryFiles || []).forEach(function (f) {
        formData.append("gallery", f);
      });

      fetch("/create/", { method: "POST", body: formData })
        .then(function (r) {
          if (r.url && r.url.indexOf("/create/success/") !== -1) {
            window.location.href = r.url;
          } else {
            if (btnNext) { btnNext.disabled = false; btnNext.textContent = "Create Memorial"; }
            alert("Something went wrong. Please check all required fields and try again.");
          }
        })
        .catch(function () {
          if (btnNext) { btnNext.disabled = false; btnNext.textContent = "Create Memorial"; }
          alert("Network error. Please check your connection and try again.");
        });
    }

    function esc(str) {
      return String(str === null || str === undefined ? "" : str)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    renderProgress();
    renderStep();
  }
})();
