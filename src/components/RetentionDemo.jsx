import { useEffect, useRef, useState } from 'react'

function stageFor(day) {
  if (day >= 40) return 's40'
  if (day >= 30) return 's30'
  if (day >= 25) return 's25'
  return 's0'
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

// Milestones shown on the plain timeline. `node` indexes into r.nodes for the
// label; the forecast node (1) is intentionally left off to reduce clutter.
const MARKERS = [
  { day: 0, node: 0, stage: 's0' },
  { day: 25, node: 2, stage: 's25' },
  { day: 30, node: 3, stage: 's30' },
  { day: 40, node: 4, stage: 's40' },
]
const MAX_DAY = 45

function Email({ email, withImage }) {
  return (
    <div className="email">
      <div className="email-head">
        <div className="from">sensilab &lt;hello@…&gt; → ana@…</div>
        <div className="subj">{email.subject}</div>
      </div>
      <div className="email-body">
        {email.body}
        {withImage && <div className="email-img">{email.imgNote}</div>}
        <br />
        <span className="email-cta">{email.cta} →</span>
      </div>
    </div>
  )
}

function StageBody({ r, stage }) {
  const s = r.stages[stage]
  return (
    <div className="stage2" key={stage}>
      <span className="stage-tag">{s.tag}</span>
      <p className="stage-text">{s.text}</p>
      {s.email ? (
        <Email email={s.email} withImage={stage === 's40'} />
      ) : (
        <div className="stage-quiet">— {stage === 's30' ? '…' : 'n8n'} —</div>
      )}
    </div>
  )
}

// Big day counter + plain filling timeline with milestone markers.
function Timeline({ r, day, stage }) {
  return (
    <>
      <div className="day-counter">
        <span className="day-num">{day}</span>
        <span className="day-unit">{r.sliderLabel}</span>
      </div>
      <div className="tl" style={{ '--fill': `${(day / MAX_DAY) * 100}%` }}>
        <div className="tl-track" />
        <div className="tl-fill" />
        {MARKERS.map((m) => (
          <div
            key={m.node}
            className={`tl-marker ${stage === m.stage ? 'on' : ''} ${day >= m.day ? 'reached' : ''}`}
            style={{ left: `${(m.day / MAX_DAY) * 100}%` }}
          >
            <span className="tl-dot" />
            <span className="tl-label">{r.nodes[m.node]}</span>
          </div>
        ))}
      </div>
    </>
  )
}

export default function RetentionDemo({ t }) {
  const r = t.retention
  const [day, setDay] = useState(0)
  const [reduced, setReduced] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      setReduced(true)
      return
    }

    const el = wrapRef.current
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        if (!el) return
        const rect = el.getBoundingClientRect()
        const scrollable = rect.height - window.innerHeight
        const p = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0
        setDay(Math.round(p * MAX_DAY))
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const stage = stageFor(day)

  return (
    <section className="section alt" id="demo2">
      <div className="section-inner">
        <span className="eyebrow">{r.eyebrow}</span>
        <h2>{r.title}</h2>
        <p className="lead">{r.lead}</p>

        {reduced ? (
          // Static, fully-visible fallback — no pinning, no scroll-jacking.
          <div className="demo-shell demo2-static">
            {MARKERS.map((m) => (
              <StageBody r={r} stage={m.stage} key={m.stage} />
            ))}
            <p className="framing">{r.framing}</p>
          </div>
        ) : (
          <div className="demo2-scroll" ref={wrapRef}>
            <div className="demo2-sticky">
              <div className="demo-shell">
                <div className="wf-caption">{r.workflowLabel}</div>
                <Timeline r={r} day={day} stage={stage} />
                <StageBody r={r} stage={stage} />
                <p className="framing">{r.framing}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
