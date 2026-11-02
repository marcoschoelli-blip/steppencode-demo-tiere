import { Check, Copy, HandHeart, Heart } from 'lucide-react'
import { useState } from 'react'
import { donationAmounts, helpOptions, org } from '../data'
import { SectionHeading } from './SectionHeading'

export function Help() {
  const [amount, setAmount] = useState(25)
  const [custom, setCustom] = useState('')
  const [monthly, setMonthly] = useState(false)
  const [copied, setCopied] = useState(false)

  const value = custom ? Number(custom.replace(',', '.')) || 0 : amount
  const purpose = `${monthly ? 'Dauerspende' : 'Spende'} Tierschutz`
  const impact =
    value >= 100 ? 'eine Impfung und Chip für zwei Tiere' : value >= 50 ? 'die Kastration einer Katze' : value >= 25 ? 'eine Woche Futter für einen Hund' : 'Streu und Futter für ein Kaninchen'

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(org.iban.replace(/\s/g, ''))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* Zwischenablage nicht verfügbar – IBAN steht sichtbar daneben */
    }
  }

  return (
    <section className="section help" id="mithelfen">
      <div className="container">
        <SectionHeading eyebrow="Mithelfen" strong="Jede Hilfe" light="zählt." />
        <div className="help__grid">
          <div className="donate" id="spenden">
            <div className="donate__head">
              <HandHeart size={36} strokeWidth={1.6} />
              <div>
                <h3>Spenden</h3>
                <p>Spenden an uns sind steuerlich absetzbar.</p>
              </div>
            </div>

            <div className="toggle" role="group" aria-label="Spendenart">
              <button type="button" aria-pressed={!monthly} className={!monthly ? 'is-active' : ''} onClick={() => setMonthly(false)}>
                Einmalig
              </button>
              <button type="button" aria-pressed={monthly} className={monthly ? 'is-active' : ''} onClick={() => setMonthly(true)}>
                Monatlich
              </button>
            </div>

            <div className="amounts" role="group" aria-label="Betrag wählen">
              {donationAmounts.map((a) => (
                <button
                  key={a}
                  type="button"
                  className={!custom && amount === a ? 'is-active' : ''}
                  aria-pressed={!custom && amount === a}
                  onClick={() => {
                    setAmount(a)
                    setCustom('')
                  }}
                >
                  {a} €
                </button>
              ))}
              <label className="amounts__custom">
                <span className="sr-only">Eigener Betrag in Euro</span>
                <input
                  inputMode="decimal"
                  placeholder="Betrag"
                  value={custom}
                  onChange={(e) => setCustom(e.target.value.replace(/[^\d,.]/g, ''))}
                />
                <span aria-hidden="true">€</span>
              </label>
            </div>

            {value > 0 && (
              <p className="donate__impact">
                <Heart size={18} fill="currentColor" /> {value} € {monthly ? 'im Monat ' : ''}ermöglichen z. B. {impact}.
              </p>
            )}

            <dl className="bank">
              <div>
                <dt>Empfänger</dt>
                <dd>{org.name}</dd>
              </div>
              <div>
                <dt>IBAN</dt>
                <dd>
                  {org.iban}
                  <button type="button" className="bank__copy" onClick={copy} aria-label="IBAN kopieren">
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </dd>
              </div>
              <div>
                <dt>BIC</dt>
                <dd>{org.bic}</dd>
              </div>
              <div>
                <dt>Verwendungszweck</dt>
                <dd>{purpose}</dd>
              </div>
            </dl>
            <p className="donate__hint">
              {monthly ? 'Richte dazu einfach einen Dauerauftrag in deinem Online-Banking ein.' : 'Überweise den Betrag mit diesen Daten.'} Für die
              Absetzbarkeit gib bitte Vor- und Nachname wie im Meldezettel und dein Geburtsdatum im Verwendungszweck an.
            </p>
          </div>

          <div className="help__options">
            {helpOptions.map((h) => (
              <article key={h.title} className="option">
                <h3>{h.title}</h3>
                <p>{h.text}</p>
                <a href={`mailto:${org.email}?subject=${encodeURIComponent(`Mithelfen: ${h.title}`)}`} className="link-underline">
                  Mehr erfahren
                </a>
              </article>
            ))}
            <div className="help__photo">
              <img src="/images/gassi.jpg" alt="Zwei Hunde beim gemeinsamen Spaziergang" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
