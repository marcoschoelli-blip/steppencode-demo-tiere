import { Clock, Mail, MapPin, Phone, Siren } from 'lucide-react'
import { org } from '../data'
import { SectionHeading } from './SectionHeading'

export function Contact() {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${org.street}, ${org.city}`)}`
  return (
    <section className="section contact" id="kontakt">
      <div className="container">
        <SectionHeading eyebrow="Kontakt" strong="Besuch" light="uns im Tierheim." />
        <div className="contact__grid">
          <a className="contact__card" href={mapsUrl} target="_blank" rel="noreferrer">
            <MapPin strokeWidth={1.6} />
            <h3>Adresse</h3>
            <p>
              {org.street}
              <br />
              {org.city}
            </p>
          </a>
          <div className="contact__card">
            <Clock strokeWidth={1.6} />
            <h3>Besuchszeiten</h3>
            <dl className="hours">
              {org.hours.map((h) => (
                <div key={h.days}>
                  <dt>{h.days}</dt>
                  <dd>{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="contact__card">
            <Phone strokeWidth={1.6} />
            <h3>Telefon & E-Mail</h3>
            <p>
              <a href={`tel:${org.phone.replace(/\s/g, '')}`}>{org.phone}</a>
              <br />
              <a href={`mailto:${org.email}`}>{org.email}</a>
            </p>
          </div>
          <a className="contact__card contact__card--alert" href={`tel:${org.emergency.replace(/\s/g, '')}`}>
            <Siren strokeWidth={1.6} />
            <h3>Tiernotfall</h3>
            <p>
              Fundtier oder verletztes Tier? Rund um die Uhr:
              <br />
              <strong>{org.emergency}</strong>
            </p>
          </a>
        </div>
        <p className="contact__note">
          <Mail size={18} /> Für Vermittlungen bitte vorab einen Termin ausmachen – so haben wir Zeit für dich und das Tier.
        </p>
      </div>
    </section>
  )
}
