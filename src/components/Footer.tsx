import type { FooterData } from '../cms/chrome'
import { org, navItems } from '../data'
import { Logo } from './Logo'
import { t } from '../cms/i18n'

/** Eingebaute Inhalte – solange das CMS nichts liefert. */
const FALLBACK: FooterData = {
  nav: navItems,
  legal: [
    { label: 'Impressum', href: '#impressum' },
    { label: 'Datenschutz', href: '#datenschutz' },
  ],
  copyright: `© ${new Date().getFullYear()} ${org.name}. Gemeinnütziger Verein.`,
  claim: 'Tieren eine Chance geben.',
  address: [org.street, org.city],
  phone: org.phone,
  email: org.email,
}

export function Footer({ data = FALLBACK }: { data?: FooterData }) {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <Logo light />
          {data.claim ? <p className="footer__claim">{data.claim}</p> : null}
        </div>
        <nav aria-label={t('Fußzeile')}>
          <h4>{t('Seiten')}</h4>
          {data.nav.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>
        <div>
          <h4>{t('Kontakt')}</h4>
          {data.address.length ? (
            <p>
              {data.address.map((line, i) => (
                <span key={line}>
                  {i > 0 ? <br /> : null}
                  {line}
                </span>
              ))}
            </p>
          ) : null}
          <p>
            {data.phone ? <a href={`tel:${data.phone.replace(/[^\d+]/g, '')}`}>{data.phone}</a> : null}
            {data.phone && data.email ? <br /> : null}
            {data.email ? <a href={`mailto:${data.email}`}>{data.email}</a> : null}
          </p>
        </div>
      </div>
      <div className="container footer__bottom">
        {data.copyright ? <p>{data.copyright}</p> : <span />}
        <div>
          {data.legal.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
