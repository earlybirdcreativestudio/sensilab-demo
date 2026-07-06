import { useState } from 'react'
import { WEBHOOK_URL, CHRONOTYPES, PRODUCTS, scoreChronotype } from '../config'

function ProductCard({ slug, lang, added, onAdd, addLabel, addedLabel }) {
  const p = PRODUCTS[slug]
  if (!p) return null
  return (
    <div className="product-card">
      <div className="product-img">
        <img src={p.img} alt={p[lang]} loading="lazy" />
      </div>
      <p className="product-title">{p[lang]}</p>
      <button
        className={`cta${added ? ' added' : ''}`}
        onClick={() => onAdd(slug)}
        disabled={added}
      >
        {added ? addedLabel : addLabel}
      </button>
    </div>
  )
}

function EnergyCurve({ curve, label }) {
  const w = 560
  const h = 130
  const pad = 26
  const xs = curve.map((_, i) => pad + (i * (w - pad * 2)) / (curve.length - 1))
  const ys = curve.map((v) => h - pad - (v / 10) * (h - pad * 2))
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x} ${ys[i]}`).join(' ')
  const peak = curve.indexOf(Math.max(...curve))
  const hours = ['06', '09', '12', '15', '18', '21', '24', '03']
  return (
    <div className="energy-curve">
      <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>{label}</h4>
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label}>
        <path d={`${d} L${xs[xs.length - 1]} ${h - pad} L${xs[0]} ${h - pad} Z`} fill="#e4efe8" opacity="0.7" />
        <path d={d} fill="none" stroke="#1d6e4e" strokeWidth="2" strokeLinecap="round" />
        <circle cx={xs[peak]} cy={ys[peak]} r="5" fill="#e0a458" />
        {hours.map((hr, i) => (
          <text key={hr} x={xs[i]} y={h - 8} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="9.5" fill="#7d8c84">
            {hr}h
          </text>
        ))}
      </svg>
    </div>
  )
}

export default function QuizDemo({ t, lang }) {
  const q = t.quiz
  const [step, setStep] = useState(-1) // -1 intro, 0-4 questions, 5 loading, 6 result
  const [answers, setAnswers] = useState([null, null, null, null, null])
  const [result, setResult] = useState(null) // { typeKey, description, routine, live }
  const [cart, setCart] = useState([]) // slugs added to the simulated cart

  const addToCart = (slug) => setCart((c) => (c.includes(slug) ? c : [...c, slug]))

  const pick = (i) => {
    const next = [...answers]
    next[step] = i
    setAnswers(next)
  }

  const submit = async () => {
    setStep(5)
    const typeKey = scoreChronotype(answers)
    const fallback = CHRONOTYPES[typeKey][lang]
    if (!WEBHOOK_URL) {
      setTimeout(() => {
        setResult({ typeKey, description: fallback.description, routine: fallback.routine, live: false })
        setStep(6)
      }, 900)
      return
    }
    try {
      const ctrl = new AbortController()
      const timer = setTimeout(() => ctrl.abort(), 9000)
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: ctrl.signal,
        body: JSON.stringify({
          q1: answers[0], q2: answers[1], q3: answers[2], q4: answers[3], q5: answers[4],
          lang,
          website: '', // honeypot — must stay empty
        }),
      })
      clearTimeout(timer)
      const data = await res.json()
      if (!data || typeof data.description !== 'string' || !Array.isArray(data.routine) || data.routine.length < 3) {
        throw new Error('bad shape')
      }
      setResult({ typeKey, description: data.description, routine: data.routine.slice(0, 4), live: true })
    } catch {
      setResult({ typeKey, description: fallback.description, routine: fallback.routine, live: false, errored: true })
    }
    setStep(6)
  }

  const reset = () => {
    setAnswers([null, null, null, null, null])
    setResult(null)
    setCart([])
    setStep(-1)
  }

  const type = result ? CHRONOTYPES[result.typeKey] : null

  return (
    <section className="section" id="demo1">
      <div className="section-inner">
        <span className="eyebrow">{q.eyebrow}</span>
        <h2>{q.title}</h2>
        <p className="lead">{q.lead}</p>

        <div className="demo-shell">
          {step === -1 && (
            <div className="intro-cta quiz-step" key="intro">
              <button className="btn primary" onClick={() => setStep(0)}>{q.start} →</button>
            </div>
          )}

          {step >= 0 && step <= 4 && (
            <div className="quiz-step" key={step}>
              <div className="quiz-progress" aria-hidden="true">
                {q.questions.map((_, i) => (
                  <span key={i} className={i <= step ? 'done' : ''} />
                ))}
              </div>
              <p className="quiz-q">{q.questions[step].q}</p>
              <div className="quiz-opts" role="group" aria-label={q.questions[step].q}>
                {q.questions[step].a.map((opt, i) => (
                  <button key={opt} className={answers[step] === i ? 'sel' : ''} onClick={() => pick(i)}>
                    {opt}
                  </button>
                ))}
              </div>
              <div className="quiz-nav">
                {step > 0 && (
                  <button className="btn ghost" onClick={() => setStep(step - 1)}>← {q.back}</button>
                )}
                {step < 4 ? (
                  <button className="btn" disabled={answers[step] === null} onClick={() => setStep(step + 1)}>
                    {q.next} →
                  </button>
                ) : (
                  <button className="btn primary" disabled={answers[step] === null} onClick={submit}>
                    {q.submit} →
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="quiz-loading quiz-step" role="status">
              <span className="spinner" aria-hidden="true" /> {q.loading}
            </div>
          )}

          {step === 6 && result && (
            <div className="quiz-step">
              <div className="result-head">
                <span className={`badge ${result.live ? 'live' : 'demo'}`}>
                  <span className="dot" /> {result.live ? q.liveBadge : result.errored ? q.error : q.fallbackBadge}
                </span>
                {cart.length > 0 && (
                  <span className="cart-pill" role="status" aria-label={`${q.cartLabel}: ${cart.length}`}>
                    🛒 {cart.length}
                  </span>
                )}
              </div>
              <p className="result-label" style={{ marginTop: 20 }}>{q.resultTitle}</p>
              <p className="result-name">{type[lang].name}</p>
              <p className="result-desc">{result.description}</p>

              <EnergyCurve curve={type.curve} label={q.curveLabel} />

              <div className="result-grid">
                <div className="result-block">
                  <h4>{q.categories}</h4>
                  {type[lang].categories.map((c) => (
                    <div className="rec-item" key={c.cat}>
                      <div className="cat-item">
                        <b>{c.cat}</b>
                        <span>{c.ex}</span>
                      </div>
                      <ProductCard
                        slug={c.product}
                        lang={lang}
                        added={cart.includes(c.product)}
                        onAdd={addToCart}
                        addLabel={q.addToCart}
                        addedLabel={q.added}
                      />
                    </div>
                  ))}
                </div>
                <div className="result-block">
                  <h4>{q.routine}</h4>
                  <ol className="routine-list">
                    {result.routine.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ol>
                </div>
              </div>

              <p className="disclaimer">{q.disclaimer}</p>
              <div className="quiz-nav">
                <button className="btn ghost" onClick={reset}>{q.restart}</button>
              </div>
            </div>
          )}
        </div>

        <details className="how">
          <summary>{q.howTitle}</summary>
          <div className="how-body">
            {q.how.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </details>
      </div>
    </section>
  )
}
