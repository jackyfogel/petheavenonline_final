export function initLoginPage() {
  const stage   = document.getElementById("stage");
  const sceneEl = document.getElementById("scene");

  sceneEl.style.display = "none";
  document.documentElement.style.overflow = "auto";
  document.documentElement.style.height   = "auto";
  document.body.style.overflow = "auto";
  document.body.style.height   = "auto";

  stage.classList.add("auth-page-stage");

  const page = document.createElement("div");
  page.className = "auth-page";
  page.innerHTML = `
    <div class="auth-inner">
      <h1 class="auth-title">Welcome back</h1>

      <form class="auth-form" id="login-form" novalidate>
        <div class="auth-field-group">
          <label class="auth-label" for="login-email">Email</label>
          <input class="auth-input" id="login-email" name="email"
            type="email" autocomplete="email" required>
          <p class="auth-error" id="login-email-err" hidden></p>
        </div>

        <div class="auth-field-group">
          <label class="auth-label" for="login-password">Password</label>
          <input class="auth-input" id="login-password" name="password"
            type="password" autocomplete="current-password" required>
          <p class="auth-error" id="login-password-err" hidden></p>
        </div>

        <button class="auth-btn" type="submit">Log in</button>

        <p class="auth-forgot">
          <a href="/forgot-password" class="auth-link">Forgot your password?</a>
        </p>
      </form>

      <p class="auth-switch">
        Don't have an account?
        <a href="/register" class="auth-link">Sign up</a>
      </p>
    </div>
  `;

  stage.appendChild(page);

  const form        = document.getElementById("login-form");
  const emailEl     = document.getElementById("login-email");
  const passwordEl  = document.getElementById("login-password");
  const emailErr    = document.getElementById("login-email-err");
  const passwordErr = document.getElementById("login-password-err");

  function showError(el, errEl, msg) {
    el.classList.add("auth-input--error");
    errEl.textContent = msg;
    errEl.hidden = false;
  }

  function clearError(el, errEl) {
    el.classList.remove("auth-input--error");
    errEl.hidden = true;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    clearError(emailEl, emailErr);
    clearError(passwordEl, passwordErr);

    if (!emailEl.value.trim()) {
      showError(emailEl, emailErr, "Email is required.");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
      showError(emailEl, emailErr, "Enter a valid email address.");
      valid = false;
    }

    if (!passwordEl.value) {
      showError(passwordEl, passwordErr, "Password is required.");
      valid = false;
    }

    if (valid) {
      window.location.href = "/account";
    }
  });
}

export function initRegisterPage() {
  const stage   = document.getElementById("stage");
  const sceneEl = document.getElementById("scene");

  sceneEl.style.display = "none";
  document.documentElement.style.overflow = "auto";
  document.documentElement.style.height   = "auto";
  document.body.style.overflow = "auto";
  document.body.style.height   = "auto";

  stage.classList.add("auth-page-stage");

  const page = document.createElement("div");
  page.className = "auth-page";
  page.innerHTML = `
    <div class="auth-inner">
      <h1 class="auth-title">Create your account</h1>
      <p class="auth-intro">Join PetHeavenOnline to create lasting memorials for your beloved pets.</p>

      <form class="auth-form" id="register-form" novalidate>
        <div class="auth-field-group">
          <label class="auth-label" for="reg-name">Full name</label>
          <input class="auth-input" id="reg-name" name="full_name"
            type="text" autocomplete="name" required>
          <p class="auth-error" id="reg-name-err" hidden></p>
        </div>

        <div class="auth-field-group">
          <label class="auth-label" for="reg-email">Email</label>
          <input class="auth-input" id="reg-email" name="email"
            type="email" autocomplete="email" required>
          <p class="auth-error" id="reg-email-err" hidden></p>
        </div>

        <div class="auth-field-group">
          <label class="auth-label" for="reg-password">Password</label>
          <input class="auth-input" id="reg-password" name="password"
            type="password" autocomplete="new-password" required>
          <p class="auth-hint">At least 8 characters.</p>
          <p class="auth-error" id="reg-password-err" hidden></p>
        </div>

        <div class="auth-field-group">
          <label class="auth-label" for="reg-confirm">Confirm password</label>
          <input class="auth-input" id="reg-confirm" name="password_confirm"
            type="password" autocomplete="new-password" required>
          <p class="auth-error" id="reg-confirm-err" hidden></p>
        </div>

        <button class="auth-btn" type="submit">Create account</button>

        <p class="auth-terms">
          By creating an account, you agree to our
          <a href="/terms" class="auth-link">Terms of Service</a>
          and
          <a href="/privacy" class="auth-link">Privacy Policy</a>.
        </p>
      </form>

      <div class="auth-success" id="reg-success" hidden>
        <svg class="auth-success-icon" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="9 12 11 14 15 10"/>
        </svg>
        <p class="auth-success-msg">Account created! Welcome to PetHeavenOnline.</p>
      </div>

      <p class="auth-switch">
        Already have an account?
        <a href="/login" class="auth-link">Log in</a>
      </p>
    </div>
  `;

  stage.appendChild(page);

  const form       = document.getElementById("register-form");
  const nameEl     = document.getElementById("reg-name");
  const emailEl    = document.getElementById("reg-email");
  const passEl     = document.getElementById("reg-password");
  const confirmEl  = document.getElementById("reg-confirm");
  const nameErr    = document.getElementById("reg-name-err");
  const emailErr   = document.getElementById("reg-email-err");
  const passErr    = document.getElementById("reg-password-err");
  const confirmErr = document.getElementById("reg-confirm-err");
  const successEl  = document.getElementById("reg-success");

  function showError(el, errEl, msg) {
    el.classList.add("auth-input--error");
    errEl.textContent = msg;
    errEl.hidden = false;
  }

  function clearError(el, errEl) {
    el.classList.remove("auth-input--error");
    errEl.hidden = true;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    [nameEl, emailEl, passEl, confirmEl].forEach((el, i) => {
      clearError(el, [nameErr, emailErr, passErr, confirmErr][i]);
    });

    if (!nameEl.value.trim()) {
      showError(nameEl, nameErr, "Full name is required.");
      valid = false;
    }

    if (!emailEl.value.trim()) {
      showError(emailEl, emailErr, "Email is required.");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
      showError(emailEl, emailErr, "Enter a valid email address.");
      valid = false;
    }

    if (!passEl.value) {
      showError(passEl, passErr, "Password is required.");
      valid = false;
    } else if (passEl.value.length < 8) {
      showError(passEl, passErr, "Password must be at least 8 characters.");
      valid = false;
    }

    if (!confirmEl.value) {
      showError(confirmEl, confirmErr, "Please confirm your password.");
      valid = false;
    } else if (passEl.value && confirmEl.value !== passEl.value) {
      showError(confirmEl, confirmErr, "Passwords do not match.");
      valid = false;
    }

    if (valid) {
      form.hidden = true;
      successEl.hidden = false;
      setTimeout(() => { window.location.href = "/create"; }, 2000);
    }
  });
}
