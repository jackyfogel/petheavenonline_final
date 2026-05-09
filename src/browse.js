import { memorials } from './data/memorials.js';

export function initBrowsePage() {
  const stage  = document.getElementById("stage");
  const sceneEl = document.getElementById("scene");

  sceneEl.style.display = "none";
  document.documentElement.style.overflow = "auto";
  document.documentElement.style.height   = "auto";
  document.body.style.overflow = "auto";
  document.body.style.height   = "auto";

  stage.classList.add("browse-page-stage");

  // Convert to array, sort newest first by default (passed year desc)
  const all = Object.values(memorials).sort((a, b) => Number(b.passed) - Number(a.passed));

  let activeSpecies = "All";
  let activeSort    = "newest";
  let searchQuery   = "";

  // --- Scaffold ---
  const page = document.createElement("div");
  page.className = "browse-page";
  page.innerHTML = `
    <div class="browse-inner">
      <a href="/" class="mem-back-link">← Back to garden</a>
      <h1 class="browse-title">Browse Memorials</h1>
      <p class="browse-intro">Explore the memorials in our garden and remember those who touched our lives.</p>

      <section class="browse-featured" id="browse-featured"></section>

      <div class="browse-controls">
        <div class="browse-pills" id="browse-pills" role="group" aria-label="Filter by species"></div>
        <div class="browse-controls-right">
          <select class="browse-sort" id="browse-sort" aria-label="Sort order">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="visited">Most visited</option>
          </select>
          <div class="browse-search-wrap">
            <input class="browse-search" id="browse-search" type="search"
              placeholder="Search by name…" aria-label="Search memorials">
          </div>
        </div>
      </div>

      <div class="browse-list" id="browse-list"></div>
    </div>
  `;

  stage.appendChild(page);

  // --- Featured ---
  const featured = all.slice(0, 3);
  document.getElementById("browse-featured").innerHTML = `
    <h2 class="browse-section-label">Recently added</h2>
    <div class="featured-cards">
      ${featured.map(m => featuredCardHTML(m)).join("")}
    </div>
  `;

  // --- Pills ---
  const speciesOptions = ["All", "Dogs", "Cats", "Birds", "Other"];
  const pillsEl = document.getElementById("browse-pills");
  pillsEl.innerHTML = speciesOptions.map(s =>
    `<button class="browse-pill${s === "All" ? " pill--active" : ""}" data-species="${s}">${s}</button>`
  ).join("");

  pillsEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".browse-pill");
    if (!btn) return;
    activeSpecies = btn.dataset.species;
    pillsEl.querySelectorAll(".browse-pill").forEach(b =>
      b.classList.toggle("pill--active", b === btn)
    );
    renderList();
  });

  // --- Sort ---
  document.getElementById("browse-sort").addEventListener("change", (e) => {
    activeSort = e.target.value;
    renderList();
  });

  // --- Search ---
  document.getElementById("browse-search").addEventListener("input", (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    renderList();
  });

  // --- List ---
  function filtered() {
    let list = all.slice();

    if (activeSpecies !== "All") {
      const map = { Dogs: "Dog", Cats: "Cat", Birds: "Bird" };
      const target = map[activeSpecies];
      list = list.filter(m => {
        if (activeSpecies === "Other") return !["Dog", "Cat", "Bird"].includes(m.species);
        return m.species === target;
      });
    }

    if (searchQuery) {
      list = list.filter(m => m.name.toLowerCase().includes(searchQuery));
    }

    if (activeSort === "oldest") {
      list.sort((a, b) => Number(a.passed) - Number(b.passed));
    } else if (activeSort === "visited") {
      // No real visit data — stable order as proxy
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => Number(b.passed) - Number(a.passed));
    }

    return list;
  }

  function renderList() {
    const results = filtered();
    const listEl  = document.getElementById("browse-list");

    if (!results.length) {
      listEl.innerHTML = `<p class="browse-empty">No memorials found. Try a different filter.</p>`;
      return;
    }

    listEl.innerHTML = results.map(m => listCardHTML(m)).join("");
  }

  renderList();
}

function featuredCardHTML(m) {
  const photoHTML = m.photo
    ? `<img src="${m.photo}" alt="${esc(m.name)}">`
    : "";
  return `
    <a class="featured-card" href="/memorial/${esc(m.slug)}">
      <div class="featured-card-photo">${photoHTML}</div>
      <div class="featured-card-name">${esc(m.name)}</div>
      <div class="featured-card-dates">${esc(m.born)} – ${esc(m.passed)}</div>
      <p class="featured-card-epitaph">${esc(m.epitaph)}</p>
    </a>
  `;
}

function listCardHTML(m) {
  const breed  = m.traits ? m.traits[0] : (m.species || "");
  const detail = [breed, m.species].filter(Boolean).join(" · ");
  const photoHTML = m.photo
    ? `<img src="${m.photo}" alt="${esc(m.name)}">`
    : "";
  return `
    <a class="browse-card" href="/memorial/${esc(m.slug)}">
      <div class="browse-card-photo">${photoHTML}</div>
      <div class="browse-card-body">
        <div class="browse-card-name">${esc(m.name)}</div>
        <div class="browse-card-detail">${esc(detail)}</div>
        <div class="browse-card-dates">${esc(m.born)} – ${esc(m.passed)}</div>
        <p class="browse-card-epitaph">${esc(m.epitaph)}</p>
      </div>
      <svg class="browse-card-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </a>
  `;
}

function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
