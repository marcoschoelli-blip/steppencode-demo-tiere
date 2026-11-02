import { ArrowRight, Heart, Mars, Venus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { animals, org, type Animal, type Species } from '../data'
import { SectionHeading } from './SectionHeading'

const FAV_KEY = 'tierschutz:favoriten'
const filters: Array<'Alle' | Species> = ['Alle', 'Hund', 'Katze', 'Kleintier']
const labels: Record<(typeof filters)[number], string> = { Alle: 'Alle', Hund: 'Hunde', Katze: 'Katzen', Kleintier: 'Kleintiere' }

function readFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function Animals() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('Alle')
  const [showAll, setShowAll] = useState(false)
  const [favorites, setFavorites] = useState<string[]>(readFavorites)

  useEffect(() => {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(favorites))
    } catch {
      /* Speicher nicht verfügbar – Favoriten gelten nur für diesen Besuch */
    }
  }, [favorites])

  const filtered = filter === 'Alle' ? animals : animals.filter((a) => a.species === filter)
  const visible = showAll ? filtered : filtered.slice(0, 3)

  const toggle = (id: string) => setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))

  return (
    <section className="section animals" id="tiere">
      <div className="container">
        <SectionHeading
          eyebrow="Unsere Schützlinge"
          strong="Tiere,"
          light="die auf dich warten."
          aside={
            filtered.length > 3 && (
              <button type="button" className="link-arrow" onClick={() => setShowAll((v) => !v)}>
                <span className="link-underline">{showAll ? 'Weniger anzeigen' : 'Alle Tiere ansehen'}</span>
                <ArrowRight size={20} />
              </button>
            )
          }
        />

        <div className="chips" role="group" aria-label="Nach Tierart filtern">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              className={`chip${filter === f ? ' chip--active' : ''}`}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {labels[f]}
              <span className="chip__count">{f === 'Alle' ? animals.length : animals.filter((a) => a.species === f).length}</span>
            </button>
          ))}
          {favorites.length > 0 && (
            <span className="chips__fav">
              <Heart size={16} fill="currentColor" /> {favorites.length} gemerkt
            </span>
          )}
        </div>

        <div className="animals__grid">
          {visible.map((a) => (
            <AnimalCard key={a.id} animal={a} favorite={favorites.includes(a.id)} onToggle={() => toggle(a.id)} />
          ))}
        </div>
      </div>
    </section>
  )
}

function AnimalCard({ animal: a, favorite, onToggle }: { animal: Animal; favorite: boolean; onToggle: () => void }) {
  const Sex = a.sex === 'weiblich' ? Venus : Mars
  return (
    <article className="animal">
      <div className="animal__media">
        <img src={a.image} alt={`${a.name}, ${a.breed}`} loading="lazy" />
        {a.urgent && <span className="animal__badge">Wartet schon lange</span>}
        <button
          type="button"
          className={`animal__fav${favorite ? ' animal__fav--active' : ''}`}
          aria-label={favorite ? `${a.name} nicht mehr merken` : `${a.name} merken`}
          aria-pressed={favorite}
          onClick={onToggle}
        >
          <Heart size={26} strokeWidth={1.8} />
        </button>
      </div>
      <div className="animal__body">
        <div className="animal__title">
          <h3>{a.name}</h3>
          <span className="animal__sex" title={a.sex}>
            <Sex size={18} /> {a.age}
          </span>
        </div>
        <p className="animal__breed">{a.breed}</p>
        <p className="animal__story">{a.story}</p>
        <ul className="animal__traits">
          {a.traits.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <a
          className="btn btn--soft"
          href={`mailto:${org.email}?subject=${encodeURIComponent(`Ich möchte ${a.name} kennenlernen`)}`}
        >
          {a.name} kennenlernen <ArrowRight size={18} />
        </a>
      </div>
    </article>
  )
}
