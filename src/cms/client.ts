/**
 * Verbindung zum Steppencode-CMS.
 *
 * Die Website lädt Einstellungen, Navigation, Footer, Seiten und Beiträge
 * ihres Kunden über die REST-API. Die Sektionen der Seiten rendert die
 * Block-Laufzeit des CMS (siehe blocksRuntime.ts) – diese Website kennt keine
 * einzelnen Blöcke.
 *
 * Env:
 * - VITE_CMS_URL   Adresse des CMS (Standard: https://cms.steppencode.at)
 * - VITE_TENANT    Kurzname oder ID des Kunden (Standard: siehe config.ts)
 * - VITE_CMS=off   CMS abschalten – die Website zeigt dann ihre eingebauten Inhalte
 */
import { DEFAULT_TENANT } from './config'
import {
  docLanguage,
  languageFromPath,
  setUiLanguage,
  siteLanguages,
  stripLanguage,
  withLanguage,
  type SiteLanguages,
} from './i18n'

const CMS_URL = (import.meta.env.VITE_CMS_URL || 'https://cms.steppencode.at').replace(/\/$/, '')
const TENANT = String(import.meta.env.VITE_TENANT || DEFAULT_TENANT).trim()

export function isCmsEnabled() {
  return import.meta.env.VITE_CMS !== 'off' && Boolean(TENANT)
}

export function getCmsUrl() {
  return CMS_URL
}

export type Lexical = { root?: { children?: unknown[] } } | null

export type MediaDoc = { id: number | string; url?: string | null; alt?: string | null }

export type Page = {
  id: number | string
  title: string
  slug: string
  excerpt?: string | null
  layout?: unknown[] | null
  /** Mehrsprachig: Sprache der Seite und Seite in der Standardsprache. */
  language?: string | null
  translationOf?: { id: number | string } | number | string | null
}

export type Post = {
  id: number | string
  title: string
  slug: string
  excerpt?: string | null
  content?: Lexical
  publishedAt?: string | null
  featuredImage?: MediaDoc | number | null
  language?: string | null
  translationOf?: { id: number | string } | number | string | null
}

export type NavLink = {
  label?: string | null
  type?: 'page' | 'post' | 'custom' | 'none' | null
  url?: string | null
  /** `sitePath`: fertige Adresse vom CMS, auf mehrsprachigen Websites mit Sprache (`/en/contact`). */
  page?: { slug?: string | null; sitePath?: string | null } | number | null
  post?: { slug?: string | null } | number | null
}

export type HeaderDoc = {
  navItems?: (NavLink & { children?: NavLink[] | null })[] | null
  cta?: (NavLink & { enabled?: boolean | null }) | null
}

export type FooterDoc = {
  navItems?: { label: string; url: string }[] | null
  copyright?: string | null
}

export type SiteSettings = {
  siteName?: string | null
  tagline?: string | null
  languages?: { default?: string | null; additional?: string[] | null } | null
  contact?: { email?: string | null; phone?: string | null; address?: string | null } | null
  seo?: { metaTitle?: string | null; metaDescription?: string | null } | null
}

export type SiteBundle = {
  tenantId: string
  /** Sprache dieser Adresse und alle Sprachen der Website. */
  language: string
  languages: SiteLanguages
  settings: SiteSettings | null
  header: HeaderDoc | null
  footer: FooterDoc | null
  pages: Page[]
  posts: Post[]
}

type List<T> = { docs: T[] }

/** Kurzname → ID. Die API filtert nach der Zahl, die Kunden-Sammlung ist nicht öffentlich. */
async function resolveTenantId(signal: AbortSignal): Promise<string> {
  if (/^\d+$/.test(TENANT)) return TENANT
  const res = await fetch(`${CMS_URL}/api/tenants/lookup/${encodeURIComponent(TENANT)}`, { signal })
  if (!res.ok) throw new Error(`Kunde „${TENANT}“ im CMS nicht gefunden (${res.status}).`)
  const { id } = (await res.json()) as { id: number | string }
  return String(id)
}

async function list<T>(
  path: string,
  tenantId: string,
  signal: AbortSignal,
  published = false,
  sort?: string,
  lang?: string | null,
): Promise<T[]> {
  const params = new URLSearchParams({ depth: '2', limit: '100' })
  // Menü, Fußzeile und Einstellungen in dieser Sprache (Übersetzungen aus dem CMS).
  if (lang) params.set('lang', lang)
  if (sort) params.set('sort', sort)
  if (published) {
    params.set('where[and][0][tenant][equals]', tenantId)
    params.set('where[and][1][_status][equals]', 'published')
  } else {
    params.set('where[tenant][equals]', tenantId)
  }
  const res = await fetch(`${CMS_URL}/api/${path}?${params}`, { signal })
  if (!res.ok) throw new Error(`CMS antwortet mit ${res.status} bei ${path}.`)
  return ((await res.json()) as List<T>).docs || []
}

export async function loadSite(signal: AbortSignal): Promise<SiteBundle> {
  const tenantId = await resolveTenantId(signal)
  const requested = languageFromPath()
  const [settings, header, footer, pages, posts] = await Promise.all([
    list<SiteSettings>('site-settings', tenantId, signal, false, undefined, requested),
    list<HeaderDoc>('header', tenantId, signal, false, undefined, requested),
    list<FooterDoc>('footer', tenantId, signal, false, undefined, requested),
    list<Page>('pages', tenantId, signal, true),
    list<Post>('posts', tenantId, signal, true, '-publishedAt'),
  ])
  const languages = siteLanguages(settings[0]?.languages)
  const language = requested && languages.all.includes(requested) ? requested : languages.default
  active = { language, languages }
  setUiLanguage(language)
  return {
    tenantId,
    language,
    languages,
    settings: settings[0] || null,
    header: header[0] || null,
    footer: footer[0] || null,
    pages,
    // Nur Beiträge in der Sprache dieser Adresse.
    posts: posts.filter((post) => docLanguage(post, languages) === language),
  }
}

/** Sprache der geladenen Website – für Links und die aktuelle Adresse. */
let active: { language: string; languages: SiteLanguages } = {
  language: 'de',
  languages: { default: 'de', all: ['de'] },
}

/** Interne Adresse in der Sprache der Seite (`/kontakt` → `/en/kontakt`). */
export function localHref(href: string): string {
  return withLanguage(href, active.language, active.languages)
}

/** Ziel eines Menüpunkts als Adresse. */
export function linkUrl(link: NavLink | null | undefined): string | null {
  if (!link) return null
  if (link.type === 'page' && link.page && typeof link.page === 'object') {
    if (link.page.sitePath) return link.page.sitePath
    const slug = link.page.slug
    return localHref(!slug || slug === 'home' ? '/' : `/${slug}`)
  }
  if (link.type === 'post' && link.post && typeof link.post === 'object') {
    return link.post.slug ? localHref(`/beitraege/${link.post.slug}`) : null
  }
  return link.url ? localHref(link.url) : null
}

export function mediaUrl(media: MediaDoc | number | null | undefined): string | null {
  if (!media || typeof media !== 'object' || !media.url) return null
  return media.url.startsWith('http') ? media.url : `${CMS_URL}${media.url}`
}

/** Pfad der aktuellen Adresse: "" → home, "impressum", "beitraege/xyz" */
export function currentPath(): string {
  const path = stripLanguage(window.location.pathname, active.language, active.languages)
  return path.replace(/^\/+|\/+$/g, '') || 'home'
}
