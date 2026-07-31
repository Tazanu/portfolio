# Tazanu Stanley — Portfolio

A personal portfolio website for Tazanu Stanley, a Software & Web Developer specializing in full-stack development, dev tools, and AI integrations.

## Live Site

> Deploy to Vercel and add your URL here.

## Features

- **Jumbotron Hero** — Full-viewport hero section with a floating image animation, gradient overlay, and overlapping text
- **Scroll Animations** — Fade-up reveal animations triggered as sections enter the viewport
- **AI Chat Widget** — Embedded assistant powered by NVIDIA NIM that answers visitor questions about Tazanu
- **Projects Showcase** — Cards highlighting live and open-source projects including [StudyHub](https://studyhubwebapp.vercel.app)
- **Skills Section** — Code-style display of languages, frameworks, and tooling
- **Contact Section** — Direct links to email, GitHub, and LinkedIn
- **Fully Responsive** — Works across desktop, tablet, and mobile
- **Theme Effects** — Animated teal/amber glowing orbs, gradient text, card glow on hover

## Tech Stack

- HTML5, CSS3, Vanilla JavaScript
- IBM Plex Mono & IBM Plex Sans (Google Fonts)
- NVIDIA NIM API (chat backend)
- Vercel (hosting + serverless functions)

## Project Structure

```
portfolio/
├── index.html          # Main site (single file)
├── api/
│   └── chat.js         # Serverless function — NVIDIA chat proxy
├── vercel.json         # Vercel deployment config
└── README.md
```

## Deployment

### 1. Clone the repo
```bash
git clone https://github.com/Tazanu/portfolio.git
cd portfolio
```

### 2. Deploy to Vercel
```bash
npm i -g vercel
vercel
```

### 3. Add environment variable
In your Vercel project dashboard go to **Settings → Environment Variables** and add:

| Key | Value |
|-----|-------|
| `NVIDIA_API_KEY` | `nvapi-xxxxxxxxxxxxxxxx` |

### 4. Redeploy
```bash
vercel --prod
```

The AI chat widget will be fully functional after adding the API key.

## Local Development

```bash
npm i -g vercel
vercel dev
```

Create a `.env.local` file in the root:
```
NVIDIA_API_KEY=nvapi-xxxxxxxxxxxxxxxx
```

> Never commit your `.env.local` file.

## Contact

- Email: stanleytazanu262@gmail.com
- GitHub: [github.com/Tazanu](https://github.com/Tazanu)
- LinkedIn: [linkedin.com/in/tazanu-stanley-7783542a3](https://www.linkedin.com/in/tazanu-stanley-7783542a3/)

---

© 2026 Tazanu Stanley
