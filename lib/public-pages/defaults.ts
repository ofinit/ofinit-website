import type { PublicPageContent, PublicPageSlug } from "./types"

function privacyPolicyMd() {
  return `## 1. Overview
This Privacy Policy explains how **OfinIT Solutions Pvt. Ltd.** ("OfinIT", "we", "us") collects, uses, and protects information when you use our website and services.

## 2. Information we collect
- **Contact information**: name, email, phone, company (when you submit forms).
- **Usage data**: basic analytics such as pages visited and approximate location (if enabled).
- **Communication content**: messages you send to us.

## 3. How we use information
- Respond to inquiries and provide services
- Improve the website and user experience
- Security, abuse prevention, and compliance

## 4. Sharing
We do not sell personal information. We may share information with service providers (e.g., hosting/email) only as needed to operate the site, and with authorities if legally required.

## 5. Cookies
We may use cookies for essential functionality and analytics. See our **Cookie Policy** for details.

## 6. Data retention
We retain information only as long as necessary for the purposes described above or as required by law.

## 7. Your rights
Depending on your location, you may have rights to access, correct, or delete your information. Contact us at **info@ofinit.com**.

## 8. Contact
Email: **info@ofinit.com**
`
}

function termsOfServiceMd() {
  return `## 1. Acceptance
By accessing or using this website, you agree to these Terms of Service.

## 2. Use of website
You agree not to misuse the website, attempt unauthorized access, or disrupt services.

## 3. Intellectual property
Website content and branding are owned by OfinIT or its licensors. You may not copy or redistribute without permission.

## 4. Service engagements
Commercial terms for project work (scope, pricing, timelines, acceptance) are governed by written proposals, SOWs, or agreements.

## 5. Disclaimers
The website is provided "as is" without warranties to the maximum extent permitted by law.

## 6. Limitation of liability
To the extent permitted by law, OfinIT is not liable for indirect or consequential damages arising from website use.

## 7. Changes
We may update these terms from time to time. Continued use constitutes acceptance of the updated terms.

## 8. Contact
Email: **info@ofinit.com**
`
}

function cookiePolicyMd() {
  return `## 1. What are cookies?
Cookies are small text files stored on your device to help websites function and remember preferences.

## 2. How we use cookies
- **Essential**: core functionality and security.
- **Analytics (optional)**: understand site usage and improve experience (if enabled).

## 3. Managing cookies
You can control cookies through your browser settings. Disabling some cookies may impact site functionality.

## 4. Updates
We may update this Cookie Policy from time to time.
`
}

function careersMd() {
  return `## Careers at OfinIT
We’re always looking for curious builders—engineers, designers, and problem-solvers.

## How to apply
Email **info@ofinit.com** with:
- Your resume / portfolio
- The role you’re applying for
- A short note on what you want to build next

## What we value
- Ownership and clear communication
- Strong fundamentals and clean execution
- Customer empathy and pragmatism
`
}

export function getDefaultPublicPage(slug: PublicPageSlug): PublicPageContent {
  switch (slug) {
    case "privacy-policy":
      return { slug, title: "Privacy Policy", bodyMd: privacyPolicyMd() }
    case "terms-of-service":
      return { slug, title: "Terms of Service", bodyMd: termsOfServiceMd() }
    case "cookie-policy":
      return { slug, title: "Cookie Policy", bodyMd: cookiePolicyMd() }
    case "careers":
      return { slug, title: "Careers", bodyMd: careersMd() }
  }
}

