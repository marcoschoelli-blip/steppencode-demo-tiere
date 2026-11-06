/**
 * Mehrsprachige Website (Sprachen kommen aus dem CMS: Website-Einstellungen
 * → Sprachen). Die Standardsprache steht ohne Präfix in der Adresse
 * (`/kontakt`), weitere Sprachen mit Präfix (`/en/contact`).
 *
 * Jede Sprachfassung einer Seite ist im CMS eine eigene Seite; „Übersetzung
 * von“ verbindet sie. Menü, Fußzeile und Einstellungen liefert das CMS mit
 * `?lang=` gleich in der richtigen Sprache, Seitenlinks bringen ihre fertige
 * Adresse mit (`sitePath`).
 */

/** Sprachen, die das CMS kennt – Name in der Sprache selbst. */
export const LANGUAGE_NAMES: Record<string, string> = {
  de: 'Deutsch',
  en: 'English',
  fr: 'Français',
  it: 'Italiano',
  es: 'Español',
  nl: 'Nederlands',
  pl: 'Polski',
  cs: 'Čeština',
  sk: 'Slovenčina',
  hu: 'Magyar',
  sl: 'Slovenščina',
  hr: 'Hrvatski',
}

export type SiteLanguages = { default: string; all: string[] }

export const isLanguage = (value: unknown): value is string =>
  typeof value === 'string' && value in LANGUAGE_NAMES

/** Aus `settings.languages` – fehlt es, nur Deutsch. */
export function siteLanguages(field: { default?: unknown; additional?: unknown } | null | undefined): SiteLanguages {
  const fallback = isLanguage(field?.default) ? field.default : 'de'
  const extra = Array.isArray(field?.additional) ? field.additional.filter(isLanguage) : []
  return { default: fallback, all: [...new Set([fallback, ...extra])] }
}

/** Sprachkürzel am Anfang der Adresse – noch ohne zu wissen, welche Sprachen die Website hat. */
export function languageFromPath(pathname = window.location.pathname): string | null {
  const match = /^\/([a-z]{2})(?=\/|$)/.exec(pathname)
  return match && isLanguage(match[1]) ? match[1] : null
}

/** Pfad ohne Sprachkürzel: `/en/contact` → `/contact`. */
export function stripLanguage(pathname: string, language: string, languages: SiteLanguages): string {
  if (language === languages.default) return pathname
  const rest = pathname.replace(new RegExp(`^/${language}(?=/|$)`), '')
  return rest || '/'
}

/** Präfix einer Sprache: '' für die Standardsprache, sonst `/en`. */
export function languagePrefix(language: string, languages: SiteLanguages): string {
  return language === languages.default ? '' : `/${language}`
}

/** Interne Adresse (`/kontakt`, `/#team`) in der Sprache – externe bleiben, wie sie sind. */
export function withLanguage(href: string, language: string, languages: SiteLanguages): string {
  const prefix = languagePrefix(language, languages)
  if (!prefix || !href.startsWith('/') || href.startsWith('//')) return href
  if (new RegExp(`^/(${languages.all.join('|')})(?=/|$|#|\\?)`).test(href)) return href
  if (href === '/') return prefix
  return href.startsWith('/#') || href.startsWith('/?') ? `${prefix}${href.slice(1)}` : `${prefix}${href}`
}

type Doc = { id: number | string; slug?: string | null; language?: string | null; translationOf?: unknown }

const idOf = (value: unknown): string | null => {
  if (value && typeof value === 'object' && 'id' in value) return String((value as { id: unknown }).id)
  return typeof value === 'number' || typeof value === 'string' ? String(value) : null
}

/** Wurzel einer Übersetzungsgruppe: die Seite in der Standardsprache. */
export const translationRoot = (doc: Doc) => idOf(doc.translationOf) ?? String(doc.id)

/** Sprache eines Dokuments – leer heißt Standardsprache. */
export const docLanguage = (doc: Doc, languages: SiteLanguages) =>
  isLanguage(doc.language) && languages.all.includes(doc.language) ? doc.language : languages.default

/** Adresse einer Seite in ihrer Sprache. */
export function pageHref(page: Doc, languages: SiteLanguages): string {
  const path = !page.slug || page.slug === 'home' ? '/' : `/${page.slug}`
  return withLanguage(path, docLanguage(page, languages), languages)
}

export type LanguageLink = { code: string; label: string; href: string; current: boolean }

/**
 * Sprachumschalter: dieselbe Seite in jeder Sprache – gibt es sie dort nicht,
 * die Startseite dieser Sprache. Leer, wenn die Website nur eine Sprache hat.
 */
export function languageLinks(
  languages: SiteLanguages,
  current: string,
  pages: Doc[],
  page: Doc | null | undefined,
): LanguageLink[] {
  if (languages.all.length < 2) return []
  const root = page ? translationRoot(page) : null
  return languages.all.map((code) => {
    const match = root
      ? pages.find((entry) => translationRoot(entry) === root && docLanguage(entry, languages) === code)
      : null
    return {
      code,
      label: LANGUAGE_NAMES[code] || code.toUpperCase(),
      href: match ? pageHref(match, languages) : withLanguage('/', code, languages),
      current: code === current,
    }
  })
}

/**
 * Seite zur Adresse in der Sprache. Gibt es den Kurznamen nur in einer
 * anderen Sprache (z. B. ein Link `/en/kontakt` auf die deutsche Seite),
 * kommt deren Übersetzung zurück – mit der richtigen Adresse zum Umleiten.
 */
export function findPage<P extends Doc>(
  pages: P[],
  slug: string,
  language: string,
  languages: SiteLanguages,
): { page: P | null; redirect: string | null; reload: boolean } {
  const own = pages.find((page) => page.slug === slug && docLanguage(page, languages) === language)
  if (own) return { page: own, redirect: null, reload: false }
  const other = pages.find((page) => page.slug === slug)
  if (!other) return { page: null, redirect: null, reload: false }
  const root = translationRoot(other)
  const translated = pages.find(
    (page) => translationRoot(page) === root && docLanguage(page, languages) === language,
  )
  const target = translated || other
  // Andere Sprache: neu laden, damit Menü und Fußzeile mitwechseln.
  return { page: target, redirect: pageHref(target, languages), reload: !translated }
}
