# AI koncepti za Sensilab — pitch page

Interactive job-application page: live AI chronotype quiz (n8n + Claude) and a
reorder-automation simulation. React + Vite + Three.js, bilingual SL/EN.

## Run locally
    npm install
    npm run dev

## Deploy (Vercel or Netlify)
Push to GitHub → import the repo → framework preset "Vite" → deploy.
Build command `npm run build`, output directory `dist`. No env vars needed.

## Before sharing the link — edit `src/config.js`
1. `WEBHOOK_URL` — paste your live n8n webhook. Empty = demo mode with
   pre-baked results (page still fully works and never errors).
2. `CONTACT` — name, email, LinkedIn, CV path, Calendly link.
3. Put `cv.pdf` into `/public`.

## Other assets to replace
- Landing-page thumbnails: `.thumb` placeholders in `src/App.jsx` (Background
  section) — swap for `<img>` tags with your screenshots in `/public`.
- Client testimonial: `bg.testimonial` in `src/i18n.js`.
- Day-40 email AI image: the `.email-img` placeholder in
  `src/components/RetentionDemo.jsx` — replace with your pre-generated Gemini
  image (`<img src="/winback.jpg" …>`).
- OG image: add `/public/og.jpg` and a `<meta property="og:image">` tag in
  `index.html` so the link previews well when pasted.

## Webhook contract (what n8n must accept/return)
Request:  POST JSON `{ q1..q5: 0-3, lang: "sl"|"en", website: "" }`
          (`website` is a honeypot — reject if non-empty)
Response: JSON `{ description: string, routine: string[4] }`
Anything else (timeout, error, bad shape) → the page silently falls back to
pre-baked results, so the demo can never visibly break.

## All copy
Both languages live in `src/i18n.js`. Chronotype definitions, category →
Sensilab-line mapping, and fallback texts live in `src/config.js`.
# sensilab-demo
