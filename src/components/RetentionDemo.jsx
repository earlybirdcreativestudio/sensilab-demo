import { useState } from 'react'

function stageFor(day) {
  if (day >= 40) return 's40'
  if (day >= 30) return 's30'
  if (day >= 25) return 's25'
  return 's0'
}

// which workflow node index is active per stage
const NODE_FOR = { s0: 0, s25: 2, s30: 3, s40: 4 }
// forecast node (1) is "already passed" once day >= 20
function nodeState(i, day, stage) {
  const active = NODE_FOR[stage]
  if (i === active) return 'on'
  if (i < active || (i === 1 && day >= 20)) return 'passed'
  return ''
}

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

export default function RetentionDemo({ t }) {
  const r = t.retention
  const [day, setDay] = useState(0)
  const stage = stageFor(day)
  const s = r.stages[stage]

  return (
    <section className="section alt" id="demo2">
      <div className="section-inner">
        <span className="eyebrow">{r.eyebrow}</span>
        <h2>{r.title}</h2>
        <p className="lead">{r.lead}</p>

        <div className="demo-shell">
          <div className="timeline-wrap">
            <div className="timeline-label">
              <span className="day">
                {day} <small>{r.sliderLabel}</small>
              </span>
            </div>
            <input
              type="range"
              className="timeline"
              min="0"
              max="45"
              value={day}
              style={{ '--fill': `${(day / 45) * 100}%` }}
              onChange={(e) => setDay(Number(e.target.value))}
              aria-label={r.sliderLabel}
            />
            <div className="timeline-marks">
              <span>0</span><span>10</span><span>20</span><span>30</span><span>40</span><span>45</span>
            </div>
          </div>

          <div className="wf">
            <div className="wf-label">{r.workflowLabel}</div>
            <div className="wf-nodes">
              {r.nodes.map((n, i) => (
                <span key={n} style={{ display: 'contents' }}>
                  {i > 0 && <span className={`wf-link ${nodeState(i, day, stage) ? 'on' : ''}`} aria-hidden="true" />}
                  <span className={`wf-node ${nodeState(i, day, stage) === 'on' ? 'on' : ''}`}>
                    <small>n8n · {String(i + 1).padStart(2, '0')}</small>
                    {n}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="stage">
            <div>
              <span className="stage-tag">{s.tag}</span>
              <p className="stage-text">{s.text}</p>
            </div>
            <div>
              {s.email ? (
                <Email email={s.email} withImage={stage === 's40'} key={stage} />
              ) : (
                <div className="stage-quiet">— {stage === 's30' ? '…' : 'n8n'} —</div>
              )}
            </div>
          </div>

          <p className="framing">{r.framing}</p>
        </div>
      </div>
    </section>
  )
}
