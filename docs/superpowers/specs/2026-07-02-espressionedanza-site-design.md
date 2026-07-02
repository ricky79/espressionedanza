# EspressioneDanza — Static Website Design

**Date:** 2026-07-02
**Status:** Presented in chat; explicit user approval pending (user was away — proceeding on documented assumptions, all cheap to revise)

## Purpose

A static presentation website for **EspressioneDanza**, a real Italian dance school teaching **Hip-Hop**, **Danza Moderna** (modern/contemporary), and **Cerchio Aereo** (aerial hoop). The site presents courses and teachers, shows photos, explains how to reach the school, and offers a prominent contact box with phone number and social links.

**Success criteria:** a prospective student (or parent) landing on the site understands the school's vibe within seconds, finds the course they care about, and can call / message / follow the school in one tap. Works on any static hosting with no build step.

## Confirmed decisions (from user)

- Real school; site built now with **realistic placeholder content** the owner will swap in later.
- School name: **EspressioneDanza**.
- Disciplines: Hip-Hop, Danza Moderna, Cerchio Aereo.

## Assumptions (user was away; flagged for review)

| Assumption | Default adopted | Cost to change |
|---|---|---|
| Language | Italian | Text swap only |
| Structure | Single scrolling page with anchor nav | Sections split into pages later if needed |
| Hosting | Unknown → plain static files that work anywhere (GitHub Pages / Netlify / FTP) | None — universal |
| Socials | Instagram, Facebook, TikTok, YouTube placeholders | Delete a list item |
| Contact channels | Phone (tel:), WhatsApp, email | Edit one block |

## Approach

**Pure static HTML + CSS + vanilla JS, no build step.** One `index.html`, one custom stylesheet, small JS file (mobile menu, gallery lightbox). No frameworks, no toolchain, no external JS dependencies. Rationale: smallest solution that fully does the job; trivial handoff and hosting; migratable to a static site generator later if the site grows.

Alternatives considered: static site generator (Astro/Eleventy — overkill, Node toolchain hurts handoff), template/framework (generic look, heavy deps). Rejected per YAGNI.

## Page structure (single page, Italian)

1. **Sticky nav** — school name/wordmark + anchor links: Corsi, Insegnanti, Galleria, Dove siamo, Contatti. Collapses to a hamburger menu on mobile.
2. **Hero** — full-viewport, school name, tagline, primary CTA "Prenota una lezione di prova" (links to phone/WhatsApp), scroll hint.
3. **Corsi** — 3 course cards: Hip-Hop, Danza Moderna, Cerchio Aereo. Each: evocative description, target audience (bambini/ragazzi/adulti), placeholder schedule line, level note.
4. **Insegnanti** — 3 teacher cards, one per discipline: photo placeholder, name, specialty, 2–3 sentence bio. Placeholder names: Marco Esposito (Hip-Hop), Giulia Ferrari (Danza Moderna), Sara Ricci (Cerchio Aereo).
5. **Galleria** — responsive grid of 8 placeholder images with a vanilla-JS lightbox (click to open, ESC/arrow keys, focus returned on close, no-ops gracefully if images missing).
6. **Dove siamo** — placeholder address (Via della Danza 12, Verona — clearly marked replaceable), embedded **OpenStreetMap iframe** (no API key), "Apri in Google Maps" fallback link, one line on parking/transit.
7. **Contatti (contact box)** — visually prominent: large tap-to-call phone `+39 333 0000000`, WhatsApp button, email `info@espressionedanza.it`, social icons (inline SVG, no icon fonts), opening/secretary hours placeholder.
8. **Footer** — © EspressioneDanza, P.IVA placeholder, minimal credits.

## Visual design

Developed at implementation time with the frontend-design skill. Constraints it must honor:

- Distinctive, energetic-but-elegant: urban edge (hip-hop) + fluid lines (modern) + verticality/suspension motifs (aerial hoop). No generic bootstrap-y look.
- One display font with personality + one clean body font, **self-hosted** (GDPR-clean for Italy; no Google Fonts CDN at runtime). Fallback to a deliberate system stack if font download fails during implementation.
- Placeholder photos are **stylized dance-themed SVG art** (silhouettes/gradients) so the draft looks intentional; files named `img/placeholder-*.svg` for obvious replacement.
- Mobile-first (traffic arrives from Instagram on phones); breakpoints verified at ~375 / 768 / 1280 px.
- Semantic HTML5 landmarks, WCAG AA contrast, alt text everywhere, visible focus states, `prefers-reduced-motion` respected.
- Meta description, Open Graph tags, favicon (SVG), `lang="it"`.

## Content replaceability

Every placeholder is marked with an HTML comment `<!-- SOSTITUISCI: ... -->` and catalogued in a Italian-language `README.md` table (what to replace, where, how), including: texts, photos, phone, WhatsApp number, email, social URLs, map coordinates/address, hours, P.IVA. README also gives 3-step publish instructions for GitHub Pages, Netlify, and classic FTP hosting.

## File layout

```
index.html
css/style.css
js/main.js
img/            (favicon + placeholder SVGs + self-hosted font files under img/../fonts if used)
fonts/          (self-hosted woff2, if download succeeds)
README.md       (Italian: content-replacement guide + publishing guide)
docs/superpowers/specs/  (this spec; plan doc)
```

## Error handling

Static site — no server-side concerns. JS is defensive: lightbox and menu query elements before binding; site is fully usable with JS disabled (menu falls back to visible links via CSS, gallery images still visible, map iframe independent). Map iframe has a plain link fallback. `tel:`/`wa.me` links work without JS.

## Testing

Manual verification in a real browser (open `index.html` directly — must work from `file://`): all anchors, mobile menu, lightbox keyboard handling, tel/WhatsApp/social links point to placeholders, map renders, layout at 375/768/1280 px, reduced-motion, keyboard-only navigation. No console errors.

## Out of scope

Booking system, CMS, blog/news, bilingual version, analytics/cookies (none — no banner needed), custom domain/DNS setup.
