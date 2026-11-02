import { navItems, org } from '../data'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <Logo light />
          <p className="footer__claim">Tieren eine Chance geben.</p>
        </div>
        <nav aria-label="Footer">
          <h4>Seiten</h4>
          {navItems.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>
        <div>
          <h4>Spendenkonto</h4>
          <p>
            IBAN {org.iban}
            <br />
            BIC {org.bic}
          </p>
          <p>
            <a href={`tel:${org.phone.replace(/\s/g, '')}`}>{org.phone}</a>
            <br />
            <a href={`mailto:${org.email}`}>{org.email}</a>
          </p>
        </div>
      </div>
      <div className="container footer__bottom">
        <p>© {new Date().getFullYear()} {org.name}. Gemeinnütziger Verein.</p>
        <div>
          <a href="#impressum">Impressum</a>
          <a href="#datenschutz">Datenschutz</a>
        </div>
      </div>
    </footer>
  )
}
