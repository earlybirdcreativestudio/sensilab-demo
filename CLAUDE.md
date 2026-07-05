# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page job-application pitch site (React + Vite + Three.js, bilingual SL/EN) built for a
"Junior AI Specialist" role at Sensilab. It contains two interactive demo concepts:

1. **AI product-advisor quiz** ([QuizDemo.jsx](src/components/QuizDemo.jsx)) — a 5-question
   chronotype quiz. Answers are indices only (no free text), sent to an n8n webhook which forwards
   to the Claude API for the personalized description/routine copy. The chronotype itself (which
   of `morning`/`intermediate`/`evening`) is always computed client-side by deterministic scoring
   (`scoreChronotype` in [config.js](src/config.js)), never by the AI.
2. **Reorder-automation simulation** ([RetentionDemo.jsx](src/components/RetentionDemo.jsx)) — a
   slider (days 0-45 since purchase) that drives a purely client-side, hardcoded state machine
   simulating an n8n workflow (purchase → forecast → reminder → silence → win-back), with
   pre-written example emails per stage. No network calls involved.

There is no backend in this repo — the only external integration point is the n8n webhook called
from `QuizDemo.jsx`, and it's designed to degrade invisibly to pre-baked results if unset or if the
call fails/times out (see the try/catch in `submit()`).

## Commands

```
npm install       # install deps
npm run dev       # start Vite dev server
npm run build     # production build to dist/
npm run preview   # preview the production build
```

There is no test suite, linter, or type checker configured in this repo.

## Architecture

- **[src/config.js](src/config.js)** — the one file meant to be edited before sharing the link:
  `WEBHOOK_URL` (empty = demo mode, pre-baked results, page never errors), `CONTACT` info, and
  `CHRONOTYPES` (the three chronotype definitions: energy curve, category→Sensilab-line mapping,
  fallback description/routine copy per language). Product-category mapping is intentionally
  hardcoded here rather than left to the AI.
- **[src/i18n.js](src/i18n.js)** — all UI copy for both `sl` and `en`, keyed under `STRINGS[lang]`.
  `App.jsx` picks `t = STRINGS[lang]` and threads it down as a `t` prop through every section
  component; there's no i18n library. Every component in this repo takes `t` (and sometimes `lang`)
  as props rather than reading global state.
- **[src/App.jsx](src/App.jsx)** — page composition only: `Nav`, `Hero`, `Bridge`, `QuizDemo`,
  `RetentionDemo`, `Background`, `Skills`, `About`, footer, in that scroll order. Section-level
  components not broken into their own files live directly here (`Nav`, `Bridge`, `Background`,
  `Skills`, `About`).
- **[src/components/CapsuleField.jsx](src/components/CapsuleField.jsx)** — the Three.js hero
  background (floating capsule/sphere meshes, mouse parallax). Lazy-loaded via `React.lazy` from
  `Hero.jsx` and fully self-contained: sets up its own scene/renderer/RAF loop in a `useEffect` and
  tears everything down (geometry/material dispose, renderer dispose, listener removal) in the
  cleanup function. Respects `prefers-reduced-motion` by skipping the RAF loop.
- **Webhook contract** (see [README.md](README.md) for full details): POST JSON
  `{ q1..q5: 0-3, lang, website: "" }` (`website` is a honeypot, n8n should reject if non-empty) →
  expects `{ description: string, routine: string[4] }` back. Any deviation (timeout, error, wrong
  shape) is caught in `QuizDemo.submit()` and silently falls back to the pre-baked
  `CHRONOTYPES[typeKey][lang]` copy — the demo must never visibly break regardless of backend state.
- Styling is a single global stylesheet, [src/styles.css](src/styles.css) — no CSS modules or
  CSS-in-JS.

## Content editing notes

- Placeholder assets to swap before sharing: `.thumb` divs in the `Background` section of
  `App.jsx` (landing-page screenshots), `bg.testimonial` in `i18n.js`, the `.email-img` placeholder
  in `RetentionDemo.jsx` (day-40 AI-generated image), and an OG image + meta tag in `index.html`.
  `cv.pdf` referenced by `CONTACT.cv` must be placed in `/public`.
- Both languages must be kept in sync in `i18n.js` — the two `STRINGS.sl` / `STRINGS.en` objects
  mirror each other key-for-key.
