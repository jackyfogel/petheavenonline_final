export function initContactPage() {
  const stage  = document.getElementById("stage");
  const sceneEl = document.getElementById("scene");

  sceneEl.style.display = "none";
  document.documentElement.style.overflow = "auto";
  document.documentElement.style.height   = "auto";
  document.body.style.overflow = "auto";
  document.body.style.height   = "auto";

  stage.classList.add("contact-page-stage");

  const page = document.createElement("div");
  page.className = "contact-page";
  page.innerHTML = `
    <div class="contact-inner">
      <a href="/" class="mem-back-link">← Back to garden</a>
      <h1 class="contact-title">Contact Us</h1>
      <p class="contact-intro">Have a question or need help? We'd love to hear from you.</p>

      <form class="contact-form" id="contact-form" novalidate>
        <div class="contact-field-group">
          <label class="contact-label" for="c-name">Name <span class="req">*</span></label>
          <input class="create-input" id="c-name" name="name" type="text" placeholder="Your name">
        </div>

        <div class="contact-field-group">
          <label class="contact-label" for="c-email">Email <span class="req">*</span></label>
          <input class="create-input" id="c-email" name="email" type="email" placeholder="you@example.com">
        </div>

        <div class="contact-field-group">
          <label class="contact-label" for="c-subject">Subject <span class="req">*</span></label>
          <select class="create-input" id="c-subject" name="subject">
            <option value="">Select a subject…</option>
            <option value="general">General inquiry</option>
            <option value="support">Support</option>
            <option value="report">Report an issue</option>
            <option value="business">Business &amp; partnerships</option>
          </select>
        </div>

        <div class="contact-field-group">
          <label class="contact-label" for="c-message">Message <span class="req">*</span></label>
          <textarea class="create-input create-textarea" id="c-message" name="message"
            placeholder="Write your message here…"></textarea>
        </div>

        <button class="contact-btn" type="submit">Send Message</button>
      </form>

      <div class="contact-success" id="contact-success" style="display:none">
        <svg class="success-icon-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" stroke="#9a89b5" stroke-width="2"/>
          <path d="M20 33l9 9 15-18" stroke="#5e4f76" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h2 class="success-title">Message Sent</h2>
        <p class="contact-success-msg" id="contact-success-msg"></p>
        <a href="/" class="create-btn create-btn--ghost">Back to home</a>
      </div>
    </div>
  `;

  stage.appendChild(page);

  const form = document.getElementById("contact-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const nameEl    = document.getElementById("c-name");
    const emailEl   = document.getElementById("c-email");
    const subjectEl = document.getElementById("c-subject");
    const msgEl     = document.getElementById("c-message");

    let ok = true;

    function need(el, msg) {
      if (!el.value.trim()) { markError(el, msg); ok = false; }
    }

    need(nameEl,    "Please enter your name.");
    need(subjectEl, "Please select a subject.");
    need(msgEl,     "Please write a message.");

    if (!emailEl.value.trim()) {
      markError(emailEl, "Please enter your email address.");
      ok = false;
    } else if (!emailEl.value.includes("@")) {
      markError(emailEl, "Please enter a valid email address.");
      ok = false;
    }

    if (!ok) return;

    const email = emailEl.value.trim();
    form.style.display = "none";
    const successEl = document.getElementById("contact-success");
    document.getElementById("contact-success-msg").textContent =
      `Thanks for reaching out! We'll get back to you at ${email} as soon as possible.`;
    successEl.style.display = "flex";
  });

  function markError(el, msg) {
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
}
