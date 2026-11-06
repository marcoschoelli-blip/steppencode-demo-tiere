import { Heart, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { NavItem } from '../cms/chrome'
import { navItems } from '../data'
import { Logo } from './Logo'
import { LanguageSwitch } from '../cms/LanguageSwitch'
import type { LanguageLink } from '../cms/i18n'
import { t } from '../cms/i18n'

const DEFAULT_CTA: NavItem = { label: 'Jetzt unterstützen', href: '#spenden' }

/** Navigation – Menüpunkte und Button kommen aus dem CMS oder aus data.ts. */
export function Header({
  items = navItems,
  cta = DEFAULT_CTA,
  languages,
}: { items?: NavItem[]; cta?: NavItem | null; languages?: LanguageLink[] } = {}) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <header className={`header${scrolled ? ' header--scrolled' : ''}${open ? ' header--open' : ''}`}>
      <div className="container header__inner">
        <Logo />
        <nav className="header__nav" aria-label={t('Hauptnavigation')}>
          {items.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          {cta ? (
            <a href={cta.href} className="btn btn--primary header__mobile-cta" onClick={() => setOpen(false)}>
              <Heart size={20} /> {cta.label}
            </a>
          ) : null}
          <LanguageSwitch links={languages} />
        </nav>
        {cta ? (
          <a href={cta.href} className="btn btn--primary btn--sm header__cta">
            <Heart size={20} /> {cta.label}
          </a>
        ) : null}
        <button
          type="button"
          className="header__toggle"
          aria-label={open ? t('Menü schließen') : t('Menü öffnen')}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  )
}
