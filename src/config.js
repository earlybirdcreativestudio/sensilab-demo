// ─────────────────────────────────────────────────────────────
// EDIT THIS FILE — everything personal / backend lives here.
// ─────────────────────────────────────────────────────────────

// 1. Paste your live n8n webhook URL here when the workflow is ready.
//    Leave empty ('') to run in demo mode with pre-baked results.
export const WEBHOOK_URL = ''

// 2. Your details.
export const CONTACT = {
  name: 'Tien Suhorepec',
  email: 'mailto:you@example.com',
  linkedin: 'https://linkedin.com/in/your-handle',
  cv: '/cv.pdf', // put cv.pdf in /public
  call: 'https://calendly.com/your-handle/15min',
}

// 3. Product registry (hardcoded on purpose — the AI never picks products).
//    Each category below references one product by slug. Images live in /public.
//    Titles are the official Sensilab product names, used as-is for both SL and EN.
export const PRODUCTS = {
  'mag-malate': {
    img: '/101383_sensilab_essentials_magnesium_malate_1x-700.webp',
    sl: 'Essentials Magnezijev malat 500, visok odmerek – vegansko, 120 kapsul',
    en: 'Essentials Magnezijev malat 500, visok odmerek – vegansko, 120 kapsul',
  },
  'beyond-brain': {
    img: '/100100_sensilab_beyond_brain_1x-700_1.webp',
    sl: 'Beyond Brain: Maksimalna osredotočenost, spomin in koncentracija',
    en: 'Beyond Brain: Maksimalna osredotočenost, spomin in koncentracija',
  },
  ashwagandha: {
    img: '/xxxxxx_sensilab_essentials_ashwagandha_1x-700_1.webp',
    sl: 'Essentials Ašvaganda KSM-66 120 kapsul',
    en: 'Essentials Ašvaganda KSM-66 120 kapsul',
  },
  adrenalux: {
    img: '/901807_902200_glandline-adrenalux-2x-700_2_1.webp',
    sl: 'AdrenaLux - naravna podpora v obdobljih stresa',
    en: 'AdrenaLux - naravna podpora v obdobljih stresa',
  },
  'mag-complex': {
    img: '/xxxxxx_sensilab_essentials_magnesium_complex_500_1x-300.webp',
    sl: 'Kapsule magnezijevega kompleksa 500',
    en: 'Kapsule magnezijevega kompleksa 500',
  },
  sleeplux: {
    img: '/xxxxxx_glandline_sleeplux_forte_1x-700.webp',
    sl: 'Sensilab Glandline SleepLux',
    en: 'Sensilab Glandline SleepLux',
  },
  'mag-glycinate': {
    img: '/xxxxxx_sensilab_essentials_magnesium_glycinate_2x-700_3.webp',
    sl: 'Essentials Magnezijev glicinat 750, visok odmerek',
    en: 'Essentials Magnezijev glicinat 750, visok odmerek',
  },
}

// 4. Chronotype definitions: names, energy curves, category → product mapping
//    (hardcoded on purpose — the AI never picks products), and the pre-baked
//    fallback copy used when WEBHOOK_URL is empty or the call fails.
export const CHRONOTYPES = {
  morning: {
    curve: [3, 9, 10, 8, 6, 4, 3, 2], // energy 0-10 at 6h,9h,12h,15h,18h,21h,24h,3h
    sl: {
      name: 'Jutranji tip',
      categories: [
        { cat: 'Vzdržljiva energija', ex: 'npr. magnezijev malat, B-kompleks', product: 'mag-malate' },
        { cat: 'Popoldanski fokus', ex: 'npr. L-teanin, Beyond Brain linija', product: 'beyond-brain' },
        { cat: 'Obvladovanje stresa', ex: 'npr. ašvaganda KSM-66', product: 'ashwagandha' },
      ],
      description:
        'Vaša energija doseže vrh dopoldne in začne popuščati sredi popoldneva. Jutranji tipi najbolje delujejo, ko zahtevne naloge opravijo zgodaj, popoldne pa energijo zavestno podpirajo, namesto da jo lovijo s kavo.',
      routine: [
        'Najzahtevnejše delo opravite med 8. in 12. uro — takrat ste na vrhuncu.',
        'Kosilo naj bo lažje; težka hrana poglobi popoldanski padec.',
        'Okoli 15h vstavite 10-minutni sprehod namesto tretje kave.',
        'Zaslon ugasnite 60 minut pred spanjem — vaš zgodnji ritem je vaša prednost, zaščitite ga.',
      ],
    },
    en: {
      name: 'Morning type',
      categories: [
        { cat: 'Sustained energy', ex: 'e.g. magnesium malate, B-complex', product: 'mag-malate' },
        { cat: 'Afternoon focus', ex: 'e.g. L-theanine, Beyond Brain line', product: 'beyond-brain' },
        { cat: 'Stress management', ex: 'e.g. ashwagandha KSM-66', product: 'ashwagandha' },
      ],
      description:
        'Your energy peaks before noon and starts fading mid-afternoon. Morning types perform best when demanding work happens early and the afternoon is consciously supported rather than chased with coffee.',
      routine: [
        'Schedule your hardest work between 8 and 12 — that is your peak.',
        'Keep lunch light; heavy food deepens the afternoon dip.',
        'Swap the third coffee for a 10-minute walk around 3 pm.',
        'Screens off 60 minutes before bed — your early rhythm is an advantage, protect it.',
      ],
    },
  },
  intermediate: {
    curve: [2, 6, 8, 7, 8, 6, 3, 2],
    sl: {
      name: 'Vmesni tip',
      categories: [
        { cat: 'Stres in sprostitev', ex: 'npr. magnezijev glicinat, AdrenaLux', product: 'adrenalux' },
        { cat: 'Stabilna energija', ex: 'npr. magnezijev kompleks, elektroliti', product: 'mag-complex' },
        { cat: 'Kakovost spanca', ex: 'npr. linija SleepLux', product: 'sleeplux' },
      ],
      description:
        'Vaš ritem je prilagodljiv — energija je razmeroma stabilna, a prav zato nanjo najbolj vplivata stres in nereden urnik. Vmesni tipi največ pridobijo z doslednostjo, ne z optimizacijo posameznih ur.',
      routine: [
        'Vstajajte in hodite spat ob isti uri — tudi ob vikendih; doslednost je vaš multiplikator.',
        'Zahtevne naloge razporedite v dva bloka: pozno dopoldne in zgodnji večer.',
        'Ob stresnih dnevih dodajte 5 minut dihalnih vaj pred kosilom.',
        'Zadnjo kavo spijte pred 14. uro, da zaščitite globok spanec.',
      ],
    },
    en: {
      name: 'Intermediate type',
      categories: [
        { cat: 'Stress & relaxation', ex: 'e.g. magnesium glycinate, AdrenaLux', product: 'adrenalux' },
        { cat: 'Stable energy', ex: 'e.g. magnesium complex, electrolytes', product: 'mag-complex' },
        { cat: 'Sleep quality', ex: 'e.g. the SleepLux line', product: 'sleeplux' },
      ],
      description:
        'Your rhythm is flexible — energy is relatively stable, which is exactly why stress and an irregular schedule affect it most. Intermediate types gain the most from consistency, not from optimizing individual hours.',
      routine: [
        'Wake up and go to bed at the same time — weekends included; consistency is your multiplier.',
        'Split demanding work into two blocks: late morning and early evening.',
        'On stressful days, add 5 minutes of breathing exercises before lunch.',
        'Last coffee before 2 pm to protect deep sleep.',
      ],
    },
  },
  evening: {
    curve: [1, 3, 5, 6, 8, 10, 8, 4],
    sl: {
      name: 'Večerni tip',
      categories: [
        { cat: 'Podpora spancu', ex: 'npr. linija SleepLux, baldrijan', product: 'sleeplux' },
        { cat: 'Jutranja energija', ex: 'npr. magnezijev malat, B-kompleks', product: 'mag-malate' },
        { cat: 'Umirjanje zvečer', ex: 'npr. GABA, magnezijev glicinat', product: 'mag-glycinate' },
      ],
      description:
        'Vaša energija se prebudi pozno in doseže vrh zvečer — jutra so za vas najtežji del dneva. Večerni tipi ne potrebujejo več discipline, ampak pametnejši večerni ritual in mehkejši prehod v jutro.',
      routine: [
        'Jutro začnite z dnevno svetlobo in vodo, ne s telefonom — svetloba prestavi notranjo uro.',
        'Zahtevno delo načrtujte po 16. uri, ko se vaš motor zares zažene.',
        'Zvečer si postavite »mejo zaslona« 90 minut pred spanjem.',
        'Ustvarite kratek večerni ritual umirjanja — vsak večer enak, telo se ga nauči.',
      ],
    },
    en: {
      name: 'Evening type',
      categories: [
        { cat: 'Sleep support', ex: 'e.g. the SleepLux line, valerian', product: 'sleeplux' },
        { cat: 'Morning energy', ex: 'e.g. magnesium malate, B-complex', product: 'mag-malate' },
        { cat: 'Evening wind-down', ex: 'e.g. GABA, magnesium glycinate', product: 'mag-glycinate' },
      ],
      description:
        'Your energy wakes up late and peaks in the evening — mornings are the hardest part of your day. Evening types don\'t need more discipline; they need a smarter evening ritual and a softer transition into the morning.',
      routine: [
        'Start the morning with daylight and water, not your phone — light shifts the internal clock.',
        'Plan demanding work after 4 pm, when your engine truly starts.',
        'Set a "screen boundary" 90 minutes before bed.',
        'Build a short, identical wind-down ritual every evening — the body learns it.',
      ],
    },
  },
}

// Deterministic scoring: sum of answer indices (0-3) across 5 questions → 0-15.
export function scoreChronotype(answers) {
  const total = answers.reduce((s, v) => s + v, 0)
  if (total <= 5) return 'morning'
  if (total <= 9) return 'intermediate'
  return 'evening'
}
