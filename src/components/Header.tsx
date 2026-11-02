import { Heart, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { navItems } from '../data'
import { Logo } from './Logo'

export function Header() {
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
        <nav className="header__nav" aria-label="Hauptnavigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a href="#spenden" className="btn btn--primary header__mobile-cta" onClick={() => setOpen(false)}>
            <Heart size={20} /> Jetzt unterstützen
          </a>
        </nav>
        <a href="#spenden" className="btn btn--primary btn--sm header__cta">
          <Heart size={20} /> Jetzt unterstützen
        </a>
        <button
          type="button"
          className="header__toggle"
          aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  )
}
