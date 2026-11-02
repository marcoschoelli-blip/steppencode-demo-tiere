import { stats } from '../data'
import { SectionHeading } from './SectionHeading'

export function About() {
  return (
    <section className="section about" id="ueber-uns">
      <div className="container about__grid">
        <div className="about__media">
          <img src="/images/freunde.jpg" alt="Hund und Katze kuscheln im Gras" loading="lazy" />
        </div>
        <div>
          <SectionHeading eyebrow="Über uns" strong="Mit Herz," light="seit über 40 Jahren." />
          <p className="section-lead">
            Was 1983 mit einer Handvoll tierlieber Menschen begann, ist heute das Tierheim der Region. Wir nehmen
            Fundtiere und abgegebene Tiere auf, versorgen sie medizinisch und suchen in Ruhe das passende Zuhause.
            Unsere Arbeit finanziert sich fast ausschließlich über Spenden, Mitgliedsbeiträge und Patenschaften.
          </p>
          <dl className="stats">
            {stats.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
