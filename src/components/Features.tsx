import { Heart, House, PawPrint, Users } from 'lucide-react'

const items = [
  { icon: PawPrint, title: 'Tiere retten', text: 'Schutz und Versorgung in Not geratener Tiere.', filled: true },
  { icon: House, title: 'Zuhause finden', text: 'Liebevolle Vermittlung in ein neues Leben.' },
  { icon: Heart, title: 'Unterstützen', text: 'Mit Spenden, Patenschaften oder deiner Zeit helfen.' },
  { icon: Users, title: 'Gemeinsam stark', text: 'Für mehr Tierwohl in unserer Region.' },
]

export function Features() {
  return (
    <section className="features" aria-label="Was wir tun">
      <div className="container features__grid">
        {items.map(({ icon: Icon, title, text, filled }) => (
          <div key={title} className="feature">
            <Icon className="feature__icon" strokeWidth={1.6} size={44} fill={filled ? 'currentColor' : 'none'} />
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
