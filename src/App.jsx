import { useState } from 'react'
import { STRINGS } from './i18n'
import { CONTACT } from './config'
import Hero from './components/Hero'
import QuizDemo from './components/QuizDemo'
import RetentionDemo from './components/RetentionDemo'

function Nav({ t, lang, setLang }) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a className="nav-brand" href="#top">{CONTACT.name}</a>
        <div className="nav-links">
          <a href="#demo1">{t.nav.d1}</a>
          <a href="#demo2">{t.nav.d2}</a>
          <a href="#ozadje">{t.nav.bg}</a>
          <a href="#kontakt">{t.nav.contact}</a>
          <div className="lang-toggle keep" role="group" aria-label="Language">
            <button className={lang === 'sl' ? 'on' : ''} onClick={() => setLang('sl')}>SL</button>
            <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
          </div>
        </div>
      </div>
    </nav>
  )
}

function Bridge({ t }) {
  return (
    <section className="section bridge">
      <div className="section-inner">
        <p>{t.bridge.body}</p>
      </div>
    </section>
  )
}

function Background({ t }) {
  const b = t.bg
  return (
    <section className="section" id="ozadje">
      <div className="section-inner">
        <span className="eyebrow">{b.eyebrow}</span>
        <h2>{b.title}</h2>
        <div className="bg-grid">
          <div className="bg-card">
            <h3>{b.card1Title}</h3>
            <p>{b.card1}</p>
            <div className="arch-strip">
              {b.arch.map((step, i) => (
                <span key={step} style={{ display: 'contents' }}>
                  {i > 0 && <i>→</i>}
                  <span>{step}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="bg-card">
            <h3>{b.card2Title}</h3>
            <p>{b.card2}</p>
            <div className="thumbs">
              <div className="thumb">landing 01</div>
              <div className="thumb">landing 02</div>
              <div className="thumb">landing 03</div>
            </div>
            <p className="testimonial">{b.testimonial}</p>
          </div>
        </div>
        <p className="connect-line">{b.connect}</p>
      </div>
    </section>
  )
}

function Skills({ t }) {
  const s = t.skills
  return (
    <section className="section alt">
      <div className="section-inner">
        <span className="eyebrow">{s.eyebrow}</span>
        <h2>{s.title}</h2>
        <div className="match">
          <div className="match-row head">
            <div className="match-cell">{s.left}</div>
            <div className="match-cell">{s.right}</div>
          </div>
          {s.rows.map(([need, bring]) => (
            <div className="match-row" key={need}>
              <div className="match-cell">{need}</div>
              <div className="match-cell">{bring}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function About({ t }) {
  const a = t.about
  return (
    <section className="section" id="kontakt">
      <div className="section-inner">
        <span className="eyebrow">{a.eyebrow}</span>
        <div className="about-grid">
          <div>
            <h2>{a.title}</h2>
            <p className="lead">{a.body}</p>
          </div>
          <div className="cta-card">
            <h3>{a.cta}</h3>
            <p>{a.ctaBody}</p>
            <div className="cta-links">
              <a href={CONTACT.linkedin} target="_blank" rel="noreferrer">{a.linkedin}</a>
              <a href={CONTACT.cv} download>{a.cv}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  const [lang, setLang] = useState('sl')
  const t = STRINGS[lang]
  return (
    <>
      <Nav t={t} lang={lang} setLang={setLang} />
      <Hero t={t} />
      <Bridge t={t} />
      <QuizDemo t={t} lang={lang} />
      <RetentionDemo t={t} />
      <Background t={t} />
      <Skills t={t} />
      <About t={t} />
      <footer className="footer">
        <p>{t.footer}</p>
      </footer>
    </>
  )
}
