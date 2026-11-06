import type { LanguageLink } from './i18n'
import './language.css'

/** Sprachumschalter – nur, wenn die Website mehr als eine Sprache hat. */
export function LanguageSwitch({ links, className = '' }: { links?: LanguageLink[]; className?: string }) {
  if (!links || links.length < 2) return null
  return (
    <span className={`lang-switch ${className}`.trim()} aria-label="Sprache / Language" role="group">
      {links.map((link) => (
        <a
          aria-current={link.current ? 'true' : undefined}
          href={link.href}
          hrefLang={link.code}
          key={link.code}
          lang={link.code}
          title={link.label}
        >
          {link.code.toUpperCase()}
        </a>
      ))}
    </span>
  )
}
