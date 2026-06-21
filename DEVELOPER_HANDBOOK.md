# OfinIT Developer Handbook

This developer handbook serves as the engineering reference guide for the **OfinIT Website** project. It outlines the architecture, database schema, key security practices, and workflow conventions of the codebase.

---

## 1. Overview & Architecture

OfinIT is a professional web, software, and AI agency platform built on **Next.js 16 (App Router)** and **React 19**.

### Architectural Patterns:
* **Hybrid Dynamic/Static Generation**: The landing sections (Hero, About, Services, Features, CTA, Footer) are managed dynamically through the Admin panel. If the database is missing or fails to connect, the system falls back to default seed templates.
* **Indian GST Billing Module**: An isolated backoffice utility to manage buyers, supplier info, track invoices, fetch real-time USD-INR rates, generate PDF invoices on-the-fly, and email them directly to clients.
* **Resilient DB Singleton**: Uses a custom lazy Proxy wrapper around the Prisma Client. This allows disconnecting and swapping the underlying SQLite database file during backups/restores without needing a process restart.

---

## 2. Technology Stack

* **Core Framework**: Next.js 16.0.10 & React 19.2.0
* **Language**: TypeScript 5
* **Database & ORM**: SQLite (`dev.db`) & Prisma 6.19.0
* **CSS Framework**: Tailwind CSS v4.1.9 (configured with PostCSS `@tailwindcss/postcss`)
* **Component Library**: Radix UI Primitives & Lucide React Icons
* **Forms & Validation**: React Hook Form, Zod 3.25.76
* **Security & Verification**: Cloudflare Turnstile Site/Secret verification
* **Email System**: Nodemailer 8.0.7 (SMTP transporter)
* **PDF Utility**: `@react-pdf/renderer` 4.5.1

---

## 3. Directory Layout & Structure

```
├── app/
│   ├── actions/               # Next.js Server Actions (Mutations)
│   ├── admin/                 # Admin Dashboard pages (Blogs, Leads, Settings, Invoices)
│   ├── api/                   # REST API Endpoints (leads, newsletter, upload, csrf, fx)
│   ├── blog/                  # Public Blog views and dynamic post pages
│   ├── globals.css            # Root stylesheet
│   └── layout.tsx             # Root Layout with providers
├── components/
│   ├── admin/                 # Admin-only interactive components
│   ├── ui/                    # Reusable shadcn/ui primitives
│   └── ...                    # Section-specific components (hero, header, cta, etc.)
├── hooks/                     # Custom React hooks (e.g., csrf token loader)
├── lib/
│   ├── auth/                  # Session and admin verification helpers
│   ├── db/                    # SQLite pathing, backup/restore logic, and Prisma wrapper
│   ├── email/                 # SMTP configuration and custom mail templates
│   ├── gst/                   # GST invoices, calculations, and PDF layout rendering
│   ├── site-content/          # Address parsers, default values, page loaders
│   └── validations/           # Zod form validation schemas
├── prisma/
│   ├── dev.db                 # SQLite local database file
│   ├── schema.prisma          # Database schemas and models
│   └── seed.ts                # Database seed data script
└── scripts/
    └── verify-db.mjs          # Database integration checking script
```

---

## 4. Database Models

The relational schema maps to 11 key models under SQLite:

1. **`AdminUser`**: Holds email and bcrypt password hashes for admin panel access.
2. **`AdminPasswordResetToken`**: Secure tokens for resetting passwords.
3. **`BlogPost`**: Custom metadata, slug mapping, featured flags, JSON author payload, and canonical info.
4. **`Category`**: For organizing blog posts.
5. **`CaseStudy`**: Client portfolio entries.
6. **`GstInvoiceRecord`**: Stores full India GST invoice datasets as a JSON document.
7. **`SiteSetting`**: Key-value JSON table containing settings (Turnstile configuration, GST Buyers list, HSN codes, and active landing page text content).
8. **`LeadSubmission`**: Client contact inquiries.
9. **`NewsletterSubscription`**: Double opt-in newsletter listings with confirmation tokens.
10. **`PublicPage`**: Custom markdown content for flat text pages (e.g. Terms, Privacy Policy).
11. **`Service`**: Custom dynamic subpages for services rendered.

---

## 5. Security Protocols

### CSRF Protection (Double-Submit Cookie Pattern)
1. The client retrieves a secure, randomized CSRF token from the `/api/csrf` endpoint, which automatically registers it inside the `public_csrf` cookie.
2. All post requests submit this token inside the `X-Public-CSRF` header.
3. The server compares both tokens using `timingSafeEqual` in `verifyPublicCsrf()` before accepting the request.

### Anti-Spam Measures
* **Honeypot**: Forms feature an invisible `_gotcha` field. If filled, the server returns a silent mock success response.
* **IP Rate Limiting**: The server logs client requests inside a sliding window memory limit.
* **Cloudflare Turnstile**: Integrates challenge verification on critical forms (leads, newsletter).
* **Disposable Email Blocker**: Zod validations filter domains against list files to prevent dummy/disposable addresses.
* **Shannon Entropy Verification**: Uses message text character-diversity checks (`lib/message-entropy.ts`) to programmatically reject automated key-mashed spam submissions.

### Admin Protection
* Protected under Next.js `middleware.ts`.
* Unauthenticated visits to `/admin` are instantly rerouted to `/login`.
* Sessions are tracked via cookies: `admin_authenticated === 'true'` and `admin_email`.

---

## 6. Development Conventions

1. **Database Swapping**: To push database changes during development, run:
   ```bash
   npm run db:push
   ```
2. **Seeding mock records**:
   ```bash
   npm run db:seed
   ```
3. **Adding a UI Component**: Add your primitives to `components/ui/` and expose them through standard React patterns.
4. **Adding Server Actions**: Ensure `"use server"` is declared at the top of the file, and wrap authentication assertions:
   ```typescript
   await assertAdminAuthenticated()
   ```

---

## 7. Automatic Updates

This handbook is automatically maintained and updated when structural changes are detected in the repository (e.g., changes to `schema.prisma`, new API routes, or updated layout structures). If you modify structural files, the background scheduler will re-run analysis and synchronize the changes to this handbook.
