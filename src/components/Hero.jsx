import { lazy, Suspense } from 'react'

const CapsuleField = lazy(() => import('./CapsuleField'))

function CircadianArc() {
  return (
    <svg className="hero-arc" viewBox="0 0 600 300" aria-hidden="true">
      <path d="M20 280 Q300 -60 580 280" fill="none" stroke="#e0a458" strokeWidth="1.4" strokeDasharray="1 7" strokeLinecap="round" />
      <circle cx="437" cy="98" r="7" fill="#e0a458" opacity="0.9" />
      <circle cx="437" cy="98" r="14" fill="none" stroke="#e0a458" strokeWidth="1" opacity="0.35" />
      <text x="437" y="76" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="10" fill="#8a5a1d" letterSpacing="1">
        06:00 → 24:00
      </text>
    </svg>
  )
}

export default function Hero({ t }) {
  return (
    <header className="hero" id="top">
      <Suspense fallback={null}>
        <CapsuleField />
      </Suspense>
      <CircadianArc />
      <div className="hero-inner">
        <h1>
          {t.hero.title.split('Sensilab')[0]}
          <em>Sensilab</em>
          {t.hero.title.split('Sensilab')[1]}
        </h1>
        <p className="hero-sub">{t.hero.sub}</p>
        <p className="hero-byline">{t.hero.byline}</p>
        <div>
          <a className="hero-scroll" href="#demo1">
            {t.hero.scroll} <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </header>
  )
}
