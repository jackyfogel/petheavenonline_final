(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var timeEl = document.getElementById("form_time");
    if (timeEl) timeEl.value = Date.now();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors();

      var nameEl    = document.getElementById("c-name");
      var emailEl   = document.getElementById("c-email");
      var subjectEl = document.getElementById("c-subject");
      var msgEl     = document.getElementById("c-message");
      var ok        = true;

      function need(el, msg) {
        if (!el || !el.value.trim()) { markError(el, msg); ok = false; }
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

      var btn = form.querySelector(".contact-btn");
      btn.disabled = true;
      btn.textContent = "Sending…";

      var fd = new FormData(form);

      fetch("/contact/", {
        method: "POST",
        body: fd,
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.ok) {
            form.style.display = "none";
            var successEl = document.getElementById("contact-success");
            var msgTextEl = document.getElementById("contact-success-msg");
            if (msgTextEl) {
              msgTextEl.textContent =
                "Thanks for reaching out! We'll get back to you at " +
                emailEl.value.trim() + " as soon as possible.";
            }
            if (successEl) successEl.style.display = "flex";
          } else {
            showError(data.error || "Something went wrong. Please try again.");
            btn.disabled = false;
            btn.textContent = "Send Message";
          }
        })
        .catch(function () {
          showError("Something went wrong. Please try again.");
          btn.disabled = false;
          btn.textContent = "Send Message";
        });
    });

    function showError(msg) {
      var el = document.getElementById("contact-error");
      if (!el) return;
      el.textContent = msg;
      el.style.display = "block";
    }

    function markError(el, msg) {
      if (!el) return;
      el.classList.add("input-error");
      var p = document.createElement("p");
      p.className = "create-error-msg";
      p.textContent = msg;
      el.after(p);
    }

    function clearErrors() {
      var errEl = document.getElementById("contact-error");
      if (errEl) errEl.style.display = "none";
      document.querySelectorAll(".input-error").forEach(function (el) { el.classList.remove("input-error"); });
      document.querySelectorAll(".create-error-msg").forEach(function (el) { el.remove(); });
    }
  });
})();
