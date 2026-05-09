export function initCreatePage() {
  const stage  = document.getElementById("stage");
  const sceneEl = document.getElementById("scene");

  sceneEl.style.display = "none";
  document.documentElement.style.overflow = "auto";
  document.documentElement.style.height   = "auto";
  document.body.style.overflow = "auto";
  document.body.style.height   = "auto";

  let currentStep = 1;
  const TOTAL = 5;

  const fd = {
    pet_name: "", species: "", breed: "",
    birth_date: "", passing_date: "",
    photo: null, photoUrl: null,
    epitaph: "", story: "",
    traits: [],
    timeline: [{ date: "", description: "" }, { date: "", description: "" }],
    gallery: [],
    owner_name: "", email: "",
  };

  // --- Scaffold ---
  const page = document.createElement("div");
  page.className = "create-page";
  page.innerHTML = `
    <div class="create-inner">
      <div class="create-header">
        <a href="/" class="mem-back-link">← Back to garden</a>
        <h1 class="create-title">Create a Memorial</h1>
        <p class="create-subtitle">A beautiful, lasting tribute for your beloved pet</p>
      </div>
      <nav class="create-progress" id="create-progress" aria-label="Form progress"></nav>
      <div id="create-body"></div>
    </div>
  `;
  stage.classList.add("create-page-stage");
  stage.appendChild(page);

  // --- Progress ---
  function renderProgress() {
    const labels = ["Pet Info", "Story", "Traits", "Gallery", "Preview"];
    document.getElementById("create-progress").innerHTML =
      labels.map((lbl, i) => {
        const n = i + 1;
        const cls = n < currentStep ? "step-done" : n === currentStep ? "step-active" : "step-future";
        const circle = n < currentStep ? "✓" : n;
        return (i > 0 ? `<div class="pip-connector"></div>` : "") +
          `<div class="create-step-pip ${cls}">
            <div class="pip-circle">${circle}</div>
            <span class="pip-label">${lbl}</span>
          </div>`;
      }).join("");
  }

  // --- Step render ---
  function renderStep() {
    const body = document.getElementById("create-body");
    body.innerHTML = "";

    const content = document.createElement("div");
    content.className = "create-step-content";

    const builders = [null, step1, step2, step3, step4, step5];
    content.innerHTML = builders[currentStep]();

    const nav = document.createElement("div");
    nav.className = "create-nav";
    nav.innerHTML = `
      ${currentStep > 1
        ? `<button class="create-btn create-btn--ghost" id="btn-back">← Back</button>`
        : `<div></div>`}
      <button class="create-btn create-btn--primary" id="btn-next">
        ${currentStep === TOTAL ? "Create Memorial" : "Next →"}
      </button>
    `;

    body.appendChild(content);
    body.appendChild(nav);
    requestAnimationFrame(() => content.classList.add("step-visible"));

    attachListeners();
  }

  // ---- Step HTML ----

  const speciesOptions = ["", "Dog", "Cat", "Bird", "Rabbit", "Hamster", "Fish", "Reptile", "Horse", "Other"];

  function step1() {
    return `
      <h2 class="create-step-title">Step 1 — Pet Info &amp; Photo</h2>

      <div class="create-field-group">
        <label class="create-label" for="f-pet_name">Pet name <span class="req">*</span></label>
        <input class="create-input" id="f-pet_name" name="pet_name" type="text"
          value="${esc(fd.pet_name)}" placeholder="e.g. Buddy">
      </div>

      <div class="create-field-row">
        <div class="create-field-group">
          <label class="create-label" for="f-species">Species <span class="req">*</span></label>
          <select class="create-input" id="f-species" name="species">
            ${speciesOptions.map(s =>
              `<option value="${s}"${fd.species === s ? " selected" : ""}>${s || "Select species…"}</option>`
            ).join("")}
          </select>
        </div>
        <div class="create-field-group">
          <label class="create-label" for="f-breed">Breed <span class="opt">(optional)</span></label>
          <input class="create-input" id="f-breed" name="breed" type="text"
            value="${esc(fd.breed)}" placeholder="e.g. Golden Retriever">
        </div>
      </div>

      <div class="create-field-row">
        <div class="create-field-group">
          <label class="create-label" for="f-birth_date">Date of birth <span class="opt">(optional)</span></label>
          <input class="create-input" id="f-birth_date" name="birth_date" type="date" value="${fd.birth_date}">
        </div>
        <div class="create-field-group">
          <label class="create-label" for="f-passing_date">Date of passing <span class="req">*</span></label>
          <input class="create-input" id="f-passing_date" name="passing_date" type="date" value="${fd.passing_date}">
        </div>
      </div>

      <div class="create-field-group">
        <label class="create-label">Memorial photo <span class="opt">(optional)</span></label>
        <div class="create-dropzone" id="dz-photo">
          <div class="dropzone-placeholder" id="dz-photo-placeholder"${fd.photoUrl ? ' style="display:none"' : ""}>
            <svg class="dz-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            <p>Drag &amp; drop or <span class="dz-link">browse</span></p>
            <p class="dz-hint">JPG, PNG or WEBP</p>
          </div>
          <img class="dropzone-preview" id="dz-photo-img"
            src="${fd.photoUrl || ""}" alt="Photo preview"
            style="${fd.photoUrl ? "" : "display:none"}">
          <input type="file" class="dropzone-input" id="f-photo" name="photo" accept="image/*">
        </div>
      </div>
    `;
  }

  function step2() {
    const rem = 100 - fd.epitaph.length;
    return `
      <h2 class="create-step-title">Step 2 — Epitaph &amp; Story</h2>

      <div class="create-field-group">
        <label class="create-label" for="f-epitaph">Epitaph <span class="req">*</span></label>
        <p class="create-hint">A short phrase that appears on the tombstone. Keep it personal.</p>
        <input class="create-input" id="f-epitaph" name="epitaph" type="text" maxlength="100"
          value="${esc(fd.epitaph)}" placeholder="e.g. Loyal beyond measure.">
        <div class="epitaph-counter${rem < 20 ? " counter-warn" : ""}" id="epi-counter">${rem} characters remaining</div>
      </div>

      <div class="create-field-group">
        <label class="create-label" for="f-story">Pet story <span class="opt">(optional)</span></label>
        <p class="create-hint">Tell the world about your pet — their personality, favourite moments, what made them unique.</p>
        <textarea class="create-input create-textarea" id="f-story" name="story"
          placeholder="Write about your pet here…">${esc(fd.story)}</textarea>
      </div>
    `;
  }

  function step3() {
    const tagHTML = fd.traits.map(t =>
      `<span class="trait-tag">${esc(t)}<button class="trait-remove" data-trait="${esc(t)}" aria-label="Remove ${esc(t)}">×</button></span>`
    ).join("");

    const rowsHTML = fd.timeline.map((item, i) => timelineRowHTML(item, i)).join("");

    return `
      <h2 class="create-step-title">Step 3 — Traits &amp; Timeline</h2>

      <div class="create-field-group">
        <label class="create-label">Personality traits <span class="opt">(optional)</span></label>
        <p class="create-hint">Type a trait and press Enter to add it.</p>
        <div class="trait-input-wrap" id="trait-wrap">
          <div class="trait-tags" id="trait-tags">${tagHTML}</div>
          <input class="trait-input" id="trait-input" type="text"
            placeholder="e.g. Playful, Gentle, Loved swimming…">
        </div>
      </div>

      <div class="create-field-group">
        <label class="create-label">Life milestones <span class="opt">(optional)</span></label>
        <p class="create-hint">Add key moments from your pet's life.</p>
        <div class="timeline-rows" id="timeline-rows">${rowsHTML}</div>
        <button class="create-btn create-btn--ghost create-btn--sm" id="add-milestone">+ Add milestone</button>
      </div>
    `;
  }

  function timelineRowHTML(item, i) {
    return `
      <div class="timeline-row" data-index="${i}">
        <input class="create-input timeline-date" type="date" value="${item.date}"
          data-field="date" data-index="${i}">
        <input class="create-input timeline-desc" type="text"
          placeholder="e.g. Born into the world" value="${esc(item.description)}"
          data-field="description" data-index="${i}">
        <button class="timeline-remove" data-index="${i}" aria-label="Remove milestone">×</button>
      </div>`;
  }

  function step4() {
    const thumbsHTML = fd.gallery.length
      ? fd.gallery.map(url => `<div class="gallery-thumb" style="background-image:url(${url})"></div>`).join("")
      : Array.from({ length: 4 }, () => `<div class="gallery-thumb gallery-thumb--empty"></div>`).join("");

    return `
      <h2 class="create-step-title">Step 4 — Gallery</h2>
      <p class="create-hint" style="margin-bottom:24px">Add photos of your pet's favourite moments.</p>

      <div class="create-field-group">
        <div class="create-dropzone create-dropzone--gallery" id="dz-gallery">
          <div class="dropzone-placeholder">
            <svg class="dz-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <p>Drag &amp; drop or <span class="dz-link">browse</span></p>
            <p class="dz-hint">Select multiple photos</p>
          </div>
          <input type="file" class="dropzone-input" id="f-gallery" name="gallery" accept="image/*" multiple>
        </div>
        <div class="gallery-grid" id="gallery-grid">${thumbsHTML}</div>
      </div>
    `;
  }

  function step5() {
    const byear = fd.birth_date   ? fd.birth_date.slice(0, 4)   : "—";
    const pyear = fd.passing_date ? fd.passing_date.slice(0, 4) : "—";

    return `
      <h2 class="create-step-title">Step 5 — Owner Info &amp; Preview</h2>

      <div class="create-field-group">
        <label class="create-label" for="f-owner_name">Your name or family name <span class="req">*</span></label>
        <input class="create-input" id="f-owner_name" name="owner_name" type="text"
          value="${esc(fd.owner_name)}" placeholder="e.g. The Johnson Family">
      </div>

      <div class="create-field-group">
        <label class="create-label" for="f-email">Email address <span class="req">*</span></label>
        <p class="create-hint">Used to access your memorial later. Not shown publicly.</p>
        <input class="create-input" id="f-email" name="email" type="email"
          value="${esc(fd.email)}" placeholder="you@example.com">
      </div>

      <div class="create-field-group">
        <label class="create-label">Memorial preview</label>
        <div class="create-preview-hero" id="preview-hero">
          <div class="preview-hero-photo" id="preview-photo">
            ${fd.photoUrl ? `<img src="${fd.photoUrl}" alt="${esc(fd.pet_name)}">` : ""}
          </div>
          <p class="preview-hero-eyebrow">In Loving Memory of</p>
          <h3 class="preview-hero-name" id="preview-name">${esc(fd.pet_name) || "Your Pet's Name"}</h3>
          <p class="preview-hero-dates">${byear} — ${pyear}</p>
          <p class="preview-hero-epitaph" id="preview-epitaph">${fd.epitaph ? `"${esc(fd.epitaph)}"` : "Your epitaph will appear here"}</p>
          <p class="preview-hero-owner" id="preview-owner">${fd.owner_name ? `Created by ${esc(fd.owner_name)}` : ""}</p>
        </div>
      </div>
    `;
  }

  // ---- Event listeners ----

  function attachListeners() {
    const btnBack = document.getElementById("btn-back");
    const btnNext = document.getElementById("btn-next");

    if (btnBack) btnBack.addEventListener("click", () => { saveStep(); goTo(currentStep - 1); });

    if (btnNext) btnNext.addEventListener("click", () => {
      saveStep();
      if (!validateStep()) return;
      if (currentStep === TOTAL) handleSubmit();
      else goTo(currentStep + 1);
    });

    // Step 1 — photo
    const dzPhoto = document.getElementById("dz-photo");
    const photoInput = document.getElementById("f-photo");
    if (dzPhoto && photoInput) {
      photoInput.addEventListener("change", () => {
        const file = photoInput.files[0];
        if (!file) return;
        fd.photo = file;
        fd.photoUrl = URL.createObjectURL(file);
        document.getElementById("dz-photo-placeholder").style.display = "none";
        const img = document.getElementById("dz-photo-img");
        img.src = fd.photoUrl;
        img.style.display = "block";
      });
    }

    // Step 2 — epitaph counter
    const epitaphInput = document.getElementById("f-epitaph");
    if (epitaphInput) {
      epitaphInput.addEventListener("input", () => {
        const rem = 100 - epitaphInput.value.length;
        const counter = document.getElementById("epi-counter");
        counter.textContent = `${rem} characters remaining`;
        counter.classList.toggle("counter-warn", rem < 20);
      });
    }

    // Step 3 — trait input
    const traitInput = document.getElementById("trait-input");
    if (traitInput) {
      traitInput.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== ",") return;
        e.preventDefault();
        const val = traitInput.value.trim().replace(/,+$/, "");
        if (val && !fd.traits.includes(val)) {
          fd.traits.push(val);
          refreshTraitTags();
        }
        traitInput.value = "";
      });
    }

    // Step 3 — trait remove (delegated)
    const tagContainer = document.getElementById("trait-tags");
    if (tagContainer) {
      tagContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".trait-remove");
        if (!btn) return;
        fd.traits = fd.traits.filter(t => t !== btn.dataset.trait);
        refreshTraitTags();
      });
    }

    // Step 3 — timeline (delegated)
    const rowsContainer = document.getElementById("timeline-rows");
    if (rowsContainer) {
      rowsContainer.addEventListener("input", (e) => {
        const idx   = parseInt(e.target.dataset.index);
        const field = e.target.dataset.field;
        if (!isNaN(idx) && field) fd.timeline[idx][field] = e.target.value;
      });
      rowsContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".timeline-remove");
        if (!btn || fd.timeline.length <= 1) return;
        fd.timeline.splice(parseInt(btn.dataset.index), 1);
        refreshTimelineRows();
      });
    }

    const addBtn = document.getElementById("add-milestone");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        fd.timeline.push({ date: "", description: "" });
        refreshTimelineRows();
      });
    }

    // Step 4 — gallery
    const dzGallery  = document.getElementById("dz-gallery");
    const galInput   = document.getElementById("f-gallery");
    if (dzGallery && galInput) {
      galInput.addEventListener("change", () => {
        fd.gallery = Array.from(galInput.files).map(f => URL.createObjectURL(f));
        document.getElementById("gallery-grid").innerHTML =
          fd.gallery.map(url => `<div class="gallery-thumb" style="background-image:url(${url})"></div>`).join("");
      });
    }

    // Step 5 — live preview update
    const ownerInput = document.getElementById("f-owner_name");
    if (ownerInput) {
      ownerInput.addEventListener("input", () => {
        const el = document.getElementById("preview-owner");
        if (el) el.textContent = ownerInput.value ? `Created by ${ownerInput.value}` : "";
      });
    }
  }

  function refreshTraitTags() {
    const c = document.getElementById("trait-tags");
    if (!c) return;
    c.innerHTML = fd.traits.map(t =>
      `<span class="trait-tag">${esc(t)}<button class="trait-remove" data-trait="${esc(t)}" aria-label="Remove">×</button></span>`
    ).join("");
  }

  function refreshTimelineRows() {
    const c = document.getElementById("timeline-rows");
    if (!c) return;
    c.innerHTML = fd.timeline.map((item, i) => timelineRowHTML(item, i)).join("");
  }

  // ---- Save / validate ----

  function saveStep() {
    const v = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ""; };
    if (currentStep === 1) {
      fd.pet_name     = v("f-pet_name");
      fd.species      = v("f-species");
      fd.breed        = v("f-breed");
      fd.birth_date   = v("f-birth_date");
      fd.passing_date = v("f-passing_date");
    } else if (currentStep === 2) {
      fd.epitaph = v("f-epitaph");
      fd.story   = v("f-story");
    } else if (currentStep === 5) {
      fd.owner_name = v("f-owner_name");
      fd.email      = v("f-email");
    }
  }

  function validateStep() {
    clearErrors();
    let ok = true;

    function need(id, msg) {
      const el = document.getElementById(id);
      if (!el || !el.value.trim()) { markError(el, msg); ok = false; }
    }

    if (currentStep === 1) {
      need("f-pet_name",     "Please enter your pet's name.");
      need("f-species",      "Please select a species.");
      need("f-passing_date", "Please enter the date of passing.");
    } else if (currentStep === 2) {
      need("f-epitaph", "Please write a short epitaph for the tombstone.");
    } else if (currentStep === 5) {
      need("f-owner_name", "Please enter your name or family name.");
      need("f-email",      "Please enter your email address.");
      const emailEl = document.getElementById("f-email");
      if (emailEl && emailEl.value && !emailEl.value.includes("@")) {
        markError(emailEl, "Please enter a valid email address.");
        ok = false;
      }
    }

    return ok;
  }

  function markError(el, msg) {
    if (!el) return;
    el.classList.add("input-error");
    const p = document.createElement("p");
    p.className = "create-error-msg";
    p.textContent = msg;
    el.after(p);
  }

  function clearErrors() {
    document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
    document.querySelectorAll(".create-error-msg").forEach(el => el.remove());
  }

  // ---- Navigation ----

  function goTo(n) {
    currentStep = n;
    renderProgress();
    renderStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ---- Submit ----

  function handleSubmit() {
    const slug = fd.pet_name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    document.getElementById("create-body").innerHTML = `
      <div class="create-success">
        <svg class="success-icon-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" stroke="#9a89b5" stroke-width="2"/>
          <path d="M20 33l9 9 15-18" stroke="#5e4f76" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h2 class="success-title">Memorial Created</h2>
        <p class="success-msg">${esc(fd.pet_name)}'s memorial is ready.</p>
        <a href="/memorial/${slug}" class="create-btn create-btn--primary">View Memorial →</a>
        <a href="/" class="create-btn create-btn--ghost">Back to Garden</a>
      </div>
    `;
  }

  // ---- Helpers ----

  function esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // ---- Boot ----
  renderProgress();
  renderStep();
}
