# Tazanu Stanley — Portfolio

Personal portfolio for **Tazanu Stanley**, a software & web developer working on
full-stack products, ML-backed APIs, and AI-integrated features.

One hand-written HTML file. No framework, no build step, no dependencies.

**Live:** https://portfolio-tazan-s-projects.vercel.app

---

## Design notes

The layout follows the order recruiters actually scan in — **name → role → work →
about → toolkit → contact** — so the two things that matter most are readable in
the first few seconds without scrolling.

| Decision | Why |
|---|---|
| Typographic hero, photo moved to About | The work is the evidence; a headshot isn't the headline |
| Real projects with a spec table and metrics | Missing context is the most common portfolio weakness — each card says what it solves, how it's built, and what role was played |
| Fluid type + space scale (`clamp()`) | Every size interpolates smoothly between 360px and 1280px, so there are no layout jumps at breakpoints |
| Light & dark themes | Respects `prefers-color-scheme`, remembers an explicit choice, and darkens accents in light mode to clear WCAG AA |
| Responsive `<picture>` with WebP | Hero photo went from **1.2 MB → 42 KB** (‑96%) |
| Progressive enhancement | Scroll reveal, theme, and chat all degrade to a fully readable page without JS |

### Accessibility

- Skip link, semantic landmarks, and a labelled primary nav
- Visible `:focus-visible` rings on every interactive element
- `aria-current` on the active nav section, `aria-live` on the chat log
- Full `prefers-reduced-motion` support — all animation is disabled, not just shortened
- Body text and accents meet WCAG AA contrast in both themes

### Performance

- Total page weight well under 200 KB including the photo
- Images are lazy-loaded, `decoding="async"`, with explicit `width`/`height` to avoid layout shift
- Assets served `immutable` with a one-year cache; HTML always revalidates
- Scroll handler is `requestAnimationFrame`-throttled and passive

### SEO & sharing

Open Graph + Twitter card metadata, a generated 1200×630 preview image, a canonical
URL, and JSON-LD `Person` structured data.

---

## Features

- **AI chat widget** — an assistant that answers visitor questions about Tazanu, running
  through a serverless proxy so the API key never reaches the browser. Includes suggested
  prompts, a typing indicator, and a graceful offline fallback.
- **Selected work** — a featured flagship project plus a responsive grid, all linking to
  live sites and source.
- **Theme toggle** — persisted to `localStorage`, defaults to the system preference.
- **Scroll progress bar** and scroll-spy navigation.
- **Copy-to-clipboard** email button.

## Tech stack

- HTML5, modern CSS (custom properties, `clamp()`, `color-mix()`, fluid grids), vanilla JS
- IBM Plex Sans & IBM Plex Mono
- NVIDIA NIM API (chat backend)
- Vercel — hosting + serverless functions

## Project structure

```
portfolio/
├── index.html                    # The entire site
├── api/
│   └── chat.js                   # Serverless NVIDIA chat proxy
├── assets/
│   ├── portrait-400.{webp,jpg}   # Responsive portrait
│   ├── portrait-800.{webp,jpg}
│   ├── og.jpg                    # 1200×630 social preview
│   └── source/
│       └── portrait-original.jpg # Unoptimised original (not served)
├── vercel.json
└── README.md
```

## Deployment

```bash
git clone https://github.com/Tazanu/portfolio.git
cd portfolio
npm i -g vercel
vercel
```

Then in **Vercel → Settings → Environment Variables** add:

| Key | Value |
|-----|-------|
| `NVIDIA_API_KEY` | `nvapi-xxxxxxxxxxxxxxxx` |

```bash
vercel --prod
```

The chat widget goes live once the key is set. Without it the widget still renders and
falls back to pointing visitors at the email address.

## Local development

```bash
vercel dev
```

Create `.env.local` in the project root (never commit it):

```
NVIDIA_API_KEY=nvapi-xxxxxxxxxxxxxxxx
```

## Editing the content

Everything is in `index.html`:

- **Design tokens** — the `:root` block at the top. Change `--accent` and the whole site follows.
- **Type & space scale** — the `--step-*` and `--space-*` clamp values.
- **Projects** — the `<section id="work">` markup.
- **Chat facts** — the `PROFILE_CONTEXT` string in the script, marked `EDIT ME`.

To regenerate the images after swapping the photo, drop a new file in `assets/source/`
and re-run the Pillow resize (see git history) or any image tool that outputs
400px/800px WebP + JPEG pairs.

## Contact

- Email: stanleytazanu262@gmail.com
- GitHub: [github.com/Tazanu](https://github.com/Tazanu)
- LinkedIn: [linkedin.com/in/tazanu-stanley-7783542a3](https://www.linkedin.com/in/tazanu-stanley-7783542a3/)

---

© 2026 Tazanu Stanley
