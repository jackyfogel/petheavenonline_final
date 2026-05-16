export function initLegalPage(type) {
  const stage   = document.getElementById("stage");
  const sceneEl = document.getElementById("scene");

  sceneEl.style.display = "none";
  document.documentElement.style.overflow = "auto";
  document.documentElement.style.height   = "auto";
  document.body.style.overflow = "auto";
  document.body.style.height   = "auto";

  stage.classList.add("legal-page-stage");

  const content = type === "terms" ? termsContent() : privacyContent();

  const page = document.createElement("div");
  page.className = "legal-page";
  page.innerHTML = `
    <div class="legal-inner">
      <a href="/" class="mem-back-link">← Back to garden</a>
      ${content}
    </div>
  `;

  stage.appendChild(page);
}

function termsContent() {
  return sections("Terms of Service", [
    {
      heading: "1. Acceptance of Terms",
      body: "By accessing or using PetHeavenOnline, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service. Your continued use of the service constitutes acceptance of any updates to these terms.",
    },
    {
      heading: "2. Description of Service",
      body: "PetHeavenOnline is an online memorial platform that allows users to create, share, and discover memorial pages for pets. We provide a respectful space for tribute, remembrance, and community. Features may change over time as the service evolves.",
    },
    {
      heading: "3. User Accounts",
      body: "To create a memorial you must register for an account with accurate information. You are responsible for maintaining the security of your account and all activity that occurs under it. You may not share your account credentials with others.",
    },
    {
      heading: "4. Memorial Content",
      body: "You retain ownership of content you submit, including photos, stories, and tribute text. By submitting content you grant PetHeavenOnline a license to display it on the platform. You are solely responsible for ensuring you have the right to share any content you upload.",
    },
    {
      heading: "5. Prohibited Content",
      body: "You may not submit content that is unlawful, offensive, hateful, or violates the rights of others. Spam, impersonation, or abuse of the memorial format for commercial purposes is strictly prohibited. We reserve the right to remove content that violates these guidelines without notice.",
    },
    {
      heading: "6. Intellectual Property",
      body: "PetHeavenOnline and its original content, features, and functionality are owned by PetHeavenOnline and protected by applicable copyright and trademark laws. You may not reproduce, modify, or distribute our proprietary materials without written permission. User-submitted content remains the property of its respective owners.",
    },
    {
      heading: "7. Limitation of Liability",
      body: "PetHeavenOnline is provided \"as is\" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability shall not exceed the amount you have paid us in the past twelve months.",
    },
    {
      heading: "8. Termination",
      body: "We reserve the right to suspend or terminate your account at any time for violations of these terms. You may delete your account at any time through the account settings page. Upon termination your public memorial pages may remain accessible unless you specifically request their removal.",
    },
    {
      heading: "9. Changes to Terms",
      body: "We may update these terms from time to time and will notify you of significant changes. Your continued use of the service after changes are posted constitutes your acceptance of the updated terms. We encourage you to review this page periodically.",
    },
    {
      heading: "10. Contact Us",
      body: "If you have questions about these Terms of Service, please contact us at support@petheavenonline.com. We are committed to addressing your concerns promptly and fairly.",
    },
  ]);
}

function privacyContent() {
  return sections("Privacy Policy", [
    {
      heading: "1. Information We Collect",
      body: "We collect information you provide when creating an account or memorial, including your name, email address, and pet details. We also collect usage data such as pages visited and interactions with the service. This information helps us improve PetHeavenOnline and provide a better experience.",
    },
    {
      heading: "2. How We Use Your Information",
      body: "We use your information to provide and improve the PetHeavenOnline service, communicate with you about your account, and send optional notifications about activity on your memorials. We do not sell your personal information to third parties. We may use aggregated, anonymized data for analytics purposes.",
    },
    {
      heading: "3. Memorial Content and Photos",
      body: "Photos and stories you upload to memorials are stored securely and displayed publicly as part of the memorial page. You may request removal of any content you have uploaded at any time by contacting support. We take care to store your uploads securely and do not use them for any purpose beyond displaying your memorial.",
    },
    {
      heading: "4. Cookies",
      body: "PetHeavenOnline uses cookies to maintain your session and remember your preferences. We may also use analytics cookies to understand how visitors interact with the site. You can disable cookies in your browser settings, though some features may not function correctly as a result.",
    },
    {
      heading: "5. Data Retention",
      body: "We retain your account information and memorial content for as long as your account is active. If you delete your account we will remove your personal data within 30 days, except where required by law. Memorial pages you created may be retained in anonymized form to preserve tributes for other visitors.",
    },
    {
      heading: "6. Your Rights",
      body: "You have the right to access, correct, or delete your personal information at any time. To exercise these rights contact us at privacy@petheavenonline.com. Depending on your location you may have additional rights under applicable privacy laws such as GDPR or CCPA.",
    },
    {
      heading: "7. Children's Privacy",
      body: "PetHeavenOnline is not intended for use by children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information please contact us and we will remove it promptly.",
    },
    {
      heading: "8. Changes to This Policy",
      body: "We may update this Privacy Policy periodically and will post the revised version on this page. If changes are significant we will notify you via email or a notice on the site. Your continued use of the service after changes are posted constitutes your acceptance of the updated policy.",
    },
    {
      heading: "9. Contact Us",
      body: "For questions about this Privacy Policy or your personal data, contact us at privacy@petheavenonline.com. We aim to respond to all privacy inquiries within 14 business days.",
    },
  ]);
}

function sections(title, items) {
  const sectionsHTML = items.map(({ heading, body }) => `
    <div class="legal-section">
      <h2 class="legal-section-heading">${heading}</h2>
      <p class="legal-section-body">${body}</p>
    </div>
  `).join("");

  return `
    <h1 class="legal-title">${title}</h1>
    <p class="legal-updated">Last updated: May 2026</p>
    ${sectionsHTML}
  `;
}
