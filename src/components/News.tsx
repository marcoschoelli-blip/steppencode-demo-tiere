import { news } from '../data'
import { SectionHeading } from './SectionHeading'

const fmt = new Intl.DateTimeFormat('de-AT', { day: 'numeric', month: 'long', year: 'numeric' })

export function News() {
  return (
    <section className="section news" id="aktuelles">
      <div className="container">
        <SectionHeading eyebrow="Aktuelles" strong="Neues" light="aus dem Tierheim." />
        <div className="news__grid">
          {news.map((n) => (
            <article key={n.title} className="post">
              <time dateTime={n.date}>{fmt.format(new Date(`${n.date}T12:00:00`))}</time>
              <h3>{n.title}</h3>
              <p>{n.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
