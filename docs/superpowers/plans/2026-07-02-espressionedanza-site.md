# EspressioneDanza Static Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> **This session:** executed inline via superpowers:executing-plans (user AFK; unrequested subagents not permitted by harness policy). Task 4 (CSS/visual craft) MUST be executed under the frontend-design skill.

**Goal:** A single-page static Italian website for the dance school EspressioneDanza (hip-hop, danza moderna, cerchio aereo) with courses, teachers, gallery, directions, and a prominent contact box — all content as clearly-marked realistic placeholders.

**Architecture:** Pure static files, no build step: one `index.html` holding all content, one custom stylesheet, one small vanilla-JS file (mobile menu, lightbox, active-section nav). Self-hosted fonts, inline SVG icons, SVG placeholder art, OpenStreetMap iframe. Must work opened directly from `file://` and on any static host.

**Tech Stack:** HTML5, CSS3 (custom properties, grid, clamp), vanilla ES5-compatible JS, self-hosted Google Fonts woff2 (Syne + Work Sans), OpenStreetMap embed.

## Global Constraints

- All site copy in **Italian**; `<html lang="it">`.
- **No runtime external dependencies**: no CDN scripts/styles, no Google Fonts at runtime, no icon fonts, no analytics/cookies (no cookie banner needed). Only external runtime resource: the OpenStreetMap iframe (with plain-link fallback).
- Every placeholder marked `<!-- SOSTITUISCI: ... -->` in HTML and catalogued in `README.md`.
- Placeholder values (exact, used everywhere): phone `+39 333 0000000` (tel: `+393330000000`), WhatsApp `https://wa.me/393330000000`, email `info@espressionedanza.it`, address `Via della Danza 12, 37100 Verona`, socials `https://instagram.com/espressionedanza`, `https://facebook.com/espressionedanza`, `https://tiktok.com/@espressionedanza`, `https://youtube.com/@espressionedanza`, P.IVA `00000000000`, map marker `45.4384, 10.9936`.
- Accessibility: semantic landmarks, alt text on every img, visible focus states, WCAG AA contrast, `prefers-reduced-motion` respected, lightbox keyboard-operable (ESC, arrows), site fully usable with JS disabled.
- Design tokens (palette/fonts) are fixed in Task 4 and must be used verbatim.
- Section ids (fixed interface between HTML, CSS, JS, nav): `hero`, `corsi`, `insegnanti`, `galleria`, `dove-siamo`, `contatti`.
- Verification is manual/structural (no test framework for a static page): exact greps, XML validation for SVGs, browser checks with expected observations. Final task is an end-to-end browser pass.

---

### Task 1: Scaffold + self-hosted fonts

**Files:**
- Create: `fonts/syne-700.woff2`, `fonts/syne-800.woff2`, `fonts/worksans-400.woff2`, `fonts/worksans-500.woff2`, `fonts/worksans-600.woff2`, `fonts/worksans-italic-400.woff2`
- Create: directories `css/`, `js/`, `img/`, `fonts/`

**Interfaces:**
- Produces: font files whose exact names are referenced by `@font-face` in Task 4. If download fails, `fonts/` may be empty — Task 4's font stacks fall back silently (missing @font-face source ⇒ next family in stack).

- [ ] **Step 1: Create directories and download the 6 woff2 files (latin subset)**

Run in Bash (Git Bash) from `C:\Progetti\oasi`:

```bash
mkdir -p css js img fonts
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
fetch_font () {
  css=$(curl -fsS -A "$UA" "https://fonts.googleapis.com/css2?family=$2&display=swap") || return 1
  url=$(printf '%s' "$css" | grep -A 12 '/\* latin \*/' | grep -o 'https://[^)]*\.woff2' | head -1)
  [ -n "$url" ] && curl -fsS -o "fonts/$1" "$url"
}
fetch_font syne-700.woff2 'Syne:wght@700'
fetch_font syne-800.woff2 'Syne:wght@800'
fetch_font worksans-400.woff2 'Work+Sans:wght@400'
fetch_font worksans-500.woff2 'Work+Sans:wght@500'
fetch_font worksans-600.woff2 'Work+Sans:wght@600'
fetch_font worksans-italic-400.woff2 'Work+Sans:ital,wght@1,400'
ls -la fonts/
```

- [ ] **Step 2: Verify**

Expected: `ls -la fonts/` lists 6 `.woff2` files, each > 5000 bytes. If curl fails (offline), remove any zero-byte files and continue — Task 4 fallback stacks cover it; note it in the final report.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "chore: scaffold directories and self-host Syne + Work Sans fonts"
```

---

### Task 2: index.html — complete page with all content

**Files:**
- Create: `index.html`

**Interfaces:**
- Consumes: font files from Task 1 (indirectly via CSS), image paths created in Task 3, `css/style.css` (Task 4), `js/main.js` (Task 5). Referencing them before they exist is fine — browsers degrade gracefully; final check is Task 7.
- Produces: DOM contract used by CSS/JS: section ids listed in Global Constraints; classes `site-header`, `nav-toggle` (button, `aria-controls="nav-menu"`, `aria-expanded`), `nav-menu` (id `nav-menu`), `brand`, `hero`, `marquee`, `corsi-griglia`, `card-corso`, `insegnanti-griglia`, `card-insegnante`, `galleria-griglia`, `foto`, `mappa-wrap`, `contatto-box`, `social-badge`, `lightbox` (+ `lightbox-close`, `lightbox-prev`, `lightbox-next`, `lightbox-caption`), body state classes `nav-open`, `lightbox-open` (set by JS).

- [ ] **Step 1: Write `index.html`**

Head (exact):

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>EspressioneDanza — Scuola di danza a Verona | Hip-Hop, Moderna, Cerchio Aereo</title>
  <meta name="description" content="Corsi di hip-hop, danza moderna e cerchio aereo per bambini, ragazzi e adulti a Verona. Prenota una lezione di prova gratuita.">
  <meta property="og:title" content="EspressioneDanza — Scuola di danza a Verona">
  <meta property="og:description" content="Hip-hop, danza moderna e cerchio aereo per tutte le età. Prima lezione di prova gratuita.">
  <meta property="og:type" content="website">
  <link rel="icon" type="image/svg+xml" href="img/favicon.svg">
  <link rel="stylesheet" href="css/style.css">
</head>
```

Body structure and full copy (build exactly this; decorative flourishes may be added in Task 4 but content and attributes below are fixed):

1. `<header class="site-header">` — `<a class="brand" href="#hero">Espressione<span>Danza</span></a>`; `<button class="nav-toggle" aria-controls="nav-menu" aria-expanded="false"><span class="sr-only">Menu</span>` + 2 burger bars `</button>`; `<nav id="nav-menu" class="nav-menu" aria-label="Principale"><ul>` links: Corsi `#corsi`, Insegnanti `#insegnanti`, Galleria `#galleria`, Dove siamo `#dove-siamo`, Contatti `#contatti`.
2. `<main>`:
   - `<section id="hero">` — kicker `Scuola di danza · Verona`; `<h1>Muoviti come sei.</h1>`; lead: `Hip-hop, danza moderna e cerchio aereo per bambini, ragazzi e adulti. Tecnica, espressione e una sala che diventa casa.`; CTA primaria `<a href="https://wa.me/393330000000">Prenota una lezione di prova</a>` (+ `<!-- SOSTITUISCI: numero WhatsApp -->`), CTA secondaria `<a href="#corsi">Scopri i corsi</a>`. Decorative ring SVG aria-hidden.
   - Marquee strip `<div class="marquee" aria-hidden="true">` with repeated text `HIP-HOP · DANZA MODERNA · CERCHIO AEREO · ` (repeat ≥ 8 times inside a `.marquee-track` span, duplicated twice for seamless loop).
   - `<section id="corsi">` — `<h2>I corsi</h2>`, intro: `Tre discipline, un unico filo: l'espressione. I gruppi sono divisi per età e livello — la prima lezione di prova è sempre gratuita.` Grid `corsi-griglia` with 3 `<article class="card-corso">`:
     - **01 · Hip-Hop** — `Groove, freestyle e coreografie: dalle fondamenta old school ai linguaggi più attuali della scena urbana.` Meta: `Bambini 6–10 · Ragazzi 11–17 · Adulti` / `Mar e Gio · 18:00–19:30 <!-- SOSTITUISCI: orari reali -->` / `Dal principiante all'avanzato`.
     - **02 · Danza Moderna** — `Tecnica, fluidità e interpretazione: un percorso tra modern jazz e contemporaneo per dare forma alle emozioni.` Meta: `Ragazzi 11–17 · Adulti` / `Lun e Mer · 17:30–19:00 <!-- SOSTITUISCI: orari reali -->` / `Base e intermedio`.
     - **03 · Cerchio Aereo** — `Forza, grazia e un pizzico di vertigine: danza aerea sul cerchio, in piccoli gruppi e in totale sicurezza.` Meta: `Ragazzi e adulti` / `Ven · 18:30–20:00 · Sab · 10:00–11:30 <!-- SOSTITUISCI: orari reali -->` / `Max 8 persone per corso`.
   - `<section id="insegnanti">` — `<h2>Gli insegnanti</h2>`, intro `Professionisti che salgono ancora sul palco — e che in sala, prima di tutto, ascoltano.` Grid with 3 `<article class="card-insegnante">` (img `img/placeholder-insegnante-0N.svg`, alt `Foto di <nome> — segnaposto`, `<!-- SOSTITUISCI: foto e bio insegnante -->`):
     - **Marco Esposito** — Hip-Hop — `Cresciuto nelle battle, porta in sala vent'anni di scena urbana. Le sue lezioni: fondamenta solide, groove e tanta libertà.`
     - **Giulia Ferrari** — Danza Moderna — `Diplomata in danza contemporanea, ha danzato in compagnie italiane ed europee. Lavora su tecnica, respiro e interpretazione.`
     - **Sara Ricci** — Cerchio Aereo — `Performer aerea e istruttrice certificata. Con lei si vola in sicurezza: progressioni graduali e attenzione a ogni dettaglio.`
   - `<section id="galleria">` — `<h2>La galleria</h2>`, intro `Sala, allenamenti e saggi: qualche scatto di chi siamo quando ci muoviamo.` `<!-- SOSTITUISCI: foto reali della scuola -->` Grid `galleria-griglia` of 8 `<a class="foto" href="img/placeholder-galleria-0N.svg" data-caption="Segnaposto — sostituire con foto reale"><img src="img/placeholder-galleria-0N.svg" alt="Segnaposto galleria N" loading="lazy"></a>`.
   - `<section id="dove-siamo">` — `<h2>Dove siamo</h2>`; address block: `Via della Danza 12, 37100 Verona <!-- SOSTITUISCI: indirizzo reale -->` + `A 5 minuti a piedi dalla stazione di Porta Nuova. Parcheggio libero nelle vie laterali. <!-- SOSTITUISCI: indicazioni reali -->`; `<div class="mappa-wrap"><iframe title="Mappa — dove trovarci" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=10.9856%2C45.4344%2C11.0016%2C45.4424&amp;layer=mapnik&amp;marker=45.4384%2C10.9936"></iframe></div> <!-- SOSTITUISCI: coordinate mappa -->` + link `Apri in Google Maps` → `https://www.google.com/maps/search/?api=1&query=Via+della+Danza+12+Verona`.
   - `<section id="contatti">` — `<h2>Contatti</h2>`, lead `La prima lezione di prova è gratuita: chiamaci o scrivici, oppure passa a trovarci in segreteria.` Inside `<div class="contatto-box">`: big phone `<a href="tel:+393330000000">+39 333 0000000</a> <!-- SOSTITUISCI: telefono reale -->`; WhatsApp button → `https://wa.me/393330000000`; email `<a href="mailto:info@espressionedanza.it">info@espressionedanza.it</a>`; hours `Segreteria: lun–ven · 16:00–20:00 <!-- SOSTITUISCI: orari segreteria -->`; social list of 4 `<a class="social-badge">` (Instagram/Facebook/TikTok/YouTube, URLs from Global Constraints, each `target="_blank" rel="noopener"`, monogram badge text `IG`/`FB`/`TT`/`YT` + `sr-only` full name, `<!-- SOSTITUISCI: link social reali -->`).
3. `<footer>` — `© 2026 EspressioneDanza · P.IVA 00000000000 <!-- SOSTITUISCI: P.IVA reale -->` + `Sito realizzato con ♥ — foto segnaposto in attesa di quelle vere.`
4. Lightbox at end of body (exact):

```html
<div class="lightbox" hidden role="dialog" aria-modal="true" aria-label="Foto a schermo intero">
  <button class="lightbox-close" type="button" aria-label="Chiudi">×</button>
  <button class="lightbox-prev" type="button" aria-label="Foto precedente">‹</button>
  <figure><img src="" alt=""><figcaption class="lightbox-caption"></figcaption></figure>
  <button class="lightbox-next" type="button" aria-label="Foto successiva">›</button>
</div>
<script src="js/main.js"></script>
```

- [ ] **Step 2: Verify structure**

```bash
grep -c 'SOSTITUISCI' index.html          # expected: >= 10
grep -o 'id="[a-z-]*"' index.html | sort  # expected: contains hero, corsi, insegnanti, galleria, dove-siamo, contatti, nav-menu
grep -c 'placeholder-galleria' index.html # expected: 16 (8 links + 8 imgs)
```

- [ ] **Step 3: Commit**

```bash
git add index.html && git commit -m "feat: page structure and full Italian placeholder content"
```

---

### Task 3: SVG assets — favicon, gallery, and teacher placeholders

**Files:**
- Create: `img/favicon.svg`, `img/placeholder-galleria-01.svg` … `img/placeholder-galleria-08.svg`, `img/placeholder-insegnante-01.svg` … `img/placeholder-insegnante-03.svg`

**Interfaces:**
- Produces: the exact filenames referenced by Task 2's markup.

- [ ] **Step 1: favicon (exact code)**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#100D12"/>
  <circle cx="32" cy="32" r="20" fill="none" stroke="#FF4632" stroke-width="4"/>
  <text x="32" y="41" font-family="Arial, sans-serif" font-size="26" font-weight="800" fill="#F5F0E6" text-anchor="middle">E</text>
</svg>
```

- [ ] **Step 2: gallery placeholders — 8 variations of this template (800×600)**

Template (this IS `placeholder-galleria-01.svg`; others vary per table):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-label="Segnaposto foto — sostituire con una foto reale">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#1B171F"/><stop offset="1" stop-color="#3A2430"/>
  </linearGradient></defs>
  <rect width="800" height="600" fill="url(#g)"/>
  <circle cx="600" cy="180" r="140" fill="none" stroke="#FF4632" stroke-width="3" opacity=".9"/>
  <circle cx="620" cy="200" r="180" fill="none" stroke="#8C7AE6" stroke-width="1.5" opacity=".5"/>
  <path d="M0 470 Q 200 380 400 460 T 800 440" fill="none" stroke="#F5F0E6" stroke-width="2" opacity=".35"/>
  <text x="40" y="560" font-family="Arial, sans-serif" font-size="20" letter-spacing="4" fill="#F5F0E6" opacity=".55">ESPRESSIONEDANZA · FOTO 01</text>
</svg>
```

Variations (change gradient end color, ring accent, composition, label NN):
| N | gradient end | ring stroke | composition tweak |
|---|---|---|---|
| 02 | `#2A1E3C` | `#8C7AE6` | rings left (cx 200/220), wave flipped (`M0 440 Q 200 520 400 450 T 800 470`) |
| 03 | `#3C2A1E` | `#FFB13D` | one big ring center (cx 400, cy 300, r 220), no second ring |
| 04 | `#1E3C34` | `#FF4632` | three concentric rings cx 650 cy 450 r 60/100/140 |
| 05 | `#3A2430` | `#F5F0E6` | diagonal line `M0 600 L800 0` stroke-width 1 opacity .3 + ring cx 250 cy 250 r 120 |
| 06 | `#2A1E3C` | `#FF4632` | rings cx 400 cy 120 r 90/130, wave amplitude doubled |
| 07 | `#3C2A1E` | `#8C7AE6` | ring bottom-left cx 150 cy 480 r 160 |
| 08 | `#1E3C34` | `#FFB13D` | two rings cx 300/520 cy 300 r 110 (intersecting) |

Every file: unique `id` for the gradient is NOT needed across files (separate documents), keep `id="g"`; update label text `FOTO NN`.

- [ ] **Step 3: teacher placeholders — 3 files (600×800, arch motif, initials)**

`placeholder-insegnante-01.svg` (02/03: change initials ME→GF→SR, arch stroke `#FF4632`→`#F5F0E6`→`#8C7AE6`, gradient end `#3A2430`→`#2A1E3C`→`#1E3C34`):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" role="img" aria-label="Segnaposto foto insegnante — sostituire con una foto reale">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#1B171F"/><stop offset="1" stop-color="#3A2430"/>
  </linearGradient></defs>
  <rect width="600" height="800" fill="url(#g)"/>
  <path d="M120 700 V 360 A 180 180 0 0 1 480 360 V 700" fill="none" stroke="#FF4632" stroke-width="3"/>
  <text x="300" y="540" font-family="Arial, sans-serif" font-size="96" font-weight="800" fill="#F5F0E6" opacity=".85" text-anchor="middle">ME</text>
  <text x="300" y="740" font-family="Arial, sans-serif" font-size="18" letter-spacing="4" fill="#F5F0E6" opacity=".5" text-anchor="middle">FOTO IN ARRIVO</text>
</svg>
```

- [ ] **Step 4: Verify all 12 SVGs are valid XML**

PowerShell: `Get-ChildItem img/*.svg | ForEach-Object { try { [xml](Get-Content $_.FullName -Raw) | Out-Null; "$($_.Name) OK" } catch { "$($_.Name) INVALID" } }`
Expected: 12 lines ending in `OK`.

- [ ] **Step 5: Commit**

```bash
git add img && git commit -m "feat: favicon and SVG placeholder art for gallery and teachers"
```

---

### Task 4: css/style.css — full visual design (frontend-design skill REQUIRED)

**Files:**
- Create: `css/style.css`

**Interfaces:**
- Consumes: DOM contract from Task 2, font files from Task 1.
- Produces: body state class behaviors JS relies on: `body.nav-open` shows the mobile menu; `body.lightbox-open` sets `overflow: hidden`; `.is-active` nav link style; `.sr-only` utility.

**Design system (fixed — use verbatim):**

```css
:root {
  --ink: #100D12; --ink-soft: #1B171F;
  --paper: #F5F0E6; --paper-dim: #EAE3D3;
  --accent: #FF4632; --accent-deep: #C22A1C;
  --violet: #8C7AE6; --amber: #FFB13D;
  --line: rgba(16,13,18,.14); --line-inv: rgba(245,240,230,.16);
  --muted: rgba(16,13,18,.66); --muted-inv: rgba(245,240,230,.7);
  --font-display: "Syne", "Segoe UI", system-ui, sans-serif;
  --font-body: "Work Sans", "Segoe UI", system-ui, sans-serif;
}
```

`@font-face` for the 6 files from Task 1 (`font-display: swap`, `woff2` only, exact filenames). Missing files fall back silently to the stacks above.

**Section treatments (fixed direction; craft the details under frontend-design):**
- Theatrical stage mood: dark sections on `--ink`, light on `--paper`, alternating: hero dark → corsi light → insegnanti dark → galleria dark (`--ink-soft`) → dove-siamo light → contatti dark → footer dark. Ring/arc motifs throughout (echo of cerchio aereo).
- Sticky header: translucent ink (backdrop-filter blur), brand in Syne with `span` in `--accent`; hamburger below 760px, full-screen overlay menu (`body.nav-open`), giant Syne links.
- Hero: full viewport, huge uppercase Syne `clamp(2.8rem, 9vw, 6.5rem)`, kicker in accent letterspaced caps, big decorative ring stroke overlapping right edge, CTAs: solid accent pill + outlined pill.
- Marquee: accent background, ink Syne text, slight `-2deg` rotate, `.marquee-track` duplicated content animated `translateX(-50%)` 30s linear infinite; `prefers-reduced-motion: reduce` ⇒ animation none (all animations/transitions).
- Course cards: numbered `01/02/03` oversized ghost numerals, top rule, hover lift + accent rule; card 03 gets `--violet` accents.
- Teacher cards: arch-cropped portraits (`border-radius: 50% 50% 0 0 / 33% 33% 0 0` on a 3:4 img), name Syne, role in accent caps.
- Gallery: CSS grid `repeat(auto-fill, minmax(220px, 1fr))`, items 2 and 7 span 2 columns on ≥760px (`grid-column: span 2`), hover scale 1.03 on img (overflow hidden), focus-visible outline.
- Dove siamo: 2-col ≥ 900px (address card + map), `mappa-wrap iframe` 100%×min 380px, border-radius 16px, border `--line`.
- Contact box: `--ink-soft` panel, accent border ring motif, phone number in Syne `clamp(1.8rem, 5vw, 3rem)`, WhatsApp solid pill, social monogram badges: 48px circles, 1.5px `--line-inv` border, hover accent border + raise.
- Focus states: `:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }` (on dark sections use `--amber` if accent-on-dark contrast is insufficient).
- Contrast floor: body text `--paper` on `--ink` / `--ink` on `--paper`; never accent-on-ink for body-size text (accent only for large display text, rules, and interactive accents with `--paper` labels).
- `.sr-only` standard clip utility. Smooth scrolling `html { scroll-behavior: smooth; }` inside a `prefers-reduced-motion: no-preference` media query, plus `scroll-margin-top` on sections for the sticky header.
- Mobile-first; key breakpoints ~`760px` and `1080px`; max content width `1160px` with fluid padding.

- [ ] **Step 1: Invoke frontend-design skill; write the full stylesheet implementing everything above**
- [ ] **Step 2: Verify in browser** — open `index.html` (e.g. `start index.html`): styled page, no horizontal scrollbar at 375px width, hero fills viewport, all 7 section treatments present, focus ring visible when tabbing.
- [ ] **Step 3: Commit** — `git add css && git commit -m "feat: full visual design (theatrical stage system, Syne/Work Sans)"`

---

### Task 5: js/main.js — menu, lightbox, active nav link

**Files:**
- Create: `js/main.js`

**Interfaces:**
- Consumes: DOM contract from Task 2; CSS state classes from Task 4.

- [ ] **Step 1: Write `js/main.js` (exact code)**

```js
// EspressioneDanza — menu mobile, evidenziazione sezione attiva, lightbox galleria
(function () {
  'use strict';

  // --- Menu mobile ---
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- Link attivo durante lo scroll ---
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.remove('is-active'); });
        var link = byId[entry.target.id];
        if (link) link.classList.add('is-active');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { observer.observe(s); });
  }

  // --- Lightbox galleria ---
  var thumbs = Array.prototype.slice.call(document.querySelectorAll('.galleria-griglia a.foto'));
  var lightbox = document.querySelector('.lightbox');
  if (thumbs.length && lightbox) {
    var img = lightbox.querySelector('img');
    var caption = lightbox.querySelector('.lightbox-caption');
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var prevBtn = lightbox.querySelector('.lightbox-prev');
    var nextBtn = lightbox.querySelector('.lightbox-next');
    var current = -1;
    var lastFocus = null;

    function show(i) {
      current = (i + thumbs.length) % thumbs.length;
      var a = thumbs[current];
      var thumbImg = a.querySelector('img');
      img.src = a.getAttribute('href');
      img.alt = thumbImg ? thumbImg.alt : '';
      caption.textContent = a.getAttribute('data-caption') || '';
    }
    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      lightbox.hidden = false;
      document.body.classList.add('lightbox-open');
      closeBtn.focus();
    }
    function close() {
      lightbox.hidden = true;
      document.body.classList.remove('lightbox-open');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    thumbs.forEach(function (a, i) {
      a.addEventListener('click', function (e) { e.preventDefault(); open(i); });
    });
    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function () { show(current - 1); });
    nextBtn.addEventListener('click', function () { show(current + 1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }
})();
```

- [ ] **Step 2: Verify in browser** — narrow window (<760px): hamburger opens/closes menu, clicking a link closes it and scrolls; gallery click opens lightbox, arrows + ESC work, focus returns to clicked thumbnail; scrolling updates the highlighted nav link; console has no errors.
- [ ] **Step 3: Commit** — `git add js && git commit -m "feat: mobile menu, gallery lightbox, active-section nav"`

---

### Task 6: README.md — Italian content-replacement and publishing guide

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write README.md** with these sections (in Italian, complete):
  1. **Cos'è** — one paragraph: static site, no build, open `index.html`.
  2. **Come sostituire i contenuti** — table: every `SOSTITUISCI` marker → file/section → what to put there (phone in 3 places: tel link text, tel href, wa.me links; email; address; hours ×2; teacher photos/bios; gallery photos with recommended size ≥1200px JPG; map bbox+marker with instructions to get coordinates from openstreetmap.org "Condividi"; social URLs; P.IVA; tagline if desired).
  3. **Sostituire le foto** — drop JPGs in `img/`, update `src`/`href` in gallery (both the `<a href>` and `<img src>`), keep `alt` meaningful.
  4. **Sostituire le icone social** — monogram badges by design; to use official logos, download SVGs from https://simpleicons.org and replace badge content.
  5. **Font** — self-hosted in `fonts/` (GDPR-friendly); if absent the site falls back to system fonts.
  6. **Pubblicare il sito** — GitHub Pages (repo → Settings → Pages → deploy from branch), Netlify (drag&drop of the folder on app.netlify.com/drop), hosting FTP classico (upload everything to `public_html/`).
- [ ] **Step 2: Verify** — `grep -c '^#' README.md` ≥ 6 headings; proofread Italian.
- [ ] **Step 3: Commit** — `git add README.md && git commit -m "docs: Italian guide for content replacement and publishing"`

---

### Task 7: End-to-end verification in a real browser

**Files:** possibly small fixes to any of the above.

- [ ] **Step 1: Open the site in Chrome** via claude-in-chrome tools (file:// URL). If browser automation is unavailable, `start index.html` and verify manually; report the limitation.
- [ ] **Step 2: Check at ~1280px:** hero fills viewport; nav anchors scroll to right sections with correct sticky-header offset; marquee animates; map iframe renders Verona; all images load (12 SVGs); console free of errors (missing-font 404s acceptable only if Task 1 failed).
- [ ] **Step 3: Check at ~375px:** no horizontal overflow; hamburger menu works; course cards stack; contact box readable; tap targets ≥ 44px.
- [ ] **Step 4: Interactions:** lightbox open/prev/next/ESC; tel:/wa.me/mailto links present with placeholder values; social links open placeholder profiles in new tab.
- [ ] **Step 5: Fix anything found, re-verify, then commit fixes** — `git add -A && git commit -m "fix: post-verification adjustments"` (only if fixes were needed).

---

## Self-review (done at plan time)

- **Spec coverage:** all 8 page sections → Task 2; visual constraints + fonts → Tasks 1/4; SVG placeholders → Task 3; lightbox/menu/JS-off degradation → Task 5 (+ CSS fallbacks in Task 4); README + publishing → Task 6; browser testing → Task 7; no-cookies/no-CDN → Global Constraints. Gaps: none found.
- **Placeholder scan:** the many "SOSTITUISCI/placeholder" strings are *deliverables* (content markers), not plan gaps. No TBD/TODO items remain.
- **Type consistency:** section ids and class names cross-checked between Task 2 (HTML), Task 4 (CSS treatments), Task 5 (JS selectors: `.nav-toggle`, `#nav-menu`, `.nav-menu a[href^="#"]`, `.galleria-griglia a.foto`, `.lightbox*`, `nav-open`, `lightbox-open`, `is-active`) — consistent.
