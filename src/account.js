import { memorials } from './data/memorials.js';

export function initAccountPage() {
  const stage   = document.getElementById("stage");
  const sceneEl = document.getElementById("scene");

  sceneEl.style.display = "none";
  document.documentElement.style.overflow = "auto";
  document.documentElement.style.height   = "auto";
  document.body.style.overflow = "auto";
  document.body.style.height   = "auto";

  stage.classList.add("acct-page-stage");

  // Mock user data
  const user = {
    initials: "SM",
    name: "Sarah Mitchell",
    email: "sarah@example.com",
    since: "April 2026",
  };

  // Mock memorials owned by this user
  const myMemorials = [
    { memorial: memorials["mem-buddy"], status: "live" },
    { memorial: memorials["mem-luna"],  status: "live" },
    { memorial: memorials["mem-oscar"], status: "pending" },
  ];

  const page = document.createElement("div");
  page.className = "acct-page";

  page.innerHTML = `
    <div class="acct-inner">

      <!-- Profile header -->
      <section class="acct-profile">
        <div class="acct-avatar">${esc(user.initials)}</div>
        <div class="acct-profile-info">
          <h1 class="acct-profile-name">${esc(user.name)}</h1>
          <p class="acct-profile-email">${esc(user.email)}</p>
          <p class="acct-profile-since">Member since ${esc(user.since)}</p>
        </div>
        <button class="acct-edit-btn" type="button">Edit profile</button>
      </section>

      <!-- My Memorials -->
      <section class="acct-section">
        <h2 class="acct-section-title">My memorials</h2>
        <div class="acct-cards" id="acct-cards">
          ${myMemorials.map(({ memorial: m, status }) => memCardHTML(m, status)).join("")}
        </div>
        <a href="/create" class="acct-create-btn">+ Create new memorial</a>
      </section>

      <!-- Settings -->
      <section class="acct-section">
        <h2 class="acct-section-title">Settings</h2>
        <ul class="acct-settings-list">
          <li class="acct-settings-item">
            <span class="acct-settings-label">Change password</span>
            <button class="acct-settings-action" type="button">Change</button>
          </li>
          <li class="acct-settings-item">
            <span class="acct-settings-label">Email notifications</span>
            <label class="acct-toggle" aria-label="Email notifications">
              <input type="checkbox" checked>
              <span class="acct-toggle-track"></span>
            </label>
          </li>
          <li class="acct-settings-item">
            <span class="acct-settings-label acct-settings-danger">Delete account</span>
            <button class="acct-settings-action acct-settings-action--danger" type="button">Delete</button>
          </li>
        </ul>
      </section>

    </div>
  `;

  stage.appendChild(page);
}

function memCardHTML(m, status) {
  if (!m) return "";
  const photoHTML = m.photo
    ? `<img src="${esc(m.photo)}" alt="${esc(m.name)}">`
    : "";
  const badgeClass = status === "live" ? "acct-badge--live" : "acct-badge--pending";
  const badgeLabel = status === "live" ? "Live" : "Pending review";
  return `
    <div class="acct-card">
      <div class="acct-card-photo">${photoHTML}</div>
      <div class="acct-card-body">
        <div class="acct-card-top">
          <span class="acct-card-name">${esc(m.name)}</span>
          <span class="acct-badge ${badgeClass}">${badgeLabel}</span>
        </div>
        <div class="acct-card-dates">${esc(m.born)} – ${esc(m.passed)}</div>
        <p class="acct-card-epitaph">${esc(m.epitaph)}</p>
      </div>
      <div class="acct-card-actions">
        <a class="acct-action-link" href="/memorial/${esc(m.slug)}">View</a>
        <button class="acct-action-link acct-action-link--btn" type="button">Edit</button>
      </div>
    </div>
  `;
}

function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
